<?php
/**
 * Utilitários comuns: respostas JSON padronizadas e helpers.
 */

// CORS simples (descomente para permitir acesso de outras origens ao desenvolver)
function applyCors(): void
{
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
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
