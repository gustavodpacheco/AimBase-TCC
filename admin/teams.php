<?php
$pageTitle = 'Times';
require __DIR__ . '/includes/header.php';
$editId = isset($_GET['edit']) ? (int)$_GET['edit'] : 0;
?>

<div class="admin-title">
  <div><p class="kicker">AIMBASE</p><h1>Times</h1></div>
  <button class="btn btn-primary" id="newTeamBtn">+ Novo time</button>
</div>

<div class="admin-panel">
  <div class="admin-panel-head"><h2>Lista de times</h2></div>
  <div id="teamsWrap" class="loading"><span class="spin"></span>Carregando...</div>
</div>

<!-- Modal simplificado -->
<dialog class="admin-modal" id="teamModal">
  <form id="teamForm">
    <h2 id="teamModalTitle">Novo time</h2>
    <input type="hidden" name="id">
    <input name="name" required placeholder="Nome do time">
    <input name="country" placeholder="País">
    <input name="logo" placeholder="Logo (URL)">
    <div class="actions-row">
      <button class="btn btn-primary" type="submit">Salvar</button>
      <button class="btn" type="button" id="closeTeam">Cancelar</button>
    </div>
  </form>
</dialog>

<script>
let EDIT_ID = 0;
let TEAMS = [];
const modal = document.getElementById('teamModal');

async function loadTeams() {
  const wrap = document.getElementById('teamsWrap');
  try {
    const res = await fetch(ADMIN_BASE + '/teams.php');
    const json = await res.json();
    TEAMS = json.data.teams || [];
    if (!TEAMS.length) { wrap.innerHTML = '<p class="admin-muted">Nenhum time cadastrado.</p>'; return; }
    wrap.innerHTML = `<table class="admin-table"><thead><tr><th>Time</th><th>País</th><th>Jogadores</th><th></th></tr></thead><tbody>` +
      TEAMS.map(t => `<tr><td><strong>${esc(t.name)}</strong></td><td>${esc(t.country || '—')}</td><td>${esc(t.player_count)}</td><td class="actions"><button class="btn" data-edit="${esc(t.id)}">Editar</button><button class="btn btn-danger" data-del="${esc(t.id)}" data-name="${esc(t.name)}">Excluir</button></td></tr>`).join('') + `</tbody></table>`;

    document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openEdit(Number(b.dataset.edit))));
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm(`Excluir o time "${b.dataset.name}"?`)) return;
      try { await fetch(`${ADMIN_BASE}/teams.php?id=${b.dataset.del}`, { method: 'DELETE' }); toast('Time excluído.'); loadTeams(); }
      catch (err) { toast(err.message); }
    }));
  } catch (err) { wrap.innerHTML = `<p class="admin-muted">Falha: ${esc(err.message)}</p>`; }
}

function openEdit(id) {
  const t = TEAMS.find(x => x.id === id);
  if (!t) return;
  EDIT_ID = t.id;
  document.getElementById('teamModalTitle').textContent = 'Editar time';
  document.querySelector('[name=id]').value = t.id;
  document.querySelector('[name=name]').value = t.name || '';
  document.querySelector('[name=country]').value = t.country || '';
  document.querySelector('[name=logo]').value = t.logo || '';
  modal.showModal();
}
document.getElementById('newTeamBtn').addEventListener('click', () => {
  EDIT_ID = 0;
  document.getElementById('teamModalTitle').textContent = 'Novo time';
  document.querySelector('[name=id]').value = '';
  document.querySelector('[name=name]').value = '';
  document.querySelector('[name=country]').value = '';
  document.querySelector('[name=logo]').value = '';
  modal.showModal();
});
document.getElementById('closeTeam').addEventListener('click', () => modal.close());

document.getElementById('teamForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const fd = new FormData(ev.currentTarget);
  const payload = { name: fd.get('name'), country: fd.get('country'), logo: fd.get('logo') };
  try {
    let opts = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) };
    if (EDIT_ID) { payload.id = EDIT_ID; opts.method = 'PUT'; }
    const res = await fetch(ADMIN_BASE + '/teams.php', opts);
    const json = await res.json();
    toast(json.message || 'OK');
    modal.close();
    loadTeams();
  } catch (err) { toast(err.message); }
});

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'admin-toast show';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2500);
}
loadTeams();
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
