<?php
/**
 * API - Players
 *
 * GET  /api/players.php                -> lista jogadores (com filtros)
 * GET  /api/players.php?game=valorant  -> filtra por jogo
 * GET  /api/players.php?team_id=1      -> filtra por time
 * GET  /api/players.php?search=termo   -> pesquisa por nick/nome/time
 * GET  /api/players.php?id=1           -> detalhes de um jogador
 * POST   /api/players.php              -> cria jogador (admin)
 * PUT    /api/players.php              -> edita jogador (admin)
 * DELETE /api/players.php?id=1         -> exclui jogador (admin)
 *
 * Método: PDO + prepared statements.
 */

require __DIR__ . '/../includes/database.php';
require __DIR__ . '/../includes/functions.php';

applyCors();

$method = $_SERVER['REQUEST_METHOD'];

// ============================================================
// GET - consulta (público)
// ============================================================
if ($method === 'GET') {
    $id = $_GET['id'] ?? null;

    // Detalhe de um único jogador
    if ($id !== null) {
        if (!validId($id)) {
            errorResponse('ID inválido.', 400);
        }
        $pdo  = db();
        $stmt = $pdo->prepare("
            SELECT p.*, g.name AS game_name, g.slug AS game_slug,
                   t.name AS team_name, t.slug AS team_slug, t.logo AS team_logo
            FROM players p
            LEFT JOIN games g ON g.id = p.game_id
            LEFT JOIN teams t ON t.id = p.team_id
            WHERE p.id = ?
        ");
        $stmt->execute([(int)$id]);
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
        $stmt->execute([(int)$id]);
        $player['settings'] = $stmt->fetch() ?: null;

        // social
        $stmt = $pdo->prepare("SELECT platform, url FROM player_social WHERE player_id = ?");
        $stmt->execute([(int)$id]);
        $player['social'] = $stmt->fetchAll();

        // video settings
        $stmt = $pdo->prepare("SELECT setting_key, setting_value FROM player_video_settings WHERE player_id = ? ORDER BY sort_order");
        $stmt->execute([(int)$id]);
        $player['video_settings'] = $stmt->fetchAll();

        // pc specs
        $stmt = $pdo->prepare("SELECT spec_type, label, link, image FROM player_pc_specs WHERE player_id = ? ORDER BY sort_order");
        $stmt->execute([(int)$id]);
        $player['pc_specs'] = $stmt->fetchAll();

        jsonResponse($player);
    }

    // ============================================================
    // Lista com filtros
    // ============================================================
    $where  = [];
    $params = [];

    $sql = "
        SELECT p.id, p.nickname, p.real_name, p.slug, p.photo, p.role, p.country, p.active, p.is_pro,
               g.name AS game_name, g.slug AS game_slug,
               t.name AS team_name, t.slug AS team_slug, t.logo AS team_logo
        FROM players p
        LEFT JOIN games g ON g.id = p.game_id
        LEFT JOIN teams t ON t.id = p.team_id
    ";

    // filtrar por jogo (slug)
    if (!empty($_GET['game'])) {
        $where[] = "g.slug = ?";
        $params[] = $_GET['game'];
    }
    // filtrar por time
    if (!empty($_GET['team_id'])) {
        $where[] = "p.team_id = ?";
        $params[] = (int)$_GET['team_id'];
    }
    // filtrar por país
    if (!empty($_GET['country'])) {
        $where[] = "p.country = ?";
        $params[] = $_GET['country'];
    }
    // filtrar por função
    if (!empty($_GET['role'])) {
        $where[] = "p.role = ?";
        $params[] = $_GET['role'];
    }
    // pesquisa por texto (nick, nome, time)
    if (!empty($_GET['search'])) {
        $where[] = "(p.nickname LIKE ? OR p.real_name LIKE ? OR t.name LIKE ?)";
        $like = '%' . $_GET['search'] . '%';
        $params[] = $like;
        $params[] = $like;
        $params[] = $like;
    }

    if ($where) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }

    // ordenação
    $sql .= ' ORDER BY p.nickname ASC';

    $stmt = db()->prepare($sql);
    $stmt->execute($params);

    $players   = $stmt->fetchAll();
    $total     = count($players);

    // buscar settings resumidas (dpi/sensitivity) para a listagem
    $stmtSettings = db()->prepare("SELECT player_id, dpi, sensitivity FROM player_settings WHERE player_id IN (" . implode(',', array_column($players, 'id') ?: [0]) . ")");
    $settingsByPlayer = [];
    if ($players) {
        $stmtSettings->execute();
        foreach ($stmtSettings->fetchAll() as $s) {
            $settingsByPlayer[$s['player_id']] = [
                'dpi'         => $s['dpi'],
                'sensitivity' => $s['sensitivity'],
            ];
        }
    }

    foreach ($players as &$pl) {
        $pl['settings'] = $settingsByPlayer[$pl['id']] ?? null;
    }
    unset($pl);

    jsonResponse(['players' => $players, 'total' => $total]);
}

