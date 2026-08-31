<?php
/**
 * API - Filtros (metadados para os selects do diretório)
 *
 * GET /api/filters.php -> retorna games, teams, roles e countries distintos
 *
 * Método: PDO + prepared statements.
 */

require __DIR__ . '/../includes/database.php';
require __DIR__ . '/../includes/functions.php';

applyCors();

$pdo = db();

$games = $pdo->query("SELECT id, name, slug FROM games ORDER BY name ASC")->fetchAll();

$teams = $pdo->query("SELECT id, name, slug FROM teams ORDER BY name ASC")->fetchAll();

$roles = $pdo->query("SELECT DISTINCT role FROM players WHERE role IS NOT NULL AND role <> '' ORDER BY role ASC")->fetchAll(PDO::FETCH_COLUMN);

$countries = $pdo->query("SELECT DISTINCT country FROM players WHERE country IS NOT NULL AND country <> '' ORDER BY country ASC")->fetchAll(PDO::FETCH_COLUMN);

jsonResponse([
    'games'     => $games,
    'teams'     => $teams,
    'roles'     => array_values($roles),
    'countries' => array_values($countries),
]);
