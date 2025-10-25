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
if (strlen($password) < 8) { http_response_code(400); echo json_encode(['error'=>'Password must be at least 8 characters']); exit; }

$pdo = db_conn();
$pdo->beginTransaction();
try {
  $stmt = $pdo->prepare('SELECT id, email, created_at, password_hash FROM users WHERE email = ?');
  $stmt->execute([$email]);
  $u = $stmt->fetch(PDO::FETCH_ASSOC);
  $hash = password_hash($password, PASSWORD_DEFAULT);
  if ($u) {
    if (!empty($u['password_hash'])) {
      $pdo->rollBack();
      http_response_code(409);
      echo json_encode(['error'=>'Email already registered']);
      exit;
    }
    $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([$hash, $u['id']]);
    $userId = (int)$u['id'];
    $createdAt = (int)$u['created_at'];
  } else {
    $stmt = $pdo->prepare('INSERT INTO users(email, created_at, password_hash) VALUES(?,?,?)');
    $createdAt = time();
    $stmt->execute([$email, $createdAt, $hash]);
    $userId = (int)$pdo->lastInsertId();
  }
  $pdo->commit();
  $_SESSION['user_id'] = $userId;
  echo json_encode(['ok'=>true, 'user'=>['id'=>$userId,'email'=>$email,'created_at'=>$createdAt]]);
} catch (Throwable $e) {
  if ($pdo->inTransaction()) { $pdo->rollBack(); }
  http_response_code(500);
  echo json_encode(['error'=>'Server error']);
}