// ============================================================
// POST - criar jogador (admin)
// ============================================================
if ($method === 'POST') {
    $data = readJsonBody();

    $nickname   = trim($data['nickname'] ?? '');
    $slug       = trim($data['slug'] ?? '') ?: slugify($nickname);
    $gameId     = isset($data['game_id']) && validId($data['game_id']) ? (int)$data['game_id'] : null;
    $teamId     = isset($data['team_id']) && validId($data['team_id']) ? (int)$data['team_id'] : null;

    if ($nickname === '') {
        errorResponse('O nickname é obrigatório.', 422);
    }
    if (!validId($gameId)) {
        errorResponse('Selecione um jogo válido.', 422);
    }

    $pdo = db();
    try {
        $stmt = $pdo->prepare("
            INSERT INTO players (nickname, real_name, team_id, game_id, role, country, photo, slug, description, active, is_pro)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $nickname,
            trim($data['real_name'] ?? '') ?: null,
            $teamId,
            $gameId,
            trim($data['role'] ?? '') ?: null,
            trim($data['country'] ?? '') ?: null,
            trim($data['photo'] ?? '') ?: null,
            $slug,
            trim($data['description'] ?? '') ?: null,
            isset($data['active']) && $data['active'] ? 1 : 1,
            isset($data['is_pro']) && $data['is_pro'] ? 1 : 0,
        ]);
        jsonResponse(['id' => (int)$pdo->lastInsertId()], true, 201, 'Jogador criado.');
    } catch (PDOException $e) {
        errorResponse('Não foi possível criar o jogador (verifique o slug).', 409);
    }
}

// ============================================================
// PUT - editar jogador (admin)
// ============================================================
if ($method === 'PUT') {
    $data = readJsonBody();
    if (!validId($data['id'] ?? null)) {
        errorResponse('ID inválido.', 400);
    }
    $id = (int)$data['id'];

    $slug = trim($data['slug'] ?? '') ?: slugify($data['nickname'] ?? '');

    $pdo = db();
    try {
        $fields = "nickname = ?, real_name = ?, team_id = ?, game_id = ?,
                   role = ?, country = ?, photo = ?, slug = ?, description = ?, active = ?";
        $values = [
            trim($data['nickname'] ?? ''),
            trim($data['real_name'] ?? '') ?: null,
            isset($data['team_id']) && validId($data['team_id']) ? (int)$data['team_id'] : null,
            isset($data['game_id']) && validId($data['game_id']) ? (int)$data['game_id'] : null,
            trim($data['role'] ?? '') ?: null,
            trim($data['country'] ?? '') ?: null,
            trim($data['photo'] ?? '') ?: null,
            $slug,
            trim($data['description'] ?? '') ?: null,
            isset($data['active']) ? ($data['active'] ? 1 : 0) : 1,
        ];
        if (array_key_exists('is_pro', $data)) {
            $fields .= ", is_pro = ?";
            $values[] = $data['is_pro'] ? 1 : 0;
        }
        $values[] = $id;
        $stmt = $pdo->prepare("UPDATE players SET $fields WHERE id = ?");
        $stmt->execute($values);

        // Salvar settings, se enviadas
        saveSettings($pdo, $id, $data['settings'] ?? []);
        if (array_key_exists('social', $data)) {
            saveSocial($pdo, $id, $data['social'] ?? []);
        }
        if (array_key_exists('video_settings', $data)) {
            saveVideoSettings($pdo, $id, $data['video_settings'] ?? []);
        }
        if (array_key_exists('pc_specs', $data)) {
            savePcSpecs($pdo, $id, $data['pc_specs'] ?? []);
        }

        jsonResponse(['id' => $id], true, 200, 'Jogador atualizado.');
    } catch (PDOException $e) {
        errorResponse('Não foi possível atualizar o jogador (verifique o slug).', 409);
    }
}

