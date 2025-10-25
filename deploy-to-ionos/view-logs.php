<?php
// Simple log viewer - DELETE THIS FILE after debugging!
// This should NOT be accessible in production!

$logFile = __DIR__ . '/paypal_errors.log';

echo "<!DOCTYPE html><html><head>";
echo "<meta charset='UTF-8'>";
echo "<title>PayPal Error Logs</title>";
echo "<style>
body { font-family: monospace; background: #1e1e1e; color: #d4d4d4; padding: 20px; }
h1 { color: #569cd6; }
.log { background: #252526; padding: 10px; border-left: 3px solid #569cd6; margin: 10px 0; }
.error { border-left-color: #f48771; }
.info { border-left-color: #4ec9b0; }
pre { margin: 0; white-space: pre-wrap; word-wrap: break-word; }
.refresh { background: #0e639c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
</style>";
echo "</head><body>";

echo "<h1>PayPal Error Logs</h1>";
echo "<a href='?' class='refresh'>🔄 Refresh</a> | ";
echo "<a href='?clear=1' class='refresh' style='background:#c94c4c'>🗑️ Clear Logs</a>";

if (isset($_GET['clear'])) {
    file_put_contents($logFile, '');
    echo "<p style='color:#4ec9b0'>✓ Logs cleared!</p>";
    echo "<a href='view-logs.php' class='refresh'>Back to logs</a>";
    exit;
}

echo "<p><strong>Log file:</strong> $logFile</p>";

if (!file_exists($logFile)) {
    echo "<p style='color:#f48771'>⚠️ Log file does not exist yet. Try creating an order first.</p>";
} else {
    $size = filesize($logFile);
    echo "<p><strong>File size:</strong> " . number_format($size) . " bytes</p>";
    
    if ($size === 0) {
        echo "<p style='color:#ce9178'>Log file is empty. No errors logged yet.</p>";
    } else {
        $logs = file_get_contents($logFile);
        $lines = explode("\n", $logs);
        
        echo "<h2>Last 100 lines:</h2>";
        $lines = array_slice($lines, -100);
        
        foreach ($lines as $line) {
            if (empty(trim($line))) continue;
            
            $class = 'log';
            if (stripos($line, 'error') !== false || stripos($line, 'failed') !== false) {
                $class .= ' error';
            } elseif (stripos($line, 'success') !== false || stripos($line, 'completed') !== false) {
                $class .= ' info';
            }
            
            echo "<div class='$class'><pre>" . htmlspecialchars($line) . "</pre></div>";
        }
    }
}

echo "<hr><p style='color:#ce9178'><strong>⚠️ SECURITY WARNING:</strong> Delete this file (view-logs.php) after debugging! It exposes sensitive information.</p>";
echo "</body></html>";
?>
