<?php
session_start();
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/util.php';

cors_json();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if (empty($_SESSION['user_id'])) { http_response_code(401); echo json_encode(['error'=>'Not signed in']); exit; }
$pdo = db_conn();
$stmt = $pdo->prepare('SELECT id, email, created_at FROM users WHERE id = ?');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user) { http_response_code(401); echo json_encode(['error'=>'Not signed in']); exit; }

echo json_encode(['ok'=>true,'user'=>$user]);
