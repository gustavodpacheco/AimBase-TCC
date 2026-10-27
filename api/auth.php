<?php
/**
 * API - Autenticação
 *
 * POST   /api/auth.php?action=register  -> registra novo usuário
 * POST   /api/auth.php?action=login     -> autentica usuário (sessão)
 * POST   /api/auth.php?action=logout    -> encerra sessão
 * GET    /api/auth.php?action=me        -> retorna usuário logado (ou null)
 * GET    /api/auth.php?action=csrf      -> devolve o token anti-CSRF da sessão
 *
 * Senhas são armazenadas com password_hash() e nunca em texto puro.
 * Sessões via PHP (session_start) com cookie HttpOnly.
 * Login e registro têm rate limit por IP (contador em arquivo).
 */

require __DIR__ . '/../includes/database.php';
require __DIR__ . '/../includes/functions.php';
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/rate_limit.php';

applyCors();

bootSession();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'GET') {
    // ---- /me : retorna o usuário da sessão ----
    if ($action === 'me') {
        $user = currentUser();
        jsonResponse(['user' => $user]);
    }

    // ---- /csrf : devolve o token anti-CSRF desta sessão ----
    if ($action === 'csrf') {
        jsonResponse(['token' => csrfToken()]);
    }

    errorResponse('Ação inválida.', 400);
}

if ($method === 'POST') {
    // Login, registro e logout alteram o estado da sessão: exigem token CSRF
    // (evita login CSRF — um site externo "forçar" o login na sua sessão).
    bootSession();
    verifyCsrf();

    $data = readJsonBody();

    if ($action === 'register') {
        // 5 contas por IP por hora: bloqueia criação em massa de contas.
        rateLimitEnforce('register', 5, 3600, 'ip');

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
        } catch (PDOException $e) {
            errorResponse('E-mail ou username já está em uso.', 409);
        }

        session_regenerate_id(true);
        $_SESSION['user_id'] = (int)$pdo->lastInsertId();

        $user = currentUser();
        jsonResponse(['user' => $user], true, 201, 'Conta criada. Boas-vindas ao AimBase.');
    }

    if ($action === 'login') {
        // 10 tentativas por IP a cada 5 minutos (mesmo contador do /admin/login.php).
        rateLimitEnforce('login', 10, 300, 'ip');

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
        rateLimitClear('login', 'ip');

        $user = currentUser();
        jsonResponse(['user' => $user], true, 200, 'Login realizado.');
    }

    if ($action === 'logout') {
        destroySession();
        jsonResponse(null, true, 200, 'Sessão encerrada.');
    }

    errorResponse('Ação inválida.', 400);
}

errorResponse('Método não permitido.', 405);
