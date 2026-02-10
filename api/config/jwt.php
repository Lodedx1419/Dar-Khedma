<?php
/**
 * JWT Configuration & Helper Functions
 * Lightweight JWT implementation for PHP
 */

// Load environment variables from .env file
require_once(__DIR__ . '/environment.php');

// Get JWT secret from environment, generate default if not set
$jwtSecret = getEnv('JWT_SECRET');
if (!$jwtSecret || $jwtSecret === 'your-secure-random-string-here') {
    // Fallback to a secure random string if not configured
    $jwtSecret = bin2hex(random_bytes(32));
    error_log('WARNING: JWT_SECRET not configured. Using temporary random key. Set JWT_SECRET in .env file for production.');
}

define('JWT_SECRET', $jwtSecret);
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRY', (int)getEnv('JWT_EXPIRY', 86400 * 7)); // 7 days default

/**
 * Create a JWT token
 */
function createJWT($payload) {
    $header = json_encode(['alg' => JWT_ALGORITHM, 'typ' => 'JWT']);
    $issuedAt = time();
    $expire = $issuedAt + JWT_EXPIRY;
    
    $payload['iat'] = $issuedAt;
    $payload['exp'] = $expire;
    
    $payloadEncoded = json_encode($payload);
    
    // Base64 encode
    $headerEncoded = rtrim(strtr(base64_encode($header), '+/', '-_'), '=');
    $payloadEncoded = rtrim(strtr(base64_encode($payloadEncoded), '+/', '-_'), '=');
    
    // Sign
    $signature = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", JWT_SECRET, true);
    $signatureEncoded = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
    
    return "$headerEncoded.$payloadEncoded.$signatureEncoded";
}

/**
 * Verify and decode JWT token
 */
function verifyJWT($token) {
    $parts = explode('.', $token);
    
    if (count($parts) !== 3) {
        return null;
    }
    
    list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;
    
    // Verify signature
    $signature = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", JWT_SECRET, true);
    $expectedSignature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
    
    if ($signatureEncoded !== $expectedSignature) {
        return null;
    }
    
    // Decode payload
    $payload = json_decode(base64_decode(strtr($payloadEncoded, '-_', '+/')), true);
    
    // Check expiry
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return null;
    }
    
    return $payload;
}

/**
 * Get token from Authorization header
 */
function getTokenFromHeader() {
    // Try multiple header sources for compatibility with different server setups
    $authHeader = null;

    // First, try the standard $_SERVER variable (works in most configurations)
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    }
    // Fallback to getallheaders() if available (some Apache setups)
    elseif (function_exists('getallheaders')) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? null;
    }

    if (!$authHeader || !preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
        return null;
    }

    return $matches[1];
}

/**
 * Hash password using bcrypt
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
}

/**
 * Verify password against hash
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

?>
