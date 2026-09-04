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
INSERT INTO teams (name, slug, logo, country) VALUES
('Free Agent (exemplo)', 'free-agent-exemplo', NULL, NULL),
('Equipe Exemplo RG', 'equipe-exemplo-rg', NULL, 'Brasil'),
('Teenagers', 'teenagers', 'assets/image.png', 'Brasil'),
('FURIA', 'furia', NULL, 'Brasil'),
('MIBR', 'mibr', NULL, 'Brasil'),
('Shopify Rebellion Gold', 'shopify-rebellion-gold', NULL, 'Dinamarca'),
('FURIA Fe', 'furia-fe', NULL, 'Brasil')
ON DUPLICATE KEY UPDATE name = VALUES(name), logo = VALUES(logo);

UPDATE teams SET name = 'Teenagers', slug = 'teenagers', logo = 'assets/image.png'
WHERE name = 'Teenager' AND slug = 'teenager';

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
('keyboard', 'Ajazz', 'AK820', 'ajazz-ak820'),
('mouse', 'Fallen Gear', 'Lobo Wireless', 'fallen-gear-lobo-wireless'),
('keyboard', 'Fallen Gear', 'Pink Keyboard (HE)', 'fallen-gear-pink-keyboard'),
('mousepad', 'Fallen Gear', 'Invoker', 'fallen-gear-invoker'),
('headset', 'Fallen Gear', 'Morcego Pro Wireless Black', 'fallen-gear-morcego-pro'),
('monitor', 'ZOWIE', 'XL2546K 240Hz', 'zowie-xl2546k'),
('mouse', 'Logitech G', 'Pro X Superlight 2', 'logitech-g-pro-x-superlight-2'),
('keyboard', 'ATK', 'RS6 Ultra Aspas Edition', 'atk-rs6-ultra-aspas'),
('mousepad', 'SteelSeries', 'QcK Large', 'steelseries-qck-large'),
('headset', 'Razer', 'BlackShark V3 Pro', 'razer-blackshark-v3-pro'),
('monitor', 'ZOWIE', 'XL2586X 540Hz', 'zowie-xl2586x'),
('mouse', 'WLMouse', 'BEAST X Mini', 'wlmouse-beast-x-mini'),
('monitor', 'ZOWIE', 'XL2566X+ 400Hz', 'zowie-xl2566x-plus'),
('keyboard', 'Wooting', '60HE+', 'wooting-60he-plus'),
('headset', 'SteelSeries', 'Arctis Nova Pro', 'steelseries-arctis-nova-pro'),
('mousepad', 'Artisan', 'Ninja FX Zero Soft', 'artisan-ninja-fx-zero-soft'),
('keyboard', 'Logitech G', 'Pro X TKL', 'logitech-g-pro-x-tkl'),
('headset', 'HyperX', 'Cloud Alpha', 'hyperx-cloud-alpha'),
('mousepad', 'Logitech G', 'G640', 'logitech-g640'),
('monitor', 'ZOWIE', 'XL2546 240Hz', 'zowie-xl2546')
ON DUPLICATE KEY UPDATE model = VALUES(model);

