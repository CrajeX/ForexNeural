<?php
// api/check_auth.php
require_once 'config.php';

session_start();

if (isset($_SESSION['user_id'])) {
    // User is authenticated
    try {
        $stmt = $pdo->prepare("SELECT id, username, email FROM accounts WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            echo json_encode([
                'authenticated' => true,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email']
                ]
            ]);
        } else {
            // User not found, destroy session
            session_destroy();
            echo json_encode(['authenticated' => false]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['authenticated' => false]);
}
?>