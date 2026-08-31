<?php
$pageTitle = 'Periféricos';
require __DIR__ . '/includes/header.php';
?>

<div class="admin-title">
  <div><p class="kicker">PROSENS</p><h1>Periféricos</h1></div>
  <button class="btn btn-primary" id="newPeriphBtn">+ Novo periférico</button>
</div>

<div class="admin-panel">
  <div class="admin-panel-head"><h2>Catálogo de periféricos</h2></div>
  <div id="periphsWrap" class="loading"><span class="spin"></span>Carregando...</div>
</div>

<dialog class="admin-modal" id="periphModal" style="border:1px solid var(--line);background:var(--panel-2);color:var(--text);padding:24px;width:min(100%-30px,440px);border-radius:4px">
  <form id="periphForm" style="display:grid;gap:12px">
    <h2 style="margin:0;font-size:18px;text-transform:uppercase" id="periphModalTitle">Novo periférico</h2>
    <input type="hidden" name="id">
    <select name="type" style="padding:10px;border:1px solid var(--line);background:#0a141e;color:var(--text)">
      <option value="mouse">Mouse</option>
      <option value="keyboard">Teclado</option>
      <option value="mousepad">Mousepad</option>
      <option value="headset">Headset</option>
      <option value="monitor">Monitor</option>
    </select>
    <input name="brand" placeholder="Marca" style="padding:10px;border:1px solid var(--line);background:#0a141e;color:var(--text)">
    <input name="model" required placeholder="Modelo" style="padding:10px;border:1px solid var(--line);background:#0a141e;color:var(--text)">
    <div style="display:flex;gap:8px">
      <button class="btn btn-primary" type="submit">Salvar</button>
      <button class="btn" type="button" id="closePeriph">Cancelar</button>
    </div>
  </form>
</dialog>

<script>
let EDIT_ID = 0;
const modal = document.getElementById('periphModal');
const TYPES = { mouse:'Mouse', keyboard:'Teclado', mousepad:'Mousepad', headset:'Headset', monitor:'Monitor' };

async function loadPeriphs() {
  const wrap = document.getElementById('periphsWrap');
  try {
    const res = await fetch(ADMIN_BASE + '/peripherals.php');
    const json = await res.json();
    const list = json.data.peripherals || [];
    if (!list.length) { wrap.innerHTML = '<p style="padding:18px;color:var(--muted)">Nenhum periférico cadastrado.</p>'; return; }
    wrap.innerHTML = `<table class="admin-table"><thead><tr><th>Tipo</th><th>Marca</th><th>Modelo</th><th>Slug</th><th></th></tr></thead><tbody>` +
      list.map(x => `<tr><td><span class="admin-badge">${TYPES[x.type] || x.type}</span></td><td>${x.brand || '—'}</td><td><strong>${x.model}</strong></td><td style="color:var(--muted)">${x.slug}</td><td class="actions"><button class="btn" data-edit='${JSON.stringify(x)}'>Editar</button><button class="btn btn-danger" data-del="${x.id}" data-name="${x.model}">Excluir</button></td></tr>`).join('') + `</tbody></table>`;

    document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openEdit(JSON.parse(b.dataset.edit))));
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm(`Excluir "${b.dataset.name}"?`)) return;
      try { await fetch(`${ADMIN_BASE}/peripherals.php?id=${b.dataset.del}`, { method: 'DELETE' }); toast('Periférico excluído.'); loadPeriphs(); }
      catch (err) { toast(err.message); }
    }));
  } catch (err) { wrap.innerHTML = `<p style="padding:18px;color:var(--muted)">Falha: ${err.message}</p>`; }
}

function openEdit(x) {
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
