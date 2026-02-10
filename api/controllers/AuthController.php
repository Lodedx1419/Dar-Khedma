<?php
/**
 * Authentication Controller
 */

require_once __DIR__ . '/../config/jwt.php';

class AuthController {
    private $db;
    
    public function __construct() {
        $this->db = require __DIR__ . '/../config/database.php';
    }
    
    /**
     * POST /api/auth/register
     */
    public function register($params) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (empty($input['email']) || empty($input['password']) || empty($input['full_name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email, password, and full name are required']);
            return;
        }
        
        if (strlen($input['password']) < 6) {
            http_response_code(400);
            echo json_encode(['error' => 'Password must be at least 6 characters']);
            return;
        }
        
        if (($input['account_type'] ?? 'individual') === 'business' && empty($input['business_name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Business name is required for business accounts']);
            return;
        }
        
        // Check if user exists
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $input['email']);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows > 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Email already registered']);
            return;
        }
        
        // Hash password
        $passwordHash = hashPassword($input['password']);
        $accountType = $input['account_type'] ?? 'individual';
        
        // Insert user
        $stmt = $this->db->prepare(
            "INSERT INTO users (email, password_hash, full_name, phone, account_type, business_name, business_registration, address, city, role) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'user')"
        );
        
        $stmt->bind_param(
            "sssssssss",
            $input['email'],
            $passwordHash,
            $input['full_name'],
            $input['phone'] ?? null,
            $accountType,
            $input['business_name'] ?? null,
            $input['business_registration'] ?? null,
            $input['address'] ?? null,
            $input['city'] ?? null
        );
        
        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(['error' => 'Registration failed']);
            return;
        }
        
        $userId = $stmt->insert_id;
        
        // Create JWT token
        $token = createJWT([
            'userId' => $userId,
            'email' => $input['email'],
            'role' => 'user'
        ]);
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $userId,
                'email' => $input['email'],
                'full_name' => $input['full_name'],
                'role' => 'user',
                'account_type' => $accountType
            ]
        ]);
    }
    
    /**
     * POST /api/auth/login
     */
    public function login($params) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (empty($input['email']) || empty($input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password are required']);
            return;
        }
        
        // Get user
        $stmt = $this->db->prepare(
            "SELECT id, email, password_hash, full_name, role, account_type, phone, address, city, business_name 
             FROM users WHERE email = ?"
        );
        $stmt->bind_param("s", $input['email']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid email or password']);
            return;
        }
        
        $user = $result->fetch_assoc();
        
        // Verify password
        if (!verifyPassword($input['password'], $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid email or password']);
            return;
        }
        
        // Create JWT token
        $token = createJWT([
            'userId' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);
        
        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'full_name' => $user['full_name'],
                'role' => $user['role'],
                'account_type' => $user['account_type'],
                'phone' => $user['phone'],
                'address' => $user['address'],
                'city' => $user['city'],
                'business_name' => $user['business_name']
            ]
        ]);
    }
    
    /**
     * GET /api/auth/me
     */
    public function getProfile($params) {
        // Get token from header
        $token = getTokenFromHeader();
        
        if (!$token) {
            http_response_code(401);
            echo json_encode(['error' => 'No authorization token provided']);
            return;
        }
        
        $payload = verifyJWT($token);
        
        if (!$payload) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or expired token']);
            return;
        }
        
        // Get user
        $stmt = $this->db->prepare(
            "SELECT id, email, full_name, phone, role, account_type, business_name, address, city 
             FROM users WHERE id = ?"
        );
        $stmt->bind_param("i", $payload['userId']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        $user = $result->fetch_assoc();
        echo json_encode($user);
    }
}

?>
