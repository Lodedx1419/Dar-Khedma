<?php
/**
 * Database Configuration
 * Lightweight database connection for Raspberry Pi
 */

// Load environment variables from .env file
require_once(__DIR__ . '/environment.php');

// Get configuration from environment variables with fallbacks
define('DB_HOST', getEnv('DB_HOST', 'localhost'));
define('DB_USER', getEnv('DB_USER', 'root'));
define('DB_PASS', getEnv('DB_PASS', 'root'));
define('DB_NAME', getEnv('DB_NAME', 'dar_khedma'));

// Create connection
$db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($db->connect_error) {
    http_response_code(500);
    die(json_encode(['error' => 'Database connection failed: ' . $db->connect_error]));
}

// Set charset to utf8mb4
$db->set_charset("utf8mb4");

// Enable error reporting
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

return $db;
?>
