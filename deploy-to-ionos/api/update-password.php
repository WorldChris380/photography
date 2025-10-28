<?php
session_start();
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/util.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { cors_json(); http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { cors_json(); http_response_code(405); echo json_encode(['error'=>'Method not allowed']); exit; }

if (empty($_SESSION['user_id'])) { cors_json(); http_response_code(401); echo json_encode(['error'=>'Not signed in']); exit; }

cors_json();
$input = json_decode(file_get_contents('php://input'), true) ?? [];
$current = (string)($input['currentPassword'] ?? '');
$new = (string)($input['newPassword'] ?? '');
if (strlen($new) < 8) { http_response_code(400); echo json_encode(['error'=>'Password must be at least 8 characters']); exit; }

$pdo = db_conn();
$stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
$stmt->execute([$_SESSION['user_id']]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
$existing = $row['password_hash'] ?? null;
if (!empty($existing)) {
  if ($current === '' || !password_verify($current, $existing)) { http_response_code(401); echo json_encode(['error'=>'Current password incorrect']); exit; }
}
$newHash = password_hash($new, PASSWORD_DEFAULT);
$pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([$newHash, $_SESSION['user_id']]);
echo json_encode(['ok'=>true]);
