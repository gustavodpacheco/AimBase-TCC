const defaultPlayers = [{
  id: 'pacheco', name: 'Gustavo Pacheco', tag: 'pacheco#ofGod', team: 'Free Agent', role: 'Duelista', country: '🇧🇷 Brasil',
  photo: 'assets/gustavo-pacheco.jpg', dpi: 800, sensitivity: 0.50, mouse: 'ATK A9 Plus', keyboard: 'Madlions 68 HE', mousepad: 'ATK 99G X Soft', monitor: 'SuperFrame SFP2415 FHD 185Hz',
  crosshair: '0;P;h;0;f;0;0l;4;0o;0;0a;1;0f;0;1b;0', crosshairImage: 'assets/mira.png?v=4',
  links: { mouse: 'https://pt.aliexpress.com/item/1005011812220400.html', keyboard: 'https://pt.aliexpress.com/item/1005008299208938.html', mousepad: 'https://pt.aliexpress.com/item/1005011561185122.html', monitor: 'https://www.terabyteshop.com.br/produto/33583/monitor-gamer-superframe-precision-ultra-v3-236-pol-curvo-full-hd-va-1ms-180hz-rgb-freesyncg-sync-hdmidp-sfpcb-24180-fhd' }
}, {
  id: 'z4gb', name: 'Gabriel Felipi', tag: 'Z4GB#TOP1', team: 'Free Agent', role: 'Duelista', country: '🇧🇷 Brasil',
  photo: 'assets/gabzao.jpg', dpi: 1600, sensitivity: 0.14, mouse: 'Ajazz AJ179 Pro', keyboard: 'Redragon Kumara', mousepad: 'Unknown', monitor: 'Duex DX270QGP165',
  crosshair: '0;P;t;1;o;1;d;1;0b;0;1b;0;1m;0;1f;0', crosshairImage: 'assets/ret.png?v=1',
  links: { mouse: 'https://pt.aliexpress.com/item/1005007791313445.html', keyboard: 'https://www.pichau.com.br/teclado-gaming-redragon-kumara-mecanico-rgb-switch-brown-k552rgb-1', mousepad: '', monitor: 'https://www.terabyteshop.com.br/produto/30480/monitor-gamer-duex-27-pol-quad-hd-ips-165hz-1ms-hdr-flicker-free-freesync-hdmidp-dx270qgp165' }
}, {
  id: 'tardus', name: 'Guilherme Costa', tag: 'Tardus#DARK', team: 'Free Agent', role: 'Sentinela', country: '🇧🇷 Brasil',
  photo: 'assets/tardus.jpeg', dpi: 1600, sensitivity: 0.32, mouse: 'Logitech G403 Hero', keyboard: 'Ajazz AK820', mousepad: 'Unknown', monitor: 'Duex DX270QGP165',
  crosshair: 'Não informado', crosshairImage: 'assets/mira.png?v=4',
  links: { mouse: 'https://www.kabum.com.br/produto/102649/mouse-gamer-logitech-g403-hero-com-rgb-lightsync-6-botoes-programaveis-ajuste-de-peso-e-sensor-hero-25k-910-005631', keyboard: 'https://pt.aliexpress.com/item/1005007805708183.html', mousepad: '', monitor: 'https://www.setupninja.com.br/monitor-gamer-duex-27-pol-eled-ips-2k-qhd-1ms-165hz-display-porthdmi-dx270qgp165?variation=29971648&utm_term=&ad_id=794568015039' }
}, {
  id: 'danilo-andrade', name: 'Danilo Andrade', tag: 'Danilo Andrade', team: 'Free Agent', role: 'Iniciador', country: '🇧🇷 Brasil',
  photo: 'assets/danilo-andrade.jpg', dpi: 1600, sensitivity: 0.10, mouse: 'Delux M800 Pro PAW 3395', keyboard: 'Redragon Kumara K552RGB-1 Brown', mousepad: 'Desconhecido', monitor: 'LG UltraGear 27GS60F-B 27” 180Hz',
  crosshair: 'Não informado', crosshairImage: 'assets/mira.png?v=4',
  links: { mouse: 'https://www.mercadolivre.com.br/mouse-delux-m800-pro-paw-3395-cor-branco/up/MLBU4278007761?pdp_filters=item_id%3AMLB4881703977&from=gshop&matt_tool=13560550&matt_word=&matt_source=google&matt_campaign_id=22120855569&matt_ad_group_id=179138690771&matt_match_type=&matt_network=g&matt_device=c&matt_creative=729092955358&matt_keyword=&matt_ad_position=&matt_ad_type=pla&matt_merchant_id=5824254113&matt_product_id=MLBU4278007761&matt_product_partition_id=2584316702352&matt_target_id=aud-2486208819580:pla-2584316702352&cq_src=google_ads&cq_cmp=22120855569&cq_net=g&cq_plt=gp&cq_med=pla', keyboard: 'https://www.kabum.com.br/produto/93160/teclado-mecanico-gamer-redragon-kumara-anti-ghosting-rgb-switch-outemu-brown-abnt2-preto-pt-k552rgb-1-pt-brown', mousepad: '', monitor: 'https://www.kabum.com.br/produto/620992/monitor-gamer-lg-ultragear-27-fhd-180hz-1ms-ips-dp-e-hdmi-hdr10-freesync-g-sync-27gs60f-b' }
}, {
  id: 'igor-gomes', name: 'Igor Gomes', tag: 'Igor Gomes', team: 'Free Agent', role: 'Player de CS', country: '🇧🇷 Brasil',
  photo: 'assets/igao.jpeg', dpi: 400, sensitivity: 4.0, mouse: 'Redragon Stormrage M718', keyboard: 'Não informado', mousepad: 'Não informado', monitor: 'LG UltraGear 27GS60F-B 27” 180Hz',
  crosshair: 'donk (CS2) — Classic Static | Ponto: sim | Comprimento: 1 | Espessura: 1 | Gap: -4 | RGB: 0, 255, 145', crosshairImage: 'assets/mira.png?v=4',
  links: { mouse: 'https://www.kabum.com.br/produto/152313/mouse-gamer-redragon-stormrage-rgb-10000-dpi-ambidestro-7-botoes-preto-m718', keyboard: '', mousepad: '', monitor: 'https://www.kabum.com.br/produto/620992/monitor-gamer-lg-ultragear-27-fhd-180hz-1ms-ips-dp-e-hdmi-hdr10-freesync-g-sync-27gs60f-b' }
}];

