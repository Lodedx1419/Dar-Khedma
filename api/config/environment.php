<?php
/**
 * Environment Configuration Loader
 * Loads settings from .env file or uses defaults
 */

function loadEnv($filePath) {
    if (!file_exists($filePath)) {
        return;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            // Set as environment variable
            putenv("$key=$value");
            $_ENV[$key] = $value;
        }
    }
}

// Load .env from api directory
$apiDir = dirname(__DIR__);
$envFile = $apiDir . '/.env';
if (file_exists($envFile)) {
    loadEnv($envFile);
}

// Helper function to get environment variable with fallback
function getEnv($key, $default = null) {
    return $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key) ?: $default;
}

?>
