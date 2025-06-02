<?php
// api/login.php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit();
}

$email = trim($input['email']);
$password = trim($input['password']);

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password cannot be empty']);
    exit();
}

try {
    // Step 1: Get account_id from students using email
    $stmt = $pdo->prepare("SELECT account_id, name, student_id FROM students WHERE email = ?");
    $stmt->execute([$email]);
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
        exit();
    }

    $account_id = $student['account_id'];

    // Step 2: Get username, password, and role from accounts using account_id
    $stmt2 = $pdo->prepare("SELECT account_id, username, password, roles FROM accounts WHERE account_id = ?");
    $stmt2->execute([$account_id]);
    $account = $stmt2->fetch(PDO::FETCH_ASSOC);

    if (!$account) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
        exit();
    }

    // Step 3: Verify password
    if (password_verify($password, $account['password']) || $password === $account['password']) {
        // Password matched (hashed or plain)

        session_start();
        $_SESSION['user_id'] = $account['account_id'];
        $_SESSION['user_email'] = $email;

        echo json_encode([
            'success' => true,
            'user' => [
                'student_id' => $student['student_id'],
                'name' => $student['name'],
                'username' => $account['username'],
                'email' => $email,
                'roles' => $account['roles'],
                'loginTime' => date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
