<?php
/**
 * Приём заявок с сайта AquaCore.
 *
 *  POST  → отправляет заявку:
 *            1) в Telegram-группу (через бота);
 *            2) письмом на почту — серверно через Resend API
 *               (тот же сервис, что и в основном приложении AquaCore).
 *  GET   → отдаёт публичный ключ web3forms (запасной client-side вариант
 *          отправки письма из браузера, если Resend не настроен).
 *
 * Токены и ключи задаются на хостинге в telegram-secret.php
 * (скопируйте telegram-secret.example.php → telegram-secret.php).
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// ── Настройки ───────────────────────────────────────────────────────────
$TELEGRAM_BOT_TOKEN = getenv('TELEGRAM_BOT_TOKEN') ?: '';
$TELEGRAM_CHAT_ID   = getenv('TELEGRAM_CHAT_ID') ?: '-5380504235';
$WEB3FORMS_KEY      = getenv('WEB3FORMS_KEY') ?: '';

// Почта через Resend (как в основном приложении AquaCore).
$RESEND_API_KEY     = getenv('RESEND_API_KEY') ?: '';
$EMAIL_FROM         = getenv('EMAIL_FROM') ?: 'AquaCore <onboarding@resend.dev>';
$MAIL_TO            = getenv('MAIL_TO') ?: 'info@aqua-core.ru';

$secret = __DIR__ . '/telegram-secret.php';
if (is_file($secret)) {
    ob_start();          // на случай BOM/пробелов перед <?php
    require $secret;
    ob_end_clean();
}

// ── Хелпер: POST-запрос (curl, с фолбэком на stream) ────────────────────
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

// ── GET: отдать публичный ключ web3forms браузеру ───────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['web3forms_key' => $WEB3FORMS_KEY]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'method_not_allowed']);
    exit;
}

// ── Антиспам ────────────────────────────────────────────────────────────
if (!empty($_POST['botcheck'])) {
    echo json_encode(['success' => true]);
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
    echo json_encode(['success' => false, 'error' => 'empty']);
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

// ── Почта через Resend (серверно, как в основном приложении) ────────────
$email_ok = false;
if ($RESEND_API_KEY && $MAIL_TO) {
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

    $body = json_encode([
        'from'    => $EMAIL_FROM,
        'to'      => [$MAIL_TO],
        'subject' => 'Новая заявка с сайта AquaCore',
        'html'    => $html,
        'text'    => $text,
    ], JSON_UNESCAPED_UNICODE);

    $r = $http_post('https://api.resend.com/emails', $body, [
        'Authorization: Bearer ' . $RESEND_API_KEY,
        'Content-Type: application/json',
    ]);
    $email_ok = ($r['code'] >= 200 && $r['code'] < 300);
}

echo json_encode([
    'success'  => $telegram_ok || $email_ok,
    'telegram' => $telegram_ok,
    'email'    => $email_ok,
]);
