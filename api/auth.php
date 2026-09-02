<?php
/**
 * API - Autenticação
 *
 * POST   /api/auth.php?action=register  -> registra novo usuário
 * POST   /api/auth.php?action=login     -> autentica usuário (sessão)
 * POST   /api/auth.php?action=logout    -> encerra sessão
 * GET    /api/auth.php?action=me        -> retorna usuário logado (ou null)
 *
 * Senhas são armazenadas com password_hash() e nunca em texto puro.
 * Sessões via PHP (session_start) com cookie HttpOnly.
 */

require __DIR__ . '/../includes/database.php';
require __DIR__ . '/../includes/functions.php';

applyCors();

if (session_status() === PHP_SESSION_NONE) {
    session_name('AIMBASE_SESSID');
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
        'path'     => '/',
    ]);
    session_start();
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'GET') {
    // ---- /me : retorna o usuário da sessão ----
    if ($action === 'me') {
        if (empty($_SESSION['user_id'])) {
            jsonResponse(['user' => null]);
        }
        $stmt = db()->prepare("SELECT id, username, email, created_at FROM users WHERE id = ?");
        $stmt->execute([(int)$_SESSION['user_id']]);
        $user = $stmt->fetch();
        if (!$user) {
            session_destroy();
            jsonResponse(['user' => null]);
        }
        jsonResponse(['user' => $user]);
    }

    errorResponse('Ação inválida.', 400);
}

if ($method === 'POST') {
    $data = readJsonBody();

    if ($action === 'register') {
        $username = trim($data['username'] ?? '');
        $email    = trim($data['email'] ?? '');
        $password = (string)($data['password'] ?? '');

        if (!preg_match('/^[a-zA-Z0-9_]{3,50}$/', $username)) {
            errorResponse('Username deve ter 3 a 50 caracteres (letras, números e _).', 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            errorResponse('E-mail inválido.', 422);
        }
        if (strlen($password) < 6) {
            errorResponse('A senha deve ter pelo menos 6 caracteres.', 422);
        }

        $pdo = db();
        try {
            $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
            $stmt->execute([$username, $email, password_hash($password, PASSWORD_DEFAULT)]);
            $_SESSION['user_id'] = (int)$pdo->lastInsertId();
            jsonResponse([
                'user' => [
                    'id'       => (int)$pdo->lastInsertId(),
                    'username' => $username,
                    'email'    => $email,
                ],
            ], true, 201, 'Conta criada. Boas-vindas ao AimBase.');
        } catch (PDOException $e) {
            errorResponse('E-mail ou username já está em uso.', 409);
        }
    }

    if ($action === 'login') {
        $identifier = trim($data['email'] ?? '');
        $password   = (string)($data['password'] ?? '');
        $identifierLower = mb_strtolower($identifier);

        if ($identifier === '' || $password === '') {
            errorResponse('Informe e-mail/username e senha.', 422);
        }

        $stmt = db()->prepare("SELECT id, username, email, password_hash FROM users WHERE email = ? OR LOWER(username) = ?");
        $stmt->execute([$identifierLower, $identifierLower]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            errorResponse('E-mail, username ou senha inválidos.', 401);
        }

        session_regenerate_id(true);
        $_SESSION['user_id'] = (int)$user['id'];
        jsonResponse([
            'user' => [
                'id'       => (int)$user['id'],
                'username' => $user['username'],
                'email'    => $user['email'],
            ],
        ], true, 200, 'Login realizado.');
    }

    if ($action === 'logout') {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
        session_destroy();
        jsonResponse(null, true, 200, 'Sessão encerrada.');
    }

    errorResponse('Ação inválida.', 400);
}

errorResponse('Método não permitido.', 405);
