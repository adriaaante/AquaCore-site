<?php
/**
 * Приём заявок с сайта AquaCore.
 *
 *  POST  → отправляет заявку в Telegram-группу (через бота).
 *  GET   → отдаёт публичный ключ web3forms, чтобы письмо ушло из браузера
 *          (бесплатный тариф web3forms разрешает отправку только client-side).
 *
 * Токен бота и ключ задаются на хостинге в telegram-secret.php
 * (скопируйте telegram-secret.example.php → telegram-secret.php).
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// ── Настройки ───────────────────────────────────────────────────────────
$TELEGRAM_BOT_TOKEN = getenv('TELEGRAM_BOT_TOKEN') ?: '';
$TELEGRAM_CHAT_ID   = getenv('TELEGRAM_CHAT_ID') ?: '-5380504235';
$WEB3FORMS_KEY      = getenv('WEB3FORMS_KEY') ?: '';

$secret = __DIR__ . '/telegram-secret.php';
if (is_file($secret)) {
    ob_start();          // на случай BOM/пробелов перед <?php
    require $secret;
    ob_end_clean();
}

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
        $ctx = stream_context_create(['http' => [
            'method' => 'POST', 'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => $payload, 'timeout' => 15,
        ]]);
        $resp = @file_get_contents($api, false, $ctx);
        $telegram_ok = (is_string($resp) && strpos($resp, '"ok":true') !== false);
    }
}

echo json_encode(['success' => $telegram_ok, 'telegram' => $telegram_ok]);
