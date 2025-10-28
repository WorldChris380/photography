<?php
session_start();
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/util.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { header('Access-Control-Allow-Origin: https://photography.christian-boehme.com'); header('Access-Control-Allow-Methods: GET, OPTIONS'); header('Access-Control-Allow-Headers: Content-Type'); http_response_code(204); exit; }

if (empty($_SESSION['user_id'])) { http_response_code(401); echo 'Not signed in'; exit; }
$src = $_GET['src'] ?? '';
if (!$src) { http_response_code(400); echo 'Missing src'; exit; }

$pdo = db_conn();
$stmt = $pdo->prepare('SELECT 1 FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE o.user_id = ? AND oi.src = ? LIMIT 1');
$stmt->execute([$_SESSION['user_id'], $src]);
$ok = $stmt->fetchColumn();
if (!$ok) { http_response_code(403); echo 'Not purchased'; exit; }

try {
  // Try private original first
  $filePath = map_src_to_private_path($src);
  if (!is_file($filePath)) {
    // Fallback to public assets within web root for initial phase
    $publicPath = realpath(__DIR__ . '/../' . ltrim($src, '/'));
    if ($publicPath && is_file($publicPath)) {
      $filePath = $publicPath;
    } else {
      http_response_code(404); echo 'File not found'; exit;
    }
  }
  // Serve download
  $filename = basename($filePath);
  header('Content-Description: File Transfer');
  header('Content-Type: application/octet-stream');
  header('Content-Disposition: attachment; filename="' . $filename . '"');
  header('Content-Length: ' . filesize($filePath));
  readfile($filePath);
  exit;
} catch (Exception $e) {
  http_response_code(400);
  echo 'Invalid path';
}
