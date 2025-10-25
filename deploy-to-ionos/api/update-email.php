<?php
session_start();
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/util.php';

cors_json();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'Method not allowed']); exit; }
if (empty($_SESSION['user_id'])) { http_response_code(401); echo json_encode(['error'=>'Not signed in']); exit; }

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$email = strtolower(trim($input['email'] ?? ''));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { http_response_code(400); echo json_encode(['error'=>'Invalid email']); exit; }

$pdo = db_conn();
try {
  $stmt = $pdo->prepare('UPDATE users SET email = ? WHERE id = ?');
  $stmt->execute([$email, $_SESSION['user_id']]);
  echo json_encode(['ok'=>true]);
} catch (Exception $e) {
  http_response_code(400);
  echo json_encode(['error'=>'Email already in use']);
}
