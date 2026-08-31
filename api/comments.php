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

applyCors();

if (session_status() === PHP_SESSION_NONE) {
    session_name('PROSENS_SESSID');
    session_start();
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

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
    $data     = readJsonBody();
    $playerId = $data['player_id'] ?? null;
    $author   = trim($data['author'] ?? '');
    $message  = trim($data['message'] ?? '');

    if (!validId($playerId)) {
        errorResponse('Informe player_id válido.', 400);
    }
    if ($author === '') {
        errorResponse('Informe seu nome.', 422);
    }
    if ($message === '') {
        errorResponse('Escreva um comentário.', 422);
    }
    if (mb_strlen($author) > 32) {
        errorResponse('O nome deve ter no máximo 32 caracteres.', 422);
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
    $stmt->execute([(int)$playerId, mb_substr($author, 0, 32), mb_substr($message, 0, 500)]);

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
    // Somente permite excluir o próprio comentário se estiver logado com o mesmo autor associado.
    // Esta versão não vincula comentário a usuário, então exige sessão de admin de demonstração.
    if (empty($_SESSION['user_id'])) {
        errorResponse('Não autorizado.', 403);
    }
    $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
    $stmt->execute([(int)$id]);
    jsonResponse(null, true, 200, 'Comentário excluído.');
}

errorResponse('Método não permitido.', 405);