-- ============================================================
-- PLAYERS  (dados FICTÍCIOS, apenas para teste)
-- ============================================================
INSERT INTO players (nickname, real_name, team_id, game_id, role, country, slug, photo, description, active, is_pro) VALUES
('TNG', 'Gustavo Pacheco', NULL, 1, 'Duelista', 'Brasil', 'pacheco', 'assets/gustavo-pacheco.jpg', 'Perfil de exemplo.', 1, 0),
('Z4GB', 'Gabriel Felipi', NULL, 1, 'Duelista', 'Brasil', 'z4gb', 'assets/gabzao.jpg', 'Perfil de exemplo.', 1, 0),
('Tardus', 'Guilherme Costa', NULL, 1, 'Sentinela', 'Brasil', 'tardus', 'assets/tardus.jpeg', 'Perfil de exemplo.', 1, 0),
('Danilo Andrade', 'Danilo Andrade', NULL, 1, 'Iniciador', 'Brasil', 'danilo-andrade', 'assets/danilo-andrade.jpg', 'Perfil de exemplo.', 1, 0),
('Igor Gomes', 'Igor Gomes', NULL, 2, 'Player de CS', 'Brasil', 'igor-gomes', 'assets/igao.jpeg', 'Perfil de exemplo.', 1, 0),
('Thomaz', 'Thomas Evangelista', NULL, 5, 'Não informado', 'Brasil', 'thomaz', 'assets/thomaz.jpeg', 'Perfil de exemplo.', 1, 0),
('FalleN', 'Gabriel Toledo', NULL, 2, 'IGL / AWP', 'Brasil', 'fallen', 'assets/fallen.jpg', 'Pro player profissional de Counter-Strike.', 1, 1),
('aspas', 'Erick Santos', NULL, 1, 'Duelista', 'Brasil', 'aspas', 'assets/aspas.jpg', 'Pro player profissional de VALORANT.', 1, 1),
('noia', 'Nicole Tierce', NULL, 1, 'Não informado', 'Dinamarca', 'noia', 'assets/noia.jpg', 'Pro player profissional de VALORANT.', 1, 1),
('bizinha', 'Bruna Marvila', NULL, 2, 'Rifler', 'Brasil', 'bizinha', 'assets/bruna.jpg', 'Pro player profissional de Counter-Strike 2.', 1, 1)
ON DUPLICATE KEY UPDATE nickname = VALUES(nickname), is_pro = VALUES(is_pro);

-- Pacheco (TNG) entra no time Teenager
UPDATE players
SET team_id = (SELECT id FROM teams WHERE slug = 'teenagers')
WHERE slug = 'pacheco';

-- Pro players entram nos seus times
UPDATE players SET team_id = (SELECT id FROM teams WHERE slug = 'furia') WHERE slug = 'fallen';
UPDATE players SET team_id = (SELECT id FROM teams WHERE slug = 'mibr') WHERE slug = 'aspas';
UPDATE players SET team_id = (SELECT id FROM teams WHERE slug = 'shopify-rebellion-gold') WHERE slug = 'noia';
UPDATE players SET team_id = (SELECT id FROM teams WHERE slug = 'furia-fe') WHERE slug = 'bizinha';

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

-- Pro players
INSERT INTO player_settings
(player_id, mouse_id, keyboard_id, mousepad_id, headset_id, monitor_id,
 dpi, sensitivity, edpi, polling_rate, resolution, aspect_ratio, crosshair, crosshair_image,
 raw_input, scoped_sensitivity, zoom_sensitivity, agents, notes,
 product_link_mouse, product_link_keyboard, product_link_mousepad, product_link_monitor, product_link_headset)
SELECT p.id,
  (SELECT id FROM peripherals WHERE slug = 'fallen-gear-lobo-wireless'),
  (SELECT id FROM peripherals WHERE slug = 'fallen-gear-pink-keyboard'),
  (SELECT id FROM peripherals WHERE slug = 'fallen-gear-invoker'),
  (SELECT id FROM peripherals WHERE slug = 'fallen-gear-morcego-pro'),
  (SELECT id FROM peripherals WHERE slug = 'zowie-xl2546k'),
  400, 2.0000, 800, 1000, '1280x960', '4:3', 'CSGO-ssxCh-Y9LFi-B9amu-NWkZo-ObaAB', 'assets/mira.png?v=4',
  1, 1.0000, NULL, 'AWP', 'Config CS2 (fonte: prosettings.net).',
  'https://amzn.to/4qunGMd', 'https://amzn.to/4aFVOj2', 'https://amzn.to/3QTJdSG', 'https://amzn.to/2VDw5B1', 'https://amzn.to/4cg5Gl6'
FROM players p WHERE p.slug = 'fallen'
ON DUPLICATE KEY UPDATE dpi = VALUES(dpi);

INSERT INTO player_settings
(player_id, mouse_id, keyboard_id, mousepad_id, headset_id, monitor_id,
 dpi, sensitivity, edpi, polling_rate, resolution, aspect_ratio, crosshair, crosshair_image,
 raw_input, scoped_sensitivity, zoom_sensitivity, agents, notes,
 product_image_mouse, product_image_keyboard, product_image_mousepad, product_image_monitor, product_image_headset,
 product_link_mouse, product_link_keyboard, product_link_mousepad, product_link_monitor, product_link_headset)
