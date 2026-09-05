// ============================================================
// data.js - Dados estáticos / fallback compartilhado entre as páginas
// Depende de: nada (define defaultPlayers e savedPlayers).
// ============================================================

const defaultPlayers = [{
  id: 'pacheco', name: 'Gustavo Pacheco 🐐', tag: 'TNG', team: 'Teenagers', role: 'Duelista', country: '🇧🇷 Brasil',
  cardImage: 'assets/players/pacheco-card.png',
  photo: 'assets/gustavo-pacheco.jpg', dpi: 800, sensitivity: 0.45, mouse: 'ATK A9 Plus', keyboard: 'Madlions 68 HE', mousepad: 'ATK 99G X Soft', monitor: 'SuperFrame SFP2415 FHD 185Hz',
  crosshair: '0;P;t;1;o;1;d;1;0b;0;0a;1;0f;0;1b;0;1m;0;1f;0', crosshairImage: 'assets/ponto.png?v=1',
  game: 'VALORANT', agents: 'Jett', scopedSensitivity: 1.0,
  // DADOS DE EXEMPLO do card estilo "FIFA" (até a estrutura real vir da API).
  // overall é um valor próprio do jogador (não calculado a partir dos demais).
  attrs: { overall: 93, operator: 91, rifle: 100, pistol: 91, clutch: 85, trashtalk: 0 },
  clips: [{ src: 'assets/4k paisagem.mp4', label: 'Clutch 1v3 — Ascent', orientation: 'landscape' }, { src: 'assets/4k retrato.mp4', label: 'Ace — Split', orientation: 'portrait' }],
  social: { Instagram: 'https://www.instagram.com/gstvpacheco/', Tracker: 'https://tracker.gg/valorant/profile/riot/pacheco%23ofGod/overview?platform=pc&playlist=competitive&season=4f0864e2-40af-28a4-de2c-0e9e64e75f23', VLR: 'https://www.vlr.gg/user/pachecovlr' },
  videoSettings: [['Resolução', '1920x1080'], ['Proporção', '16:9'], ['Método', 'Fill'], ['Modo de exibição', 'Tela cheia'], ['Renderização multithread', 'Ligada'], ['Material / textura / detalhe', 'Baixo'], ['Qualidade da interface', 'Baixa'], ['Vignette / VSync', 'Desligados'], ['Anti-aliasing', 'MSAA 4x'], ['Filtragem anisotrópica', '4x'], ['Improve Clarity / Sharpening', 'Desligados'], ['Bloom', 'Desligado'], ['Distortion / sombras', 'Desligados'], ['Destaque de inimigo', 'Yellow (Deuteranopia)'], ['NVIDIA Reflex', 'On + Boost']],
  pcSpecs: [['Processador', 'AMD Ryzen 5 5600', 'https://www.pichau.com.br/processador-amd-ryzen-5-5600-6-core-12-threads-3-5ghz-4-4ghz-turbo-cache-35mb-am4-100-100000927box', 'assets/rzn.jpg'], ['Placa de vídeo', 'RTX 3060 12GB', 'https://www.foxgamerinfo.com.br/product-page/placa-de-v%C3%ADdeo-geforce-rtx-3060-12gb-gddr6', 'assets/rtx.jpeg']],
  headset: { name: 'MCHOSE V9 Pro', link: 'https://pt.aliexpress.com/item/1005011745761008.html' },
  productImages: { monitor: 'assets/products/superframe-sfp2415.jpg', mouse: 'assets/products/atk-a9-plus.jpg', keyboard: 'assets/products/madlions-68-he.jpg', headset: 'assets/products/mchose-v9-pro.jpg', mousepad: 'assets/products/atk-99g-xsoft.png' },
  links: { mouse: 'https://pt.aliexpress.com/item/1005011812220400.html', keyboard: 'https://pt.aliexpress.com/item/1005008299208938.html', mousepad: 'https://pt.aliexpress.com/item/1005011561185122.html', monitor: 'https://www.terabyteshop.com.br/produto/33583' }
}, {
  id: 'z4gb', name: 'Gabriel Felipi', tag: 'Z4GB#TOP1', team: 'Free Agent', role: 'Duelista', country: '🇧🇷 Brasil',
  cardImage: 'assets/players/gabriel final card.jpeg',
  photo: 'assets/gab.jpg', dpi: 1600, sensitivity: 0.14, mouse: 'Ajazz AJ179 Pro', keyboard: 'Redragon Kumara', mousepad: 'Mouse Pad Gamer Extended CM02 900x400', monitor: 'Duex DX270QGP165', game: 'VALORANT',
  crosshair: '0;P;c;1;u;FFFFFFFF;t;1;o;1;d;1;b;0;z;2;0b;0;0l;6;1b;0;1e;0.99', crosshairImage: 'assets/pontoverde.png?v=1',
  headset: { name: 'Fone Fortrek', link: '' },
  productImages: { mouse: 'assets/products/gabriel-ajazz-aj179-pro.png', keyboard: 'assets/teclado.webp', headset: 'assets/fone.jpg', mousepad: 'assets/products/gabriel-mousepad-cm02.jpg', monitor: 'assets/products/gabriel-duex-dx270qgp165.jpg' },
  social: { Instagram: 'https://www.instagram.com/zzgb._/', VLR: 'https://www.vlr.gg/user/Z4GB', Tracker: 'https://tracker.gg/valorant/profile/riot/Z4GB%23TOP1/overview?platform=pc&playlist=competitive&season=4f0864e2-40af-28a4-de2c-0e9e64e75f23' },
  videoSettings: [['Resolução', '1920x1080'], ['Proporção', '16:9'], ['Método', 'Fill'], ['Modo de exibição', 'Tela cheia'], ['Renderização multithread', 'Ligada'], ['Material / textura / detalhe', 'Baixo'], ['Qualidade da UI', 'Alta'], ['Vignette / VSync', 'Desligados'], ['Anti-aliasing', 'MSAA 4x'], ['Filtragem anisotrópica', '8x'], ['Improve Clarity / Sharpening', 'Desligados'], ['Bloom', 'Ligado'], ['Distortion / sombras', 'Desligados'], ['Destaque de inimigo', 'Yellow (Deuteranopia)'], ['NVIDIA Reflex', 'On + Boost']],
  pcSpecs: [['Processador', 'Intel Core i3-12100F', 'https://www.kabum.com.br/produto/283719', 'assets/products/gabriel-i3-12100f.jpg'], ['Placa de vídeo', 'AMD Radeon RX 580 8GB', 'https://www.kabum.com.br/produto/464478', 'assets/products/gabriel-rx-580-8gb.jpg']],
  links: { mouse: 'https://pt.aliexpress.com/item/1005007791313445.html', keyboard: 'https://www.pichau.com.br/teclado-gaming-redragon-kumara-mecanico-rgb-switch-brown-k552rgb-1', mousepad: '', monitor: 'https://www.terabyteshop.com.br/produto/30480' }
}, {
  id: 'tardus', name: 'Guilherme Costa', tag: 'Tardus#DARK', team: 'Free Agent', role: 'Sentinela', country: '🇧🇷 Brasil',
  cardImage: 'assets/players/Costa final card.png',
  photo: 'assets/tardus.jpeg', dpi: 1600, sensitivity: 0.32, mouse: 'Logitech G403 Hero', keyboard: 'Ajazz AK820', mousepad: 'Unknown', monitor: 'Duex DX270QGP165', game: 'VALORANT',
  crosshair: '0;P;c;1;0t;1;0l;2;0v;2;0o;2;0a;1;0f;0;1b;0', crosshairImage: 'assets/costaim.png?v=1',
  social: { Instagram: 'https://www.instagram.com/costa22_hand/' },
  headset: { name: 'TRUTHEAR x Crinacle ZERO In-ear Monitor', link: 'https://truthear.com/products/zero' },
  videoSettings: [['Resolução', '1920x1080'], ['Proporção', '16:9'], ['Método', 'Fill'], ['Modo de exibição', 'Tela cheia'], ['Renderização multithread', 'Ligada'], ['Material / textura / detalhe', 'Baixo'], ['Qualidade da interface', 'Baixa'], ['Vignette / VSync', 'Desligados'], ['Anti-aliasing', 'MSAA 4x'], ['Filtragem anisotrópica', '4x'], ['Improve Clarity / Sharpening', 'Desligados'], ['Bloom', 'Desligado'], ['Distortion / sombras', 'Desligados'], ['Destaque de inimigo', 'Yellow (Deuteranopia)'], ['NVIDIA Reflex', 'On + Boost']],
  productImages: { mouse: 'assets/products/tardus-logitech-g403-hero.jpg', keyboard: 'assets/products/tardus-ajazz-ak820.png', headset: 'assets/TRUTHEAR.jpg', monitor: 'assets/products/tardus-duex-dx270qgp165.jpg' },
  pcSpecs: [['Processador', 'AMD Ryzen 5 5600G', 'https://www.mercadolivre.com.br/processador-amd-ryzen5-5600g-com-video-6-nucleos-12-fios-39ghz-am4-ryzen-5/p/MLB18424403', 'assets/ryzeng.webp'], ['Placa de vídeo', 'RTX 3060 8GB', 'https://www.kabum.com.br/produto/543498/placa-de-video-rtx-3060-gigabyte-gaming-oc-8gb-gddr6-128bits', 'assets/rtx.webp']],
  links: { mouse: 'https://www.kabum.com.br/produto/102649', keyboard: 'https://pt.aliexpress.com/item/1005007805708183.html', mousepad: '', monitor: 'https://www.setupninja.com.br/' }
}, {
  id: 'danilo-andrade', name: 'Danilo Andrade', tag: 'Danilo Andrade', team: 'Free Agent', role: 'Iniciador', country: '🇧🇷 Brasil',
  photo: 'assets/danilo-andrade.jpg', dpi: 1600, sensitivity: 0.10, mouse: 'Delux M800 Pro PAW 3395', keyboard: 'Redragon Daksa K576R-1', mousepad: 'Desconhecido', monitor: 'LG UltraGear 27GS60F-B 27" 180Hz', game: 'VALORANT',
  crosshair: '0;P;o;1;d;1;z;1;m;1;0t;1;0l;1;0o;0;0e;0.224;1b;0', crosshairImage: 'assets/pontogordo.png?v=1',
  social: { Instagram: 'https://www.instagram.com/dannzx_01/' },
  videoSettings: [['Resolução', '1280x960'], ['Proporção', '4:3'], ['Método', 'Fill'], ['Modo de exibição', 'Tela cheia'], ['Renderização multithread', 'Ligada'], ['Material / textura / detalhe', 'Baixo'], ['Qualidade da UI', 'Baixa'], ['Vignette / VSync', 'Desligados'], ['Anti-aliasing', 'Nenhum'], ['Filtragem anisotrópica', '1x'], ['Improve Clarity / Sharpening', 'Desligados'], ['Bloom', 'Ligado'], ['Distortion / sombras', 'Desligados'], ['Destaque de inimigo', 'Yellow (Deuteranopia)'], ['NVIDIA Reflex', 'On + Boost']],
  headset: { name: 'Havit H2002D', link: 'https://www.amazon.com.br/Headphone-Ouvido-HV-H2002d-Microfone-Falante/dp/B07Y2G7VX5' },
  productImages: { mouse: 'assets/products/danilo-delux-m800-pro.jpg', keyboard: 'assets/products/danilo-redragon-daksa.jpg', headset: 'assets/havit.webp', monitor: 'assets/products/danilo-lg-27gs60f-b.jpg' },
  links: { mouse: 'https://www.mercadolivre.com.br/', keyboard: 'https://www.kabum.com.br/produto/202254', mousepad: '', monitor: 'https://www.kabum.com.br/produto/620992' },
  pcSpecs: [['Processador', 'AMD Ryzen 7 5700X', 'https://www.pichau.com.br/processador-amd-ryzen-7-5700x-8-core-16-threads-3-4ghz-4-6ghz-turbo-cache-36mb-am4-100-100000926wof', 'assets/ryzen7.jpg'], ['Placa de vídeo', 'RTX 3060 12GB', 'https://www.foxgamerinfo.com.br/product-page/placa-de-v%C3%ADdeo-geforce-rtx-3060-12gb-gddr6', 'assets/rtx.jpeg']]
}, {
  id: 'igor-gomes', name: 'Igor Gomes', tag: 'Igor Gomes', team: 'Free Agent', role: 'Player de CS', country: '🇧🇷 Brasil',
  photo: 'assets/igao.jpeg', dpi: 400, sensitivity: 4.0, mouse: 'Attack Shark X11', keyboard: 'Redragon Kumara', mousepad: 'Mousepad Genérico', monitor: 'LG UltraGear 27GS60F-B 27" 180Hz', game: 'Counter-Strike 2',
  crosshair: 'CSGO-JaaMN-QODox-vueWF-sdtLn-PU9vO', crosshairImage: 'assets/pontocs22.png?v=1',
  headset: { name: 'Mintak Pro Wireless', link: 'https://titorion.com.br/product/headset-gamer-mintak-pro-wireless-2-4ghz-preto-1' },
  social: { Instagram: 'https://www.instagram.com/oggomes___/' },
  videoSettings: [['Resolução', '1920x1080'], ['Proporção', '16:9'], ['Modo de exibição', 'Tela cheia'], ['Renderização multithread', 'Ligada'], ['Qualidade', 'Baixa'], ['Multisampling Anti-Aliasing', 'Nenhum'], ['Filtro textures', 'Bilinear'], ['Shaders', 'Baixo'], ['Sombras', 'Desligadas'], ['Detalhes do modelo', 'Baixo'], ['Destaque de inimigo', 'Yellow (Deuteranopia)']],
  productImages: { mouse: 'assets/attack.jpg', keyboard: 'assets/kumara.webp', headset: 'assets/mintak.webp', mousepad: 'assets/pad.webp', monitor: 'assets/products/igor-lg-27gs60f-b.jpg' },
  pcSpecs: [['Processador', 'AMD Ryzen 5 5600G (vídeo integrado)', 'https://www.mercadolivre.com.br/processador-amd-ryzen5-5600g-com-video-6-nucleos-12-fios-39ghz-am4-ryzen-5/p/MLB18424403#polycard_client=search-desktop&float_highlight=last_units&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=5&type=product&tracking_id=06f9e4ad-5d8d-43cb-ba03-5155137f32bb&wid=MLB3468315723&sid=search', 'assets/ryzeng.webp']],
  links: { mouse: 'https://attackshark.net.br/products/attack-shark-x11-wireless-gaming-mouse-charging-dock', keyboard: 'https://www.kabum.com.br/produto/93159/teclado-mecanico-gamer-redragon-kumara-anti-ghosting-rgb-switch-outemu-red-abnt2-preto-pt-k552rgb-1-pt-red', mousepad: 'https://www.magazineluiza.com.br/mousepad-preto-16x21-generico/p/ff5caef714/in/mspd/', monitor: 'https://www.kabum.com.br/produto/620992' }
}, {
  id: 'thomaz', name: 'Thomas', tag: 'Thomaz', team: 'Free Agent', role: 'Não informado', country: '🇧🇷 Brasil',
  cardImage: 'assets/players/thomas-card.png',
  photo: 'assets/thoamspfp.jpeg', dpi: 1600, sensitivity: 0.6, mouse: 'Redragon Nothosaur M606', keyboard: 'Redragon Dyaus 2', mousepad: 'Não informado', monitor: 'Não informado',
  crosshair: 'Padrão R6 — Ponto simples', crosshairImage: 'assets/reticula.png?v=1', game: 'Rainbow Six',
  social: { Instagram: 'https://www.instagram.com/thomas__evangelista' },
  videoSettings: [['Qualidade de Textura', 'Baixa'], ['Filtragem de Textura', 'Linear'], ['Qualidade de LOD', 'Alta'], ['Qualidade de Sombras', 'Média'], ['Reflexos, Oclusão de Ambiente e Efeitos de Lente', 'Desligados'], ['Campo de Visão (FOV)', '90'], ['Anti-Aliasing', 'Desligado'], ['Entrada de dados bruta', 'Ativado']],
  pcSpecs: [['Processador', 'AMD Ryzen 5 Pro 3600G', 'https://www.kabum.com.br/produto/688260/processador-amd-ryzen-5-pro-3600g-3-6ghz-4-2ghz-max-turbo-am4-oem', 'assets/3600.webp']],
  productImages: { mouse: 'assets/notho.webp', keyboard: 'assets/dyau.jpg' },
  links: { mouse: 'https://www.redragon.store/mouse-gamer-redragon-nothosaur-m606-3200-dp', keyboard: 'https://www.pichau.com.br/teclado-gamer-redragon-dyaus2-rgb-k509rgb-pt', mousepad: '', monitor: '' }
}, {
  id: 'mgk', name: 'Miguel Marlon', tag: 'ferreirinhachb#3717', team: 'Free Agent', role: 'Iniciador', country: '🇧🇷 Brasil',
  photo: 'assets/mgk.jpg', dpi: 800, sensitivity: 0.4, mouse: 'ATK A9 Plus', keyboard: 'Machenike K500 Branco', mousepad: 'PK Control 1', monitor: 'Samsung Essential 3', game: 'VALORANT',
  agents: 'Gekko, Deadlock',
  crosshair: 'Não informado', crosshairImage: 'assets/mira.png?v=4',
  social: { Instagram: 'https://www.instagram.com/sftu.mgk__/' },
  headset: { name: 'QKZ In-ear', link: 'https://www.mercadolivre.com.br/fone-de-ouvido-gamer-dj-musicos-retorno-palco-inear-ccase-cor-preto/p/MLB57335841#polycard_client=search-desktop&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=7&type=product&tracking_id=eeb7bae5-3c19-4de6-bac1-8f73d0129e99&wid=MLB5755630628&sid=search' },
  videoSettings: [['Resolução', '1280x960'], ['Proporção', '4:3'], ['Método', 'Fill'], ['Modo de exibição', 'Tela cheia'], ['Renderização multithread', 'Ligada'], ['Material / textura / detalhe', 'Baixo'], ['Qualidade da UI', 'Baixa'], ['Vignette / VSync', 'Desligados'], ['Anti-aliasing', 'Nenhum'], ['Filtragem anisotrópica', '1x'], ['Improve Clarity / Sharpening', 'Desligados'], ['Bloom', 'Desligado'], ['Distortion / sombras', 'Desligados'], ['Destaque de inimigo', 'Yellow (Deuteranopia)'], ['NVIDIA Reflex', 'Ativado']],
  pcSpecs: [['Processador', 'AMD Ryzen 5 5600GT (vídeo integrado)', 'https://www.pichau.com.br/processador-amd-ryzen-5-5600gt-6-core-12-threads-3-6ghz-4-6ghz-turbo-cache-19mb-am4-100-100001488box', 'assets/ryzengt.jpg']],
  productImages: { mouse: 'assets/products/atk-a9-plus.jpg', keyboard: 'assets/products/teclado.webp', mousepad: 'assets/products/mousepad.webp', headset: 'assets/qkz.webp', monitor: 'assets/products/monitor.webp' },
  links: { mouse: 'https://www.amazon.com/ATK-Dragonfly-A9-Lightweight-Adjustable/dp/B0FNC9H56K?th=1', keyboard: 'https://global.machenike.com/pt-br/products/k500', mousepad: 'https://www.amazon.com.br/Mouse-pad-pk-control-1/dp/B0DFW1CWPX', monitor: 'https://www.shop.samsung.com.br/monitor-samsung-essential-s3-32-polegadas/p' }
}, {
  id: 'fallen', name: 'Gabriel Toledo', tag: 'FalleN', team: 'FURIA', role: 'IGL / AWP', country: '🇧🇷 Brasil',
  isPro: true,
  photo: 'assets/fallen.jpg', dpi: 400, sensitivity: 2.0, mouse: 'Fallen Gear Lobo Wireless', keyboard: 'Fallen Gear Pink Keyboard (HE)', mousepad: 'Fallen Gear Invoker', monitor: 'ZOWIE XL2546K 240Hz', game: 'Counter-Strike 2',
  crosshair: 'CSGO-ssxCh-Y9LFi-B9amu-NWkZo-ObaAB', crosshairImage: 'assets/\+.png',
  social: { Instagram: 'https://www.instagram.com/fallen/', Tracker: 'https://tracker.gg/cs2/profile/steam/76561197968562033', Twitter: 'https://twitter.com/FalleNCS', Twitch: 'https://www.twitch.tv/gafallen', Steam: 'https://steamcommunity.com/id/fallencs/', Youtube: 'https://www.youtube.com/c/Fallen' },
  headset: { name: 'Fallen Gear Morcego Pro Wireless', link: 'https://amzn.to/4cg5Gl6' },
  videoSettings: [['Resolução', '1280x960'], ['Proporção', '4:3'], ['Modo de escala', 'Stretched'], ['Brilho', '93%'], ['Modo de exibição', 'Tela cheia em janela'], ['Boost Player Contrast', 'Ligado'], ['V-Sync', 'Desligado'], ['NVIDIA Reflex Low Latency', 'Ligado'], ['NVIDIA G-Sync', 'Desligado'], ['FPS máximo no jogo', '400'], ['Multisampling Anti-Aliasing', 'CMAA2'], ['Qualidade de Sombras Global', 'Alta'], ['Sombras Dinâmicas', 'Todas'], ['Detalhe de Modelo / Textura', 'Baixo'], ['Filtragem de Textura', 'Trilinear'], ['Detalhe de Shader', 'Baixo'], ['Detalhe de Partículas', 'Baixo'], ['Oclusão de Ambiente', 'Média'], ['High Dynamic Range', 'Qualidade'], ['FidelityFX Super Resolution', 'Desligado (Maior Qualidade)'], ['Viewmodel FOV', '60'], ['Viewmodel Offset X', '1'], ['Viewmodel Offset Y', '1'], ['Viewmodel Offset Z', '-1'], ['Viewmodel Presetpos', '1'], ['Bob Lower Amt', '5'], ['Bob Amt Lat', '0.4'], ['Bob Amt Vert', '0.25'], ['Bob Cycle', '0.98'], ['Launch Options', '-refresh 360 -w 1280 -h 960 -allow_third_party_software'], ['HUD Scale', '1'], ['HUD Color', 'Team Color'], ['Radar · Centrar jogador', 'Sim'], ['Radar · Rotação', 'Sim'], ['Radar · Alternar com placar', 'Sim'], ['Radar · Tamanho HUD', '1'], ['Radar · Zoom do mapa', '0.35'], ['Monitor · DyAc', 'Premium'], ['Monitor · Black eQualizer', '12'], ['Monitor · Color Vibrance', '12'], ['Monitor · Low Blue Light', '0'], ['Monitor · Picture Mode', 'FPS 2'], ['Monitor · Brilho', '100'], ['Monitor · Contraste', '50'], ['Monitor · Nitidez', '7'], ['Monitor · Gamma', '2'], ['Monitor · Temperatura de cor', 'Bluish'], ['Monitor · AMA', 'Premium']],
  productImages: { mouse: 'assets/lobo.webp', keyboard: 'assets/kb.jpg', mousepad: 'assets/dota.webp', monitor: 'assets/benq.jpg', headset: 'assets/morcego.webp' },
  pcSpecs: [['Processador', 'AMD Ryzen 9 5950X', 'https://amzn.to/3gIajWr', 'assets/amd.jpg'], ['Placa de vídeo', 'NVIDIA GeForce RTX 5080', 'https://amzn.to/4h9U4ir', 'assets/asus.jpg']],
  links: { mouse: 'https://amzn.to/4qunGMd', keyboard: 'https://amzn.to/4aFVOj2', mousepad: 'https://amzn.to/3QTJdSG', monitor: 'https://amzn.to/2VDw5B1' }
}, {
  id: 'aspas', name: 'Erick Santos', tag: 'aspas', team: 'MIBR', role: 'Duelista', country: '🇧🇷 Brasil', agents: 'Jett',
  isPro: true,
  cardImage: 'assets/arpa.png',
  photo: 'assets/aspas.jpg', dpi: 800, sensitivity: 0.4, mouse: 'Logitech G Pro X Superlight 2', keyboard: 'ATK RS6 Ultra Aspas Edition', mousepad: 'SteelSeries QcK Large', monitor: 'ZOWIE XL2586X 540Hz', game: 'VALORANT',
  crosshair: '0;P;h;0;0l;4;0o;0;0a;1;0f;0;1b;0', crosshairImage: 'assets/++.png',
  social: { Instagram: 'https://www.instagram.com/aspaszin/', Twitter: 'https://x.com/aspaszin', Twitch: 'https://www.twitch.tv/aspaszin', Youtube: 'https://www.youtube.com/channel/UC54ubmq5wHM3fK0ERA856Zg' },
  headset: { name: 'Razer BlackShark V3 Pro', link: 'https://amzn.to/419l8Jy' },
  productImages: { mouse: 'assets/gpro.jpg', keyboard: 'assets/atk.webp', mousepad: 'assets/qcK.jpg', monitor: 'assets/zowie.jpg', headset: 'assets/razer.jpg' },
  videoSettings: [['Resolução', '1920x1080'], ['Proporção', '16:9'], ['Método de proporção', 'Fill'], ['Modo de exibição', 'Tela cheia'], ['Renderização multithread', 'Ligada'], ['Qualidade de material', 'Baixa'], ['Qualidade de textura', 'Baixa'], ['Qualidade de detalhe', 'Baixa'], ['Qualidade de interface', 'Baixa'], ['Vignette', 'Desligado'], ['VSync', 'Desligado'], ['Anti-Aliasing', 'Nenhum'], ['Filtragem anisotrópica', '1x'], ['Improve Clarity', 'Desligado'], ['Experimental Sharpening', 'Desligado'], ['Bloom', 'Ligado'], ['Distorção', 'Desligado'], ['Sombras projetadas', 'Desligado'], ['Destaque de inimigo', 'Yellow (Deuteranopia)'], ['Monitor · DyAc', 'Premium'], ['Monitor · Black eQualizer', '10'], ['Monitor · Color Vibrance', '10'], ['Monitor · Low Blue Light', '0'], ['Monitor · Picture Mode', 'FPS 1'], ['Monitor · Brilho', '88'], ['Monitor · Contraste', '50'], ['Monitor · Nitidez', '7'], ['Monitor · Gamma', '3'], ['Monitor · Temperatura de cor', 'User Define'], ['Monitor · RGB', '89/87/100'], ['Monitor · AMA', 'Premium'], ['GPU · Digital Vibrance', '50%'], ['Teclado · Código do perfil', '78f7950fb2896b5528db0b9c86b632249822']],
  pcSpecs: [['Processador', 'Intel Core i7-13700K', 'https://amzn.to/3J6SDEm', 'assets/i7.jpg'], ['Placa de vídeo', 'NVIDIA GeForce RTX 5080', 'https://amzn.to/4h9U4ir', 'assets/asus.jpg'], ['Gabinete', 'NZXT H7 Flow', 'https://amzn.to/4cpUm2T', 'assets/gabinete.jpg']],
  links: { mouse: 'https://amzn.to/3q86C2l', keyboard: 'https://amzn.to/4hrl3ac', mousepad: 'https://amzn.to/4tI6c0l', monitor: 'https://amzn.to/4a0nzAd' }
}, {
  id: 'noia', name: 'Nicole Tierce', tag: 'noia', team: 'Shopify Rebellion Gold', role: 'Não informado', country: '🇩🇰 Dinamarca',
  isPro: true,
  photo: 'assets/noia.jpg', dpi: 800, sensitivity: 0.25, mouse: 'WLMouse BEAST X Mini', keyboard: 'Wooting 60HE+', mousepad: 'Artisan Ninja FX Zero Soft', monitor: 'ZOWIE XL2566X+ 400Hz', game: 'VALORANT',
  crosshair: '0;P;c;7;o;1;d;1;a;0.943;0b;0;1b;0', crosshairImage: 'assets/download.png',
  social: { Twitter: 'https://twitter.com/NoiaFPS', Twitch: 'https://www.twitch.tv/NoiaVAL' },
  headset: { name: 'SteelSeries Arctis Nova Pro', link: 'https://amzn.to/3tMDkrP' },
  productImages: { mouse: 'assets/wl.jpg', keyboard: 'assets/wooting.webp', mousepad: 'assets/artisan.jpg', monitor: 'assets/400hz.jpg', headset: 'assets/steel.jpg' },
  videoSettings: [['Resolução', '1920x1080'], ['Proporção', '16:9'], ['Método de proporção', 'Fill'], ['Modo de exibição', 'Tela cheia'], ['Renderização multithread', 'Ligada'], ['Material / textura / detalhe', 'Baixo'], ['Qualidade de interface', 'Baixa'], ['Vignette', 'Desligado'], ['VSync', 'Desligado'], ['Anti-Aliasing', 'Nenhum'], ['Filtragem anisotrópica', '8x'], ['Improve Clarity', 'Desligado'], ['Experimental Sharpening', 'Desligado'], ['Bloom', 'Desligado'], ['Distorção', 'Desligado'], ['Sombras projetadas', 'Desligado']],
  pcSpecs: [],
  links: { mouse: 'https://amzn.to/3TBrhen', keyboard: 'https://wooting.io/wooting-60he', mousepad: 'https://amzn.to/2K0cnMG', monitor: 'https://amzn.to/4cAR1xz' }
}, {
  id: 'bizinha', name: 'Bruna Marvila', tag: 'bizinha', team: 'FURIA Fe', role: 'Rifler', country: '🇧🇷 Brasil',
  isPro: true,
  photo: 'assets/bruna.jpg', dpi: 400, sensitivity: 2.1, mouse: 'Logitech G Pro X Superlight 2', keyboard: 'Logitech G Pro X TKL', mousepad: 'Logitech G640', monitor: 'ZOWIE XL2546 240Hz', game: 'Counter-Strike 2',
  crosshair: 'CSGO-WQhyz-JcvVK-Y9ptw-H56mk-37QmH', crosshairImage: 'assets/nuke.png',
  social: { Twitter: 'https://x.com/bizinhafps', Twitch: 'https://www.twitch.tv/bizinha', Instagram: 'https://www.instagram.com/bizinhafps', Steam: 'https://steamcommunity.com/id/bizinha/', Youtube: 'https://www.youtube.com/bizinha' },
  headset: { name: 'HyperX Cloud Alpha', link: 'https://amzn.to/2SMq1pR' },
  productImages: { mouse: 'assets/log.webp', keyboard: 'assets/kbm.jpg', mousepad: 'assets/gpad.jpg', monitor: 'assets/zow.jpg', headset: 'assets/hpx.jpg' },
  links: { mouse: 'https://amzn.to/3q86C2l', keyboard: 'https://amzn.to/45VrFYV', mousepad: 'https://amzn.to/2URoRXu', monitor: 'https://amzn.to/2Goc9fW' },
  videoSettings: [['Resolução', '1024x768'], ['Proporção', '4:3'], ['Modo de escala', 'Stretched'], ['Brilho', '100%'], ['Modo de exibição', 'Tela cheia'], ['Boost Player Contrast', 'Ligado'], ['V-Sync', 'Desligado'], ['NVIDIA Reflex Low Latency', 'Desligado'], ['NVIDIA G-Sync', 'Desligado'], ['FPS máximo no jogo', '0'], ['Multisampling Anti-Aliasing', '4x MSAA'], ['Qualidade de Sombras Global', 'Alta'], ['Sombras Dinâmicas', 'Todas'], ['Detalhe de Modelo / Textura', 'Baixo'], ['Filtragem de Textura', 'Bilinear'], ['Detalhe de Shader', 'Baixo'], ['Detalhe de Partículas', 'Baixo'], ['Oclusão de Ambiente', 'Desligado'], ['High Dynamic Range', 'Qualidade'], ['FidelityFX Super Resolution', 'Desligado (Maior Qualidade)'], ['Viewmodel FOV', '68'], ['Viewmodel Offset X', '1'], ['Viewmodel Offset Y', '1'], ['Viewmodel Offset Z', '-1'], ['Viewmodel Presetpos', '0'], ['Launch Options', '-allow_third_party_software -high'], ['HUD Scale', '1'], ['HUD Color', 'Team Color'], ['Radar · Centrar jogador', 'Sim'], ['Radar · Rotação', 'Sim'], ['Radar · Alternar com placar', 'Sim'], ['Radar · Tamanho HUD', '1'], ['Radar · Zoom do mapa', '0.4']],
  pcSpecs: [['Processador', 'AMD Ryzen 7 7800X3D', 'https://amzn.to/46O4LTp', 'assets/ryzen7x3d.jpg'], ['Placa de vídeo', 'NVIDIA GeForce RTX 5080', 'https://amzn.to/4h9U4ir', 'assets/gforce.jpg']],
  links: { mouse: 'https://amzn.to/3q86C2l', keyboard: 'https://amzn.to/45VrFYV', mousepad: 'https://amzn.to/2URoRXu', monitor: 'https://amzn.to/2Goc9fW' }
}];

