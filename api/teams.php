<?php
/**
 * API - Teams
 *
 * GET  /api/teams.php        -> lista times (com contagem de players)
 * POST /api/teams.php        -> cria time (admin)
 * PUT  /api/teams.php        -> edita time (admin)
 * DELETE /api/teams.php?id=N -> exclui time (admin)
 */

require __DIR__ . '/../includes/database.php';
require __DIR__ . '/../includes/functions.php';

applyCors();

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

if ($method === 'GET') {
    $stmt = $pdo->query("
        SELECT t.id, t.name, t.slug, t.logo, t.country, t.created_at,
               COUNT(p.id) AS player_count
        FROM teams t
        LEFT JOIN players p ON p.team_id = t.id
        GROUP BY t.id
        ORDER BY t.name ASC
    ");
    jsonResponse(['teams' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $data = readJsonBody();
    $name = trim($data['name'] ?? '');
    if ($name === '') {
        errorResponse('Nome do time é obrigatório.', 422);
    }
    $slug = trim($data['slug'] ?? '') ?: slugify($name);
    try {
        $stmt = $pdo->prepare("INSERT INTO teams (name, slug, logo, country) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $name,
            $slug,
            trim($data['logo'] ?? '') ?: null,
            trim($data['country'] ?? '') ?: null,
        ]);
        jsonResponse(['id' => (int)$pdo->lastInsertId()], true, 201, 'Time criado.');
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
        errorResponse('Nome do time é obrigatório.', 422);
    }
    $slug = trim($data['slug'] ?? '') ?: slugify($name);
    try {
        $stmt = $pdo->prepare("UPDATE teams SET name = ?, slug = ?, logo = ?, country = ? WHERE id = ?");
        $stmt->execute([
            $name,
            $slug,
            trim($data['logo'] ?? '') ?: null,
            trim($data['country'] ?? '') ?: null,
            (int)$data['id'],
        ]);
        jsonResponse(['id' => (int)$data['id']], true, 200, 'Time atualizado.');
    } catch (PDOException $e) {
        errorResponse('Slug já existe.', 409);
    }
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!validId($id)) {
        errorResponse('ID inválido.', 400);
    }
    $stmt = $pdo->prepare("DELETE FROM teams WHERE id = ?");
    $stmt->execute([(int)$id]);
    jsonResponse(null, true, 200, 'Time excluído.');
}

errorResponse('Método não permitido.', 405);