SELECT p.id,
  (SELECT id FROM peripherals WHERE slug = 'logitech-g-pro-x-superlight-2'),
  (SELECT id FROM peripherals WHERE slug = 'atk-rs6-ultra-aspas'),
  (SELECT id FROM peripherals WHERE slug = 'steelseries-qck-large'),
  (SELECT id FROM peripherals WHERE slug = 'razer-blackshark-v3-pro'),
  (SELECT id FROM peripherals WHERE slug = 'zowie-xl2586x'),
  800, 0.4000, 320, 1000, '1920x1080', '16:9', '0;P;h;0;f;0;0l;4;0o;0;0a;1;0f;0;1b;0', 'assets/mira.png?v=4',
  1, 1.0000, NULL, 'Jett', 'Config VALORANT (fonte: prosettings.net).',
  'assets/gpro.jpg', 'assets/atk.webp', 'assets/qcK.jpg', 'assets/zowie.jpg', 'assets/razer.jpg',
  'https://amzn.to/3q86C2l', 'https://amzn.to/4hrl3ac', 'https://amzn.to/4tI6c0l', 'https://amzn.to/4a0nzAd', 'https://amzn.to/419l8Jy'
FROM players p WHERE p.slug = 'aspas'
ON DUPLICATE KEY UPDATE dpi = VALUES(dpi);

INSERT INTO player_settings
(player_id, mouse_id, keyboard_id, mousepad_id, headset_id, monitor_id,
 dpi, sensitivity, edpi, polling_rate, resolution, aspect_ratio, crosshair, crosshair_image,
 raw_input, scoped_sensitivity, zoom_sensitivity, agents, notes,
 product_image_mouse, product_image_keyboard, product_image_mousepad, product_image_monitor, product_image_headset,
 product_link_mouse, product_link_keyboard, product_link_mousepad, product_link_monitor, product_link_headset)
SELECT p.id,
  (SELECT id FROM peripherals WHERE slug = 'wlmouse-beast-x-mini'),
  (SELECT id FROM peripherals WHERE slug = 'wooting-60he-plus'),
  (SELECT id FROM peripherals WHERE slug = 'artisan-ninja-fx-zero-soft'),
  (SELECT id FROM peripherals WHERE slug = 'steelseries-arctis-nova-pro'),
  (SELECT id FROM peripherals WHERE slug = 'zowie-xl2566x-plus'),
  800, 0.2500, 200, NULL, '1920x1080', '16:9',
  '0;s;1;P;c;7;o;0.443;d;1;0t;6;0l;1;0o;0;0a;1;0f;0;1t;6;1l;1;1o;0;1a;1;1m;0;1f;0', 'assets/mira.png?v=4',
  NULL, NULL, NULL, NULL, 'Config VALORANT (fonte: prosettings.net).',
  'assets/wl.jpg', 'assets/wooting.webp', 'assets/artisan.jpg', 'assets/400hz.jpg', 'assets/steel.jpg',
  'https://amzn.to/3TBrhen', 'https://wooting.io/wooting-60he', 'https://amzn.to/2K0cnMG', 'https://amzn.to/4cAR1xz', 'https://amzn.to/3tMDkrP'
FROM players p WHERE p.slug = 'noia'
ON DUPLICATE KEY UPDATE dpi = VALUES(dpi);

INSERT INTO player_settings
(player_id, mouse_id, keyboard_id, mousepad_id, headset_id, monitor_id,
 dpi, sensitivity, edpi, polling_rate, resolution, aspect_ratio, crosshair, crosshair_image,
 raw_input, scoped_sensitivity, zoom_sensitivity, agents, notes,
 product_link_mouse, product_link_keyboard, product_link_mousepad, product_link_monitor, product_link_headset)
SELECT p.id,
  (SELECT id FROM peripherals WHERE slug = 'logitech-g-pro-x-superlight-2'),
  (SELECT id FROM peripherals WHERE slug = 'logitech-g-pro-x-tkl'),
  (SELECT id FROM peripherals WHERE slug = 'logitech-g640'),
  (SELECT id FROM peripherals WHERE slug = 'hyperx-cloud-alpha'),
  (SELECT id FROM peripherals WHERE slug = 'zowie-xl2546'),
  400, 2.1000, 840, 1000, '1024x768', '4:3',
  'Clássico estático; Mira: Sim; Length: 1; Thickness: 0; Gap: -4; Outline: Não; Cor: Verde', 'assets/mira.png?v=4',
  NULL, NULL, 1, NULL, 'Config CS2 (fonte: prosettings.net).',
  'https://amzn.to/3q86C2l', 'https://amzn.to/45VrFYV', 'https://amzn.to/2URoRXu', 'https://amzn.to/2Goc9fW', 'https://amzn.to/2SMq1pR'
