<?php
$pageTitle = (isset($_GET['id'])) ? 'Editar jogador' : 'Novo jogador';
require __DIR__ . '/includes/header.php';
$editId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
?>

<div class="admin-title">
  <div><p class="kicker">AIMBASE</p><h1><?= $editId ? 'Editar Jogador' : 'Novo Jogador' ?></h1></div>
  <a class="btn" href="players.php">← Voltar</a>
</div>

<form class="admin-panel" id="playerForm">
  <div class="admin-panel-head"><h2>Dados básicos</h2></div>
  <div class="admin-form">
    <label>Nickname *<input name="nickname" required></label>
    <label>Nome real<input name="real_name"></label>
    <label>Jogo *
      <select name="game_id" required><option value="">— selecione —</option></select>
    </label>
    <label>Time
      <select name="team_id"><option value="">— sem time —</option></select>
    </label>
    <label>Função<input name="role" placeholder="Ex.: Duelista"></label>
    <label>País<input name="country" placeholder="Ex.: Brasil"></label>
    <label>Foto (URL)<input name="photo" placeholder="/assets/foto.jpg"></label>
    <label class="full">Descrição<textarea name="description" rows="3"></textarea></label>
  </div>

  <div class="admin-panel-head"><h2>Settings / Setup</h2></div>
  <div class="admin-form">
    <label>Mouse<select name="mouse_id"><option value="">— nenhum —</option></select></label>
    <label>Teclado<select name="keyboard_id"><option value="">— nenhum —</option></select></label>
    <label>Mousepad<select name="mousepad_id"><option value="">— nenhum —</option></select></label>
    <label>Headset<select name="headset_id"><option value="">— nenhum —</option></select></label>
    <label>Monitor<select name="monitor_id"><option value="">— nenhum —</option></select></label>
    <label>Agente principal<input name="agents"></label>
    <label>DPI<input name="dpi" type="number" min="1"></label>
    <label>Sensibilidade<input name="sensitivity" type="number" step="0.0001"></label>
    <label>Polling Rate<input name="polling_rate" type="number" min="1"></label>
    <label>Resolução<input name="resolution" placeholder="1920x1080"></label>
    <label>Aspect Ratio<input name="aspect_ratio" placeholder="16:9"></label>
    <label>Raw Input
      <select name="raw_input"><option value="1">Ligado</option><option value="0">Desligado</option></select>
    </label>
    <label>Scoped Sensitivity<input name="scoped_sensitivity" type="number" step="0.0001"></label>
    <label>Zoom Sensitivity<input name="zoom_sensitivity" type="number" step="0.0001"></label>
    <label>Imagem da retícula<input name="crosshair_image" placeholder="/assets/mira.png"></label>
    <label class="full">Código da retícula<textarea name="crosshair" rows="2"></textarea></label>
    <label class="full">Notas<textarea name="notes" rows="2"></textarea></label>
  </div>

  <div class="admin-panel-head"><h2>Ações</h2></div>
  <div class="admin-form">
    <button class="btn btn-primary" type="submit"><?= $editId ? 'Salvar alterações' : 'Criar jogador' ?></button>
    <?php if ($editId): ?>
      <button class="btn btn-danger" type="button" id="delBtn">Excluir jogador</button>
    <?php endif; ?>
  </div>
</form>

<script>
let EDIT_ID = <?= $editId ?: 0 ?>;
let GAMES = [], TEAMS = [], PERIPHS = [];

async function init() {
  try {
    const [g, t, p] = await Promise.all([
      (await fetch(ADMIN_BASE + '/games.php')).json(),
      (await fetch(ADMIN_BASE + '/teams.php')).json(),
      (await fetch(ADMIN_BASE + '/peripherals.php')).json(),
    ]);
    GAMES = g.data.games || [];
    TEAMS = t.data.teams || [];
    PERIPHS = p.data.peripherals || [];

    fillSelect('[name=game_id]', GAMES.map(x => ({ value: x.id, label: x.name })), 'selecione');
    fillSelect('[name=team_id]', TEAMS.map(x => ({ value: x.id, label: x.name })), 'sem time');
    ['mouse_id','keyboard_id','mousepad_id','headset_id','monitor_id'].forEach(name => {
      fillSelect(`[name=${name}]`, PERIPHS.map(x => ({ value: x.id, label: `${x.brand || ''} ${x.model}`.trim() })), 'nenhum');
    });

    if (EDIT_ID) await loadPlayer();
  } catch (err) {
    toast('Falha ao carregar dados: ' + err.message);
  }
}

