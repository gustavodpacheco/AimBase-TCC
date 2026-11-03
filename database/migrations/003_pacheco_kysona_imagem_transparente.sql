-- ============================================================
-- 003_pacheco_kysona_imagem_transparente.sql — foto do mouse do Pacheco
-- ============================================================
-- A primeira versão transparente gerada para a kysona.webp ficou
-- quebrada. Esta migration troca a foto pela versão enviada em
-- assets/products/kysona-removebg-preview.png.
--
-- O script é idempotente: pode rodar mais de uma vez sem erro.
-- ============================================================

USE prosettings;

UPDATE player_settings ps
JOIN players p ON p.id = ps.player_id
SET ps.product_image_mouse = 'assets/products/kysona-removebg-preview.png'
WHERE p.slug = 'pacheco';

-- Conferência
SELECT p.slug, ps.product_image_mouse
FROM players p
JOIN player_settings ps ON ps.player_id = p.id
WHERE p.slug = 'pacheco';