FROM players p WHERE p.slug = 'bizinha'
ON DUPLICATE KEY UPDATE dpi = VALUES(dpi);

INSERT INTO player_video_settings (player_id, setting_key, setting_value, sort_order)
SELECT pl.id, v.k, v.v, v.o
FROM players pl
JOIN (
  SELECT 'Resolução' k, '1280x960' v, 1 o UNION ALL
  SELECT 'Proporção', '4:3', 2 UNION ALL
  SELECT 'Modo de escala', 'Stretched', 3 UNION ALL
  SELECT 'Brilho', '93%', 4 UNION ALL
  SELECT 'Modo de exibição', 'Tela cheia em janela', 5 UNION ALL
  SELECT 'Boost Player Contrast', 'Ligado', 6 UNION ALL
  SELECT 'V-Sync', 'Desligado', 7 UNION ALL
  SELECT 'NVIDIA Reflex Low Latency', 'Ligado', 8 UNION ALL
  SELECT 'NVIDIA G-Sync', 'Desligado', 9 UNION ALL
  SELECT 'FPS máximo no jogo', '400', 10 UNION ALL
  SELECT 'Multisampling Anti-Aliasing', 'CMAA2', 11 UNION ALL
  SELECT 'Qualidade de Sombras Global', 'Alta', 12 UNION ALL
  SELECT 'Sombras Dinâmicas', 'Todas', 13 UNION ALL
  SELECT 'Detalhe de Modelo / Textura', 'Baixo', 14 UNION ALL
  SELECT 'Filtragem de Textura', 'Trilinear', 15 UNION ALL
  SELECT 'Detalhe de Shader', 'Baixo', 16 UNION ALL
  SELECT 'Detalhe de Partículas', 'Baixo', 17 UNION ALL
  SELECT 'Oclusão de Ambiente', 'Média', 18 UNION ALL
  SELECT 'High Dynamic Range', 'Qualidade', 19 UNION ALL
  SELECT 'FidelityFX Super Resolution', 'Desligado (Maior Qualidade)', 20 UNION ALL
  SELECT 'Viewmodel FOV', '60', 21 UNION ALL
  SELECT 'Viewmodel Offset X', '1', 22 UNION ALL
  SELECT 'Viewmodel Offset Y', '1', 23 UNION ALL
  SELECT 'Viewmodel Offset Z', '-1', 24 UNION ALL
  SELECT 'Viewmodel Presetpos', '1', 25 UNION ALL
  SELECT 'Bob Lower Amt', '5', 26 UNION ALL
  SELECT 'Bob Amt Lat', '0.4', 27 UNION ALL
  SELECT 'Bob Amt Vert', '0.25', 28 UNION ALL
  SELECT 'Bob Cycle', '0.98', 29 UNION ALL
  SELECT 'Launch Options', '-refresh 360 -w 1280 -h 960 -allow_third_party_software', 30 UNION ALL
  SELECT 'HUD Scale', '1', 31 UNION ALL
  SELECT 'HUD Color', 'Team Color', 32 UNION ALL
  SELECT 'Radar · Centrar jogador', 'Sim', 33 UNION ALL
  SELECT 'Radar · Rotação', 'Sim', 34 UNION ALL
  SELECT 'Radar · Alternar com placar', 'Sim', 35 UNION ALL
  SELECT 'Radar · Tamanho HUD', '1', 36 UNION ALL
  SELECT 'Radar · Zoom do mapa', '0.35', 37 UNION ALL
  SELECT 'Monitor · DyAc', 'Premium', 38 UNION ALL
  SELECT 'Monitor · Black eQualizer', '12', 39 UNION ALL
  SELECT 'Monitor · Color Vibrance', '12', 40 UNION ALL
  SELECT 'Monitor · Low Blue Light', '0', 41 UNION ALL
  SELECT 'Monitor · Picture Mode', 'FPS 2', 42 UNION ALL
  SELECT 'Monitor · Brilho', '100', 43 UNION ALL
  SELECT 'Monitor · Contraste', '50', 44 UNION ALL
  SELECT 'Monitor · Nitidez', '7', 45 UNION ALL
  SELECT 'Monitor · Gamma', '2', 46 UNION ALL
  SELECT 'Monitor · Temperatura de cor', 'Bluish', 47 UNION ALL
  SELECT 'Monitor · AMA', 'Premium', 48
) v ON 1=1
WHERE pl.slug = 'fallen'
ORDER BY v.o;

