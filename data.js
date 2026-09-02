// ============================================================
// data.js - Dados estáticos / fallback compartilhado entre as páginas
// Depende de: nada (define defaultPlayers e savedPlayers).
// ============================================================

const defaultPlayers = [{
  id: 'pacheco', name: 'Gustavo Pacheco', tag: 'pacheco#ofGod', team: 'Free Agent', role: 'Duelista', country: '🇧🇷 Brasil',
  cardImage: 'assets/players/pacheco-card.png',
  photo: 'assets/gustavo-pacheco.jpg', dpi: 800, sensitivity: 0.50, mouse: 'ATK A9 Plus', keyboard: 'Madlions 68 HE', mousepad: 'ATK 99G X Soft', monitor: 'SuperFrame SFP2415 FHD 185Hz',
  crosshair: '0;P;h;0;f;0;0l;4;0o;0;0a;1;0f;0;1b;0', crosshairImage: 'assets/mira.png?v=4',
  game: 'VALORANT', agents: 'Jett', scopedSensitivity: 1.0,
  // DADOS DE EXEMPLO do card estilo "FIFA" (até a estrutura real vir da API).
  // overall é um valor próprio do jogador (não calculado a partir dos demais).
  attrs: { overall: 93, operator: 91, rifle: 100, pistol: 91, clutch: 85, trashtalk: 0 },
  clips: [{ src: 'assets/4k paisagem.mp4', label: 'Clutch 1v3 — Ascent', orientation: 'landscape' }, { src: 'assets/4k retrato.mp4', label: 'Ace — Split', orientation: 'portrait' }],
  social: { Instagram: 'https://www.instagram.com/gstvpacheco/', Tracker: 'https://tracker.gg/valorant/profile/riot/pacheco%23ofGod/overview?platform=pc&playlist=competitive&season=4f0864e2-40af-28a4-de2c-0e9e64e75f23', VLR: 'https://www.vlr.gg/user/pachecovlr' },
  videoSettings: [['Resolução', '1920x1080'], ['Proporção', '16:9'], ['Método', 'Fill'], ['Modo de exibição', 'Tela cheia'], ['Renderização multithread', 'Ligada'], ['Material / textura / detalhe', 'Baixo'], ['Qualidade da interface', 'Baixa'], ['Vignette / VSync', 'Desligados'], ['Anti-aliasing', 'MSAA 4x'], ['Filtragem anisotrópica', '4x'], ['Improve Clarity / Sharpening', 'Desligados'], ['Bloom', 'Ligado'], ['Distortion / sombras', 'Desligados'], ['Destaque de inimigo', 'Yellow (Deuteranopia)']],
  pcSpecs: [['Processador', 'AMD Ryzen 5 5600', 'https://www.pichau.com.br/processador-amd-ryzen-5-5600-6-core-12-threads-3-5ghz-4-4ghz-turbo-cache-35mb-am4-100-100000927box', 'assets/rzn.jpg'], ['Placa de vídeo', 'Gigabyte RTX 3060 Gaming OC 8GB', 'https://www.kabum.com.br/produto/543498/placa-de-video-rtx-3060-gigabyte-gaming-oc-8gb-gddr6-128bits', 'assets/rtx.webp']],
  headset: { name: 'MCHOSE V9 Pro', link: 'https://pt.aliexpress.com/item/1005011745761008.html' },
  productImages: { monitor: 'assets/products/superframe-sfp2415.jpg', mouse: 'assets/products/atk-a9-plus.jpg', keyboard: 'assets/products/madlions-68-he.jpg', headset: 'assets/products/mchose-v9-pro.jpg', mousepad: 'assets/products/atk-99g-xsoft.png' },
  links: { mouse: 'https://pt.aliexpress.com/item/1005011812220400.html', keyboard: 'https://pt.aliexpress.com/item/1005008299208938.html', mousepad: 'https://pt.aliexpress.com/item/1005011561185122.html', monitor: 'https://www.terabyteshop.com.br/produto/33583' }
}, {
  id: 'z4gb', name: 'Gabriel Felipi', tag: 'Z4GB#TOP1', team: 'Free Agent', role: 'Duelista', country: '🇧🇷 Brasil',
  photo: 'assets/gabzao.jpg', dpi: 1600, sensitivity: 0.14, mouse: 'Ajazz AJ179 Pro', keyboard: 'Redragon Kumara', mousepad: 'Mouse Pad Gamer Extended CM02 900x400', monitor: 'Duex DX270QGP165', game: 'VALORANT',
  crosshair: '0;P;t;1;o;1;d;1;0b;0;1b;0;1m;0;1f;0', crosshairImage: 'assets/ret.png?v=1',
  headset: { name: 'Fone Fortrek', link: '' },
  productImages: { mouse: 'assets/products/gabriel-ajazz-aj179-pro.png', keyboard: 'assets/teclado.webp', headset: 'assets/fone.jpg', mousepad: 'assets/products/gabriel-mousepad-cm02.jpg', monitor: 'assets/products/gabriel-duex-dx270qgp165.jpg' },
  social: { Instagram: 'https://www.instagram.com/zzgb._/', VLR: 'https://www.vlr.gg/user/Z4GB', Tracker: 'https://tracker.gg/valorant/profile/riot/Z4GB%23TOP1/overview?platform=pc&playlist=competitive&season=4f0864e2-40af-28a4-de2c-0e9e64e75f23' },
  videoSettings: [['Resolução', '1920x1080'], ['Proporção', '16:9'], ['Método', 'Fill'], ['Modo de exibição', 'Tela cheia'], ['Renderização multithread', 'Ligada'], ['Material / textura / detalhe', 'Baixo'], ['Qualidade da UI', 'Alta'], ['Vignette / VSync', 'Desligados'], ['Anti-aliasing', 'MSAA 4x'], ['Filtragem anisotrópica', '8x'], ['Improve Clarity / Sharpening', 'Desligados'], ['Bloom', 'Ligado'], ['Distortion / sombras', 'Desligados'], ['Destaque de inimigo', 'Yellow (Deuteranopia)']],
  pcSpecs: [['Processador', 'Intel Core i3-12100F', 'https://www.kabum.com.br/produto/283719', 'assets/products/gabriel-i3-12100f.jpg'], ['Placa de vídeo', 'AMD Radeon RX 580 8GB', 'https://www.kabum.com.br/produto/464478', 'assets/products/gabriel-rx-580-8gb.jpg']],
  links: { mouse: 'https://pt.aliexpress.com/item/1005007791313445.html', keyboard: 'https://www.pichau.com.br/teclado-gaming-redragon-kumara-mecanico-rgb-switch-brown-k552rgb-1', mousepad: '', monitor: 'https://www.terabyteshop.com.br/produto/30480' }
}, {
  id: 'tardus', name: 'Guilherme Costa', tag: 'Tardus#DARK', team: 'Free Agent', role: 'Sentinela', country: '🇧🇷 Brasil',
  photo: 'assets/tardus.jpeg', dpi: 1600, sensitivity: 0.32, mouse: 'Logitech G403 Hero', keyboard: 'Ajazz AK820', mousepad: 'Unknown', monitor: 'Duex DX270QGP165', game: 'VALORANT',
  crosshair: 'Não informado', crosshairImage: 'assets/mira.png?v=4',
  productImages: { mouse: 'assets/products/tardus-logitech-g403-hero.jpg', keyboard: 'assets/products/tardus-ajazz-ak820.png', monitor: 'assets/products/tardus-duex-dx270qgp165.jpg' },
  links: { mouse: 'https://www.kabum.com.br/produto/102649', keyboard: 'https://pt.aliexpress.com/item/1005007805708183.html', mousepad: '', monitor: 'https://www.setupninja.com.br/' }
}, {
  id: 'danilo-andrade', name: 'Danilo Andrade', tag: 'Danilo Andrade', team: 'Free Agent', role: 'Iniciador', country: '🇧🇷 Brasil',
  photo: 'assets/danilo-andrade.jpg', dpi: 1600, sensitivity: 0.10, mouse: 'Delux M800 Pro PAW 3395', keyboard: 'Redragon Daksa K576R-1', mousepad: 'Desconhecido', monitor: 'LG UltraGear 27GS60F-B 27" 180Hz', game: 'VALORANT',
  crosshair: 'Não informado', crosshairImage: 'assets/mira.png?v=4',
  productImages: { mouse: 'assets/products/danilo-delux-m800-pro.jpg', keyboard: 'assets/products/danilo-redragon-daksa.jpg', monitor: 'assets/products/danilo-lg-27gs60f-b.jpg' },
  links: { mouse: 'https://www.mercadolivre.com.br/', keyboard: 'https://www.kabum.com.br/produto/202254', mousepad: '', monitor: 'https://www.kabum.com.br/produto/620992' }
}, {
  id: 'igor-gomes', name: 'Igor Gomes', tag: 'Igor Gomes', team: 'Free Agent', role: 'Player de CS', country: '🇧🇷 Brasil',
  photo: 'assets/igao.jpeg', dpi: 400, sensitivity: 4.0, mouse: 'Redragon Stormrage M718', keyboard: 'Não informado', mousepad: 'Não informado', monitor: 'LG UltraGear 27GS60F-B 27" 180Hz', game: 'Counter-Strike 2',
  crosshair: 'donk (CS2) — Classic Static | Ponto: sim | Comprimento: 1 | Espessura: 1 | Gap: -4 | RGB: 0, 255, 145', crosshairImage: 'assets/mira.png?v=4',
  productImages: { mouse: 'assets/products/igor-redragon-stormrage-m718.jpg', monitor: 'assets/products/igor-lg-27gs60f-b.jpg' },
  links: { mouse: 'https://www.kabum.com.br/produto/152313', keyboard: '', mousepad: '', monitor: 'https://www.kabum.com.br/produto/620992' }
}, {
  id: 'thomaz', name: 'Thomaz', tag: 'Thomaz', team: 'Free Agent', role: 'Não informado', country: '🇧🇷 Brasil',
  photo: 'assets/thomaz.jpeg', dpi: 1600, sensitivity: 0.6, mouse: 'Não informado', keyboard: 'Não informado', mousepad: 'Não informado', monitor: 'Não informado',
  crosshair: 'Não informado', crosshairImage: 'assets/mira.png?v=4', game: 'Rainbow Six',
  social: { Instagram: 'https://www.instagram.com/thomas__evangelista' },
  links: { mouse: '', keyboard: '', mousepad: '', monitor: '' }
}];

defaultPlayers.find(player => player.id === 'z4gb').links.mousepad = 'https://www.mercadolivre.com.br/mouse-pad-gamer-extended-cm02-900x400';

const savedPlayers = JSON.parse(localStorage.getItem('val-settings-players') || '[]');
