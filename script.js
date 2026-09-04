// ============================================================
// script.js - Lógica da página inicial (index.html) / diretório
// Depende de: data.js (defaultPlayers, savedPlayers),
//             shared.js (esc, safeUrl, showToast, applyTheme),
//             api.js (API).
// ============================================================

// Estado global dos jogadores (carregado da API quando disponível)
let players = [];
let apiActive = false;

/** Carrega os jogadores do banco via API. Retorna true se tiver sucesso. */
async function loadPlayersFromApi() {
  try {
    const res = await API.listPlayers();
    const list = (res.data && res.data.players) || [];
    if (list.length) {
      players = list.map(row => {
        const settings = row.settings || {};
        return {
          id: String(row.id),
          name: row.real_name || row.nickname,
          tag: row.nickname,
          team: row.team_name || 'Sem time',
          teamLogo: row.team_logo,
          role: row.role || 'Não informado',
          country: row.country || 'Não informado',
          photo: row.photo,
          slug: row.slug,
          game: row.game_name || 'VALORANT',
          isPro: !!row.is_pro,
          dpi: settings.dpi,
          sensitivity: settings.sensitivity,
          edpi: settings.dpi && settings.sensitivity ? Math.round(settings.dpi * settings.sensitivity) : null,
        };
      });
      const seen = new Set();
      players = players.filter(p => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

const requestedPlayer = new URLSearchParams(window.location.search).get('player');
let selectedId = null;
let proOnly = false;
const $ = (id) => document.getElementById(id);
const toast = $('toast');

function message(text) { toast.textContent = text; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); }
function initials(name) { return (name || '').split(' ').map(part => part[0]).slice(0, 2).join('') || '?'; }

function getFilteredPlayers() {
  const query = $('playerSearch').value.toLowerCase();
  const role = $('roleFilter').value;
  const team = $('teamFilter').value;
  const country = $('countryFilter').value;
  const game = $('gameFilter').value;
  const dpi = $('dpiFilter').value;
  const sensitivityRange = $('sensitivityFilter').value;
  return players.filter(player => (proOnly ? player.isPro : true) && `${player.name} ${player.tag} ${player.team} ${player.game || ''}`.toLowerCase().includes(query) && (!game || player.game === game) && (!role || player.role === role) && (!team || player.team === team) && (!country || player.country === country) && (!dpi || String(player.dpi) === dpi) && (!sensitivityRange || (sensitivityRange === 'low' && player.sensitivity <= .20) || (sensitivityRange === 'medium' && player.sensitivity > .20 && player.sensitivity <= .45) || (sensitivityRange === 'high' && player.sensitivity > .45)));
}
function selectPlayer(id) {
  const player = players.find(p => p.id === id);
  const target = player && player.slug ? player.slug : id;
  window.location.href = `player.html?player=${encodeURIComponent(target)}`;
}

/** Mapeia o nome do jogo para: rótulo curto + data-game (cor da moldura/badge). */
function gameBadge(game) {
  const g = String(game || 'VALORANT');
  if (g.toLowerCase().includes('counter') || g.toLowerCase() === 'cs2') return { label: 'CS2', game: 'Counter-Strike 2' };
  if (g.toLowerCase().includes('rainbow') || g.toLowerCase().includes('r6')) return { label: 'R6', game: 'Rainbow Six' };
  return { label: 'VALORANT', game: 'VALORANT' };
}

function homeCardHTML(player) {
  const badge = gameBadge(player.game);
  const avatar = player.photo
    ? `<img class="home-card__photo" src="${safeUrl(player.photo)}" alt="${esc(player.name)}" loading="lazy">`
    : `<span class="home-card__photo home-card__initials">${esc(initials(player.name))}</span>`;
  const teamLogo = player.teamLogo ? `<img class="home-card__team-logo" src="${safeUrl(player.teamLogo)}" alt="Logo ${esc(player.team)}">` : '';
  return `<button class="home-card ${player.id === selectedId ? 'active' : ''}" data-id="${esc(player.id)}" type="button" data-game="${esc(badge.game)}">
    <div class="home-card__media">
      ${avatar}
      <span class="home-card__badge">${esc(badge.label)}</span>
      ${player.isPro ? '<span class="home-card__pro">PRO</span>' : ''}
    </div>
    <div class="home-card__body">
      <strong class="home-card__name">${esc(player.name)}</strong>
      <div class="home-card__meta">
        <span class="home-card__team">${teamLogo}${esc(player.team)}</span>
        <span class="home-card__country">${esc(player.country)}</span>
      </div>
    </div>
  </button>`;
}
function renderList() {
  $('playerCount').textContent = `${players.length} ${players.length === 1 ? 'jogador' : 'jogadores'}`;
  $('homePlayerCount').textContent = String(players.length).padStart(2, '0');
  $('heroProfileCount').textContent = String(players.length).padStart(2, '0');
  const filtered = getFilteredPlayers();
  $('playerList').innerHTML = filtered.length ? filtered.map(homeCardHTML).join('') : '<p class="directory-count">Nenhum jogador encontrado.</p>';
  document.querySelectorAll('.home-card').forEach(button => button.addEventListener('click', () => selectPlayer(button.dataset.id)));
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

// ---- Aba "Pro Players" ----
function setProFilter(enabled) {
  proOnly = enabled;
  document.getElementById('tabAll').classList.toggle('is-active', !enabled);
  document.getElementById('tabPro').classList.toggle('is-active', enabled);
  renderList();
}
document.getElementById('tabAll').addEventListener('click', () => setProFilter(false));
document.getElementById('tabPro').addEventListener('click', () => setProFilter(true));

applyTheme(localStorage.getItem('val-tactical-theme') || 'dark');
$('themeToggle').addEventListener('click', () => applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark'));
const updateHeaderSearch = () => document.body.classList.toggle('scrolled', window.scrollY > 110);
updateHeaderSearch();
window.addEventListener('scroll', updateHeaderSearch, { passive: true });
document.querySelector('.footer-brand p').textContent = 'Configurações competitivas de múltiplos jogos, feitas pela comunidade.';

// ---- Modal de adicionar jogador (via API) ----
const modal = $('playerModal');
$('openModal').addEventListener('click', () => modal.showModal());
$('closeModal').addEventListener('click', () => modal.close());
let playerFormBusy = false;
$('playerForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (playerFormBusy) return;
  playerFormBusy = true;
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
  } finally {
    playerFormBusy = false;
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

function populateSelect(select, items, valueKey, labelKey) {
  const existing = Array.from(select.options).map(o => o.value);
  items.forEach(item => {
    const value = valueKey ? item[valueKey] : item;
    const label = labelKey ? item[labelKey] : item;
    if (!existing.includes(String(value))) {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = label;
      select.appendChild(opt);
    }
  });
}

async function loadFilters() {
  try {
    const res = await API.listFilters();
    const data = res.data || {};
    // Jogos: mantém o valor como o NOME (pra casar com player.game da API)
    populateSelect($('gameFilter'), data.games || [], 'name', 'name');
    populateSelect($('teamFilter'), data.teams || [], 'name', 'name');
    populateSelect($('roleFilter'), data.roles || [], null, null);
    populateSelect($('countryFilter'), data.countries || [], null, null);
  } catch { /* mantém filtros estáticos */ }
}

async function refreshPlayers() {
  const loaded = await loadPlayersFromApi();
  if (!loaded) {
    players = [...defaultPlayers, ...savedPlayers];
  }
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

// ---- Autenticação (via API + sessão) ----
const authModal = $('authModal');
let authMode = 'login';
const setAuthMessage = text => { $('authMessage').textContent = text; };
function renderAuth() {
  const user = currentUser;
  $('authTrigger').hidden = Boolean(user);
  $('authLogout').hidden = !user;
  if (user) $('authTrigger').textContent = user.username;
}
function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === 'register';
  $('authTitle').textContent = isRegister ? 'CRIAR CONTA' : 'ENTRAR';
  $('authKicker').textContent = isRegister ? 'NOVA CONTA' : 'ENTRAR';
  $('authIntro').textContent = isRegister ? 'Crie sua conta e entre para a comunidade.' : 'Acesse sua conta para gerenciar seu perfil.';
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
$('authLogout').addEventListener('click', async () => {
  try { await API.logout(); } catch { /* ignora */ }
  currentUser = null;
  renderAuth();
  message('Sessão encerrada.');
});
$('authClose').addEventListener('click', () => authModal.close());
$('forgotPassword').addEventListener('click', () => setAuthMessage('Em uma integração real, enviaremos um link de recuperação para seu e-mail.'));
document.querySelectorAll('[data-provider]').forEach(button => button.addEventListener('click', () => setAuthMessage(`Login com ${button.dataset.provider} é uma demonstração nesta versão.`)));
$('authForm').addEventListener('submit', async event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  setAuthMessage('');
  try {
    const res = authMode === 'register'
      ? await API.register({ username: data.username, email: data.email, password: data.password })
      : await API.login({ email: data.email, password: data.password });
    currentUser = res.data.user;
    authModal.close();
    renderAuth();
    message(authMode === 'register' ? 'Conta criada. Boas-vindas ao AimBase.' : `Bem-vindo, ${currentUser.username}.`);
  } catch (err) {
    setAuthMessage(err.message || 'Não foi possível concluir a operação.');
  }
});

let currentUser = null;
async function initAuth() {
  try {
    const res = await API.me();
    currentUser = res.data && res.data.user;
  } catch { currentUser = null; }
  renderAuth();
}
initAuth();