if (document.body.dataset.page === 'profile') {
  const $ = id => document.getElementById(id);
  const id = new URLSearchParams(window.location.search).get('player');
  const profilePlayers = [...defaultPlayers, ...JSON.parse(localStorage.getItem('val-settings-players') || '[]')];
  const player = profilePlayers.find(item => item.id === id) || defaultPlayers[0];
  const showToast = text => { const toast = $('toast'); toast.textContent = text; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); };
  document.title = `${player.tag} — ProSens`;
  $('crumbName').textContent = player.tag.toUpperCase(); $('playerName').textContent = player.name; $('playerTag').textContent = player.tag; $('playerTeam').textContent = player.team; $('playerRole').textContent = player.role; $('playerCountry').textContent = player.country;
  $('profilePhoto').style.backgroundImage = `url("${player.photo}")`; $('dpi').textContent = player.dpi; $('sensitivity').textContent = Number(player.sensitivity).toFixed(2); $('edpi').textContent = Math.round(player.dpi * player.sensitivity);
  $('mouseName').textContent = player.mouse; $('keyboardName').textContent = player.keyboard; $('mousepadName').textContent = player.mousepad; $('monitorName').textContent = player.monitor; $('crosshairText').textContent = player.crosshair; $('crosshairImage').src = player.crosshairImage || 'assets/mira.png?v=4';
  Object.entries(player.links || {}).forEach(([key, value]) => { const link = $(`${key}Link`); if (link) { link.href = value || '#'; link.style.display = value ? '' : 'none'; } });
  const copy = async (text, success) => { try { await navigator.clipboard.writeText(text); showToast(success); } catch { showToast('Não foi possível copiar.'); } };
  $('copySettings').addEventListener('click', () => copy(`${player.name} — ${player.tag}\nDPI: ${player.dpi}\nSensibilidade: ${player.sensitivity}\neDPI: ${Math.round(player.dpi * player.sensitivity)}\nRetícula: ${player.crosshair}`, 'Settings copiadas.'));
  $('crosshairCode').addEventListener('click', () => copy(player.crosshair, 'Código da retícula copiado.'));
  const setTheme = theme => { document.body.classList.toggle('dark', theme === 'dark'); $('themeToggle').textContent = theme === 'dark' ? '☼' : '◐'; localStorage.setItem('val-tactical-theme', theme); };
  setTheme(localStorage.getItem('val-tactical-theme') || 'dark'); $('themeToggle').addEventListener('click', () => setTheme(document.body.classList.contains('dark') ? 'light' : 'dark'));
  $('toast').insertAdjacentHTML('beforebegin', '<section class="comments-section profile-comments" id="comments"><div class="comments-intro"><p class="kicker">COMUNIDADE</p><h2>Comentários</h2><p>Deixe uma dica ou opinião sobre o setup deste jogador.</p></div><div class="comments-panel"><form class="comment-form" id="commentForm"><div class="comment-fields"><input name="author" maxlength="32" required placeholder="Seu nome"><textarea name="message" maxlength="300" required placeholder="Escreva um comentário..."></textarea></div><button type="submit">Publicar comentário</button></form><div class="comment-list" id="commentList"></div></div></section>');
  const escape = value => value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  const commentsKey = `val-tactical-comments-${player.id}`;
  const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
  const renderComments = () => { $('commentList').innerHTML = comments.length ? comments.map(comment => `<article class="comment-item"><span class="comment-avatar">${escape(comment.author.slice(0, 2).toUpperCase())}</span><div><strong>${escape(comment.author)}</strong><time>${new Date(comment.date).toLocaleDateString('pt-BR')}</time><p>${escape(comment.message)}</p></div></article>`).join('') : '<p class="empty-comments">Ainda não há comentários neste perfil.</p>'; };
  $('commentForm').addEventListener('submit', event => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)); comments.unshift({ author: data.author.trim(), message: data.message.trim(), date: new Date().toISOString() }); localStorage.setItem(commentsKey, JSON.stringify(comments)); event.currentTarget.reset(); renderComments(); showToast('Comentário publicado.'); });
  renderComments();
  $('toast').insertAdjacentHTML('beforebegin', '<footer class="site-footer"><div class="footer-brand"><a class="logo" href="index.html"><span class="logo-dot">P</span> Pro<span>Sens</span></a><p>Loadouts competitivos de VALORANT, feitos pela comunidade.</p></div><div><h3>Explorar</h3><a href="index.html#players">Jogadores</a><a href="#comments">Comentários</a></div><div><h3>Contato</h3><a href="mailto:contato@prosens.gg">contato@prosens.gg</a></div><div class="footer-credit"><span>© 2026 PROSENS</span><span>CRIADO PARA COMPETIR</span></div></footer>');
} else {
const savedPlayers = JSON.parse(localStorage.getItem('val-settings-players') || '[]');
const players = [...defaultPlayers, ...savedPlayers];
const requestedPlayer = new URLSearchParams(window.location.search).get('player');
let selectedId = players.some(player => player.id === requestedPlayer) ? requestedPlayer : players[0].id;
const $ = (id) => document.getElementById(id);
const toast = $('toast');

function message(text) { toast.textContent = text; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); }
function initials(name) { return name.split(' ').map(part => part[0]).slice(0, 2).join(''); }
function getSelected() { return players.find(player => player.id === selectedId); }

