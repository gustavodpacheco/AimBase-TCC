<?php
/**
 * API - Peripherals
 *
 * GET  /api/peripherals.php            -> lista periféricos
 * GET  /api/peripherals.php?type=mouse -> filtra por tipo
 * GET  /api/peripherals.php?id=N       -> detalhe
 * POST /api/peripherals.php            -> cria periférico (admin)
 * PUT  /api/peripherals.php            -> edita periférico (admin)
 * DELETE /api/peripherals.php?id=N     -> exclui periférico (admin)
 */

require __DIR__ . '/../includes/database.php';
require __DIR__ . '/../includes/functions.php';

applyCors();

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

$allowedTypes = ['mouse', 'keyboard', 'mousepad', 'headset', 'monitor'];

if ($method === 'GET') {
    $id = $_GET['id'] ?? null;

    if ($id !== null) {
        if (!validId($id)) {
            errorResponse('ID inválido.', 400);
        }
        $stmt = $pdo->prepare("SELECT * FROM peripherals WHERE id = ?");
        $stmt->execute([(int)$id]);
        $item = $stmt->fetch();
        if (!$item) {
            errorResponse('Periférico não encontrado.', 404);
        }
        jsonResponse(['peripheral' => $item]);
    }

    $where  = [];
    $params = [];
    if (!empty($_GET['type'])) {
        if (!in_array($_GET['type'], $allowedTypes)) {
            errorResponse('Tipo inválido.', 400);
        }
        $where[]  = 'type = ?';
        $params[] = $_GET['type'];
    }
    $sql = 'SELECT id, type, brand, model, slug, created_at FROM peripherals';
    if ($where) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }
    $sql .= ' ORDER BY type ASC, brand ASC, model ASC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    jsonResponse(['peripherals' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $data = readJsonBody();
    $type = trim($data['type'] ?? '');
    $model = trim($data['model'] ?? '');
    if (!in_array($type, $allowedTypes)) {
        errorResponse('Tipo inválido.', 422);
    }
    if ($model === '') {
        errorResponse('Modelo é obrigatório.', 422);
    }
    $slug = trim($data['slug'] ?? '') ?: slugify(($data['brand'] ?? '') . ' ' . $model);
    try {
        $stmt = $pdo->prepare("INSERT INTO peripherals (type, brand, model, slug) VALUES (?, ?, ?, ?)");
        $stmt->execute([$type, trim($data['brand'] ?? '') ?: null, $model, $slug]);
        jsonResponse(['id' => (int)$pdo->lastInsertId()], true, 201, 'Periférico criado.');
    } catch (PDOException $e) {
        errorResponse('Slug já existe.', 409);
    }
}

if ($method === 'PUT') {
    $data = readJsonBody();
    if (!validId($data['id'] ?? null)) {
        errorResponse('ID inválido.', 400);
    }
    $type = trim($data['type'] ?? '');
    $model = trim($data['model'] ?? '');
    if (!in_array($type, $allowedTypes)) {
        errorResponse('Tipo inválido.', 422);
    }
    if ($model === '') {
        errorResponse('Modelo é obrigatório.', 422);
    }
    $slug = trim($data['slug'] ?? '') ?: slugify(($data['brand'] ?? '') . ' ' . $model);
    try {
        $stmt = $pdo->prepare("UPDATE peripherals SET type = ?, brand = ?, model = ?, slug = ? WHERE id = ?");
        $stmt->execute([$type, trim($data['brand'] ?? '') ?: null, $model, $slug, (int)$data['id']]);
        jsonResponse(['id' => (int)$data['id']], true, 200, 'Periférico atualizado.');
    } catch (PDOException $e) {
        errorResponse('Slug já existe.', 409);
    }
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!validId($id)) {
        errorResponse('ID inválido.', 400);
    }
    $stmt = $pdo->prepare("DELETE FROM peripherals WHERE id = ?");
    $stmt->execute([(int)$id]);
    jsonResponse(null, true, 200, 'Periférico excluído.');
}

errorResponse('Método não permitido.', 405);