// ============================================================
// DELETE - excluir jogador (admin)
// ============================================================
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!validId($id)) {
        errorResponse('ID inválido.', 400);
    }
    $id   = (int)$id;
    $pdo  = db();
    $stmt = $pdo->prepare("DELETE FROM players WHERE id = ?");
    $stmt->execute([$id]);
    jsonResponse(null, true, 200, 'Jogador excluído.');
}

// ============================================================
// Helpers (definidos aqui para uso local)
// ============================================================
function saveSettings(PDO $pdo, int $playerId, array $settings): void
{
    if (!$settings) {
        return;
    }
    $exists = $pdo->prepare("SELECT id FROM player_settings WHERE player_id = ?");
    $exists->execute([$playerId]);

    $fields = [
        'mouse_id', 'keyboard_id', 'mousepad_id', 'headset_id', 'monitor_id',
        'dpi', 'sensitivity', 'edpi', 'polling_rate', 'resolution', 'aspect_ratio',
        'crosshair', 'crosshair_image', 'raw_input', 'scoped_sensitivity',
        'zoom_sensitivity', 'agents', 'notes',
        'product_image_mouse', 'product_image_keyboard', 'product_image_mousepad',
        'product_image_monitor', 'product_image_headset',
        'product_link_mouse', 'product_link_keyboard', 'product_link_mousepad',
        'product_link_monitor', 'product_link_headset',
    ];

    $values = [];
    foreach ($fields as $f) {
        $values[$f] = isset($settings[$f]) && $settings[$f] !== '' ? $settings[$f] : null;
    }

    if ($exists->rowCount()) {
        $set = implode(', ', array_map(fn($f) => "$f = :$f", $fields));
        $sql = "UPDATE player_settings SET $set WHERE player_id = :player_id";
        $values['player_id'] = $playerId;
    } else {
        $cols = implode(', ', array_merge(['player_id'], $fields));
        $ph   = implode(', ', array_merge([':player_id'], array_map(fn($f) => ":$f", $fields)));
        $sql  = "INSERT INTO player_settings ($cols) VALUES ($ph)";
        $values['player_id'] = $playerId;
    }
    $pdo->prepare($sql)->execute($values);
}

function saveSocial(PDO $pdo, int $playerId, array $social): void
{
    $pdo->prepare("DELETE FROM player_social WHERE player_id = ?")->execute([$playerId]);
    if (!$social) return;
    $stmt = $pdo->prepare("INSERT INTO player_social (player_id, platform, url) VALUES (?, ?, ?)");
    foreach ($social as $item) {
        if (!empty($item['platform']) && !empty($item['url'])) {
            $stmt->execute([$playerId, $item['platform'], $item['url']]);
        }
    }
}

function saveVideoSettings(PDO $pdo, int $playerId, array $video): void
{
    $pdo->prepare("DELETE FROM player_video_settings WHERE player_id = ?")->execute([$playerId]);
    if (!$video) return;
    $stmt = $pdo->prepare("INSERT INTO player_video_settings (player_id, setting_key, setting_value, sort_order) VALUES (?, ?, ?, ?)");
    $i = 0;
    foreach ($video as $item) {
        if (!empty($item['key']) || !empty($item['setting_key'])) {
            $k = $item['key'] ?? $item['setting_key'];
            $v = $item['value'] ?? $item['setting_value'];
            $stmt->execute([$playerId, $k, $v, $i++]);
        }
    }
}

function savePcSpecs(PDO $pdo, int $playerId, array $specs): void
{
    $pdo->prepare("DELETE FROM player_pc_specs WHERE player_id = ?")->execute([$playerId]);
    if (!$specs) return;
    $stmt = $pdo->prepare("INSERT INTO player_pc_specs (player_id, spec_type, label, link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
    $i = 0;
    foreach ($specs as $item) {
        if (!empty($item['label'])) {
            $stmt->execute([
                $playerId,
                $item['spec_type'] ?? 'Componente',
                $item['label'],
                $item['link'] ?? null,
                $item['image'] ?? null,
                $i++,
            ]);
        }
    }
}

// Método não suportado
errorResponse('Método não permitido.', 405);
