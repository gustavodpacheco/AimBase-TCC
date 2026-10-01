<?php
/**
 * Rate limit em arquivo (sem dependências externas).
 *
 * Chave: ação + IP + sessão (a sessão só entra no escopo 'session').
 * Os arquivos ficam em storage/ratelimit, pasta bloqueada por .htaccess.
 *
 * Uso:
 *   rateLimitEnforce('comment', 5, 300);        // encerra com 429 (JSON)
 *   $wait = rateLimitAttempt('login', 10, 300, 'ip'); // devolve segundos a esperar
 *   rateLimitClear('login', 'ip');               // zera após sucesso
 *
 * Requer includes/functions.php carregado (usa errorResponse()).
 */

if (!defined('RATE_LIMIT_WINDOW')) {
    define('RATE_LIMIT_WINDOW', 86400); // 24h: arquivos mais velhos viram lixo
}

/** Pasta de armazenamento dos contadores. */
function rateLimitDir(): string
{
    $dir = __DIR__ . '/../storage/ratelimit';

    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }

    return is_dir($dir) ? $dir : sys_get_temp_dir();
}

/**
 * IP do cliente.
 * X-Forwarded-For NÃO é usado de propósito: é falsificável e permitiria
 * burlar o limite trocando o header a cada requisição.
 */
function clientIp(): string
{
    return (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

/** Caminho do contador para a ação no escopo informado. */
function rateLimitFile(string $action, string $scope = 'session'): string
{
    $parts = [$action, $scope, clientIp()];

    if ($scope === 'session') {
        $parts[] = session_id() ?: 'sem-sessao';
    }

    return rateLimitDir() . '/' . sha1(implode('|', $parts)) . '.json';
}

/** Grava a lista de timestamps com trava de escrita. */
function rateLimitStore(string $file, array $stamps): void
{
    $json = json_encode(array_values($stamps));

    if ($json === false) {
        return;
    }

    @file_put_contents($file, $json, LOCK_EX);
    @chmod($file, 0600);
}

/** Remove contadores expirados (chamado de vez em quando para não acumular). */
function rateLimitGc(): void
{
    $files = @glob(rateLimitDir() . '/*.json');

    if (!is_array($files) || count($files) < 50) {
        return;
    }

    $deadline = time() - RATE_LIMIT_WINDOW;
    foreach ($files as $file) {
        if (@filemtime($file) < $deadline) {
            @unlink($file);
        }
    }
}

/**
 * Registra uma tentativa.
 * @return int 0 se liberou; >0 = segundos a esperar.
 */
function rateLimitAttempt(string $action, int $maxAttempts, int $windowSeconds, string $scope = 'session'): int
{
    $file  = rateLimitFile($action, $scope);
    $now   = time();
    $stamps = [];

    if (is_file($file)) {
        $raw = @file_get_contents($file);
        $decoded = $raw === false ? null : json_decode($raw, true);

        if (is_array($decoded)) {
            foreach ($decoded as $stamp) {
                if (is_numeric($stamp)) {
                    $stamps[] = (int)$stamp;
                }
            }
        }
    }

    // Janela deslizante: descarta o que já saiu da janela.
    $stamps = array_values(array_filter($stamps, static fn($t) => $t > $now - $windowSeconds));
    sort($stamps);

    if (count($stamps) >= $maxAttempts) {
        $retryAfter = max(1, ($stamps[0] + $windowSeconds) - $now);
        rateLimitStore($file, $stamps);
        return $retryAfter;
    }

    $stamps[] = $now;
    rateLimitStore($file, $stamps);
    rateLimitGc();

    return 0;
}

/** Igual a rateLimitAttempt(), mas encerra a requisição com 429. */
function rateLimitEnforce(string $action, int $maxAttempts, int $windowSeconds, string $scope = 'session'): void
{
    $retryAfter = rateLimitAttempt($action, $maxAttempts, $windowSeconds, $scope);

    if ($retryAfter > 0) {
        header('Retry-After: ' . $retryAfter);
        errorResponse('Muitas tentativas. Tente novamente em ' . rateLimitWaitLabel($retryAfter) . '.', 429);
    }
}

/** "45 segundos" / "3 minutos" / "1 hora" */
function rateLimitWaitLabel(int $seconds): string
{
    if ($seconds < 60) {
        return $seconds . ' segundo' . ($seconds === 1 ? '' : 's');
    }
    if ($seconds < 3600) {
        $min = (int)ceil($seconds / 60);
        return $min . ' minuto' . ($min === 1 ? '' : 's');
    }
    $hours = (int)ceil($seconds / 3600);
    return $hours . ' hora' . ($hours === 1 ? '' : 's');
}

/** Zera o contador (usar após uma operação bem-sucedida). */
function rateLimitClear(string $action, string $scope = 'session'): void
{
    @unlink(rateLimitFile($action, $scope));
}
