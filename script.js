const defaultPlayers = [{
  id: 'pacheco', name: 'Gustavo Pacheco', tag: 'pacheco#ofGod', team: 'Free Agent', role: 'Duelista', country: '🇧🇷 Brasil',
  photo: 'assets/gustavo-pacheco.jpg', dpi: 800, sensitivity: 0.50, mouse: 'ATK A9 Plus', keyboard: 'Madlions 68 HE', mousepad: 'ATK 99G X Soft', monitor: 'SuperFrame SFP2415 FHD 185Hz',
  crosshair: '0;P;h;0;f;0;0l;4;0o;0;0a;1;0f;0;1b;0', crosshairImage: 'assets/mira.png?v=4',
  game: 'VALORANT', agents: 'Jett', scopedSensitivity: 1.0,
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
  photo: 'assets/danilo-andrade.jpg', dpi: 1600, sensitivity: 0.10, mouse: 'Delux M800 Pro PAW 3395', keyboard: 'Redragon Daksa K576R-1', mousepad: 'Desconhecido', monitor: 'LG UltraGear 27GS60F-B 27” 180Hz', game: 'VALORANT',
  crosshair: 'Não informado', crosshairImage: 'assets/mira.png?v=4',
  productImages: { mouse: 'assets/products/danilo-delux-m800-pro.jpg', keyboard: 'assets/products/danilo-redragon-daksa.jpg', monitor: 'assets/products/danilo-lg-27gs60f-b.jpg' },
  links: { mouse: 'https://www.mercadolivre.com.br/', keyboard: 'https://www.kabum.com.br/produto/202254', mousepad: '', monitor: 'https://www.kabum.com.br/produto/620992' }
}, {
  id: 'igor-gomes', name: 'Igor Gomes', tag: 'Igor Gomes', team: 'Free Agent', role: 'Player de CS', country: '🇧🇷 Brasil',
  photo: 'assets/igao.jpeg', dpi: 400, sensitivity: 4.0, mouse: 'Redragon Stormrage M718', keyboard: 'Não informado', mousepad: 'Não informado', monitor: 'LG UltraGear 27GS60F-B 27” 180Hz', game: 'Counter-Strike 2',
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

// ============================================================
// Estado global dos jogadores (carregado da API quando disponível)
// ============================================================
let players = [];

/** Carrega os jogadores do banco via API. Retorna true se tiver sucesso. */
async function loadPlayersFromApi() {
  try {
    const res = await API.listPlayers();
    const list = (res.data && res.data.players) || [];
    if (list.length) {
      players = list.map(row => {
        // the list endpoint returns summary; build minimal UI objects
        const settings = row.settings || {};
        return {
          id: String(row.id),
          name: row.real_name || row.nickname,
          tag: row.nickname,
          team: row.team_name || 'Sem time',
          role: row.role || 'Não informado',
          country: row.country || 'Não informado',
          photo: row.photo,
          slug: row.slug,
          game: row.game_name || 'VALORANT',
          dpi: settings.dpi,
          sensitivity: settings.sensitivity,
          edpi: settings.dpi && settings.sensitivity ? Math.round(settings.dpi * settings.sensitivity) : null,
        };
      });
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

/** Retorna `true` se a API está sendo usada como fonte de dados. */
let apiActive = false;

const savedPlayers = JSON.parse(localStorage.getItem('val-settings-players') || '[]');

if (document.body.dataset.page === 'profile') {
  const $ = id => document.getElementById(id);
  const showToast = text => { const toast = $('toast'); toast.textContent = text; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); };

  // Carrega o perfil: do banco (por slug/id) ou do fallback estático
  (async function initProfile() {
    const id = new URLSearchParams(window.location.search).get('player');
    let player = null;

    if (id) {
      try {
        const res = await API.getPlayerBySlug(id);
        if (res.success && res.data) {
          player = mapPlayerForUi(res.data);
          apiActive = true;
        }
      } catch (err) { /* fallback abaixo */ }
    }
    if (!player) {
      const profilePlayers = [...defaultPlayers, ...savedPlayers];
      player = profilePlayers.find(item => item.id === id || item.slug === id) || defaultPlayers[0];
    }

    renderProfile(player);
  })();

  function renderProfile(player) {
    document.title = `${player.tag} — ProSens`;
    $('crumbName').textContent = player.tag.toUpperCase();
    const bc = document.querySelector('.breadcrumb');
    if (bc && bc.childNodes[2]) bc.childNodes[2].nodeValue = ` ${player.game || 'VALORANT'} `;
    $('playerName').textContent = player.name;
    $('playerTag').textContent = player.tag;
    $('playerTeam').textContent = player.team;
    $('playerRole').textContent = player.role;
    $('playerCountry').textContent = player.country;
    $('profilePhoto').style.backgroundImage = player.photo ? `url("${player.photo}")` : 'none';
    $('dpi').textContent = player.dpi ?? '–';
    $('sensitivity').textContent = player.sensitivity != null ? Number(player.sensitivity).toFixed(2) : '–';
    const edpi = player.edpi != null ? player.edpi : (player.dpi && player.sensitivity ? Math.round(player.dpi * player.sensitivity) : null);
    $('edpi').textContent = edpi ?? '–';
    const scoped = document.querySelector('.data-grid > div:last-child strong');
    if (scoped) scoped.textContent = Number(player.scopedSensitivity ?? 1).toFixed(2);
    $('mouseName').textContent = player.mouse || 'Não informado';
    $('keyboardName').textContent = player.keyboard || 'Não informado';
    $('mousepadName').textContent = player.mousepad || 'Não informado';
    $('monitorName').textContent = player.monitor || 'Não informado';
    $('crosshairText').textContent = player.crosshair || 'Não informado';
    $('crosshairImage').src = player.crosshairImage || 'assets/mira.png?v=4';

    Object.entries(player.links || {}).forEach(([key, value]) => {
      const link = $(`${key}Link`);
      if (link) { link.href = value || '#'; link.style.display = value ? '' : 'none'; }
    });

    const gearGrid = document.querySelector('#gear .gear-grid');
    if (player.productImages && gearGrid) {
      const products = [['monitor', 'Monitor', player.monitor, player.links?.monitor], ['mouse', 'Mouse', player.mouse, player.links?.mouse], ['keyboard', 'Keyboard', player.keyboard, player.links?.keyboard], ['headset', 'Headset', player.headset?.name, player.headset?.link], ['mousepad', 'Mousepad', player.mousepad, player.links?.mousepad]];
      gearGrid.classList.add('product-grid');
      gearGrid.innerHTML = products.map(([id, label, name, href]) => `<a class="gear-card product-card" href="${href || '#'}" target="_blank" rel="noopener">${player.productImages[id] ? `<span class="product-photo"><img src="${player.productImages[id]}" alt="${name}"></span>` : ''}<small>${label}</small><strong>${name || 'Não informado'}</strong><span>Ver produto ↗</span></a>`).join('');
    } else if (player.headset && gearGrid && !gearGrid.querySelector('[id="headsetLink"]')) {
      gearGrid.insertAdjacentHTML('beforeend', `<a class="gear-card" id="headsetLink" href="${player.headset.link}" target="_blank" rel="noopener"><small>HEADSET</small><strong>${player.headset.name}</strong><span>Ver produto ↗</span></a>`);
    }

    if (player.game || Object.keys(player.social || {}).length) {
      const socialIcons = { Instagram: 'assets/brands/instagram.ico', Tracker: 'assets/brands/tracker.png', VLR: 'assets/brands/vlr.png' };
      const social = Object.entries(player.social || {}).map(([label, href]) => `<a class="social-${label.toLowerCase()}" href="${href}" target="_blank" rel="noopener"><img src="${socialIcons[label] || ''}" alt="" aria-hidden="true">${label} <span>↗</span></a>`).join('');
      if (!document.querySelector('.player-meta')) {
        document.querySelector('.profile-card').insertAdjacentHTML('afterend', `<section class="player-meta"><div><small>JOGO</small><strong>${player.game || 'Não informado'}</strong></div><div><small>AGENTE PRINCIPAL</small><strong>${player.agents || 'Não informado'}</strong></div>${social ? `<div class="player-social">${social}</div>` : ''}</section>`);
      }
    }
    if (player.videoSettings && player.videoSettings.length && !document.querySelector('.video-settings')) {
      document.querySelector('.crosshair-block').insertAdjacentHTML('afterend', `<section class="settings-block video-settings"><div class="section-heading"><span class="section-icon">◫</span><h2>Configurações de vídeo</h2></div><div class="video-settings-grid">${player.videoSettings.map(([label, value]) => `<div><small>${label}</small><strong>${value}</strong></div>`).join('')}</div></section>`);
    }
    if (player.pcSpecs && player.pcSpecs.length && !document.querySelector('.pc-specs')) {
      document.querySelector('#gear').insertAdjacentHTML('afterend', `<section class="settings-block pc-specs"><div class="section-heading"><span class="section-icon">▣</span><h2>PC Specs</h2></div><div class="gear-grid product-grid">${player.pcSpecs.map(([label, value, href, image]) => `<a class="gear-card product-card" href="${href || '#'}" target="_blank" rel="noopener">${image ? `<span class="product-photo"><img src="${image}" alt="${value}"></span>` : ''}<small>${label}</small><strong>${value}</strong><span>Ver produto ↗</span></a>`).join('')}</div></section>`);
    }

    const copy = async (text, success) => { try { await navigator.clipboard.writeText(text); showToast(success); } catch { showToast('Não foi possível copiar.'); } };
    $('copySettings').addEventListener('click', () => copy(`${player.name} — ${player.tag}\nDPI: ${player.dpi}\nSensibilidade: ${player.sensitivity}\neDPI: ${edpi ?? ''}\nRetícula: ${player.crosshair}`, 'Settings copiadas.'));
    $('crosshairCode').addEventListener('click', () => copy(player.crosshair, 'Código da retícula copiado.'));
    const setTheme = theme => { document.body.classList.toggle('dark', theme === 'dark'); $('themeToggle').textContent = theme === 'dark' ? '☼' : '◐'; localStorage.setItem('val-tactical-theme', theme); };
    setTheme(localStorage.getItem('val-tactical-theme') || 'dark');
    $('themeToggle').addEventListener('click', () => setTheme(document.body.classList.contains('dark') ? 'light' : 'dark'));
    setupComments($, player, showToast, apiActive);
    $('toast').insertAdjacentHTML('beforebegin', '<footer class="site-footer"><div class="footer-brand"><a class="logo" href="index.html"><span class="logo-dot">P</span> Pro<span>Sens</span></a><p>Loadouts competitivos de VALORANT, feitos pela comunidade.</p></div><div><h3>Explorar</h3><a href="index.html#players">Jogadores</a><a href="#comments">Comentários</a></div><div><h3>Contato</h3><a href="mailto:contato@prosens.gg">contato@prosens.gg</a></div><div class="footer-credit"><span>© 2026 PROSENS</span><span>CRIADO PARA COMPETIR</span></div></footer>');
  }

  function setupComments($, player, showToast) {
    $('toast').insertAdjacentHTML('beforebegin', '<section class="comments-section profile-comments" id="comments"><div class="comments-intro"><p class="kicker">COMUNIDADE</p><h2>Comentários</h2><p>Deixe uma dica ou opinião sobre o setup deste jogador.</p></div><div class="comments-panel"><form class="comment-form" id="commentForm"><div class="comment-fields"><input name="author" maxlength="32" required placeholder="Seu nome"><textarea name="message" maxlength="300" required placeholder="Escreva um comentário..."></textarea></div><button type="submit">Publicar comentário</button></form><div class="comment-list" id="commentList"></div></div></section>');
    const escape = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
    const commentsKey = `val-tactical-comments-${player.id}`;
    const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
    const renderComments = () => { $('commentList').innerHTML = comments.length ? comments.map(comment => `<article class="comment-item"><span class="comment-avatar">${escape(comment.author.slice(0, 2).toUpperCase())}</span><div><strong>${escape(comment.author)}</strong><time>${new Date(comment.date).toLocaleDateString('pt-BR')}</time><p>${escape(comment.message)}</p></div></article>`).join('') : '<p class="empty-comments">Ainda não há comentários neste perfil.</p>'; };
    $('commentForm').addEventListener('submit', event => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)); comments.unshift({ author: data.author.trim(), message: data.message.trim(), date: new Date().toISOString() }); localStorage.setItem(commentsKey, JSON.stringify(comments)); event.currentTarget.reset(); renderComments(); showToast('Comentário publicado.'); });
    renderComments();
  }
} else {
const requestedPlayer = new URLSearchParams(window.location.search).get('player');
let selectedId = null;
const $ = (id) => document.getElementById(id);
const toast = $('toast');

function message(text) { toast.textContent = text; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); }
function initials(name) { return (name || '').split(' ').map(part => part[0]).slice(0, 2).join('') || '?'; }
function getSelected() { return players.find(player => player.id === selectedId) || players[0] || null; }

function getFilteredPlayers() {
  const query = $('playerSearch').value.toLowerCase();
  const role = $('roleFilter').value;
  const team = $('teamFilter').value;
  const country = $('countryFilter').value;
  const game = $('gameFilter').value;
  const dpi = $('dpiFilter').value;
  const sensitivityRange = $('sensitivityFilter').value;
  return players.filter(player => `${player.name} ${player.tag} ${player.team} ${player.game || ''}`.toLowerCase().includes(query) && (!game || player.game === game) && (!role || player.role === role) && (!team || player.team === team) && (!country || player.country === country) && (!dpi || String(player.dpi) === dpi) && (!sensitivityRange || (sensitivityRange === 'low' && player.sensitivity <= .20) || (sensitivityRange === 'medium' && player.sensitivity > .20 && player.sensitivity <= .45) || (sensitivityRange === 'high' && player.sensitivity > .45)));
}
function selectPlayer(id) {
  const player = players.find(p => p.id === id);
  const target = player && player.slug ? player.slug : id;
  window.location.href = `player.html?player=${encodeURIComponent(target)}`;
}
function renderList() {
  const source = players.length ? players : defaultPlayers;
  $('playerCount').textContent = `${players.length} ${players.length === 1 ? 'jogador' : 'jogadores'}`;
  $('homePlayerCount').textContent = String(players.length).padStart(2, '0');
  $('heroProfileCount').textContent = String(players.length).padStart(2, '0');
  const filtered = getFilteredPlayers();
  $('playerList').innerHTML = filtered.length ? filtered.map(player => `<button class="player-row ${player.id === selectedId ? 'active' : ''}" data-id="${player.id}" type="button">${player.photo ? `<img class="player-avatar" src="${player.photo}" alt="">` : `<span class="player-avatar player-initials">${initials(player.name)}</span>`}<span><strong>${player.name}</strong><small>${player.game || 'VALORANT'} · ${player.team}</small></span></button>`).join('') : '<p class="directory-count">Nenhum jogador encontrado.</p>';
  document.querySelectorAll('.player-row').forEach(button => button.addEventListener('click', () => selectPlayer(button.dataset.id)));
}

const headerSearch = $('playerSearch');
const heroSearch = $('heroPlayerSearch');
function updateSearch(event) {
  const query = event.currentTarget.value;
  const pairedSearch = event.currentTarget === headerSearch ? heroSearch : headerSearch;
  pairedSearch.value = query;
  renderList();
}
headerSearch.addEventListener('input', updateSearch);
heroSearch.addEventListener('input', updateSearch);
heroSearch.addEventListener('keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); $('players').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
});
['gameFilter', 'roleFilter', 'teamFilter', 'countryFilter', 'dpiFilter', 'sensitivityFilter'].forEach(id => $(id).addEventListener('change', renderList));

