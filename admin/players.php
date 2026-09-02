<?php
$pageTitle = 'Jogadores';
require __DIR__ . '/includes/header.php';
?>

<div class="admin-title">
  <div><p class="kicker">AIMBASE</p><h1>Jogadores</h1></div>
  <a class="btn btn-primary" href="player-edit.php">+ Novo jogador</a>
</div>

<div class="admin-panel">
  <div class="admin-panel-head"><h2>Todos os jogadores</h2></div>
  <div id="playersWrap" class="loading"><span class="spin"></span>Carregando...</div>
</div>

<script>
function pLabel(p) {
  const s = p.settings || {};
  return {
    dpi: s.dpi || '–',
    sens: s.sensitivity != null ? Number(s.sensitivity) : '–',
    game: p.game_name || '—',
  };
}

async function loadPlayers() {
  const wrap = document.getElementById('playersWrap');
  try {
    const res = await fetch(ADMIN_BASE + '/players.php');
    const json = await res.json();
    const list = json.data && json.data.players ? json.data.players : [];
    if (!list.length) { wrap.innerHTML = '<p class="admin-muted">Nenhum jogador cadastrado.</p>'; return; }
    const rows = list.map(p => {
      const l = pLabel(p);
      return `<tr>
        <td>${p.photo ? `<img class="admin-avatar" src="${p.photo}">` : ''} <strong>${p.real_name || p.nickname}</strong></td>
        <td>${p.nickname}</td>
        <td><span class="admin-badge">${l.game}</span></td>
        <td>${l.dpi}</td>
        <td>${l.sens}</td>
        <td class="actions">
          <a class="btn" href="player-edit.php?id=${p.id}">Editar</a>
          <button class="btn btn-danger" data-del="${p.id}" data-name="${p.nickname}">Excluir</button>
        </td>
      </tr>`;
    }).join('');
    wrap.innerHTML = `<table class="admin-table"><thead><tr><th>Jogador</th><th>Nick</th><th>Jogo</th><th>DPI</th><th>Sens</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;

    document.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', async () => {
      if (!confirm(`Excluir o jogador "${btn.dataset.name}"?`)) return;
      try {
        await fetch(`${ADMIN_BASE}/players.php?id=${btn.dataset.del}`, { method: 'DELETE' });
        toast('Jogador excluído.');
        loadPlayers();
      } catch (err) { toast(err.message); }
    }));
  } catch (err) {
    wrap.innerHTML = `<p class="admin-muted">Falha ao carregar jogadores: ${err.message}</p>`;
  }
}

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
