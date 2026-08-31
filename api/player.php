<?php
/**
 * API - Detalhe de jogador (aliás para /api/players.php?id=N)
 *
 * GET /api/player.php?id=1
 * GET /api/player.php?slug=pacheco
 */

require __DIR__ . '/../includes/database.php';
require __DIR__ . '/../includes/functions.php';

applyCors();

$id = $_GET['id'] ?? null;
$slug = $_GET['slug'] ?? null;

if (!$id && !$slug) {
    errorResponse('Informe um id ou slug.', 400);
}

$pdo = db();
$sql = "
    SELECT p.*, g.name AS game_name, g.slug AS game_slug,
           t.name AS team_name, t.slug AS team_slug, t.logo AS team_logo
    FROM players p
    LEFT JOIN games g ON g.id = p.game_id
    LEFT JOIN teams t ON t.id = p.team_id
";
$params = [];

if ($id !== null) {
    if (!validId($id)) {
        errorResponse('ID inválido.', 400);
    }
    $params[] = (int)$id;
    $sql .= ' WHERE p.id = ?';
} else {
    $params[] = $slug;
    $sql .= ' WHERE p.slug = ?';
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$player = $stmt->fetch();

if (!$player) {
    errorResponse('Jogador não encontrado.', 404);
}

// settings
$stmt = $pdo->prepare("
    SELECT ps.*,
           m.type AS mouse_type, m.brand AS mouse_brand, m.model AS mouse_model,
           k.type AS keyboard_type, k.brand AS keyboard_brand, k.model AS keyboard_model,
           mp.type AS mousepad_type, mp.brand AS mousepad_brand, mp.model AS mousepad_model,
           h.type AS headset_type, h.brand AS headset_brand, h.model AS headset_model,
           mon.type AS monitor_type, mon.brand AS monitor_brand, mon.model AS monitor_model
    FROM player_settings ps
    LEFT JOIN peripherals m   ON m.id = ps.mouse_id
    LEFT JOIN peripherals k   ON k.id = ps.keyboard_id
    LEFT JOIN peripherals mp  ON mp.id = ps.mousepad_id
    LEFT JOIN peripherals h   ON h.id = ps.headset_id
    LEFT JOIN peripherals mon ON mon.id = ps.monitor_id
    WHERE ps.player_id = ?
");
$stmt->execute([(int)$player['id']]);
$player['settings'] = $stmt->fetch() ?: null;

// social
$stmt = $pdo->prepare("SELECT platform, url FROM player_social WHERE player_id = ?");
$stmt->execute([(int)$player['id']]);
$player['social'] = $stmt->fetchAll();

// video settings
$stmt = $pdo->prepare("SELECT setting_key, setting_value FROM player_video_settings WHERE player_id = ? ORDER BY sort_order");
$stmt->execute([(int)$player['id']]);
$player['video_settings'] = $stmt->fetchAll();

// pc specs
$stmt = $pdo->prepare("SELECT spec_type, label, link, image FROM player_pc_specs WHERE player_id = ? ORDER BY sort_order");
$stmt->execute([(int)$player['id']]);
$player['pc_specs'] = $stmt->fetchAll();

jsonResponse($player);