function setTheme(theme) { document.body.classList.toggle('dark', theme === 'dark'); $('themeToggle').textContent = theme === 'dark' ? '☼' : '◐'; localStorage.setItem('val-tactical-theme', theme); }
setTheme(localStorage.getItem('val-tactical-theme') || 'dark');
$('themeToggle').addEventListener('click', () => setTheme(document.body.classList.contains('dark') ? 'light' : 'dark'));
const updateHeaderSearch = () => document.body.classList.toggle('scrolled', window.scrollY > 110);
updateHeaderSearch();
window.addEventListener('scroll', updateHeaderSearch, { passive: true });
document.querySelector('.footer-brand p').textContent = 'Loadouts competitivos de múltiplos jogos, feitos pela comunidade.';

// ---- Modal de adicionar jogador (via API) ----
const modal = $('playerModal');
$('openModal').addEventListener('click', () => modal.showModal());
$('closeModal').addEventListener('click', () => modal.close());
$('playerForm').addEventListener('submit', async event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const payload = {
    nickname: data.tag,
    real_name: data.name,
    game_id: data.game === '' ? null : (await resolveGameId(data.game)),
    role: data.role,
    country: data.country,
  };
  try {
    const res = await API.createPlayer(payload);
    event.currentTarget.reset();
    modal.close();
    message(res.message || 'Jogador adicionado.');
    await refreshPlayers();
  } catch (err) {
    message(err.message || 'Não foi possível adicionar o jogador.');
  }
});

