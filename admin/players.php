<?php
$pageTitle = 'Jogadores';
require __DIR__ . '/includes/header.php';
?>

<div class="admin-title">
  <div><p class="kicker">AIMBASE</p><h1>Jogadores</h1></div>
  <a class="btn btn-primary" href="player-edit.php">+ Novo jogador</a>
</div>

<div class="admin-panel">
  <div class="admin-panel-head"><h2>Todos os jogadores</h2><input class="admin-search" id="playersSearch" type="search" placeholder="Buscar jogador..."></div>
  <div id="playersWrap" class="loading"><span class="spin"></span>Carregando...</div>
</div>

<script>
let PLAYERS = [];

function pLabel(p) {
  const s = p.settings || {};
  return {
    dpi: s.dpi || '–',
    sens: s.sensitivity != null ? Number(s.sensitivity) : '–',
    game: p.game_name || '—',
  };
}

function playerRows(list) {
  return list.map(p => {
    const l = pLabel(p);
    const name = p.real_name || p.nickname;
    return `<tr>
      <td>${p.photo ? `<img class="admin-avatar" src="${window.safeAdminUrl ? safeAdminUrl(p.photo) : esc(p.photo)}">` : ''} <strong>${esc(name)}</strong></td>
      <td>${p.is_pro ? '<span class="admin-badge admin-badge--pro">PRO</span> ' : ''}${esc(p.nickname)}</td>
      <td><span class="admin-badge">${esc(l.game)}</span></td>
      <td>${esc(l.dpi)}</td>
      <td>${esc(l.sens)}</td>
      <td class="actions">
        <a class="btn" href="player-edit.php?id=${esc(p.id)}">Editar</a>
        <button class="btn btn-danger" data-del="${esc(p.id)}" data-name="${esc(p.nickname)}">Excluir</button>
      </td>
    </tr>`;
  }).join('');
}

function renderPlayers(q = '') {
  const wrap = document.getElementById('playersWrap');
  const list = PLAYERS.filter(p => {
    if (!q) return true;
    const hay = `${p.real_name || ''} ${p.nickname} ${p.game_name || ''}`.toLowerCase();
    return hay.includes(q);
  });
  if (!list.length) {
    wrap.innerHTML = '<p class="admin-muted">' + (PLAYERS.length ? 'Nenhum resultado para a busca.' : 'Nenhum jogador cadastrado.') + '</p>';
    return;
  }
  wrap.innerHTML = `<table class="admin-table"><thead><tr><th>Jogador</th><th>Nick</th><th>Jogo</th><th>DPI</th><th>Sens</th><th></th></tr></thead><tbody>${playerRows(list)}</tbody></table>`;

  document.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', async () => {
    if (!confirm(`Excluir o jogador "${btn.dataset.name}"?`)) return;
    try {
      await fetch(`${ADMIN_BASE}/players.php?id=${btn.dataset.del}`, { method: 'DELETE' });
      toast('Jogador excluído.');
      loadPlayers();
    } catch (err) { toast(err.message); }
  }));
}

async function loadPlayers() {
  const wrap = document.getElementById('playersWrap');
  try {
    const res = await fetch(ADMIN_BASE + '/players.php');
    const json = await res.json();
    PLAYERS = json.data && json.data.players ? json.data.players : [];
    document.getElementById('playersSearch').value = '';
    renderPlayers('');
  } catch (err) {
    wrap.innerHTML = `<p class="admin-muted">Falha ao carregar jogadores: ${esc(err.message)}</p>`;
  }
}

document.getElementById('playersSearch').addEventListener('input', e => renderPlayers(e.currentTarget.value.trim().toLowerCase()));

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'admin-toast show';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2500);
}

loadPlayers();
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