function fillSelect(sel, options, placeholderLabel) {
  const el = document.querySelector(sel);
  el.innerHTML = `<option value="">— ${placeholderLabel} —</option>` + options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
}

async function loadPlayer() {
  try {
    const res = await fetch(`${ADMIN_BASE}/player.php?id=${EDIT_ID}`);
    const json = await res.json();
    if (!json.success) { toast(json.message); return; }
    const p = json.data;
    set('[name=nickname]', p.nickname);
    set('[name=real_name]', p.real_name);
    set('[name=game_id]', p.game_id);
    set('[name=team_id]', p.team_id);
    set('[name=role]', p.role);
    set('[name=country]', p.country);
    set('[name=photo]', p.photo);
    set('[name=description]', p.description);
    const s = p.settings || {};
    set('[name=mouse_id]', s.mouse_id);
    set('[name=keyboard_id]', s.keyboard_id);
    set('[name=mousepad_id]', s.mousepad_id);
    set('[name=headset_id]', s.headset_id);
    set('[name=monitor_id]', s.monitor_id);
    set('[name=agents]', s.agents);
    set('[name=dpi]', s.dpi);
    set('[name=sensitivity]', s.sensitivity);
    set('[name=polling_rate]', s.polling_rate);
    set('[name=resolution]', s.resolution);
    set('[name=aspect_ratio]', s.aspect_ratio);
    set('[name=raw_input]', s.raw_input == null ? 1 : s.raw_input);
    set('[name=scoped_sensitivity]', s.scoped_sensitivity);
    set('[name=zoom_sensitivity]', s.zoom_sensitivity);
    set('[name=crosshair_image]', s.crosshair_image);
    set('[name=crosshair]', s.crosshair);
    set('[name=notes]', s.notes);
  } catch (err) { toast(err.message); }
}

function set(sel, value) {
  const el = document.querySelector(sel);
  if (el) el.value = value ?? '';
}

document.getElementById('playerForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const fd = new FormData(ev.currentTarget);
  const payload = {
    nickname: fd.get('nickname'),
    real_name: fd.get('real_name'),
    game_id: fd.get('game_id') || null,
    team_id: fd.get('team_id') || null,
    role: fd.get('role'),
    country: fd.get('country'),
    photo: fd.get('photo'),
    description: fd.get('description'),
    settings: {
      mouse_id: fd.get('mouse_id') || null,
      keyboard_id: fd.get('keyboard_id') || null,
      mousepad_id: fd.get('mousepad_id') || null,
      headset_id: fd.get('headset_id') || null,
      monitor_id: fd.get('monitor_id') || null,
      agents: fd.get('agents'),
      dpi: fd.get('dpi'),
      sensitivity: fd.get('sensitivity'),
      polling_rate: fd.get('polling_rate'),
      resolution: fd.get('resolution'),
      aspect_ratio: fd.get('aspect_ratio'),
      raw_input: fd.get('raw_input') == null ? null : (fd.get('raw_input') === '1' ? 1 : 0),
      scoped_sensitivity: fd.get('scoped_sensitivity'),
      zoom_sensitivity: fd.get('zoom_sensitivity'),
      crosshair_image: fd.get('crosshair_image'),
      crosshair: fd.get('crosshair'),
      notes: fd.get('notes'),
    },
  };
  try {
    let url = ADMIN_BASE + '/players.php';
    let opts = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) };
    if (EDIT_ID) { payload.id = EDIT_ID; opts.method = 'PUT'; }
    const res = await fetch(url, opts);
    const json = await res.json();
    if (!json.success) { toast(json.message); return; }
    toast(json.message);
    setTimeout(() => location.href = 'players.php', 700);
  } catch (err) { toast(err.message); }
});

const delBtn = document.getElementById('delBtn');
if (delBtn) delBtn.addEventListener('click', async () => {
  if (!confirm('Excluir este jogador definitivamente?')) return;
  try {
    await fetch(`${ADMIN_BASE}/players.php?id=${EDIT_ID}`, { method: 'DELETE' });
    toast('Jogador excluído.');
    setTimeout(() => location.href = 'players.php', 700);
  } catch (err) { toast(err.message); }
});

init();
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