async function resolveGameId(gameName) {
  try {
    const res = await API.listGames();
    const slug = String(gameName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const found = (res.data.games || []).find(g => g.slug === slug || g.name === gameName);
    return found ? found.id : null;
  } catch { return null; }
}

async function loadFilters() {
  try {
    const games = await API.listGames();
    const gameSelect = $('gameFilter');
    (games.data.games || []).forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.slug;
      opt.textContent = g.name;
      if (!Array.from(gameSelect.options).some(o => o.value === g.slug && o.textContent === g.name)) gameSelect.appendChild(opt);
    });
  } catch { /* mantém filtros estáticos */ }
}

async function refreshPlayers() {
  await loadPlayersFromApi();
  const validRequested = requestedPlayer && players.some(p => p.id === requestedPlayer);
  selectedId = validRequested ? requestedPlayer : (players[0] || {}).id || null;
  renderList();
}

(async function initHome() {
  const loaded = await loadPlayersFromApi();
  if (loaded) apiActive = true;
  if (!loaded) players = [...defaultPlayers, ...savedPlayers];
  selectedId = players[0] ? players[0].id : null;
  loadFilters();
  renderList();
})();

// ---- Autenticação mockada ----
const authModal = $('authModal');
const authStateKey = 'prosens-auth-user';
const authAccountsKey = 'prosens-auth-accounts';
let authMode = 'login';
const getAccounts = () => JSON.parse(localStorage.getItem(authAccountsKey) || '[]');
const setAuthMessage = text => { $('authMessage').textContent = text; };
function renderAuth() {
  const user = JSON.parse(localStorage.getItem(authStateKey) || 'null');
  $('authTrigger').hidden = Boolean(user);
  $('authLogout').hidden = !user;
  if (user) $('authTrigger').textContent = user.username;
}
function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === 'register';
  $('authTitle').textContent = isRegister ? 'CRIAR CONTA' : 'ENTRAR';
  $('authKicker').textContent = isRegister ? 'NOVA CONTA' : 'ÁREA DO JOGADOR';
  $('authIntro').textContent = isRegister ? 'Crie seu acesso e entre para a comunidade.' : 'Acesse sua conta para personalizar sua experiência.';
  $('usernameField').hidden = !isRegister;
  $('authUsername').required = isRegister;
  $('authEmail').placeholder = isRegister ? 'E-mail' : 'E-mail ou username';
  $('authPassword').autocomplete = isRegister ? 'new-password' : 'current-password';
  $('authSubmit').textContent = isRegister ? 'CADASTRAR' : 'ENTRAR';
  $('authSwitchCopy').innerHTML = isRegister ? 'Já tem conta? <button id="authSwitch" type="button">Entrar</button>' : 'Não tem conta? <button id="authSwitch" type="button">Cadastre-se</button>';
  $('authSwitch').addEventListener('click', () => setAuthMode(isRegister ? 'login' : 'register'));
  setAuthMessage('');
}
function openAuth(mode = 'login') { setAuthMode(mode); authModal.showModal(); $('authEmail').focus(); }
$('authTrigger').addEventListener('click', () => openAuth());
$('authLogout').addEventListener('click', () => { localStorage.removeItem(authStateKey); renderAuth(); message('Sessão encerrada.'); });
$('authClose').addEventListener('click', () => authModal.close());
$('forgotPassword').addEventListener('click', () => setAuthMessage('Em uma integração real, enviaremos um link de recuperação para seu e-mail.'));
document.querySelectorAll('[data-provider]').forEach(button => button.addEventListener('click', () => setAuthMessage(`Login com ${button.dataset.provider} é uma demonstração nesta versão.`)));
$('authForm').addEventListener('submit', event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const accounts = getAccounts();
  if (authMode === 'register') {
    const username = data.username.trim();
    const email = data.email.trim().toLowerCase();
    if (accounts.some(account => account.email === email || account.username.toLowerCase() === username.toLowerCase())) { setAuthMessage('Este e-mail ou username já está em uso.'); return; }
    accounts.push({ username, email, password: data.password });
    localStorage.setItem(authAccountsKey, JSON.stringify(accounts));
    localStorage.setItem(authStateKey, JSON.stringify({ username, email }));
    authModal.close();
    renderAuth();
    message('Conta criada. Boas-vindas ao ProSens.');
  } else {
    const identifier = data.email.trim().toLowerCase();
    const account = accounts.find(item => item.email === identifier || item.username.toLowerCase() === identifier);
    if (!account || account.password !== data.password) { setAuthMessage('E-mail, username ou senha inválidos.'); return; }
    localStorage.setItem(authStateKey, JSON.stringify({ username: account.username, email: account.email }));
    authModal.close();
    renderAuth();
    message(`Bem-vindo, ${account.username}.`);
  }
});
renderAuth();
}
