<?php
session_start();
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/util.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { cors_json(); http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { cors_json(); http_response_code(405); echo json_encode(['error'=>'Method not allowed']); exit; }

cors_json();
$input = json_decode(file_get_contents('php://input'), true) ?? [];
$email = strtolower(trim($input['email'] ?? ''));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { http_response_code(400); echo json_encode(['error'=>'Invalid email']); exit; }

$user = db_get_or_create_user($email);
$token = db_create_login_token((int)$user['id']);

// Build magic link
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'photography.christian-boehme.com';
$link = $scheme . '://' . $host . '/api/login-verify.php?token=' . urlencode($token);

$subject = 'Your login link for Christian Böhme Photography';
$body = "Hello,\n\nClick to sign in:\n$link\n\nThis link expires in 15 minutes. If you didn't request it, you can ignore this email.";
$headers = 'From: photography@christian-boehme.com' . "\r\n" . 'Content-Type: text/plain; charset=UTF-8';

@mail($email, $subject, $body, $headers);

echo json_encode(['ok'=>true]);
