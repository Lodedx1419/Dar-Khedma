<?php
/**
 * Admin Controller
 * Admin-only operations for managing platform
 */

require_once __DIR__ . '/../config/jwt.php';

class AdminController {
    private $db;
    private $userId;
    private $userRole;
    
    public function __construct() {
        $this->db = require __DIR__ . '/../config/database.php';
        $this->authenticateAdmin();
    }
    
    /**
     * Verify JWT and check admin role
     */
    private function authenticateAdmin() {
        $token = getTokenFromHeader();
        
        if (!$token) {
            http_response_code(401);
            echo json_encode(['error' => 'No authorization token provided']);
            exit();
        }
        
        $payload = verifyJWT($token);
        
        if (!$payload) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or expired token']);
            exit();
        }
        
        // Get user role
        $stmt = $this->db->prepare("SELECT role FROM users WHERE id = ?");
        $stmt->bind_param("i", $payload['userId']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(401);
            echo json_encode(['error' => 'User not found']);
            exit();
        }
        
        $user = $result->fetch_assoc();
        
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Admin access required']);
            exit();
        }
        
        $this->userId = $payload['userId'];
        $this->userRole = $user['role'];
    }
    
    /**
     * GET /api/admin/dashboard
     * Get dashboard statistics
     */
    public function getDashboard($params) {
        $stats = [
            'users' => $this->getUserCount(),
            'bookings' => $this->getBookingStats(),
            'services' => $this->getServiceCount(),
            'providers' => $this->getProviderStats(),
            'contact_submissions' => $this->getContactSubmissionCount()
        ];
        
        echo json_encode($stats);
    }
    
    /**
     * GET /api/admin/users
     * List all users
     */
    public function getUsers($params) {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? min((int)$_GET['limit'], 100) : 20;
        $offset = ($page - 1) * $limit;
        
        $stmt = $this->db->prepare(
            "SELECT id, email, full_name, phone, role, account_type, created_at 
             FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?"
        );
        $stmt->bind_param("ii", $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        
        // Get total count
        $countResult = $this->db->query("SELECT COUNT(*) as total FROM users");
        $count = $countResult->fetch_assoc()['total'];
        
        echo json_encode([
            'users' => $users,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $count,
                'pages' => ceil($count / $limit)
            ]
        ]);
    }
    
    /**
     * GET /api/admin/service-providers
     * List service providers
     */
    public function getServiceProviders($params) {
        $status = $_GET['status'] ?? null;
        
        $sql = "SELECT id, full_name, email, phone, city, skills, experience_years, status, created_at FROM service_providers";
        
        $types = "";
        $queryParams = [];
        
        if ($status) {
            $sql .= " WHERE status = ?";
            $types = "s";
            $queryParams[] = $status;
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $this->db->prepare($sql);
        
        if (!empty($queryParams)) {
            $stmt->bind_param($types, ...$queryParams);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        $providers = [];
        while ($row = $result->fetch_assoc()) {
            $providers[] = $row;
        }
        
        echo json_encode(['providers' => $providers]);
    }
    
    /**
     * PUT /api/admin/service-providers/:id/approve
     * Approve a service provider
     */
    public function approveProvider($params) {
        $id = (int)$params['id'];
        
        $stmt = $this->db->prepare("UPDATE service_providers SET status = 'approved' WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Provider approved']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to approve provider']);
        }
    }
    
    /**
     * PUT /api/admin/service-providers/:id/reject
     * Reject a service provider
     */
    public function rejectProvider($params) {
        $id = (int)$params['id'];
        $input = json_decode(file_get_contents('php://input'), true);
        $reason = $input['reason'] ?? null;
        
        $stmt = $this->db->prepare("UPDATE service_providers SET status = 'rejected', notes = ? WHERE id = ?");
        $stmt->bind_param("si", $reason, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Provider rejected']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to reject provider']);
        }
    }
    
    /**
     * GET /api/admin/bookings
     * List all bookings
     */
    public function getBookings($params) {
        $status = $_GET['status'] ?? null;
        
        $sql = "SELECT b.*, u.full_name as user_name, s.name as service_name FROM bookings b
                JOIN users u ON b.user_id = u.id
                JOIN services s ON b.service_id = s.id";
        
        $types = "";
        $queryParams = [];
        
        if ($status) {
            $sql .= " WHERE b.status = ?";
            $types = "s";
            $queryParams[] = $status;
        }
        
        $sql .= " ORDER BY b.created_at DESC";
        
        $stmt = $this->db->prepare($sql);
        
        if (!empty($queryParams)) {
            $stmt->bind_param($types, ...$queryParams);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        $bookings = [];
        while ($row = $result->fetch_assoc()) {
            $bookings[] = $row;
        }
        
        echo json_encode(['bookings' => $bookings]);
    }
    
    /**
     * GET /api/admin/contact-submissions
     * List contact form submissions
     */
    public function getContactSubmissions($params) {
        $status = $_GET['status'] ?? null;
        
        $sql = "SELECT * FROM contact_submissions";
        
        $types = "";
        $queryParams = [];
        
        if ($status) {
            $sql .= " WHERE status = ?";
            $types = "s";
            $queryParams[] = $status;
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $this->db->prepare($sql);
        
        if (!empty($queryParams)) {
            $stmt->bind_param($types, ...$queryParams);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        $submissions = [];
        while ($row = $result->fetch_assoc()) {
            $submissions[] = $row;
        }
        
        echo json_encode(['submissions' => $submissions]);
    }
    
    /**
     * PUT /api/admin/contact-submissions/:id
     * Mark contact submission as read/responded
     */
    public function updateContactSubmission($params) {
        $id = (int)$params['id'];
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Status is required']);
            return;
        }
        
        $stmt = $this->db->prepare("UPDATE contact_submissions SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $input['status'], $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Submission updated']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update submission']);
        }
    }
    
    /**
     * Helper: Get user count
     */
    private function getUserCount() {
        $result = $this->db->query("SELECT COUNT(*) as count FROM users");
        $row = $result->fetch_assoc();
        return $row['count'];
    }
    
    /**
     * Helper: Get service count
     */
    private function getServiceCount() {
        $result = $this->db->query("SELECT COUNT(*) as count FROM services WHERE is_active = 1");
        $row = $result->fetch_assoc();
        return $row['count'];
    }
    
    /**
     * Helper: Get booking stats
     */
    private function getBookingStats() {
        $result = $this->db->query(
            "SELECT status, COUNT(*) as count FROM bookings GROUP BY status"
        );
        
        $stats = ['total' => 0, 'by_status' => []];
        while ($row = $result->fetch_assoc()) {
            $stats['by_status'][$row['status']] = $row['count'];
            $stats['total'] += $row['count'];
        }
        
        return $stats;
    }
    
    /**
     * Helper: Get provider stats
     */
    private function getProviderStats() {
        $result = $this->db->query(
            "SELECT status, COUNT(*) as count FROM service_providers GROUP BY status"
        );
        
        $stats = ['total' => 0, 'by_status' => []];
        while ($row = $result->fetch_assoc()) {
            $stats['by_status'][$row['status']] = $row['count'];
            $stats['total'] += $row['count'];
        }
        
        return $stats;
    }
    
    /**
     * Helper: Get contact submission count
     */
    private function getContactSubmissionCount() {
        $result = $this->db->query(
            "SELECT COUNT(*) as count FROM contact_submissions WHERE status = 'new'"
        );
        $row = $result->fetch_assoc();
        return $row['count'];
    }
}

?>
