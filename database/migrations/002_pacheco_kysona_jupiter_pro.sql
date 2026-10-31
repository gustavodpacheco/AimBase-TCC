-- ============================================================
-- 002_pacheco_kysona_jupiter_pro.sql — mouse do Gustavo Pacheco
-- ============================================================
-- Troca o mouse do perfil "pacheco" para o Kysona Jupiter Pro,
-- atualizando o periférico, a foto do produto e o link da loja.
--
-- IMPORTANTE: faça BACKUP do banco antes de executar
--   mysqldump -u root prosettings > prosettings_backup.sql
--
-- O script é idempotente: pode rodar mais de uma vez sem erro.
-- ============================================================

USE prosettings;

-- ------------------------------------------------------------
-- 1) Cadastra o mouse (se ainda não existir)
-- ------------------------------------------------------------
INSERT INTO peripherals (type, brand, model, slug) VALUES
('mouse', 'Kysona', 'Kysona Jupiter Pro', 'kysona-jupiter-pro')
ON DUPLICATE KEY UPDATE
  type  = VALUES(type),
  brand = VALUES(brand),
  model = VALUES(model);

-- ------------------------------------------------------------
-- 2) Aponta o perfil do Pacheco para o novo mouse
-- ------------------------------------------------------------
UPDATE player_settings ps
JOIN players p ON p.id = ps.player_id
SET ps.mouse_id            = (SELECT id FROM peripherals WHERE slug = 'kysona-jupiter-pro'),
    ps.product_image_mouse = 'assets/products/kysona.webp',
    ps.product_link_mouse  = 'https://shop.kysona.com/pt/products/kysona-jupiter-wireless-gaming-mouse?variant=50419738968379'
WHERE p.slug = 'pacheco';

-- ------------------------------------------------------------
-- 3) Conferência
-- ------------------------------------------------------------
SELECT p.slug, m.brand, m.model, ps.product_image_mouse, ps.product_link_mouse
FROM players p
JOIN player_settings ps ON ps.player_id = p.id
LEFT JOIN peripherals m ON m.id = ps.mouse_id
WHERE p.slug = 'pacheco';
