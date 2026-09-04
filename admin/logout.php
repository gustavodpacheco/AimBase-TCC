<?php
require __DIR__ . '/../includes/functions.php';

if (session_status() === PHP_SESSION_NONE) {
    session_name('AIMBASE_SESSID');
    session_start();
}

$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
}
session_destroy();

header('Location: login.php?out=1');
exit;