<?php
session_start();
require_once __DIR__ . '/../lib/db.php';

$token = $_GET['token'] ?? '';
if (!$token) { http_response_code(400); echo 'Missing token'; exit; }
$userId = db_consume_login_token($token);
if (!$userId) { http_response_code(400); echo 'Invalid or expired token'; exit; }
$_SESSION['user_id'] = (int)$userId;
// Redirect to account page
header('Location: /account.html');
exit;
