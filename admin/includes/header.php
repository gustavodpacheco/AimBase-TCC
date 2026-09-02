<?php
/** Helper: liga a API e normaliza o caminho base (para subtemos do Laragon). */
$baseHref = '/prosettings-page-main/';
if (getenv('ADMIN_BASE_HREF')) {
    $baseHref = getenv('ADMIN_BASE_HREF');
}
$pageTitle = $pageTitle ?? 'Painel Admin';
$apiBase = rtrim($baseHref, '/') . '/api';
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
  </nav>
  <a class="admin-home" href="<?= $baseHref ?>index.html" target="_blank">Ver site ↗</a>
</header>
<main class="admin-main">
<script>
// expõe o caminho da API para o JS do admin
window.ADMIN_BASE = <?= json_encode($apiBase) ?>;
</script>
