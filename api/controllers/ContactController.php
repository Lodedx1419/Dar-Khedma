<?php
/**
 * Contact Form Controller
 */

class ContactController {
    private $db;
    
    public function __construct() {
        $this->db = require __DIR__ . '/../config/database.php';
    }
    
    /**
     * POST /api/contact
     */
    public function submit($params) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (empty($input['name']) || empty($input['email']) || empty($input['message'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name, email, and message are required']);
            return;
        }
        
        // Validate email
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid email format']);
            return;
        }
        
        // Insert contact submission
        $stmt = $this->db->prepare(
            "INSERT INTO contact_submissions (name, email, phone, subject, message, status) 
             VALUES (?, ?, ?, ?, ?, 'new')"
        );
        
        $stmt->bind_param(
            "sssss",
            $input['name'],
            $input['email'],
            $input['phone'] ?? null,
            $input['subject'] ?? null,
            $input['message']
        );
        
        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to submit contact form']);
            return;
        }
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for your message. We will contact you soon.'
        ]);
    }
}

?>
