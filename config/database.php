<?php
// ============================================================
// Configuração da conexão com o banco de dados (MySQL/MariaDB)
//
// IMPORTANTE: Nunca coloque senhas reais no código versionado.
// Prefira variáveis de ambiente. Exemplo:
//   putenv('DB_PASSWORD=minha_senha');  -> no Laragon, defina
//   nas variáveis de ambiente do Windows ou em um .env local.
// ============================================================

return [
    'host'     => getenv('DB_HOST') ?: '127.0.0.1',
    'port'     => getenv('DB_PORT') ?: '3306',
    'database' => getenv('DB_NAME') ?: 'prosettings',
    'username' => getenv('DB_USER') ?: 'root',
    'password' => getenv('DB_PASSWORD') ?: '',
    'charset'  => 'utf8mb4',
];
