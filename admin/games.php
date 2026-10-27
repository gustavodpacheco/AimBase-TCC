<?php
$pageTitle = 'Jogos';
require __DIR__ . '/includes/header.php';
?>

<div class="admin-title">
  <div><p class="kicker">AIMBASE</p><h1>Jogos</h1></div>
  <button class="btn btn-primary" id="newGameBtn">+ Novo jogo</button>
</div>

<div class="admin-panel">
  <div class="admin-panel-head"><h2>Lista de jogos</h2></div>
  <div id="gamesWrap" class="loading"><span class="spin"></span>Carregando...</div>
</div>

<dialog class="admin-modal" id="gameModal">
  <form id="gameForm">
    <h2 id="gameModalTitle">Novo jogo</h2>
    <input type="hidden" name="id">
    <input name="name" required placeholder="Nome do jogo">
    <input name="slug" placeholder="Slug (opcional)">
    <div class="actions-row">
      <button class="btn btn-primary" type="submit">Salvar</button>
      <button class="btn" type="button" id="closeGame">Cancelar</button>
    </div>
  </form>
</dialog>

<script>
let EDIT_ID = 0;
let GAMES = [];
const modal = document.getElementById('gameModal');

async function loadGames() {
  const wrap = document.getElementById('gamesWrap');
  try {
    const res = await fetch(ADMIN_BASE + '/games.php');
    const json = await res.json();
    GAMES = json.data.games || [];
    if (!GAMES.length) { wrap.innerHTML = '<p class="admin-muted">Nenhum jogo cadastrado.</p>'; return; }
    wrap.innerHTML = `<table class="admin-table"><thead><tr><th>Jogo</th><th>Slug</th><th>Criado em</th><th></th></tr></thead><tbody>` +
      GAMES.map(g => `<tr><td><strong>${esc(g.name)}</strong></td><td>${esc(g.slug)}</td><td>${esc(g.created_at || '-')}</td><td class="actions"><button class="btn" data-edit="${esc(g.id)}">Editar</button><button class="btn btn-danger" data-del="${esc(g.id)}" data-name="${esc(g.name)}">Excluir</button></td></tr>`).join('') + `</tbody></table>`;

    document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openEdit(Number(b.dataset.edit))));
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm(`Excluir o jogo "${b.dataset.name}"?`)) return;
      try { await adminJson(`${ADMIN_BASE}/games.php?id=${b.dataset.del}`, 'DELETE'); toast('Jogo excluído.'); loadGames(); }
      catch (err) { toast(err.message); }
    }));
  } catch (err) { wrap.innerHTML = `<p class="admin-muted">Falha: ${esc(err.message)}</p>`; }
}

function openEdit(id) {
  const g = GAMES.find(x => x.id === id);
  if (!g) return;
  EDIT_ID = g.id;
  document.getElementById('gameModalTitle').textContent = 'Editar jogo';
  document.querySelector('[name=id]').value = g.id;
  document.querySelector('[name=name]').value = g.name || '';
  document.querySelector('[name=slug]').value = g.slug || '';
  modal.showModal();
}

document.getElementById('newGameBtn').addEventListener('click', () => {
  EDIT_ID = 0;
  document.getElementById('gameModalTitle').textContent = 'Novo jogo';
  document.querySelector('[name=id]').value = '';
  document.querySelector('[name=name]').value = '';
  document.querySelector('[name=slug]').value = '';
  modal.showModal();
});

document.getElementById('closeGame').addEventListener('click', () => modal.close());

document.getElementById('gameForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const fd = new FormData(ev.currentTarget);
  const payload = { name: fd.get('name'), slug: fd.get('slug') };
  if (EDIT_ID) payload.id = EDIT_ID;
  try {
    const json = await adminJson(ADMIN_BASE + '/games.php', EDIT_ID ? 'PUT' : 'POST', payload);
    toast(json.message || 'OK');
    modal.close();
    loadGames();
  } catch (err) { toast(err.message); }
});
loadGames();
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
