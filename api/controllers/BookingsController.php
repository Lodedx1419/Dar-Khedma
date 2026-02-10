<?php
/**
 * Bookings Controller
 */

require_once __DIR__ . '/../config/jwt.php';

class BookingsController {
    private $db;
    private $userId;
    
    public function __construct() {
        $this->db = require __DIR__ . '/../config/database.php';
        $this->authenticateUser();
    }
    
    /**
     * Verify JWT and get user ID
     */
    private function authenticateUser() {
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
        
        $this->userId = $payload['userId'];
    }
    
    /**
     * POST /api/bookings
     */
    public function createBooking($params) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        $required = ['service_id', 'pricing_id', 'booking_type', 'service_mode', 'start_date', 'service_address'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                return;
            }
        }
        
        // Get pricing
        $stmt = $this->db->prepare("SELECT price FROM service_pricing WHERE id = ?");
        $stmt->bind_param("i", $input['pricing_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid pricing option']);
            return;
        }
        
        $pricing = $result->fetch_assoc();
        
        // Insert booking
        $stmt = $this->db->prepare(
            "INSERT INTO bookings (
                user_id, service_id, pricing_id, booking_type, service_mode,
                start_date, end_date, duration_info, total_price, service_address,
                special_requirements, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')"
        );
        
        $durationInfo = isset($input['duration_info']) ? json_encode($input['duration_info']) : null;
        
        $stmt->bind_param(
            "iiisssssss",
            $this->userId,
            $input['service_id'],
            $input['pricing_id'],
            $input['booking_type'],
            $input['service_mode'],
            $input['start_date'],
            $input['end_date'] ?? null,
            $durationInfo,
            $pricing['price'],
            $input['service_address'],
            $input['special_requirements'] ?? null
        );
        
        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create booking']);
            return;
        }
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'booking_id' => $stmt->insert_id,
            'message' => 'Booking created successfully'
        ]);
    }
    
    /**
     * GET /api/bookings
     */
    public function getBookings($params) {
        $status = $_GET['status'] ?? null;
        
        $sql = "SELECT 
                    b.*,
                    s.name as service_name,
                    sc.name as category_name,
                    sp.price
                FROM bookings b
                JOIN services s ON b.service_id = s.id
                JOIN service_categories sc ON s.category_id = sc.id
                JOIN service_pricing sp ON b.pricing_id = sp.id
                WHERE b.user_id = ?";
        
        $types = "i";
        $queryParams = [$this->userId];
        
        if ($status) {
            $sql .= " AND b.status = ?";
            $types .= "s";
            $queryParams[] = $status;
        }
        
        $sql .= " ORDER BY b.created_at DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param($types, ...$queryParams);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $bookings = [];
        while ($row = $result->fetch_assoc()) {
            $bookings[] = $row;
        }
        
        echo json_encode(['bookings' => $bookings]);
    }
    
    /**
     * GET /api/bookings/:id
     */
    public function getBooking($params) {
        $id = (int)$params['id'];
        
        $stmt = $this->db->prepare(
            "SELECT b.*, s.name as service_name, sc.name as category_name, sp.price
             FROM bookings b
             JOIN services s ON b.service_id = s.id
             JOIN service_categories sc ON s.category_id = sc.id
             JOIN service_pricing sp ON b.pricing_id = sp.id
             WHERE b.id = ? AND b.user_id = ?"
        );
        $stmt->bind_param("ii", $id, $this->userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Booking not found']);
            return;
        }
        
        $booking = $result->fetch_assoc();
        echo json_encode(['booking' => $booking]);
    }
    
    /**
     * PUT /api/bookings/:id (Update booking)
     */
    public function updateBooking($params) {
        $id = (int)$params['id'];
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Check ownership
        $stmt = $this->db->prepare("SELECT id FROM bookings WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $id, $this->userId);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows === 0) {
            http_response_code(403);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }
        
        // Update allowed fields
        $updates = [];
        $types = "";
        $values = [];
        
        if (isset($input['special_requirements'])) {
            $updates[] = "special_requirements = ?";
            $types .= "s";
            $values[] = $input['special_requirements'];
        }
        
        if (isset($input['service_address'])) {
            $updates[] = "service_address = ?";
            $types .= "s";
            $values[] = $input['service_address'];
        }
        
        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            return;
        }
        
        $sql = "UPDATE bookings SET " . implode(", ", $updates) . " WHERE id = ?";
        $types .= "i";
        $values[] = $id;
        
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param($types, ...$values);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Booking updated']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update booking']);
        }
    }
    
    /**
     * DELETE /api/bookings/:id (Cancel booking)
     */
    public function cancelBooking($params) {
        $id = (int)$params['id'];
        
        // Check ownership and status
        $stmt = $this->db->prepare("SELECT status FROM bookings WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $id, $this->userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(403);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }
        
        $booking = $result->fetch_assoc();
        if ($booking['status'] === 'completed' || $booking['status'] === 'cancelled') {
            http_response_code(400);
            echo json_encode(['error' => 'Cannot cancel this booking']);
            return;
        }
        
        $stmt = $this->db->prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Booking cancelled']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to cancel booking']);
        }
    }
}

?>
