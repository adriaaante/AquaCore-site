<?php
/**
 * Приём заявок с сайта AquaCore.
 * Отправляет заявку ОДНОВРЕМЕННО:
 *   1) в Telegram-группу (через бота);
 *   2) письмом на e-mail.
 *
 * Токен бота и параметры задаются на хостинге в файле telegram-secret.php
 * (скопируйте telegram-secret.example.php → telegram-secret.php и впишите токен).
 *
 * Сайт статический — этот PHP-файл работает на хостинге reg.ru (PHP включён).
 */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'method_not_allowed']);
    exit;
}

// ── Настройки (токен/чат/почта) ─────────────────────────────────────────
$TELEGRAM_BOT_TOKEN = getenv('TELEGRAM_BOT_TOKEN') ?: '';
$TELEGRAM_CHAT_ID   = getenv('TELEGRAM_CHAT_ID') ?: '-5380504235';
$MAIL_TO            = getenv('LEAD_MAIL_TO') ?: 'info@aqua-core.ru';

$secret = __DIR__ . '/telegram-secret.php';
if (is_file($secret)) {
    require $secret; // может переопределить переменные выше
}

// ── Антиспам (honeypot) ─────────────────────────────────────────────────
if (!empty($_POST['botcheck'])) {
    echo json_encode(['success' => true]); // тихо игнорируем ботов
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

$lines = [
    "🆕 Новая заявка с сайта AquaCore",
    "",
    "👤 Имя: " . ($name ?: '—'),
    "📞 Телефон: " . ($phone ?: '—'),
    "🏢 Город / мойка: " . ($company ?: '—'),
    "💬 Комментарий: " . ($message ?: '—'),
];
$text = implode("\n", $lines);

$telegram_ok = false;
$mail_ok = false;

// ── 1) Telegram ─────────────────────────────────────────────────────────
if ($TELEGRAM_BOT_TOKEN && $TELEGRAM_CHAT_ID) {
    $api = "https://api.telegram.org/bot{$TELEGRAM_BOT_TOKEN}/sendMessage";
    $payload = http_build_query([
        'chat_id' => $TELEGRAM_CHAT_ID,
        'text'    => $text,
        'disable_web_page_preview' => true,
    ]);
    if (function_exists('curl_init')) {
        $ch = curl_init($api);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_TIMEOUT        => 15,
        ]);
        $resp = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        $telegram_ok = ($code === 200 && is_string($resp) && strpos($resp, '"ok":true') !== false);
    } else {
        // запасной вариант, если cURL выключен
        $ctx = stream_context_create(['http' => [
            'method'  => 'POST',
            'header'  => 'Content-Type: application/x-www-form-urlencoded',
            'content' => $payload,
            'timeout' => 15,
        ]]);
        $resp = @file_get_contents($api, false, $ctx);
        $telegram_ok = (is_string($resp) && strpos($resp, '"ok":true') !== false);
    }
}

// ── 2) E-mail ───────────────────────────────────────────────────────────
if ($MAIL_TO) {
    $subject = '=?UTF-8?B?' . base64_encode('Новая заявка с сайта AquaCore') . '?=';
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: AquaCore <noreply@aqua-core.ru>',
    ];
    $mail_ok = @mail($MAIL_TO, $subject, $text, implode("\r\n", $headers));
}

$success = $telegram_ok || $mail_ok;
http_response_code($success ? 200 : 502);
echo json_encode([
    'success'  => $success,
    'telegram' => $telegram_ok,
    'mail'     => $mail_ok,
]);