INSERT INTO player_video_settings (player_id, setting_key, setting_value, sort_order)
SELECT pl.id, v.k, v.v, v.o
FROM players pl
JOIN (
  SELECT 'Resolução' k, '1920x1080' v, 1 o UNION ALL
  SELECT 'Proporção', '16:9', 2 UNION ALL
  SELECT 'Método de proporção', 'Fill', 3 UNION ALL
  SELECT 'Modo de exibição', 'Tela cheia', 4 UNION ALL
  SELECT 'Renderização multithread', 'Ligada', 5 UNION ALL
  SELECT 'Qualidade de material', 'Baixa', 6 UNION ALL
  SELECT 'Qualidade de textura', 'Baixa', 7 UNION ALL
  SELECT 'Qualidade de detalhe', 'Baixa', 8 UNION ALL
  SELECT 'Qualidade de interface', 'Baixa', 9 UNION ALL
  SELECT 'Vignette', 'Desligado', 10 UNION ALL
  SELECT 'VSync', 'Desligado', 11 UNION ALL
  SELECT 'Anti-Aliasing', 'Nenhum', 12 UNION ALL
  SELECT 'Filtragem anisotrópica', '1x', 13 UNION ALL
  SELECT 'Improve Clarity', 'Desligado', 14 UNION ALL
  SELECT 'Experimental Sharpening', 'Desligado', 15 UNION ALL
  SELECT 'Bloom', 'Ligado', 16 UNION ALL
  SELECT 'Distorção', 'Desligado', 17 UNION ALL
  SELECT 'Sombras projetadas', 'Desligado', 18 UNION ALL
  SELECT 'Destaque de inimigo', 'Yellow (Deuteranopia)', 19 UNION ALL
  SELECT 'Monitor · DyAc', 'Premium', 20 UNION ALL
  SELECT 'Monitor · Black eQualizer', '10', 21 UNION ALL
  SELECT 'Monitor · Color Vibrance', '10', 22 UNION ALL
  SELECT 'Monitor · Low Blue Light', '0', 23 UNION ALL
  SELECT 'Monitor · Picture Mode', 'FPS 1', 24 UNION ALL
  SELECT 'Monitor · Brilho', '88', 25 UNION ALL
  SELECT 'Monitor · Contraste', '50', 26 UNION ALL
  SELECT 'Monitor · Nitidez', '7', 27 UNION ALL
  SELECT 'Monitor · Gamma', '3', 28 UNION ALL
  SELECT 'Monitor · Temperatura de cor', 'User Define', 29 UNION ALL
  SELECT 'Monitor · RGB', '89/87/100', 30 UNION ALL
  SELECT 'Monitor · AMA', 'Premium', 31 UNION ALL
  SELECT 'GPU · Digital Vibrance', '50%', 32 UNION ALL
  SELECT 'Teclado · Código do perfil', '78f7950fb2896b5528db0b9c86b632249822', 33
) v ON 1=1
WHERE pl.slug = 'aspas'
ORDER BY v.o;

