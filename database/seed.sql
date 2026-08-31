USE prosettings;

-- ============================================================
-- GAMES
-- ============================================================
INSERT INTO games (name, slug) VALUES
('VALORANT', 'valorant'),
('Counter-Strike 2', 'counter-strike-2'),
('Fortnite', 'fortnite'),
('Rocket League', 'rocket-league'),
('Rainbow Six Siege', 'rainbow-six-siege')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================================
-- TEAMS
-- ============================================================
INSERT INTO teams (name, slug, country) VALUES
('Free Agent (exemplo)', 'free-agent-exemplo', NULL),
('Equipe Exemplo RG', 'equipe-exemplo-rg', 'Brasil')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================================
-- PERIPHERALS
-- ============================================================
INSERT INTO peripherals (type, brand, model, slug) VALUES
('mouse', 'ATK', 'A9 Plus', 'atk-a9-plus'),
('keyboard', 'Madlions', '68 HE', 'madlions-68-he'),
('mousepad', 'ATK', '99G X Soft', 'atk-99g-xsoft'),
('headset', 'MCHOSE', 'V9 Pro', 'mchose-v9-pro'),
('monitor', 'SuperFrame', 'SFP2415 FHD 185Hz', 'superframe-sfp2415'),
('mouse', 'Ajazz', 'AJ179 Pro', 'ajazz-aj179-pro'),
('keyboard', 'Redragon', 'Kumara', 'redragon-kumara'),
('mousepad', 'CM02', 'Extended 900x400', 'cm02-extended-900x400'),
('monitor', 'Duex', 'DX270QGP165', 'duex-dx270qgp165'),
('headset', 'Fortrek', 'Fone Gaming (exemplo)', 'fortrek-fone-gaming'),
('mouse', 'Logitech', 'G403 Hero', 'logitech-g403-hero'),
('keyboard', 'Ajazz', 'AK820', 'ajazz-ak820')
ON DUPLICATE KEY UPDATE model = VALUES(model);

-- ============================================================
-- PLAYERS  (dados FICTÍCIOS, apenas para teste)
-- ============================================================
INSERT INTO players (nickname, real_name, team_id, game_id, role, slug, photo, description, active) VALUES
('pacheco', 'Gustavo Pacheco', NULL, 1, 'Duelista', 'pacheco', 'assets/gustavo-pacheco.jpg', 'Perfil de exemplo.', 1),
('Z4GB', 'Gabriel Felipi', NULL, 1, 'Duelista', 'z4gb', 'assets/gabzao.jpg', 'Perfil de exemplo.', 1),
('Tardus', 'Guilherme Costa', NULL, 1, 'Sentinela', 'tardus', 'assets/tardus.jpeg', 'Perfil de exemplo.', 1),
('Danilo Andrade', 'Danilo Andrade', NULL, 1, 'Iniciador', 'danilo-andrade', 'assets/danilo-andrade.jpg', 'Perfil de exemplo.', 1),
('Igor Gomes', 'Igor Gomes', NULL, 2, 'Player de CS', 'igor-gomes', 'assets/igao.jpeg', 'Perfil de exemplo.', 1),
('Thomaz', 'Thomaz Evangelista', NULL, 5, 'Não informado', 'thomaz', 'assets/thomaz.jpeg', 'Perfil de exemplo.', 1)
ON DUPLICATE KEY UPDATE nickname = VALUES(nickname);

-- ============================================================
-- PLAYER SETTINGS
-- ============================================================
INSERT INTO player_settings
(player_id, mouse_id, keyboard_id, mousepad_id, headset_id, monitor_id,
 dpi, sensitivity, edpi, polling_rate, resolution, aspect_ratio, crosshair, crosshair_image,
 raw_input, scoped_sensitivity, zoom_sensitivity, agents, notes,
 product_image_mouse, product_image_keyboard, product_image_mousepad, product_image_monitor, product_image_headset,
 product_link_mouse, product_link_keyboard, product_link_mousepad, product_link_monitor, product_link_headset)
SELECT p.id, 1, 2, 3, 4, 5,
  800, 0.5000, 400, 1000, '1920x1080', '16:9', '0;P;h;0;f;0;0l;4;0o;0;0a;1;0f;0;1b;0', 'assets/mira.png?v=4',
  1, 1.0000, NULL, 'Jett', 'Exemplo.',
  'assets/products/atk-a9-plus.jpg', 'assets/products/madlions-68-he.jpg', 'assets/products/atk-99g-xsoft.png', 'assets/products/superframe-sfp2415.jpg', 'assets/products/mchose-v9-pro.jpg',
  'https://pt.aliexpress.com/item/1005011812220400.html', 'https://pt.aliexpress.com/item/1005008299208938.html', 'https://pt.aliexpress.com/item/1005011561185122.html', 'https://www.terabyteshop.com.br/produto/33583', 'https://pt.aliexpress.com/item/1005011745761008.html'
FROM players p WHERE p.slug = 'pacheco'
ON DUPLICATE KEY UPDATE dpi = VALUES(dpi);

