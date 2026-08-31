<?php
$pageTitle = 'Times';
require __DIR__ . '/includes/header.php';
$editId = isset($_GET['edit']) ? (int)$_GET['edit'] : 0;
?>

<div class="admin-title">
  <div><p class="kicker">PROSENS</p><h1>Times</h1></div>
  <button class="btn btn-primary" id="newTeamBtn">+ Novo time</button>
</div>

<div class="admin-panel">
  <div class="admin-panel-head"><h2>Lista de times</h2></div>
  <div id="teamsWrap" class="loading"><span class="spin"></span>Carregando...</div>
</div>

<!-- Modal simplificado -->
<dialog class="admin-modal" id="teamModal" style="border:1px solid var(--line);background:var(--panel-2);color:var(--text);padding:24px;width:min(100%-30px,440px);border-radius:4px">
  <form id="teamForm" style="display:grid;gap:12px">
    <h2 style="margin:0;font-size:18px;text-transform:uppercase" id="teamModalTitle">Novo time</h2>
    <input type="hidden" name="id">
    <input name="name" required placeholder="Nome do time" style="padding:10px;border:1px solid var(--line);background:#0a141e;color:var(--text)">
    <input name="country" placeholder="País" style="padding:10px;border:1px solid var(--line);background:#0a141e;color:var(--text)">
    <input name="logo" placeholder="Logo (URL)" style="padding:10px;border:1px solid var(--line);background:#0a141e;color:var(--text)">
    <div style="display:flex;gap:8px">
      <button class="btn btn-primary" type="submit">Salvar</button>
      <button class="btn" type="button" id="closeTeam">Cancelar</button>
    </div>
  </form>
</dialog>

<script>
let EDIT_ID = 0;
const modal = document.getElementById('teamModal');

async function loadTeams() {
  const wrap = document.getElementById('teamsWrap');
  try {
    const res = await fetch(ADMIN_BASE + '/teams.php');
    const json = await res.json();
    const list = json.data.teams || [];
    if (!list.length) { wrap.innerHTML = '<p style="padding:18px;color:var(--muted)">Nenhum time cadastrado.</p>'; return; }
    wrap.innerHTML = `<table class="admin-table"><thead><tr><th>Time</th><th>País</th><th>Jogadores</th><th></th></tr></thead><tbody>` +
      list.map(t => `<tr><td><strong>${t.name}</strong></td><td>${t.country || '—'}</td><td>${t.player_count}</td><td class="actions"><button class="btn" data-edit='${JSON.stringify(t)}'>Editar</button><button class="btn btn-danger" data-del="${t.id}" data-name="${t.name}">Excluir</button></td></tr>`).join('') + `</tbody></table>`;

    document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openEdit(JSON.parse(b.dataset.edit))));
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm(`Excluir o time "${b.dataset.name}"?`)) return;
      try { await fetch(`${ADMIN_BASE}/teams.php?id=${b.dataset.del}`, { method: 'DELETE' }); toast('Time excluído.'); loadTeams(); }
      catch (err) { toast(err.message); }
    }));
  } catch (err) { wrap.innerHTML = `<p style="padding:18px;color:var(--muted)">Falha: ${err.message}</p>`; }
}

function openEdit(t) {
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
