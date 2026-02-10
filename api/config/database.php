<?php
/**
 * Database Configuration
 * Lightweight database connection for Raspberry Pi
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');  // Change to your MariaDB user
define('DB_PASS', 'root');  // Change to your MariaDB password
define('DB_NAME', 'dar_khedma');

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
