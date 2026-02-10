<?php
/**
 * Services Controller
 */

class ServicesController {
    private $db;
    
    public function __construct() {
        $this->db = require __DIR__ . '/../config/database.php';
    }
    
    /**
     * GET /api/services/categories
     */
    public function getCategories($params) {
        $stmt = $this->db->prepare(
            "SELECT id, name, name_ar, description, icon, display_order 
             FROM service_categories WHERE is_active = 1 
             ORDER BY display_order, name"
        );
        $stmt->execute();
        $result = $stmt->get_result();
        
        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
        
        echo json_encode(['categories' => $categories]);
    }
    
    /**
     * GET /api/services
     */
    public function getServices($params) {
        $audience = $_GET['audience'] ?? null;
        $categoryId = $_GET['category'] ?? null;
        
        $sql = "SELECT s.*, sc.name as category_name, sc.icon as category_icon 
                FROM services s 
                JOIN service_categories sc ON s.category_id = sc.id 
                WHERE s.is_active = 1";
        
        $types = "";
        $queryParams = [];
        
        if ($audience) {
            $sql .= " AND (s.target_audience = ? OR s.target_audience = 'both')";
            $types .= "s";
            $queryParams[] = $audience;
        }
        
        if ($categoryId) {
            $sql .= " AND s.category_id = ?";
            $types .= "i";
            $queryParams[] = (int)$categoryId;
        }
        
        $sql .= " ORDER BY sc.display_order, s.name";
        
        $stmt = $this->db->prepare($sql);
        
        if (!empty($queryParams)) {
            $stmt->bind_param($types, ...$queryParams);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        $services = [];
        while ($row = $result->fetch_assoc()) {
            $services[] = $row;
        }
        
        echo json_encode(['services' => $services]);
    }
    
    /**
     * GET /api/services/:id
     */
    public function getService($params) {
        $id = (int)$params['id'];
        
        $stmt = $this->db->prepare(
            "SELECT s.*, sc.name as category_name, sc.icon as category_icon 
             FROM services s 
             JOIN service_categories sc ON s.category_id = sc.id 
             WHERE s.id = ? AND s.is_active = 1"
        );
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Service not found']);
            return;
        }
        
        $service = $result->fetch_assoc();
        echo json_encode(['service' => $service]);
    }
    
    /**
     * GET /api/services/:id/pricing
     */
    public function getPricing($params) {
        $serviceId = (int)$params['id'];
        $pricingType = $_GET['type'] ?? null;
        $serviceMode = $_GET['mode'] ?? null;
        
        $sql = "SELECT * FROM service_pricing WHERE service_id = ? AND is_active = 1";
        
        $types = "i";
        $queryParams = [$serviceId];
        
        if ($pricingType) {
            $sql .= " AND pricing_type = ?";
            $types .= "s";
            $queryParams[] = $pricingType;
        }
        
        if ($serviceMode) {
            $sql .= " AND service_mode = ?";
            $types .= "s";
            $queryParams[] = $serviceMode;
        }
        
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param($types, ...$queryParams);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $pricing = [];
        while ($row = $result->fetch_assoc()) {
            $pricing[] = $row;
        }
        
        echo json_encode(['pricing' => $pricing]);
    }
}

?>
