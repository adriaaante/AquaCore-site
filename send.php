<?php
/**
 * Приём заявок с сайта AquaCore.
 *
 *  POST  → отправляет заявку:
 *            1) в Telegram-группу (через бота);
 *            2) письмом на почту — серверно ЧЕРЕЗ ПОЧТУ ХОСТИНГА reg.ru
 *               (где расположен домен aqua-core.ru). Данные не покидают РФ,
 *               отправка бесплатна (входит в хостинг).
 *  GET   → отдаёт публичный ключ web3forms (запасной client-side вариант;
 *          по умолчанию ключ пуст → запасной путь выключен).
 *
 * Токены и настройки задаются на хостинге в telegram-secret.php
 * (скопируйте telegram-secret.example.php → telegram-secret.php).
 *
 * ── Как отправляется письмо (по приоритету) ─────────────────────────────
 *   1) SMTP хостинга reg.ru — если заданы $SMTP_HOST/$SMTP_USER/$SMTP_PASS.
 *      Самый надёжный путь: письмо подписывается DKIM ящика домена.
 *   2) Нативная функция mail() PHP — если SMTP не задан. Бесплатно, без
 *      настройки: письмо уходит через локальный почтовый сервер хостинга
 *      (Россия). Работает «из коробки», когда From на домене хостинга.
 *   3) Resend (США) — ТОЛЬКО если явно включён ($ALLOW_RESEND = true).
 *      Это трансграничная передача ПДн — по умолчанию ВЫКЛЮЧЕНО.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// ── Настройки ───────────────────────────────────────────────────────────
$TELEGRAM_BOT_TOKEN = getenv('TELEGRAM_BOT_TOKEN') ?: '';
$TELEGRAM_CHAT_ID   = getenv('TELEGRAM_CHAT_ID') ?: '-5380504235';
$WEB3FORMS_KEY      = getenv('WEB3FORMS_KEY') ?: '';

// Почта.
$EMAIL_FROM = getenv('EMAIL_FROM') ?: 'AquaCore <info@aqua-core.ru>';
$MAIL_TO    = getenv('MAIL_TO') ?: 'info@aqua-core.ru';

// SMTP хостинга reg.ru (рекомендуется). Ящик info@aqua-core.ru создаётся
// бесплатно в панели хостинга; хост обычно mail.hosting.reg.ru, порт 465 (SSL).
$SMTP_HOST   = getenv('SMTP_HOST')   ?: '';
$SMTP_PORT   = (int) (getenv('SMTP_PORT') ?: 465);
$SMTP_USER   = getenv('SMTP_USER')   ?: '';   // полный адрес ящика, напр. info@aqua-core.ru
$SMTP_PASS   = getenv('SMTP_PASS')   ?: '';
$SMTP_SECURE = getenv('SMTP_SECURE') ?: 'ssl'; // 'ssl' (465) или 'tls' (587)

// Resend (США) — трансграничная передача, по умолчанию ВЫКЛЮЧЕНО.
$RESEND_API_KEY = getenv('RESEND_API_KEY') ?: '';
$ALLOW_RESEND   = false;

$secret = __DIR__ . '/telegram-secret.php';
if (is_file($secret)) {
    ob_start();          // на случай BOM/пробелов перед <?php
    require $secret;
    ob_end_clean();
}

// ── Хелпер: HTTP POST (curl, с фолбэком на stream) ──────────────────────
$http_post = function ($url, $payload, array $headers = []) {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_TIMEOUT        => 15,
        ]);
        $resp = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ['code' => $code, 'body' => is_string($resp) ? $resp : ''];
    }
    $hdr = "Content-Type: application/x-www-form-urlencoded\r\n";
    foreach ($headers as $h) {
        $hdr .= $h . "\r\n";
    }
    $ctx = stream_context_create(['http' => [
        'method'        => 'POST',
        'header'        => $hdr,
        'content'       => $payload,
        'timeout'       => 15,
        'ignore_errors' => true,
    ]]);
    $resp = @file_get_contents($url, false, $ctx);
    $code = 0;
    if (isset($http_response_header[0]) &&
        preg_match('#\s(\d{3})\s#', $http_response_header[0], $m)) {
        $code = (int) $m[1];
    }
    return ['code' => $code, 'body' => is_string($resp) ? $resp : ''];
};

// ── Хелпер: голый почтовый адрес из "Имя <addr@x>" ──────────────────────
$bare_addr = function ($s) {
    if (preg_match('/<([^>]+)>/', (string)$s, $m)) return trim($m[1]);
    return trim((string)$s);
};

// ── Хелпер: отправка письма по SMTP (сырой сокет, AUTH LOGIN) ───────────
$smtp_send = function ($host, $port, $secure, $user, $pass, $fromAddr, $fromHeader, $to, $subject, $html, $text)
             use ($bare_addr) {
    $transport = ($secure === 'ssl') ? "ssl://{$host}" : $host;
    $fp = @stream_socket_client("{$transport}:{$port}", $errno, $errstr, 20,
                                STREAM_CLIENT_CONNECT);
    if (!$fp) return false;
    stream_set_timeout($fp, 20);

    $read = function () use ($fp) {
        $data = '';
        while (($line = fgets($fp, 515)) !== false) {
            $data .= $line;
            // последняя строка ответа: "250 текст" (пробел после кода)
            if (isset($line[3]) && $line[3] === ' ') break;
        }
        return $data;
    };
    $cmd = function ($c) use ($fp, $read) {
        fwrite($fp, $c . "\r\n");
        return $read();
    };
    $code = function ($resp) { return (int) substr((string)$resp, 0, 3); };

    $ok = true;
    if ($code($read()) !== 220) $ok = false;               // приветствие сервера
    $ehlo = $cmd('EHLO aqua-core.ru');
    if ($code($ehlo) !== 250) $ok = false;

    if ($ok && $secure === 'tls') {                        // STARTTLS для 587
        if ($code($cmd('STARTTLS')) !== 220) $ok = false;
        if ($ok && !stream_socket_enable_crypto(
                $fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) $ok = false;
        if ($ok && $code($cmd('EHLO aqua-core.ru')) !== 250) $ok = false;
    }

    if ($ok) {
        if ($code($cmd('AUTH LOGIN')) !== 334) $ok = false;
        if ($ok && $code($cmd(base64_encode($user))) !== 334) $ok = false;
        if ($ok && $code($cmd(base64_encode($pass))) !== 235) $ok = false;
    }
    if ($ok && $code($cmd('MAIL FROM:<' . $bare_addr($fromAddr) . '>')) !== 250) $ok = false;
    if ($ok && $code($cmd('RCPT TO:<' . $bare_addr($to) . '>')) > 251)  $ok = false;
    if ($ok && $code($cmd('DATA')) !== 354) $ok = false;

    if ($ok) {
        $subjEnc = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $boundary = 'ac_' . bin2hex(random_bytes(8));
        $headers  = "From: {$fromHeader}\r\n";
        $headers .= 'To: <' . $bare_addr($to) . ">\r\n";
        $headers .= "Subject: {$subjEnc}\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";
        $body  = "--{$boundary}\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($text)) . "\r\n";
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($html)) . "\r\n";
        $body .= "--{$boundary}--\r\n";
        // Точки в начале строк экранируются (dot-stuffing).
        $msg = preg_replace('/^\./m', '..', $headers . "\r\n" . $body);
        fwrite($fp, $msg . "\r\n.\r\n");
        if ($code($read()) !== 250) $ok = false;
    }
    $cmd('QUIT');
    fclose($fp);
    return $ok;
};

// ── Хелпер: отправка через нативную mail() (почта хостинга, бесплатно) ───
$mail_send = function ($fromHeader, $to, $subject, $html, $text) use ($bare_addr) {
    $subjEnc  = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $headers  = "From: {$fromHeader}\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n";
    // -f задаёт envelope-from (важно для SPF/доставки на shared-хостинге).
    $params = '-f ' . $bare_addr($fromHeader);
    return @mail($bare_addr($to), $subjEnc, $html, $headers, $params);
};

// ── GET: отдать публичный ключ web3forms браузеру ───────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['web3forms_key' => $WEB3FORMS_KEY]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'telegram' => false, 'email' => false,
                      'error' => 'method_not_allowed']);
    exit;
}

// ── Антиспам (honeypot) ─────────────────────────────────────────────────
if (!empty($_POST['botcheck'])) {
    echo json_encode(['success' => true, 'telegram' => true, 'email' => true]);
    exit;
}

// ── Данные заявки ───────────────────────────────────────────────────────
$clean = function ($s) {
    return trim(mb_substr(strip_tags((string)$s), 0, 1500));
};
$name    = $clean($_POST['name'] ?? '');
$phone   = $clean($_POST['phone'] ?? '');
$company = $clean($_POST['company'] ?? '');
$message = $clean($_POST['message'] ?? '');

if ($name === '' && $phone === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'telegram' => false, 'email' => false,
                      'error' => 'empty']);
    exit;
}

$text = implode("\n", [
    "🆕 Новая заявка с сайта AquaCore",
    "",
    "👤 Имя: " . ($name ?: '—'),
    "📞 Телефон: " . ($phone ?: '—'),
    "🏢 Город / мойка: " . ($company ?: '—'),
    "💬 Комментарий: " . ($message ?: '—'),
]);

// ── Telegram ────────────────────────────────────────────────────────────
$telegram_ok = false;
if ($TELEGRAM_BOT_TOKEN && $TELEGRAM_CHAT_ID) {
    $api = "https://api.telegram.org/bot{$TELEGRAM_BOT_TOKEN}/sendMessage";
    $payload = http_build_query([
        'chat_id' => $TELEGRAM_CHAT_ID,
        'text'    => $text,
        'disable_web_page_preview' => true,
    ]);
    $r = $http_post($api, $payload);
    $telegram_ok = ($r['code'] === 200 && strpos($r['body'], '"ok":true') !== false);
}

// ── Почта ───────────────────────────────────────────────────────────────
$subject = 'Новая заявка с сайта AquaCore';
$rows = [
    ['👤 Имя',           $name ?: '—'],
    ['📞 Телефон',       $phone ?: '—'],
    ['🏢 Город / мойка', $company ?: '—'],
    ['💬 Комментарий',   $message ?: '—'],
];
$html = '<h2>🆕 Новая заявка с сайта AquaCore</h2><table cellpadding="6" '
      . 'style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">';
foreach ($rows as $row) {
    $html .= '<tr><td style="color:#64748b">' . htmlspecialchars($row[0])
          .  '</td><td><b>' . nl2br(htmlspecialchars($row[1])) . '</b></td></tr>';
}
$html .= '</table>';

$email_ok = false;
if ($MAIL_TO) {
    // 1) SMTP хостинга (если настроен) — самый надёжный путь.
    if (!$email_ok && $SMTP_HOST && $SMTP_USER && $SMTP_PASS) {
        $email_ok = $smtp_send($SMTP_HOST, $SMTP_PORT, $SMTP_SECURE,
                               $SMTP_USER, $SMTP_PASS, $EMAIL_FROM, $EMAIL_FROM,
                               $MAIL_TO, $subject, $html, $text);
    }
    // 2) Нативная mail() почты хостинга — бесплатно, данные в РФ.
    if (!$email_ok && function_exists('mail')) {
        $email_ok = $mail_send($EMAIL_FROM, $MAIL_TO, $subject, $html, $text);
    }
    // 3) Resend (США) — только при явном включении (трансграничная передача).
    if (!$email_ok && $ALLOW_RESEND && $RESEND_API_KEY) {
        $rbody = json_encode([
            'from'    => $EMAIL_FROM,
            'to'      => [$MAIL_TO],
            'subject' => $subject,
            'html'    => $html,
            'text'    => $text,
        ], JSON_UNESCAPED_UNICODE);
        $r = $http_post('https://api.resend.com/emails', $rbody, [
            'Authorization: Bearer ' . $RESEND_API_KEY,
            'Content-Type: application/json',
        ]);
        $email_ok = ($r['code'] >= 200 && $r['code'] < 300);
    }
}

echo json_encode([
    'success'  => $telegram_ok || $email_ok,
    'telegram' => $telegram_ok,
    'email'    => $email_ok,
]);
