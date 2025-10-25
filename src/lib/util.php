<?php
define('ALLOW_INCLUDE', true);
require_once __DIR__ . '/../paypal-secret.php';

function cors_json() {
  $allowed_origins = [
    'https://photography.christian-boehme.com',
    // 'http://localhost:4200',
    // 'https://localhost:4200'
  ];
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if (in_array($origin, $allowed_origins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
  } else {
    header('Access-Control-Allow-Origin: https://photography.christian-boehme.com');
  }
  header('Vary: Origin');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
  header('Content-Type: application/json');
}

function private_downloads_dir(): string {
  if (defined('PRIVATE_DOWNLOADS_DIR')) return PRIVATE_DOWNLOADS_DIR;
  return __DIR__ . '/../private_downloads';
}

function map_src_to_private_path(string $src): string {
  // Normalize relative path from gallery.json to private store
  $src = ltrim($src, '/');
  $path = private_downloads_dir() . '/' . $src;
  // collapse .. to avoid traversal
  $realBase = realpath(private_downloads_dir());
  $realPath = realpath(dirname($path));
  if ($realBase && $realPath && strpos($realPath, $realBase) !== 0) {
    throw new Exception('Invalid path');
  }
  return $path;
}
