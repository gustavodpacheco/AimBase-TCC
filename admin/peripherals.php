<?php
$pageTitle = 'Periféricos';
require __DIR__ . '/includes/header.php';
?>

<div class="admin-title">
  <div><p class="kicker">AIMBASE</p><h1>Periféricos</h1></div>
  <button class="btn btn-primary" id="newPeriphBtn">+ Novo periférico</button>
</div>

<div class="admin-panel">
  <div class="admin-panel-head"><h2>Catálogo de periféricos</h2></div>
  <div id="periphsWrap" class="loading"><span class="spin"></span>Carregando...</div>
</div>

<dialog class="admin-modal" id="periphModal">
  <form id="periphForm">
    <h2 id="periphModalTitle">Novo periférico</h2>
    <input type="hidden" name="id">
    <select name="type">
      <option value="mouse">Mouse</option>
      <option value="keyboard">Teclado</option>
      <option value="mousepad">Mousepad</option>
      <option value="headset">Headset</option>
      <option value="monitor">Monitor</option>
    </select>
    <input name="brand" placeholder="Marca">
    <input name="model" required placeholder="Modelo">
    <div class="actions-row">
      <button class="btn btn-primary" type="submit">Salvar</button>
      <button class="btn" type="button" id="closePeriph">Cancelar</button>
    </div>
  </form>
</dialog>

<script>
let EDIT_ID = 0;
let PERIPH = [];
const modal = document.getElementById('periphModal');
const TYPES = { mouse:'Mouse', keyboard:'Teclado', mousepad:'Mousepad', headset:'Headset', monitor:'Monitor' };

async function loadPeriphs() {
  const wrap = document.getElementById('periphsWrap');
  try {
    const res = await fetch(ADMIN_BASE + '/peripherals.php');
    const json = await res.json();
    PERIPH = json.data.peripherals || [];
    if (!PERIPH.length) { wrap.innerHTML = '<p class="admin-muted">Nenhum periférico cadastrado.</p>'; return; }
    wrap.innerHTML = `<table class="admin-table"><thead><tr><th>Tipo</th><th>Marca</th><th>Modelo</th><th>Slug</th><th></th></tr></thead><tbody>` +
      PERIPH.map(x => `<tr><td><span class="admin-badge">${esc(TYPES[x.type] || x.type)}</span></td><td>${esc(x.brand || '—')}</td><td><strong>${esc(x.model)}</strong></td><td class="muted">${esc(x.slug)}</td><td class="actions"><button class="btn" data-edit="${esc(x.id)}">Editar</button><button class="btn btn-danger" data-del="${esc(x.id)}" data-name="${esc(x.model)}">Excluir</button></td></tr>`).join('') + `</tbody></table>`;

    document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openEdit(Number(b.dataset.edit))));
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm(`Excluir "${b.dataset.name}"?`)) return;
      try { await fetch(`${ADMIN_BASE}/peripherals.php?id=${b.dataset.del}`, { method: 'DELETE' }); toast('Periférico excluído.'); loadPeriphs(); }
      catch (err) { toast(err.message); }
    }));
  } catch (err) { wrap.innerHTML = `<p class="admin-muted">Falha: ${esc(err.message)}</p>`; }
}

function openEdit(id) {
  const x = PERIPH.find(item => item.id === id);
  if (!x) return;
  EDIT_ID = x.id;
  document.getElementById('periphModalTitle').textContent = 'Editar periférico';
  document.querySelector('[name=id]').value = x.id;
  document.querySelector('[name=type]').value = x.type;
  document.querySelector('[name=brand]').value = x.brand || '';
  document.querySelector('[name=model]').value = x.model || '';
  modal.showModal();
}
document.getElementById('newPeriphBtn').addEventListener('click', () => {
  EDIT_ID = 0;
  document.getElementById('periphModalTitle').textContent = 'Novo periférico';
  document.querySelector('[name=id]').value = '';
  document.querySelector('[name=type]').value = 'mouse';
  document.querySelector('[name=brand]').value = '';
  document.querySelector('[name=model]').value = '';
  modal.showModal();
});
document.getElementById('closePeriph').addEventListener('click', () => modal.close());

document.getElementById('periphForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const fd = new FormData(ev.currentTarget);
  const payload = { type: fd.get('type'), brand: fd.get('brand'), model: fd.get('model') };
  try {
    let opts = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) };
    if (EDIT_ID) { payload.id = EDIT_ID; opts.method = 'PUT'; }
    const res = await fetch(ADMIN_BASE + '/peripherals.php', opts);
    const json = await res.json();
    toast(json.message || 'OK');
    modal.close();
    loadPeriphs();
  } catch (err) { toast(err.message); }
});

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'admin-toast show';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2500);
}
loadPeriphs();
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
