<?php
// SQLite DB helper and schema
function db_conn(): PDO {
  static $pdo = null;
  if ($pdo) return $pdo;
  $dbDir = __DIR__ . '/../data';
  if (!is_dir($dbDir)) { @mkdir($dbDir, 0775, true); }
  $dbFile = $dbDir . '/app.sqlite';
  $pdo = new PDO('sqlite:' . $dbFile);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  // Pragmas
  $pdo->exec('PRAGMA foreign_keys = ON');
  // Schema
  $pdo->exec('CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at INTEGER NOT NULL
  )');
  // Runtime migration: ensure password_hash column exists for password-based accounts
  try {
    $cols = $pdo->query("PRAGMA table_info(users)")->fetchAll(PDO::FETCH_ASSOC);
    $hasPassword = false;
    foreach ($cols as $c) { if (($c['name'] ?? '') === 'password_hash') { $hasPassword = true; break; } }
    if (!$hasPassword) {
      $pdo->exec('ALTER TABLE users ADD COLUMN password_hash TEXT');
    }
  } catch (Throwable $e) { /* ignore */ }
  $pdo->exec('CREATE TABLE IF NOT EXISTS login_tokens (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )');
  $pdo->exec('CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    paypal_order_id TEXT,
    paypal_capture_id TEXT,
    amount TEXT,
    currency TEXT,
    status TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
  )');
  $pdo->exec('CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    src TEXT NOT NULL,
    description TEXT,
    price TEXT,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
  )');
  return $pdo;
}

function db_get_or_create_user(string $email): array {
  $email = strtolower(trim($email));
  $pdo = db_conn();
  $stmt = $pdo->prepare('SELECT id, email FROM users WHERE email = ?');
  $stmt->execute([$email]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);
  if ($user) return $user;
  $stmt = $pdo->prepare('INSERT INTO users(email, created_at) VALUES(?, ?)');
  $stmt->execute([$email, time()]);
  $id = (int)$pdo->lastInsertId();
  return ['id'=>$id,'email'=>$email];
}

function db_create_login_token(int $userId, int $ttlSeconds = 900): string {
  $token = bin2hex(random_bytes(32));
  $pdo = db_conn();
  $stmt = $pdo->prepare('INSERT INTO login_tokens(token, user_id, expires_at, created_at) VALUES(?,?,?,?)');
  $stmt->execute([$token, $userId, time()+$ttlSeconds, time()]);
  return $token;
}

function db_consume_login_token(string $token): ?int {
  $pdo = db_conn();
  $stmt = $pdo->prepare('SELECT user_id, expires_at FROM login_tokens WHERE token = ?');
  $stmt->execute([$token]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$row) return null;
  if ((int)$row['expires_at'] < time()) {
    $pdo->prepare('DELETE FROM login_tokens WHERE token = ?')->execute([$token]);
    return null;
  }
  $pdo->prepare('DELETE FROM login_tokens WHERE token = ?')->execute([$token]);
  return (int)$row['user_id'];
}
