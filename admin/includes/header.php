<?php
/** Helper: liga a API e normaliza o caminho base (para subtemos do Laragon). */
require_once __DIR__ . '/../../includes/auth.php';

$baseHref = '/prosettings-page-main/';
if (getenv('ADMIN_BASE_HREF')) {
    $baseHref = getenv('ADMIN_BASE_HREF');
}
$pageTitle = $pageTitle ?? 'Painel Admin';
$apiBase = rtrim($baseHref, '/') . '/api';

// --- Sessão compartilhada com a API (AIMBASE_SESSID) ---
bootSession();

// --- Proteção: exige usuário logado COM PAPEL admin ---
$adminUser = currentUser();
if ($adminUser === null) {
    header('Location: login.php');
    exit;
}
if ($adminUser['role'] !== 'admin') {
    http_response_code(403);
    ?>
    <!doctype html>
    <html lang="pt-BR">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Acesso negado — AimBase Admin</title>
    <link rel="stylesheet" href="<?= e($baseHref) ?>assets/css/tokens.css">
    <link rel="stylesheet" href="<?= e($baseHref) ?>assets/css/base.css">
    <link rel="stylesheet" href="includes/admin.css">
    </head>
    <body class="dark" data-page="admin">
    <main class="admin-main">
      <div class="admin-title"><div><p class="kicker">AIMBASE</p><h1>Acesso negado</h1></div></div>
      <div class="admin-panel">
        <p class="admin-muted">
          A conta <strong><?= e($adminUser['username']) ?></strong> não tem permissão de administrador.
          Promova-a no banco com:<br>
          <code>UPDATE users SET role = 'admin' WHERE username = '<?= e($adminUser['username']) ?>';</code>
        </p>
        <a class="btn" href="logout.php">Sair</a>
        <a class="btn" href="<?= e($baseHref) ?>index.html">Voltar ao site</a>
      </div>
    </main>
    </body>
    </html>
    <?php
    exit;
}
?>
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= htmlspecialchars($pageTitle) ?> — AimBase Admin</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="<?= $baseHref ?>assets/css/tokens.css">
<link rel="stylesheet" href="<?= $baseHref ?>assets/css/base.css">
<link rel="stylesheet" href="<?= $baseHref ?>assets/css/layout.css">
<link rel="stylesheet" href="<?= $baseHref ?>assets/css/components/buttons.css">
<link rel="stylesheet" href="includes/admin.css">
</head>
<body class="dark" data-page="admin">
<header class="admin-header">
  <a class="logo" href="index.php"><span class="logo-dot">A</span>Aim<span>Base</span> <small>ADMIN</small></a>
  <nav class="admin-nav">
    <a href="index.php">Painel</a>
    <a href="players.php">Jogadores</a>
    <a href="teams.php">Times</a>
    <a href="peripherals.php">Periféricos</a>
    <a href="comments.php">Comentários</a>
  </nav>
  <div class="admin-tools">
    <?php if ($adminUser): ?>
      <span class="admin-user"><?= e($adminUser['username']) ?></span>
    <?php endif; ?>
    <a class="admin-home" href="<?= $baseHref ?>index.html" target="_blank">Ver site ↗</a>
    <a class="admin-logout" href="logout.php">Sair</a>
  </div>
</header>
<main class="admin-main">
<script>
// expõe o caminho da API para o JS do admin
window.ADMIN_BASE = <?= json_encode($apiBase) ?>;
// escapa strings para saída segura em HTML (anti-XSS)
window.esc = (value) => {
  const str = String(value ?? '');
  return str.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
};
// aceita apenas URLs http(s) ou relativas (anti javascript:)
window.safeAdminUrl = (value) => {
  const url = String(value ?? '');
  return /^(https?:|\/|\.\.?\/)/i.test(url) ? window.esc(url) : '#';
};

// ---- Token CSRF ----
// Toda escrita (POST/PUT/DELETE) passa por adminFetch(), que envia o cookie de
// sessão e o header X-CSRF-Token. Se a API responder 403, o token é renovado e
// a requisição é repetida uma única vez.
window.ADMIN_CSRF = null;

window.adminFetch = async function (url, opts = {}) {
  const method = (opts.method || 'GET').toUpperCase();
  const isWrite = method !== 'GET' && method !== 'HEAD';
  const body = opts.body;

  const token = async (force) => {
    if (force) window.ADMIN_CSRF = null;
    if (window.ADMIN_CSRF) return window.ADMIN_CSRF;
    const res = await fetch(ADMIN_BASE + '/auth.php?action=csrf', { credentials: 'same-origin' });
    const json = await res.json();
    window.ADMIN_CSRF = (json && json.data && json.data.token) || null;
    return window.ADMIN_CSRF;
  };

  const send = (tk) => {
    const headers = Object.assign({}, opts.headers || {});
    if (isWrite) headers['X-CSRF-Token'] = tk;
    return fetch(url, { method, headers, body, credentials: 'same-origin' });
  };

  if (!isWrite) return send(null);

  let res = await send(await token(false));
  if (res.status === 403) res = await send(await token(true));
  return res;
};

// atalho JSON: envia body serializado e devolve o JSON já convertido
window.adminJson = async function (url, method, payload) {
  const res = await window.adminFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Erro na requisição.');
  return json;
};
</script>
