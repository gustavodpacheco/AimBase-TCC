<?php
require __DIR__ . '/../includes/database.php';
require __DIR__ . '/../includes/functions.php';

$baseHref = getenv('ADMIN_BASE_HREF') ?: '/prosettings-page-main/';

if (session_status() === PHP_SESSION_NONE) {
    session_name('AIMBASE_SESSID');
    session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax', 'path' => '/']);
    session_start();
}

if (!empty($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

$error   = '';
$warning = '';

if (isset($_GET['out'])) {
    $warning = 'Sessão encerrada.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = (string)($_POST['password'] ?? '');

    if ($username === '' || $password === '') {
        $error = 'Informe usuário e senha.';
    } else {
        $stmt = db()->prepare("SELECT id, username, password_hash FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            $error = 'Credenciais inválidas.';
        } else {
            session_regenerate_id(true);
            $_SESSION['user_id'] = (int)$user['id'];
            header('Location: index.php');
            exit;
        }
    }
}
?>
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Login — AimBase Admin</title>
<link rel="stylesheet" href="<?= e($baseHref) ?>assets/css/tokens.css">
<link rel="stylesheet" href="<?= e($baseHref) ?>assets/css/base.css">
<link rel="stylesheet" href="includes/admin.css">
<style>
  .login-shell { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
  .login-card {
    width: min(100% - 30px, 380px);
    border: 1px solid var(--border-subtle);
    background: var(--bg-surface);
    border-radius: var(--radius-card);
    padding: var(--space-6);
    box-shadow: var(--shadow-modal);
  }
  .login-card .logo { margin-bottom: var(--space-5); }
  .login-card h1 { margin: 0 0 4px; font-size: var(--fs-xl); text-transform: uppercase; }
  .login-card p.kicker { margin: 0 0 var(--space-4); }
  .login-card form { display: grid; gap: var(--space-4); }
  .login-card label { display: grid; gap: 6px; color: var(--text-secondary); font: 700 0.625rem var(--font-mono); letter-spacing: 0.06em; text-transform: uppercase; }
  .login-card input {
    width: 100%; padding: 10px 12px; border: 1px solid var(--border-subtle);
    background: var(--bg-surface-alt); color: var(--text-primary);
    border-radius: var(--radius-input); font-size: var(--fs-sm); outline: none;
  }
  .login-card input:focus { border-color: var(--focus-ring); }
  .login-alert {
    padding: 10px 12px; border-radius: var(--radius-input); font-size: var(--fs-sm);
    border: 1px solid rgba(74, 222, 128, 0.4); color: var(--accent-success); background: rgba(74, 222, 128, 0.08);
  }
  .login-error {
    padding: 10px 12px; border-radius: var(--radius-input); font-size: var(--fs-sm);
    border: 1px solid rgba(248, 113, 113, 0.4); color: #f87171; background: rgba(248, 113, 113, 0.08);
  }
</style>
</head>
<body class="dark" data-page="admin">
<div class="login-shell">
  <div class="login-card">
    <a class="logo" href="<?= e($baseHref) ?>index.html"><span class="logo-dot">A</span>Aim<span>Base</span> <small style="color:var(--accent-primary);font:700 0.6rem var(--font-mono);letter-spacing:.08em">ADMIN</small></a>
    <h1>Entrar</h1>
    <p class="kicker">painel administrativo</p>

    <?php if ($warning): ?><p class="login-alert"><?= e($warning) ?></p><?php endif; ?>
    <?php if ($error): ?><p class="login-error"><?= e($error) ?></p><?php endif; ?>

    <form method="post">
      <label>Usuário ou e-mail
        <input name="username" required autofocus autocomplete="username">
      </label>
      <label>Senha
        <input type="password" name="password" required autocomplete="current-password">
      </label>
      <button class="btn btn-primary" type="submit">Entrar</button>
    </form>
    <p class="admin-muted" style="text-align:left;padding:var(--space-4) 0 0;font-size:0.7rem">
      Usuário demo: <code>demo</code> / senha: <code>demo1234</code>
    </p>
  </div>
</div>
</body>
</html>