function getFilteredPlayers() {
  const query = $('playerSearch').value.toLowerCase();
  const role = $('roleFilter').value;
  const team = $('teamFilter').value;
  const country = $('countryFilter').value;
  const dpi = $('dpiFilter').value;
  const sensitivityRange = $('sensitivityFilter').value;
  return players.filter(player => `${player.name} ${player.tag} ${player.team}`.toLowerCase().includes(query) && (!role || player.role === role) && (!team || player.team === team) && (!country || player.country === country) && (!dpi || String(player.dpi) === dpi) && (!sensitivityRange || (sensitivityRange === 'low' && player.sensitivity <= .20) || (sensitivityRange === 'medium' && player.sensitivity > .20 && player.sensitivity <= .45) || (sensitivityRange === 'high' && player.sensitivity > .45)));
}
function selectPlayer(id, shouldScroll = true) {
  window.location.href = `player.html?player=${encodeURIComponent(id)}`;
  return;
  selectedId = id;
  const url = new URL(window.location.href);
  url.searchParams.set('player', id);
  history.pushState({ player: id }, '', url);
  renderList(); renderProfile();
  if (shouldScroll) $('settings').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function renderList() {
  const filtered = getFilteredPlayers();
  $('playerCount').textContent = `${players.length} ${players.length === 1 ? 'jogador' : 'jogadores'}`;
  $('homePlayerCount').textContent = String(players.length).padStart(2, '0');
  $('heroProfileCount').textContent = String(players.length).padStart(2, '0');
  $('playerList').innerHTML = filtered.length ? filtered.map(player => `<button class="player-row ${player.id === selectedId ? 'active' : ''}" data-id="${player.id}" type="button">${player.photo ? `<img class="player-avatar" src="${player.photo}" alt="">` : `<span class="player-avatar player-initials">${initials(player.name)}</span>`}<span><strong>${player.name}</strong><small>${player.team}</small></span></button>`).join('') : '<p class="directory-count">Nenhum jogador encontrado.</p>';
  document.querySelectorAll('.player-row').forEach(button => button.addEventListener('click', () => selectPlayer(button.dataset.id, false)));
}

function renderProfile() {
  const player = getSelected();
  $('crumbName').textContent = player.tag.toUpperCase(); $('playerName').textContent = player.name; $('playerTag').textContent = player.tag;
  $('playerTeam').textContent = player.team; $('playerRole').textContent = player.role; $('playerCountry').textContent = player.country;
  $('profilePhoto').style.backgroundImage = player.photo ? `url("${player.photo}")` : 'none'; $('profilePhoto').textContent = player.photo ? '' : initials(player.name);
  $('profilePhoto').classList.toggle('player-initials', !player.photo); $('dpi').textContent = player.dpi; $('sensitivity').textContent = Number(player.sensitivity).toFixed(2); $('edpi').textContent = Math.round(player.dpi * player.sensitivity);
  $('mouseName').textContent = player.mouse; $('keyboardName').textContent = player.keyboard; $('mousepadName').textContent = player.mousepad; $('monitorName').textContent = player.monitor; $('crosshairText').textContent = player.crosshair; $('crosshairImage').src = player.crosshairImage || 'assets/mira.png?v=4';
  Object.entries(player.links || {}).forEach(([key, value]) => { const link = $(`${key}Link`); if (link) { link.href = value || '#'; link.style.display = value ? '' : 'none'; } });
}

async function copy(text, success) { try { await navigator.clipboard.writeText(text); message(success); } catch { message('Não foi possível copiar.'); } }
$('copySettings').addEventListener('click', () => { const p = getSelected(); copy(`${p.name} — ${p.tag}\nDPI: ${p.dpi}\nSensibilidade: ${p.sensitivity}\neDPI: ${Math.round(p.dpi * p.sensitivity)}\nRetícula: ${p.crosshair}`, 'Settings copiadas.'); });
$('crosshairCode').addEventListener('click', () => copy(getSelected().crosshair, 'Código da retícula copiado.'));
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
['roleFilter', 'teamFilter', 'countryFilter', 'dpiFilter', 'sensitivityFilter'].forEach(id => $(id).addEventListener('change', renderList));
window.addEventListener('popstate', () => { const id = new URLSearchParams(window.location.search).get('player'); if (players.some(player => player.id === id)) { selectedId = id; renderList(); renderProfile(); } });

const modal = $('playerModal'); $('openModal').addEventListener('click', () => modal.showModal()); $('closeModal').addEventListener('click', () => modal.close());
$('playerForm').addEventListener('submit', event => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)); const player = { id: `player-${Date.now()}`, ...data, dpi: Number(data.dpi), sensitivity: Number(data.sensitivity), mousepad: 'Não informado', keyboard: 'Não informado', monitor: 'Não informado', crosshair: 'Não informado', links: {} }; players.push(player); localStorage.setItem('val-settings-players', JSON.stringify(players.filter(p => p.id !== 'pacheco' && p.id !== 'z4gb'))); event.currentTarget.reset(); modal.close(); selectPlayer(player.id, false); message('Jogador adicionado.'); });


function setTheme(theme) { document.body.classList.toggle('dark', theme === 'dark'); $('themeToggle').textContent = theme === 'dark' ? '☼' : '◐'; localStorage.setItem('val-tactical-theme', theme); }
setTheme(localStorage.getItem('val-tactical-theme') || 'dark'); $('themeToggle').addEventListener('click', () => setTheme(document.body.classList.contains('dark') ? 'light' : 'dark'));
const updateHeaderSearch = () => document.body.classList.toggle('scrolled', window.scrollY > 110);
updateHeaderSearch(); window.addEventListener('scroll', updateHeaderSearch, { passive: true });
renderList(); renderProfile();
}