defaultPlayers.find(player => player.id === 'z4gb').links.mousepad = 'https://www.mercadolivre.com.br/mouse-pad-gamer-extended-cm02-900x400';

// ============================================================
// valLineups - Lineups de VALORANT (agrupadas por mapa).
// Cada item: { agent, side ('attack'|'defense'), color, src, label }
// ============================================================
const valLineups = [
  { map: 'Abyss', id: 'Abyss', items: [
      { agent: 'Deadlock', side: '', color: 'orange', src: 'assets/lineups/val/Abyss/Deadlock - Deadlock Abyss - wall for b main (from backsite).mp4', label: 'wall for b main (from backsite)' },
      { agent: 'KAY/O', side: '', color: 'orange', src: 'assets/lineups/val/Abyss/KAY_O - KAY_O Abyss - mollies for default and bridge (from spawn).mp4', label: 'mollies for default and bridge (from spawn)' },
      { agent: 'Vyse', side: '', color: 'yellow', src: 'assets/lineups/val/Abyss/Vyse - Vyse Abyss - slow for backsite a.mp4', label: 'slow for backsite a' }
    ] },
  { map: 'Ascent', id: 'Ascent', items: [
      { agent: 'Fade', side: 'attack', color: 'orange', src: 'assets/lineups/val/Ascent/attack/Fade - eye for a.mp4', label: 'eye for a' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Ascent/defense/Fade - eye for a lobby (from spawn barrier).mp4', label: 'eye for a lobby (from spawn barrier)' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Ascent/defense/Fade - eye for a lobby (from tree).mp4', label: 'eye for a lobby (from tree)' },
      { agent: 'Fade', side: 'defense', color: 'yellow', src: 'assets/lineups/val/Ascent/defense/Fade - retake eye for a.mp4', label: 'retake eye for a' },
      { agent: 'Chamber', side: '', color: 'yellow', src: 'assets/lineups/val/Ascent/Chamber - Chamber Ascent - one-two setup for tiles.mp4', label: 'one-two setup for tiles' },
      { agent: 'KAY/O', side: '', color: 'orange', src: 'assets/lineups/val/Ascent/KAY_O - KAY_O Ascent - weird flash for tree.mp4', label: 'weird flash for tree' }
    ] },
  { map: 'Bind', id: 'Bind', items: [
      { agent: 'Brimstone', side: '', color: 'purple', src: 'assets/lineups/val/Bind/Brimstone - fast molly for a default (from short).mp4', label: 'fast molly for a default (from short)' },
      { agent: 'Brimstone', side: '', color: 'orange', src: 'assets/lineups/val/Bind/Brimstone - fast molly for b default (from hookah).mp4', label: 'fast molly for b default (from hookah)' },
      { agent: 'Brimstone', side: '', color: 'black', src: 'assets/lineups/val/Bind/Brimstone - molly for b default (from long).mp4', label: 'molly for b default (from long)' },
      { agent: 'Gekko', side: '', color: 'orange', src: 'assets/lineups/val/Bind/Gekko - Gekko Bind - anti-plant molly for b (from elbow).mp4', label: 'anti-plant molly for b (from elbow)' },
      { agent: 'Viper', side: '', color: '', src: 'assets/lineups/val/Bind/Viper - captura 1.mp4', label: 'Captura de lineup' },
      { agent: 'Viper', side: '', color: '', src: 'assets/lineups/val/Bind/Viper - captura 2.mp4', label: 'Captura de lineup' },
      { agent: 'Viper', side: '', color: '', src: 'assets/lineups/val/Bind/Viper - captura 3.mp4', label: 'Captura de lineup' }
    ] },
  { map: 'Haven', id: 'Haven', items: [
      { agent: 'Viper', side: '', color: 'orange', src: 'assets/lineups/val/Haven/Viper - Viper Haven - multiuse wall for b + garage + c.mp4', label: 'multiuse wall for b + garage + c' },
      { agent: 'Sova', side: 'attack', color: 'black', src: 'assets/lineups/val/Haven/attack/Sova - dart for a (from long).mp4', label: 'dart for a (from long)' },
      { agent: 'Sova', side: 'attack', color: 'black', src: 'assets/lineups/val/Haven/attack/Sova - dart for a main (from lobby).mp4', label: 'dart for a main (from lobby)' },
      { agent: 'Sova', side: 'attack', color: 'black', src: 'assets/lineups/val/Haven/attack/Sova - dart for a short (from spawn).mp4', label: 'dart for a short (from spawn)' },
      { agent: 'Sova', side: 'attack', color: 'orange', src: 'assets/lineups/val/Haven/attack/Sova - dart for c (from main).mp4', label: 'dart for c (from main)' },
      { agent: 'Sova', side: 'attack', color: 'black', src: 'assets/lineups/val/Haven/attack/Sova - fast dart for a short (from spawn barrier).mp4', label: 'fast dart for a short (from spawn barrier)' },
      { agent: 'Sova', side: 'attack', color: 'yellow', src: 'assets/lineups/val/Haven/attack/Sova - shock for c default (from main).mp4', label: 'shock for c default (from main)' },
      { agent: 'Sova', side: 'attack', color: 'yellow', src: 'assets/lineups/val/Haven/attack/Sova - shock for optimal c plant (from main).mp4', label: 'shock for optimal c plant (from main)' },
      { agent: 'Sova', side: 'defense', color: 'orange', src: 'assets/lineups/val/Haven/defense/Sova - dart for a lobby (from heaven).mp4', label: 'dart for a lobby (from heaven)' },
      { agent: 'Sova', side: 'defense', color: 'orange', src: 'assets/lineups/val/Haven/defense/Sova - dart for mid window (from b).mp4', label: 'dart for mid window (from b)' },
      { agent: 'Sova', side: 'defense', color: 'black', src: 'assets/lineups/val/Haven/defense/Sova - fast dart for a lobby (from main).mp4', label: 'fast dart for a lobby (from main)' },
      { agent: 'Sova', side: 'defense', color: 'orange', src: 'assets/lineups/val/Haven/defense/Sova - fast dart for b (from backsite a).mp4', label: 'fast dart for b (from backsite a)' }
    ] },
  { map: 'Icebox', id: 'Icebox', items: [
      { agent: 'Gekko', side: '', color: 'orange', src: 'assets/lineups/val/Icebox/Gekko - Gekko Icebox - molly for pipes (from spawn barrier).mp4', label: 'molly for pipes (from spawn barrier)' },
      { agent: 'Killjoy', side: '', color: 'orange', src: 'assets/lineups/val/Icebox/Killjoy - Killjoy Icebox - molly for pipes (from the boxes behind belt).mp4', label: 'molly for pipes (from the boxes behind belt)' },
      { agent: 'Viper', side: 'attack', color: 'black', src: 'assets/lineups/val/Icebox/attack/Viper - default b wall.mp4', label: 'default b wall' },
      { agent: 'Viper', side: 'attack', color: 'orange', src: 'assets/lineups/val/Icebox/attack/Viper - dont ask me what this pit is.mp4', label: 'dont ask me what this pit is' },
      { agent: 'Viper', side: 'attack', color: 'orange', src: 'assets/lineups/val/Icebox/attack/Viper - orb + molly for a upper + default.mp4', label: 'orb + molly for a upper + default' },
      { agent: 'Viper', side: 'attack', color: 'orange', src: 'assets/lineups/val/Icebox/attack/Viper - orb for b upper + oneway for lower plant.mp4', label: 'orb for b upper + oneway for lower plant' },
      { agent: 'Viper', side: 'attack', color: 'yellow', src: 'assets/lineups/val/Icebox/attack/Viper - orb for mid (a side).mp4', label: 'orb for mid (a side)' },
      { agent: 'Viper', side: 'attack', color: 'yellow', src: 'assets/lineups/val/Icebox/attack/Viper - orb for mid (b side).mp4', label: 'orb for mid (b side)' },
      { agent: 'Viper', side: 'defense', color: 'black', src: 'assets/lineups/val/Icebox/defense/Viper - default a wall.mp4', label: 'default a wall' },
      { agent: 'Viper', side: 'defense', color: 'orange', src: 'assets/lineups/val/Icebox/defense/Viper - oneway for b main.mp4', label: 'oneway for b main' },
      { agent: 'Viper', side: 'defense', color: 'orange', src: 'assets/lineups/val/Icebox/defense/Viper - orb + molly for a plant.mp4', label: 'orb + molly for a plant' },
      { agent: 'Viper', side: 'defense', color: 'black', src: 'assets/lineups/val/Icebox/defense/Viper - orb for b plant.mp4', label: 'orb for b plant' }
    ] },
  { map: 'Lotus', id: 'Lotus', items: [
      { agent: 'Fade', side: '', color: 'orange', src: 'assets/lineups/val/Lotus/Fade - Fade Lotus - probably the stupidest eye I_ve ever come up with.mp4', label: 'probably the stupidest eye I_ve ever come up with' }
    ] },
  { map: 'Split', id: 'Split', items: [
      { agent: 'Fade', side: 'attack', color: 'orange', src: 'assets/lineups/val/Split/attack/Fade - eye for backsite a (from main) (two variations).mp4', label: 'eye for backsite a (from main) (two variations)' },
      { agent: 'Fade', side: 'attack', color: 'orange', src: 'assets/lineups/val/Split/attack/Fade - eye for backsite b (from main).mp4', label: 'eye for backsite b (from main)' },
      { agent: 'Fade', side: 'attack', color: 'orange', src: 'assets/lineups/val/Split/attack/Fade - eye for elbow and ct.mp4', label: 'eye for elbow and ct' },
      { agent: 'Fade', side: 'attack', color: 'yellow', src: 'assets/lineups/val/Split/attack/Fade - eye for frontsite a (from main).mp4', label: 'eye for frontsite a (from main)' },
      { agent: 'Fade', side: 'attack', color: 'orange', src: 'assets/lineups/val/Split/attack/Fade - eye for ramp (from lobby).mp4', label: 'eye for ramp (from lobby)' },
      { agent: 'Fade', side: 'attack', color: 'orange', src: 'assets/lineups/val/Split/attack/Fade - eye for ramp (from spawn #1).mp4', label: 'eye for ramp (from spawn #1)' },
      { agent: 'Fade', side: 'attack', color: 'orange', src: 'assets/lineups/val/Split/attack/Fade - eye for ramp (from spawn #2).mp4', label: 'eye for ramp (from spawn #2)' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Split/defense/Fade - anti-rush + retake eye for b (from heaven).mp4', label: 'anti-rush + retake eye for b (from heaven)' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Split/defense/Fade - anti-rush + spam eye for a heaven.mp4', label: 'anti-rush + spam eye for a heaven' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Split/defense/Fade - eye for a lobby (from flowers).mp4', label: 'eye for a lobby (from flowers)' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Split/defense/Fade - eye for a main and lobby (from flowers).mp4', label: 'eye for a main and lobby (from flowers)' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Split/defense/Fade - eye for attacker spawn.mp4', label: 'eye for attacker spawn' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Split/defense/Fade - eye for b main (from rafters).mp4', label: 'eye for b main (from rafters)' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Split/defense/Fade - fast anti-rush eye for a (from heaven).mp4', label: 'fast anti-rush eye for a (from heaven)' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Split/defense/Fade - fast anti-rush eye for b (from default).mp4', label: 'fast anti-rush eye for b (from default)' }
    ] },
  { map: 'Sunset', id: 'Sunset', items: [
      { agent: 'Fade', side: 'attack', color: 'black', src: 'assets/lineups/val/Sunset/attack/Fade - eye for mid (from bot mid).mp4', label: 'eye for mid (from bot mid)' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Sunset/defense/Fade - anti-rush eye for b (from backsite, left side).mp4', label: 'anti-rush eye for b (from backsite, left side)' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Sunset/defense/Fade - anti-rush eye for b (from backsite, right side).mp4', label: 'anti-rush eye for b (from backsite, right side)' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Sunset/defense/Fade - anti-rush seize + eye for b (from market).mp4', label: 'anti-rush seize + eye for b (from market)' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Sunset/defense/Fade - eye for a main (from link).mp4', label: 'eye for a main (from link)' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Sunset/defense/Fade - retake eye for backsite a (from ct).mp4', label: 'retake eye for backsite a (from ct)' },
      { agent: 'Fade', side: 'defense', color: 'orange', src: 'assets/lineups/val/Sunset/defense/Fade - retake eye for frontsite and backsite (from boba).mp4', label: 'retake eye for frontsite and backsite (from boba)' },
      { agent: 'Cypher', side: '', color: 'black', src: 'assets/lineups/val/Sunset/Cypher - Cypher Sunset - oneway for b main.mp4', label: 'oneway for b main' },
      { agent: 'Cypher', side: '', color: 'orange', src: 'assets/lineups/val/Sunset/Cypher - Cypher Sunset - oneway for elbow.mp4', label: 'oneway for elbow' }
    ] },
];

const savedPlayers = JSON.parse(localStorage.getItem('val-settings-players') || '[]');
