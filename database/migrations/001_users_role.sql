-- ============================================================
-- 001_users_role.sql — papel (role) dos usuários
-- ============================================================
-- Objetivo: separar "usuário comum" de "administrador".
--   users.role = 'user'  → pode comentar e gerenciar a própria conta
--   users.role = 'admin' → acessa /admin/ e os endpoints POST/PUT/DELETE
--
-- IMPORTANTE: faça BACKUP do banco antes de executar
--   mysqldump -u root prosettings > prosettings_backup.sql
--
-- O script é idempotente: pode rodar mais de uma vez sem erro.
-- ============================================================

USE prosettings;

-- ------------------------------------------------------------
-- 1) Coluna role (só cria se ainda não existir)
-- ------------------------------------------------------------
SET @coluna_existe = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'users'
      AND COLUMN_NAME  = 'role'
);

SET @sql = IF(
    @coluna_existe > 0,
    'SELECT ''users.role já existe — nada a fazer.'' AS aviso',
    'ALTER TABLE users
        ADD COLUMN role ENUM(''user'',''admin'') NOT NULL DEFAULT ''user''
        AFTER password_hash'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ------------------------------------------------------------
-- 2) Índice para consultas de papel
-- ------------------------------------------------------------
SET @indice_existe = (
    SELECT COUNT(*)
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'users'
      AND INDEX_NAME   = 'idx_role'
);

SET @sql = IF(
    @indice_existe > 0,
    'SELECT ''users.idx_role já existe — nada a fazer.'' AS aviso',
    'CREATE INDEX idx_role ON users (role)'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ------------------------------------------------------------
-- 3) Nenhuma conta é promovida automaticamente.
--
--    Esta migração NÃO cria nem promove usuários: em produção não
--    pode existir caminho para admin. Para o ambiente local, rode
--    database/dev/seed-dev.sql (cria a conta demo com role admin).
--
--    Se você já tinha uma conta de demonstração e quer promovê-la:
--    UPDATE users SET role = 'admin' WHERE username = 'demo';
--
-- 4) Como promover outros usuários a admin
-- ------------------------------------------------------------
-- UPDATE users SET role = 'admin' WHERE username = 'seu_usuario';
--
-- Consulta de conferência:
--   SELECT id, username, email, role FROM users ORDER BY id;
-- ============================================================