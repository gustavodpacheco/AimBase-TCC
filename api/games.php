<?php
/**
 * API - Games
 *
 * GET  /api/games.php        -> lista jogos
 * POST /api/games.php        -> cria jogo (admin)
 * PUT  /api/games.php        -> edita jogo (admin)
 * DELETE /api/games.php?id=N -> exclui jogo (admin)
 */

require __DIR__ . '/../includes/database.php';
require __DIR__ . '/../includes/functions.php';

applyCors();

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT id, name, slug, created_at FROM games ORDER BY name ASC");
    jsonResponse(['games' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $data = readJsonBody();
    $name = trim($data['name'] ?? '');
    if ($name === '') {
        errorResponse('Nome do jogo é obrigatório.', 422);
    }
    $slug = trim($data['slug'] ?? '') ?: slugify($name);
    try {
        $stmt = $pdo->prepare("INSERT INTO games (name, slug) VALUES (?, ?)");
        $stmt->execute([$name, $slug]);
        jsonResponse(['id' => (int)$pdo->lastInsertId()], true, 201, 'Jogo criado.');
    } catch (PDOException $e) {
        errorResponse('Slug já existe.', 409);
    }
}

if ($method === 'PUT') {
    $data = readJsonBody();
    if (!validId($data['id'] ?? null)) {
        errorResponse('ID inválido.', 400);
    }
    $name = trim($data['name'] ?? '');
    if ($name === '') {
        errorResponse('Nome do jogo é obrigatório.', 422);
    }
    $slug = trim($data['slug'] ?? '') ?: slugify($name);
    try {
        $stmt = $pdo->prepare("UPDATE games SET name = ?, slug = ? WHERE id = ?");
        $stmt->execute([$name, $slug, (int)$data['id']]);
        jsonResponse(['id' => (int)$data['id']], true, 200, 'Jogo atualizado.');
    } catch (PDOException $e) {
        errorResponse('Slug já existe.', 409);
    }
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!validId($id)) {
        errorResponse('ID inválido.', 400);
    }
    $stmt = $pdo->prepare("DELETE FROM games WHERE id = ?");
    $stmt->execute([(int)$id]);
    jsonResponse(null, true, 200, 'Jogo excluído.');
}

errorResponse('Método não permitido.', 405);
