<?php
echo "<h1>PHP Debug Information</h1>";
echo "<h2>PHP is working!</h2>";
echo "<p><strong>Current Directory:</strong> " . __DIR__ . "</p>";
echo "<p><strong>Script Location:</strong> " . __FILE__ . "</p>";

echo "<h3>Files in current directory:</h3>";
echo "<pre>";
print_r(scandir(__DIR__));
echo "</pre>";

echo "<h3>Looking for paypal-secret.php:</h3>";
$secretFile = __DIR__ . '/paypal-secret.php';
echo "<p>Checking: $secretFile</p>";
echo "<p>Exists: " . (file_exists($secretFile) ? '<strong style="color:green">YES ✓</strong>' : '<strong style="color:red">NO ✗</strong>') . "</p>";

if (file_exists($secretFile)) {
    echo "<p>Readable: " . (is_readable($secretFile) ? '<strong style="color:green">YES ✓</strong>' : '<strong style="color:red">NO ✗</strong>') . "</p>";
    echo "<p>File size: " . filesize($secretFile) . " bytes</p>";
}

echo "<h3>Parent directory check:</h3>";
$parentSecret = dirname(__DIR__) . '/paypal-secret.php';
echo "<p>Checking: $parentSecret</p>";
echo "<p>Exists: " . (file_exists($parentSecret) ? '<strong style="color:green">YES ✓</strong>' : '<strong style="color:red">NO ✗</strong>') . "</p>";
?>