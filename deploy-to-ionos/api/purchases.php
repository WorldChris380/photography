<?php
session_start();
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/util.php';

cors_json();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if (empty($_SESSION['user_id'])) { http_response_code(401); echo json_encode(['error'=>'Not signed in']); exit; }

$pdo = db_conn();
$stmt = $pdo->prepare('SELECT o.id as order_id, o.created_at, oi.src, oi.description, o.currency, oi.price
  FROM orders o JOIN order_items oi ON o.id = oi.order_id
  WHERE o.user_id = ? ORDER BY o.created_at DESC');
$stmt->execute([$_SESSION['user_id']]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['ok'=>true,'items'=>$rows]);