INSERT INTO player_settings
(player_id, mouse_id, keyboard_id, mousepad_id, headset_id, monitor_id,
 dpi, sensitivity, edpi, polling_rate, resolution, aspect_ratio, crosshair, crosshair_image,
 raw_input, scoped_sensitivity, zoom_sensitivity, agents, notes,
 product_image_mouse, product_image_keyboard, product_image_mousepad, product_image_monitor, product_image_headset,
 product_link_mouse, product_link_keyboard, product_link_mousepad, product_link_monitor, product_link_headset)
SELECT p.id, 6, 7, 8, 10, 9,
  1600, 0.1400, 224, 1000, '1920x1080', '16:9', '0;P;t;1;o;1;d;1;0b;0;1b;0;1m;0;1f;0', 'assets/ret.png?v=1',
  1, 1.0000, NULL, 'Jett', 'Exemplo.',
  'assets/products/gabriel-ajazz-aj179-pro.png', 'assets/teclado.webp', 'assets/products/gabriel-mousepad-cm02.jpg', 'assets/products/gabriel-duex-dx270qgp165.jpg', 'assets/fone.jpg',
  'https://pt.aliexpress.com/item/1005007791313445.html', 'https://www.pichau.com.br/teclado-gaming-redragon-kumara-mecanico-rgb-switch-brown-k552rgb-1', 'https://www.mercadolivre.com.br/', 'https://www.terabyteshop.com.br/produto/30480', 'https://www.mercadolivre.com.br/'
FROM players p WHERE p.slug = 'z4gb'
ON DUPLICATE KEY UPDATE dpi = VALUES(dpi);

INSERT INTO player_settings
(player_id, mouse_id, keyboard_id, mousepad_id, monitor_id,
 dpi, sensitivity, edpi, polling_rate, resolution, aspect_ratio, crosshair, crosshair_image,
 raw_input, scoped_sensitivity, zoom_sensitivity, agents, notes,
 product_image_mouse, product_image_keyboard, product_image_monitor,
 product_link_mouse, product_link_keyboard, product_link_monitor)
SELECT p.id, 11, 12, NULL, 9,
  1600, 0.3200, 512, 1000, '1920x1080', '16:9', 'Não informado', 'assets/mira.png?v=4',
  1, 1.0000, NULL, 'Sage', 'Exemplo.',
  'assets/products/tardus-logitech-g403-hero.jpg', 'assets/products/tardus-ajazz-ak820.png', 'assets/products/tardus-duex-dx270qgp165.jpg',
  'https://www.kabum.com.br/produto/102649', 'https://pt.aliexpress.com/item/1005007805708183.html', 'https://www.setupninja.com.br/'
FROM players p WHERE p.slug = 'tardus'
ON DUPLICATE KEY UPDATE dpi = VALUES(dpi);

INSERT INTO player_settings
(player_id, mouse_id, monitor_id,
 dpi, sensitivity, edpi, polling_rate, resolution, aspect_ratio, crosshair, crosshair_image,
 raw_input, scoped_sensitivity, zoom_sensitivity, agents, notes,
 product_image_mouse, product_image_monitor,
 product_link_mouse, product_link_monitor)
SELECT p.id, 6, 9,
  1600, 0.1000, 160, 1000, '1920x1080', '16:9', 'Não informado', 'assets/mira.png?v=4',
  1, 1.0000, NULL, 'Sova', 'Exemplo.',
  'assets/products/danilo-delux-m800-pro.jpg', 'assets/products/danilo-lg-27gs60f-b.jpg',
  'https://www.mercadolivre.com.br/', 'https://www.kabum.com.br/produto/620992'
FROM players p WHERE p.slug = 'danilo-andrade'
ON DUPLICATE KEY UPDATE dpi = VALUES(dpi);

-- ============================================================
-- PLAYER SOCIAL (exemplos)
-- ============================================================
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Instagram', 'https://www.instagram.com/gstvpacheco/'
FROM players p WHERE p.slug = 'pacheco'
ON DUPLICATE KEY UPDATE url = VALUES(url);

-- ============================================================
-- PLAYER VIDEO SETTINGS (exemplo para pacheco)
-- ============================================================
INSERT INTO player_video_settings (player_id, setting_key, setting_value, sort_order)
SELECT p.id, 'Resolução', '1920x1080', 1 FROM players p WHERE p.slug='pacheco'
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- ============================================================
-- PLAYER PC SPECS (exemplos)
-- ============================================================
INSERT INTO player_pc_specs (player_id, spec_type, label, link, image, sort_order)
SELECT p.id, 'Processador', 'AMD Ryzen 5 5600 (exemplo)', 'https://www.pichau.com.br/processador-amd-ryzen-5-5600', 'assets/rzn.jpg', 1
FROM players p WHERE p.slug='pacheco'
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- ============================================================
-- USERS (demo) - username: demo / senha: demo1234
-- ============================================================
INSERT INTO users (username, email, password_hash)
VALUES ('demo', 'demo@prosens.gg', '$2y$10$b/ax6g2wC7ISyq0xubQ.HeUHi.wLIKAy4eBaqT8aRWIQZjPajSOtW')
ON DUPLICATE KEY UPDATE username = VALUES(username);

-- ============================================================
-- COMMENTS (exemplos)
-- ============================================================
INSERT INTO comments (player_id, author, message)
SELECT p.id, 'Comunidade', 'Setup de exemplo para teste.'
FROM players p WHERE p.slug='pacheco'
ON DUPLICATE KEY UPDATE message = VALUES(message);