INSERT INTO player_video_settings (player_id, setting_key, setting_value, sort_order)
SELECT pl.id, v.k, v.v, v.o
FROM players pl
JOIN (
  SELECT 'Resolução' k, '1920x1080' v, 1 o UNION ALL
  SELECT 'Proporção', '16:9', 2 UNION ALL
  SELECT 'Método de proporção', 'Fill', 3 UNION ALL
  SELECT 'Modo de exibição', 'Tela cheia', 4 UNION ALL
  SELECT 'Renderização multithread', 'Ligada', 5 UNION ALL
  SELECT 'Material / textura / detalhe', 'Baixo', 6 UNION ALL
  SELECT 'Qualidade de interface', 'Baixa', 7 UNION ALL
  SELECT 'Vignette', 'Desligado', 8 UNION ALL
  SELECT 'VSync', 'Desligado', 9 UNION ALL
  SELECT 'Anti-Aliasing', 'Nenhum', 10 UNION ALL
  SELECT 'Filtragem anisotrópica', '8x', 11 UNION ALL
  SELECT 'Improve Clarity', 'Desligado', 12 UNION ALL
  SELECT 'Experimental Sharpening', 'Desligado', 13 UNION ALL
  SELECT 'Bloom', 'Desligado', 14 UNION ALL
  SELECT 'Distorção', 'Desligado', 15 UNION ALL
  SELECT 'Sombras projetadas', 'Desligado', 16
) v ON 1=1
WHERE pl.slug = 'noia'
ORDER BY v.o;

INSERT INTO player_video_settings (player_id, setting_key, setting_value, sort_order)
SELECT pl.id, v.k, v.v, v.o
FROM players pl
JOIN (
  SELECT 'Resolução' k, '1024x768' v, 1 o UNION ALL
  SELECT 'Proporção', '4:3', 2 UNION ALL
  SELECT 'Modo de escala', 'Stretched', 3 UNION ALL
  SELECT 'Brilho', '100%', 4 UNION ALL
  SELECT 'Modo de exibição', 'Tela cheia', 5 UNION ALL
  SELECT 'Boost Player Contrast', 'Ligado', 6 UNION ALL
  SELECT 'V-Sync', 'Desligado', 7 UNION ALL
  SELECT 'NVIDIA Reflex Low Latency', 'Desligado', 8 UNION ALL
  SELECT 'NVIDIA G-Sync', 'Desligado', 9 UNION ALL
  SELECT 'FPS máximo no jogo', '0', 10 UNION ALL
  SELECT 'Multisampling Anti-Aliasing', '4x MSAA', 11 UNION ALL
  SELECT 'Qualidade de Sombras Global', 'Alta', 12 UNION ALL
  SELECT 'Sombras Dinâmicas', 'Todas', 13 UNION ALL
  SELECT 'Detalhe de Modelo / Textura', 'Baixo', 14 UNION ALL
  SELECT 'Filtragem de Textura', 'Bilinear', 15 UNION ALL
  SELECT 'Detalhe de Shader', 'Baixo', 16 UNION ALL
  SELECT 'Detalhe de Partículas', 'Baixo', 17 UNION ALL
  SELECT 'Oclusão de Ambiente', 'Desligado', 18 UNION ALL
  SELECT 'High Dynamic Range', 'Qualidade', 19 UNION ALL
  SELECT 'FidelityFX Super Resolution', 'Desligado (Maior Qualidade)', 20 UNION ALL
  SELECT 'Viewmodel FOV', '68', 21 UNION ALL
  SELECT 'Viewmodel Offset X', '1', 22 UNION ALL
  SELECT 'Viewmodel Offset Y', '1', 23 UNION ALL
  SELECT 'Viewmodel Offset Z', '-1', 24 UNION ALL
  SELECT 'Viewmodel Presetpos', '0', 25 UNION ALL
  SELECT 'Launch Options', '-allow_third_party_software -high', 26 UNION ALL
  SELECT 'HUD Scale', '1', 27 UNION ALL
  SELECT 'HUD Color', 'Team Color', 28 UNION ALL
  SELECT 'Radar · Centrar jogador', 'Sim', 29 UNION ALL
  SELECT 'Radar · Rotação', 'Sim', 30 UNION ALL
  SELECT 'Radar · Alternar com placar', 'Sim', 31 UNION ALL
  SELECT 'Radar · Tamanho HUD', '1', 32 UNION ALL
  SELECT 'Radar · Zoom do mapa', '0.4', 33
) v ON 1=1
WHERE pl.slug = 'bizinha'
ORDER BY v.o;

