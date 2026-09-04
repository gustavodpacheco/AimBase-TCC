<?php
$pageTitle = 'Comentários';
require __DIR__ . '/includes/header.php';
?>

<div class="admin-title">
  <div><p class="kicker">AIMBASE</p><h1>Comentários</h1></div>
</div>

<div class="admin-panel">
  <div class="admin-panel-head"><h2>Todos os comentários</h2><input class="admin-search" id="commentsSearch" type="search" placeholder="Buscar comentário..."></div>
  <div id="commentsWrap" class="loading"><span class="spin"></span>Carregando...</div>
</div>

<script>
let COMMENTS = [];

function commentRows(list) {
  return list.map(c => `<tr>
    <td><strong>${esc(c.author)}</strong></td>
    <td><span class="admin-badge">${esc(c.player_name || '—')}</span></td>
    <td class="comment-msg">${esc(c.message)}</td>
    <td class="muted">${esc(new Date(c.created_at).toLocaleString('pt-BR'))}</td>
    <td class="actions">
      <button class="btn btn-danger" data-del="${esc(c.id)}" data-author="${esc(c.author)}">Excluir</button>
    </td>
  </tr>`).join('');
}

function renderComments(q = '') {
  const wrap = document.getElementById('commentsWrap');
  const list = COMMENTS.filter(c => {
    if (!q) return true;
    return `${c.author} ${c.message} ${c.player_name || ''}`.toLowerCase().includes(q);
  });
  if (!list.length) {
    wrap.innerHTML = '<p class="admin-muted">' + (COMMENTS.length ? 'Nenhum resultado para a busca.' : 'Nenhum comentário cadastrado.') + '</p>';
    return;
  }
  wrap.innerHTML = `<table class="admin-table"><thead><tr><th>Autor</th><th>Jogador</th><th>Mensagem</th><th>Data</th><th></th></tr></thead><tbody>${commentRows(list)}</tbody></table>`;

  document.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', async () => {
    if (!confirm(`Excluir o comentário de "${btn.dataset.author}"?`)) return;
    try {
      const res = await fetch(`${ADMIN_BASE}/comments.php?id=${btn.dataset.del}`, { method: 'DELETE', credentials: 'same-origin' });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast('Comentário excluído.');
      loadComments();
    } catch (err) { toast(err.message); }
  }));
}

async function loadComments() {
  const wrap = document.getElementById('commentsWrap');
  try {
    const playersRes = await fetch(ADMIN_BASE + '/players.php');
    const playersJson = await playersRes.json();
    const players = (playersJson.data && playersJson.data.players) || [];

    const rows = await Promise.all(players.map(async p => {
      const res = await fetch(`${ADMIN_BASE}/comments.php?player_id=${p.id}`);
      const json = await res.json();
      return (json.data && json.data.comments || []).map(c => ({ ...c, player_name: p.nickname }));
    }));

    COMMENTS = rows.flat().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    document.getElementById('commentsSearch').value = '';
    renderComments('');
  } catch (err) {
    wrap.innerHTML = `<p class="admin-muted">Falha ao carregar comentários: ${esc(err.message)}</p>`;
  }
}

document.getElementById('commentsSearch').addEventListener('input', e => renderComments(e.currentTarget.value.trim().toLowerCase()));

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'admin-toast show';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2500);
}

loadComments();
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>