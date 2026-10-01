-- ============================================================
-- Seed EXCLUSIVO DE DESENVOLVIMENTO — NÃO rode em produção.
--
-- Cria a conta de demonstração do painel administrativo:
--   username: demo
--   senha:    demo1234
--
-- Por que ficar separado do database/seed.sql:
-- em produção não deve existir nenhuma conta com senha conhecida.
-- O database/seed.sql tem os dados de exemplo do site, mas nenhum login.
--
-- Como usar (apenas na sua máquina):
--   1. rode o database/schema.sql                        (tabelas)
--   2. rode o database/migrations/001_users_role.sql     (garante users.role)
--   3. rode o database/seed.sql                          (dados de exemplo)
--   4. rode ESTE arquivo                                  (conta admin local)
--
-- Para a dica de credenciais aparecer na tela de login do painel,
-- defina APP_ENV=dev no ambiente do Apache/PHP.
-- ============================================================

SET @coluna_role = (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'
);

-- A inserção só acontece se users.role existir; caso contrário imprime o aviso.
SET @sql = IF(
    @coluna_role = 0,
    'SELECT ''AVISO: users.role nao existe. Rode antes o database/migrations/001_users_role.sql.'' AS aviso',
    'INSERT INTO users (username, email, password_hash, role)
     VALUES (''demo'', ''demo@prosens.gg'', ''$2y$10$25GzknazIVPcGyikT19iG.m3bWtxT8hBqqM7mHjW7TR7eVZnrL802'', ''admin'')
     ON DUPLICATE KEY UPDATE
        password_hash = VALUES(password_hash),
        role          = VALUES(role)'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ------------------------------------------------------------
-- Conferência:
--   SELECT id, username, email, role FROM users ORDER BY id;
--
-- Para remover a conta de demonstração:
--   DELETE FROM users WHERE username = ''demo'';
-- ============================================================
