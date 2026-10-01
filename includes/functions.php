<?php
/**
 * Utilitários comuns: respostas JSON padronizadas e helpers.
 */

/**
 * Ambiente da aplicação.
 * APP_ENV=dev habilita recursos só de desenvolvimento (dicas de credenciais
 * de teste). O padrão é 'production', ou seja, nada de dicas na tela.
 */
function appEnv(): string
{
    $env = strtolower(trim((string)getenv('APP_ENV')));

    return in_array($env, ['dev', 'development', 'local'], true) ? 'dev' : 'production';
}

/** true apenas quando APP_ENV=dev|development|local. */
function isDevEnvironment(): bool
{
    return appEnv() === 'dev';
}

/**
 * Origens permitidas para chamadas cross-origin.
 *
 * - APP_ORIGIN: lista separada por vírgula/espaço (ex.: "https://aimbase.gg,https://www.aimbase.gg").
 *   Quando não está definida, aceita-se APENAS a própria origem da requisição
 *   e os hosts locais do Laragon (localhost / 127.0.0.1).
 */
function allowedOrigins(): array
{
    $origins = [];

    $configured = trim((string)getenv('APP_ORIGIN'));
    if ($configured !== '') {
        foreach (preg_split('/[\s,]+/', $configured) as $item) {
            $origin = rtrim(trim($item), '/');
            if ($origin !== '') {
                $origins[] = $origin;
            }
        }
    }

    // Mesma origem da requisição (site e painel servidos pelo mesmo host).
    $host = trim((string)($_SERVER['HTTP_HOST'] ?? ''));
    if ($host !== '') {
        $origins[] = 'http://' . $host;
        $origins[] = 'https://' . $host;
        // Normaliza portas padrão (http://host:80, https://host:443).
        $origins[] = 'http://' . preg_replace('/:80$/i', '', $host);
        $origins[] = 'https://' . preg_replace('/:443$/i', '', $host);
    }

    // Hosts locais de desenvolvimento.
    foreach (['localhost', '127.0.0.1', '[::1]'] as $local) {
        $origins[] = 'http://' . $local;
        $origins[] = 'https://' . $local;
    }

    return array_values(array_unique($origins));
}

/** Verifica se a origem recebida está na lista permitida. */
function isAllowedOrigin(string $origin): bool
{
    $origin = rtrim(trim($origin), '/');
    if (in_array($origin, allowedOrigins(), true)) {
        return true;
    }

    // Hosts locais aceitos em qualquer porta (dev): http://localhost:8080 etc.
    if (preg_match('#^https?://(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$#i', $origin)) {
        return true;
    }

    return false;
}

/**
 * CORS restrito às origens permitidas.
 *
 * Sem APP_ORIGIN, requisições de outras origens recebem 403.
 * Requisições sem Origin (mesma origem, <img>, <form>) seguem normalmente.
 * Preflight OPTIONS é respondida aqui e encerra a execução.
 */
function applyCors(): void
{
    $origin = trim((string)($_SERVER['HTTP_ORIGIN'] ?? ''));

    if ($origin !== '') {
        header('Vary: Origin');

        if (!isAllowedOrigin($origin)) {
            http_response_code(403);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => false,
                'message' => 'Origem não permitida.',
                'data'    => null,
            ]);
            exit;
        }

        header('Access-Control-Allow-Origin: ' . rtrim($origin, '/'));
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 600');
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/**
 * Envia uma resposta JSON padronizada e encerra a execução.
 *
 * @param mixed  $data    Dados a serem retornados.
 * @param bool   $success Indicador de sucesso.
 * @param int    $status  Código HTTP.
 * @param string $message Mensagem opcional (nunca dados SQL brutos).
 */
function jsonResponse($data = null, bool $success = true, int $status = 200, string $message = ''): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data'    => $data,
    ]);
    exit;
}

/**
 * Resposta de erro genérica (não expõe detalhes internos).
 */
function errorResponse(string $message, int $status = 400, $data = null): void
{
    jsonResponse($data, false, $status, $message);
}

/**
 * Lê o corpo JSON de uma requisição, retornando array associativo.
 */
function readJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

/**
 * Valida se um ID é um inteiro positivo.
 */
function validId($value): bool
{
    return is_numeric($value) && (int)$value > 0;
}

/**
 * Escapa e limpa uma string para saída segura em HTML.
 */
function e(?string $value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

/**
 * Gera um slug simples (url-amigável) a partir de um texto.
 */
function slugify(string $text): string
{
    $text = iconv('UTF-8', 'ASCII//TRANSLIT', $text);
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    $text = trim($text, '-');
    return $text ?: 'item';
}
