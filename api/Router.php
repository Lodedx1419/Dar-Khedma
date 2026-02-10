<?php
/**
 * Lightweight Router Class
 * Handles HTTP routing without heavy dependencies
 */

class Router {
    private $routes = [];
    private $middlewares = [];
    
    public function __construct() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }
    
    /**
     * Register GET route
     */
    public function get($path, $controller, $action) {
        $this->routes['GET'][$path] = ['controller' => $controller, 'action' => $action];
    }
    
    /**
     * Register POST route
     */
    public function post($path, $controller, $action) {
        $this->routes['POST'][$path] = ['controller' => $controller, 'action' => $action];
    }
    
    /**
     * Register PUT route
     */
    public function put($path, $controller, $action) {
        $this->routes['PUT'][$path] = ['controller' => $controller, 'action' => $action];
    }
    
    /**
     * Register DELETE route
     */
    public function delete($path, $controller, $action) {
        $this->routes['DELETE'][$path] = ['controller' => $controller, 'action' => $action];
    }
    
    /**
     * Register PATCH route
     */
    public function patch($path, $controller, $action) {
        $this->routes['PATCH'][$path] = ['controller' => $controller, 'action' => $action];
    }
    
    /**
     * Register middleware (e.g., authentication)
     */
    public function middleware($path, $callback) {
        $this->middlewares[$path] = $callback;
    }
    
    /**
     * Dispatch request
     */
    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Remove base path if needed (e.g., /var/www/html/api)
        $basePath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
        if ($basePath !== '/') {
            $path = str_replace($basePath, '', $path);
        }
        
        // Remove query string
        $path = strtok($path, '?');
        
        // Try to match route
        $route = $this->findRoute($method, $path);
        
        if (!$route) {
            http_response_code(404);
            echo json_encode(['error' => 'Route not found']);
            exit();
        }
        
        // Check middleware
        $middlewarePath = $this->findMiddlewarePath($path);
        if ($middlewarePath && isset($this->middlewares[$middlewarePath])) {
            $middlewareResult = call_user_func($this->middlewares[$middlewarePath]);
            if ($middlewareResult !== true) {
                http_response_code(401);
                echo json_encode(['error' => 'Unauthorized']);
                exit();
            }
        }
        
        // Execute controller action
        $controllerClass = $route['controller'];
        $actionMethod = $route['action'];
        
        $controller = new $controllerClass();
        
        // Pass params
        $params = $this->extractParams($path, array_keys($this->routes[$method] ?? []));
        call_user_func_array([$controller, $actionMethod], [$params]);
    }
    
    /**
     * Find matching route
     */
    private function findRoute($method, $path) {
        if (!isset($this->routes[$method])) {
            return null;
        }
        
        foreach ($this->routes[$method] as $pattern => $route) {
            if ($this->matchPath($path, $pattern)) {
                return $route;
            }
        }
        
        return null;
    }
    
    /**
     * Match path with pattern (supports :id)
     */
    private function matchPath($path, $pattern) {
        $pattern = preg_replace('/:(\w+)/', '(?P<$1>[0-9]+)', $pattern);
        $pattern = '^' . $pattern . '$';
        
        return preg_match('/' . $pattern . '/', $path) === 1;
    }
    
    /**
     * Extract URL parameters
     */
    private function extractParams($path, $patterns) {
        $params = [];
        
        foreach ($patterns as $pattern) {
            $regex = preg_replace('/:(\w+)/', '(?P<$1>[0-9]+)', $pattern);
            $regex = '^' . $regex . '$';
            
            if (preg_match('/' . $regex . '/', $path, $matches)) {
                foreach ($matches as $key => $value) {
                    if (!is_numeric($key)) {
                        $params[$key] = $value;
                    }
                }
                break;
            }
        }
        
        return $params;
    }
    
    /**
     * Find middleware path
     */
    private function findMiddlewarePath($path) {
        foreach (array_keys($this->middlewares) as $middlewarePath) {
            if ($middlewarePath === '*' || strpos($path, $middlewarePath) === 0) {
                return $middlewarePath;
            }
        }
        return null;
    }
}

?>
