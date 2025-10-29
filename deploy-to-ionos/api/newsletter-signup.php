<?php
// Allow CORS for browser calls (adjust origin as needed)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid JSON body']);
    exit;
}

$email = isset($data['email']) ? trim($data['email']) : '';

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'Valid email is required']);
    exit;
}

$to = 'photography@christian-boehme.com';
$subject = 'New newsletter signup';

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$time = date('c');

$body = "A new newsletter signup has been submitted.\n\n" .
        "Email: {$email}\n" .
        "Time: {$time}\n" .
        "IP: {$ip}\n" .
        "User-Agent: {$ua}\n";

$headers = "From: noreply@christian-boehme.com\r\n" .
           "Reply-To: noreply@christian-boehme.com\r\n" .
           "X-Mailer: PHP/" . phpversion();

if (@mail($to, $subject, $body, $headers)) {
    echo json_encode(['message' => 'Signup received']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to send email']);
}
