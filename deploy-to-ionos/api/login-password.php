<?php
session_start();
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/util.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { cors_json(); http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { cors_json(); http_response_code(405); echo json_encode(['error'=>'Method not allowed']); exit; }

cors_json();
$input = json_decode(file_get_contents('php://input'), true) ?? [];
$email = strtolower(trim($input['email'] ?? ''));
$password = (string)($input['password'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { http_response_code(400); echo json_encode(['error'=>'Invalid email']); exit; }
if ($password === '') { http_response_code(400); echo json_encode(['error'=>'Password required']); exit; }

$pdo = db_conn();
$stmt = $pdo->prepare('SELECT id, email, created_at, password_hash FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user || empty($user['password_hash'])) { http_response_code(401); echo json_encode(['error'=>'Invalid credentials']); exit; }

if (!password_verify($password, $user['password_hash'])) { http_response_code(401); echo json_encode(['error'=>'Invalid credentials']); exit; }

$_SESSION['user_id'] = (int)$user['id'];
echo json_encode(['ok'=>true,'user'=>['id'=>(int)$user['id'],'email'=>$user['email'],'created_at'=>(int)$user['created_at']]]);
