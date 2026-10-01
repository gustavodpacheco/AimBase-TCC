<?php
/**
 * Sessão e autorização (papéis) compartilhadas entre a API e o painel admin.
 *
 * - bootSession()  : inicia a sessão AIMBASE_SESSID com cookie HttpOnly/SameSite.
 * - currentUser()  : usuário da sessão lido do banco (com role).
 * - hasRole()      : verificação de papel.
 * - requireUser()  : exige usuário autenticado (401).
 * - requireRole()  : exige papel específico, ex.: requireRole('admin') (403).
 *
 * As respostas de erro usam errorResponse() de includes/functions.php.
 */

require_once __DIR__ . '/database.php';
require_once __DIR__ . '/functions.php';

/** Inicia a sessão uma única vez por requisição. */
function bootSession(): void
{
    if (session_status() !== PHP_SESSION_NONE) {
        return;
    }

    session_name('AIMBASE_SESSID');
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
        'path'     => '/',
        // Só marca Secure quando a requisição é HTTPS (no Laragon é HTTP).
        'secure'   => isHttpsRequest(),
    ]);
    session_start();
}

/** Detecta HTTPS respeitando proxy reverso. */
function isHttpsRequest(): bool
{
    if (!empty($_SERVER['HTTPS']) && strtolower((string)$_SERVER['HTTPS']) !== 'off') {
        return true;
    }
    return strtolower((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https';
}

/**
 * Usuário da sessão (id, username, email, role) ou null.
 * Resultado memoizado por requisição; cache invalida se a sessão for encerrada.
 */
function currentUser(): ?array
{
    static $loaded = false;
    static $user    = null;

    if ($loaded) {
        return $user;
    }
    $loaded = true;

    $id = $_SESSION['user_id'] ?? null;
    if (!$id) {
        return null;
    }

    try {
        $stmt = db()->prepare('SELECT id, username, email, role, created_at FROM users WHERE id = ?');
        $stmt->execute([(int)$id]);
        $row = $stmt->fetch();
    } catch (Throwable $e) {
        $row = false;
    }

    if (!$row) {
        // Sessão apontando para usuário inexistente (ex.: banco restaurado).
        unset($_SESSION['user_id']);
        return null;
    }

    $user = [
        'id'       => (int)$row['id'],
        'username' => $row['username'],
        'email'    => $row['email'],
        'role'     => $row['role'] ?? 'user',
    ];

    return $user;
}

/** Verifica se o usuário da sessão tem o papel informado. */
function hasRole(string $role): bool
{
    $user = currentUser();
    return $user !== null && $user['role'] === $role;
}

/** Exige usuário autenticado; encerra a requisição com 401 caso contrário. */
function requireUser(): array
{
    $user = currentUser();
    if ($user === null) {
        errorResponse('Autenticação necessária.', 401);
    }
    return $user;
}

/** Exige o papel informado; encerra a requisição com 401/403 caso contrário. */
function requireRole(string $role): array
{
    $user = requireUser();
    if ($user['role'] !== $role) {
        errorResponse('Permissão insuficiente.', 403);
    }
    return $user;
}

/**
 * Token CSRF da sessão (criado sob demanda).
 * O cliente o envia no header X-CSRF-Token em toda escrita.
 */
function csrfToken(): string
{
    bootSession();

    if (empty($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

/** Valida o token CSRF (header X-CSRF-Token ou campo csrf_token); encerra com 403. */
function verifyCsrf(): void
{
    bootSession();

    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($_POST['csrf_token'] ?? '');
    $sent = is_string($sent) ? trim($sent) : '';

    $expected = $_SESSION['csrf_token'] ?? '';
    if ($expected === '' || !is_string($expected) || !hash_equals($expected, $sent)) {
        errorResponse('Token CSRF inválido ou ausente.', 403);
    }
}

/**
 * Atalho para escritas administrativas: sessão + CSRF + papel admin.
 */
function requireAdminWrite(): array
{
    bootSession();
    verifyCsrf();
    return requireRole('admin');
}

/** Encerra a sessão do usuário e limpa o token CSRF. */
function destroySession(): void
{
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }

    session_destroy();
}