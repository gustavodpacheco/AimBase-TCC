<?php
require __DIR__ . '/../includes/database.php';
require __DIR__ . '/../includes/functions.php';

$countPlayers   = 0;
$countGames     = 0;
$countTeams     = 0;
$countPeripherals = 0;

try {
    $pdo = db();
    $countPlayers     = (int)$pdo->query("SELECT COUNT(*) FROM players")->fetchColumn();
    $countGames       = (int)$pdo->query("SELECT COUNT(*) FROM games")->fetchColumn();
    $countTeams       = (int)$pdo->query("SELECT COUNT(*) FROM teams")->fetchColumn();
    $countPeripherals = (int)$pdo->query("SELECT COUNT(*) FROM peripherals")->fetchColumn();
} catch (Throwable $e) {
    // conexão já tratada em db()
}

$pageTitle = 'Painel';
require __DIR__ . '/includes/header.php';
?>

<div class="admin-title">
  <div><p class="kicker">PROSENS</p><h1>Painel de Controle</h1></div>
</div>

<div class="admin-grid">
  <div class="admin-stat"><small>Jogadores</small><strong><?= $countPlayers ?></strong></div>
  <div class="admin-stat"><small>Jogos</small><strong><?= $countGames ?></strong></div>
  <div class="admin-stat"><small>Times</small><strong><?= $countTeams ?></strong></div>
  <div class="admin-stat"><small>Periféricos</small><strong><?= $countPeripherals ?></strong></div>
</div>

<div class="admin-panel">
  <div class="admin-panel-head"><h2>Ações rápidas</h2></div>
  <div class="admin-form">
    <a class="btn btn-primary" href="players.php?new=1">+ Novo jogador</a>
    <a class="btn" href="teams.php?new=1">+ Novo time</a>
    <a class="btn" href="peripherals.php?new=1">+ Novo periférico</a>
  </div>
</div>

<div class="admin-panel">
  <div class="admin-panel-head"><h2>Últimos jogadores</h2></div>
  <div id="latestPlayers" class="loading"><span class="spin"></span>Carregando...</div>
</div>

<script>
(async function () {
  try {
    const res = await fetch(ADMIN_BASE + '/players.php');
    const json = await res.json();
    const players = json.data && json.data.players ? json.data.players : [];
    const el = document.getElementById('latestPlayers');
    if (!players.length) { el.innerHTML = '<p style="padding:18px;color:var(--muted)">Nenhum jogador cadastrado.</p>'; return; }
    const rows = players.slice(0, 6).map(p =>
      `<tr><td>${p.photo ? `<img class="admin-avatar" src="${p.photo}">` : ''} <strong>${p.real_name || p.nickname}</strong></td><td><span class="admin-badge">${p.game_name || '—'}</span></td><td>${p.nickname}</td><td class="actions"><a class="btn" href="players.php?edit=${p.id}">Editar</a></td></tr>`
    ).join('');
    el.outerHTML = `<table class="admin-table"><thead><tr><th>Jogador</th><th>Jogo</th><th>Nick</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
  } catch (err) {
    document.getElementById('latestPlayers').textContent = 'Falha ao carregar jogadores.';
  }
})();
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
