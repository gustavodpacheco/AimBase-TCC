<?php
/**
 * API - Comentários (comunidade)
 *
 * GET  /api/comments.php?player_id=1   -> lista comentários de um jogador
 * POST /api/comments.php               -> publica comentário
 * DELETE /api/comments.php?id=1        -> exclui próprio comentário (caso logado)
 *
 * Método: PDO + prepared statements.
 */

require __DIR__ . '/../includes/database.php';
require __DIR__ . '/../includes/functions.php';
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/rate_limit.php';

applyCors();

bootSession();

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

/**
 * Nome exibido do autor: sempre o username da sessão, limitado a 32
 * caracteres (tamanho da coluna comments.author). Nunca vem do cliente.
 */
function commentAuthorName(array $user): string
{
    $name = trim((string)($user['username'] ?? ''));

    return $name === '' ? 'usuário' : mb_substr($name, 0, 32);
}

if ($method === 'GET') {
    $playerId = $_GET['player_id'] ?? null;
    if (!validId($playerId)) {
        errorResponse('Informe player_id válido.', 400);
    }
    $stmt = $pdo->prepare("SELECT id, player_id, author, message, created_at FROM comments WHERE player_id = ? ORDER BY created_at DESC");
    $stmt->execute([(int)$playerId]);
    jsonResponse(['comments' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    // Comentários são da comunidade: exige sessão válida + token CSRF.
    $user = requireUserWrite();

    // 5 comentários por sessão+IP a cada 5 minutos.
    rateLimitEnforce('comment', 5, 300);

    $data     = readJsonBody();
    $playerId = $data['player_id'] ?? null;
    // O autor vem SEMPRE da sessão — o campo "author" do corpo é ignorado
    // (impede falsificar o nome de outra pessoa).
    $author   = commentAuthorName($user);
    $message  = trim($data['message'] ?? '');

    if (!validId($playerId)) {
        errorResponse('Informe player_id válido.', 400);
    }
    if ($message === '') {
        errorResponse('Escreva um comentário.', 422);
    }
    if (mb_strlen($message) > 500) {
        errorResponse('O comentário deve ter no máximo 500 caracteres.', 422);
    }

    // Garante que o jogador existe
    $stmt = $pdo->prepare("SELECT id FROM players WHERE id = ?");
    $stmt->execute([(int)$playerId]);
    if (!$stmt->fetch()) {
        errorResponse('Jogador não encontrado.', 404);
    }

    $stmt = $pdo->prepare("INSERT INTO comments (player_id, author, message) VALUES (?, ?, ?)");
    $stmt->execute([(int)$playerId, $author, mb_substr($message, 0, 500)]);

    $id = (int)$pdo->lastInsertId();
    $created = $pdo->prepare("SELECT id, player_id, author, message, created_at FROM comments WHERE id = ?");
    $created->execute([$id]);

    jsonResponse($created->fetch(), true, 201, 'Comentário publicado.');
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!validId($id)) {
        errorResponse('ID inválido.', 400);
    }

    $user = requireUserWrite();

    $stmt = $pdo->prepare("SELECT id, author FROM comments WHERE id = ?");
    $stmt->execute([(int)$id]);
    $comment = $stmt->fetch();

    if (!$comment) {
        errorResponse('Comentário não encontrado.', 404);
    }

    // O autor do comentário pode apagar o próprio; admin apaga qualquer um.
    $isAuthor = strcasecmp((string)$comment['author'], commentAuthorName($user)) === 0;
    $isAdmin  = ($user['role'] ?? 'user') === 'admin';

    if (!$isAuthor && !$isAdmin) {
        errorResponse('Você só pode excluir seus próprios comentários.', 403);
    }

    $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
    $stmt->execute([(int)$id]);
    jsonResponse(null, true, 200, 'Comentário excluído.');
}

errorResponse('Método não permitido.', 405);
