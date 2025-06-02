<?php
// api/logout.php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

session_start();
session_destroy();
echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>