INSERT INTO player_pc_specs (player_id, spec_type, label, link, image, sort_order)
SELECT p.id, 'Processador', 'AMD Ryzen 9 5950X', 'https://amzn.to/3gIajWr', NULL, 1 FROM players p WHERE p.slug = 'fallen';
INSERT INTO player_pc_specs (player_id, spec_type, label, link, image, sort_order)
SELECT p.id, 'Placa de vídeo', 'NVIDIA GeForce RTX 5080', 'https://amzn.to/4h9U4ir', NULL, 2 FROM players p WHERE p.slug = 'fallen';
INSERT INTO player_pc_specs (player_id, spec_type, label, link, image, sort_order)
SELECT p.id, 'Processador', 'Intel Core i7-13700K', 'https://amzn.to/3J6SDEm', 'assets/i7.jpg', 1 FROM players p WHERE p.slug = 'aspas';
INSERT INTO player_pc_specs (player_id, spec_type, label, link, image, sort_order)
SELECT p.id, 'Placa de vídeo', 'NVIDIA GeForce RTX 5080', 'https://amzn.to/4h9U4ir', 'assets/asus.jpg', 2 FROM players p WHERE p.slug = 'aspas';
INSERT INTO player_pc_specs (player_id, spec_type, label, link, image, sort_order)
SELECT p.id, 'Gabinete', 'NZXT H7 Flow', 'https://amzn.to/4cpUm2T', 'assets/gabinete.jpg', 3 FROM players p WHERE p.slug = 'aspas';
INSERT INTO player_pc_specs (player_id, spec_type, label, link, image, sort_order)
SELECT p.id, 'Processador', 'AMD Ryzen 7 7800X3D', 'https://amzn.to/46O4LTp', NULL, 1 FROM players p WHERE p.slug = 'bizinha';
INSERT INTO player_pc_specs (player_id, spec_type, label, link, image, sort_order)
SELECT p.id, 'Placa de vídeo', 'NVIDIA GeForce RTX 5080', 'https://amzn.to/4h9U4ir', NULL, 2 FROM players p WHERE p.slug = 'bizinha';

INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Instagram', 'https://www.instagram.com/fallen/' FROM players p WHERE p.slug = 'fallen';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Tracker', 'https://tracker.gg/cs2/profile/steam/76561197968562033' FROM players p WHERE p.slug = 'fallen';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Instagram', 'https://www.instagram.com/aspaszin/' FROM players p WHERE p.slug = 'aspas';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Twitter', 'https://twitter.com/FalleNCS' FROM players p WHERE p.slug = 'fallen';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Twitch', 'https://www.twitch.tv/gafallen' FROM players p WHERE p.slug = 'fallen';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Steam', 'https://steamcommunity.com/id/fallencs/' FROM players p WHERE p.slug = 'fallen';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Youtube', 'https://www.youtube.com/c/Fallen' FROM players p WHERE p.slug = 'fallen';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Twitter', 'https://x.com/aspaszin' FROM players p WHERE p.slug = 'aspas';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Twitch', 'https://www.twitch.tv/aspaszin' FROM players p WHERE p.slug = 'aspas';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Youtube', 'https://www.youtube.com/channel/UC54ubmq5wHM3fK0ERA856Zg' FROM players p WHERE p.slug = 'aspas';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Twitter', 'https://twitter.com/NoiaFPS' FROM players p WHERE p.slug = 'noia';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Twitch', 'https://www.twitch.tv/NoiaVAL' FROM players p WHERE p.slug = 'noia';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Twitter', 'https://x.com/bizinhafps' FROM players p WHERE p.slug = 'bizinha';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Twitch', 'https://www.twitch.tv/bizinha' FROM players p WHERE p.slug = 'bizinha';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Instagram', 'https://www.instagram.com/bizinhafps' FROM players p WHERE p.slug = 'bizinha';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Steam', 'https://steamcommunity.com/id/bizinha/' FROM players p WHERE p.slug = 'bizinha';
INSERT INTO player_social (player_id, platform, url)
SELECT p.id, 'Youtube', 'https://www.youtube.com/bizinha' FROM players p WHERE p.slug = 'bizinha';

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
VALUES ('demo', 'demo@prosens.gg', '$2y$10$25GzknazIVPcGyikT19iG.m3bWtxT8hBqqM7mHjW7TR7eVZnrL802')
ON DUPLICATE KEY UPDATE username = VALUES(username);

-- ============================================================
-- COMMENTS (exemplos)
-- ============================================================
INSERT INTO comments (player_id, author, message)
SELECT p.id, 'Comunidade', 'Setup de exemplo para teste.'
FROM players p WHERE p.slug='pacheco'
ON DUPLICATE KEY UPDATE message = VALUES(message);
