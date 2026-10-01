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
          // Vazio fica como null; o fallback traduzido é aplicado em textOr() na exibição.
    team: row.team_name || null,
          teamLogo: row.team_logo,
    role: row.role || null,
    country: row.country || null,
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

function initials(name) { return (name || '').split(' ').map(part => part[0]).slice(0, 2).join('') || '?'; }

/**
 * Faixas de sensibilidade por jogo: [min, max).
 *
 * `min` é INCLUSIVO e `max` é EXCLUSIVO, ou seja, intervalos meio-abertos. Isso
 * faz as três faixas particionarem o eixo sem sobreposição nem buraco, e casa
 * com os rótulos traduzidos ("Baixa (< 0.20)", "Alta (≥ 0.45)").
 * CS2 e R6 usam escalas diferentes do VALORANT: 0.35 é "baixa" num e "média" no
 * outro, então um único par de limites classificava todo mundo errado.
 */
const SENSITIVITY_BANDS = {
  'VALORANT': { low: [0, 0.20], medium: [0.20, 0.45], high: [0.45, Infinity] },
  'Counter-Strike 2': { low: [0, 1.00], medium: [1.00, 2.00], high: [2.00, Infinity] },
  'Rainbow Six': { low: [0, 6], medium: [6, 12], high: [12, Infinity] },
};
const SENSITIVITY_BAND_ORDER = ['low', 'medium', 'high'];
// Nome canônico do jogo -> prefixo das chaves i18n das faixas.
const SENSITIVITY_BAND_I18N = {
  'VALORANT': 'valorant',
  'Counter-Strike 2': 'cs2',
  'Rainbow Six': 'r6',
};

/** O jogador está na faixa escolhida? */
function matchesSensitivityBand(player, band) {
  const bands = SENSITIVITY_BANDS[gameBadge(player.game).game];
  if (!bands || !bands[band]) return false;
  const raw = player.sensitivity;
  // Sem sensibilidade no banco não é "baixa": antes, null <= 0.20 era true e
  // o jogador sem o campo caía na faixa baixa.
  if (raw == null || String(raw).trim() === '') return false;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return false;
  const [min, max] = bands[band];
  return value >= min && value < max;
}

/**
 * Rótulos das faixas dependem do jogo escolhido: os números no texto
 * ("Baixa (até 0.20)") só fazem sentido para a escala daquele jogo.
 * Sem jogo selecionado, mostra só o nome da faixa.
 */
function updateSensitivityLabels() {
  const game = $('gameFilter').value;
  const prefix = SENSITIVITY_BAND_I18N[game];
  SENSITIVITY_BAND_ORDER.forEach(band => {
    const option = document.querySelector(`#sensitivityFilter option[value="${band}"]`);
    if (!option) return;
    option.textContent = I18N.t(prefix ? `sens.${prefix}.${band}` : `sens.${band}`);
  });
}

function getFilteredPlayers() {
  const query = $('playerSearch').value.toLowerCase();
  const role = $('roleFilter').value;
  const team = $('teamFilter').value;
  const country = $('countryFilter').value;
  const game = $('gameFilter').value;
  const dpi = $('dpiFilter').value;
  const sensitivityRange = $('sensitivityFilter').value;
  return players.filter(player => (proOnly ? player.isPro : true) && `${player.name} ${player.tag} ${player.team || ''} ${player.game || ''}`.toLowerCase().includes(query) && (!game || player.game === game) && (!role || player.role === role) && (!team || player.team === team) && (!country || player.country === country) && (!dpi || String(player.dpi) === dpi) && (!sensitivityRange || matchesSensitivityBand(player, sensitivityRange)));
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
    ? `<img class="home-card__photo" src="${safeUrl(player.photo)}" alt="${esc(player.name)}" loading="lazy" decoding="async">`
    : `<span class="home-card__photo home-card__initials">${esc(initials(player.name))}</span>`;
  // Traduzido na exibição (e não no mapeamento) para acompanhar troca de idioma.
  const team = textOr(player.team, 'common.noTeam');
  const teamLogo = player.teamLogo ? `<img class="home-card__team-logo" src="${safeUrl(player.teamLogo)}" alt="Logo ${esc(team)}" loading="lazy" decoding="async">` : '';
  return `<button class="home-card ${player.id === selectedId ? 'active' : ''}" data-id="${esc(player.id)}" type="button" data-game="${esc(badge.game)}">
    <div class="home-card__media">
      ${avatar}
      <span class="home-card__badge">${esc(badge.label)}</span>
      ${player.isPro ? '<span class="home-card__pro">PRO</span>' : ''}
    </div>
    <div class="home-card__body">
      <strong class="home-card__name">${esc(player.name)}</strong>
      <div class="home-card__meta">
        <span class="home-card__team">${teamLogo}${esc(team)}</span>
        <span class="home-card__country">${esc(textOr(player.country, 'common.notInformed'))}</span>
      </div>
    </div>
  </button>`;
}
function renderList() {
  $('playerCount').textContent = I18N.t('directory.players', { count: players.length });
  $('homePlayerCount').textContent = String(players.length).padStart(2, '0');
  $('heroProfileCount').textContent = String(players.length).padStart(2, '0');
  const filtered = getFilteredPlayers();
  $('playerList').innerHTML = filtered.length ? filtered.map(homeCardHTML).join('') : '<p class="directory-count">' + I18N.t('directory.noResults') + '</p>';
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
// Trocar o jogo muda os números no rótulo das faixas de sensibilidade.
$('gameFilter').addEventListener('change', updateSensitivityLabels);
updateSensitivityLabels();
// Ao trocar de idioma, os textos que o i18n.js não conhece precisam ser
// reescritos: os rótulos das faixas e os fallbacks traduzidos dos cards
// (time/país), que são montados por JS.
document.addEventListener('i18n:changed', () => {
  updateSensitivityLabels();
  renderList();
});

// ---- Aba "Pro Players" ----
function setProFilter(enabled) {
  proOnly = enabled;
  document.getElementById('tabAll').classList.toggle('is-active', !enabled);
  document.getElementById('tabPro').classList.toggle('is-active', enabled);
  renderList();
}
document.getElementById('tabAll').addEventListener('click', () => setProFilter(false));
document.getElementById('tabPro').addEventListener('click', () => setProFilter(true));

initTheme();
const updateHeaderSearch = () => document.body.classList.toggle('scrolled', window.scrollY > 110);
updateHeaderSearch();
window.addEventListener('scroll', updateHeaderSearch, { passive: true });
// A tagline do rodapé já vem traduzida por data-i18n="footer.desc" no HTML;
// o script não deve sobrescrever isso com texto fixo em português.

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
    showToast(res.message || I18N.t('toast.playerAdded'));
    await refreshPlayers();
  } catch (err) {
    showToast(err.message || I18N.t('toast.playerAddFailed'));
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

/**
 * Carrega a lista de jogadores e escolhe o selecionado.
 *
 * `preferRequested` só vale no boot: a URL pode pedir um jogador específico
 * (?player=). Depois de criar um jogador, o que importa é voltar ao topo da
 * lista, senão a seleção fica presa num id que acabou de mudar.
 */
async function refreshPlayers(preferRequested = false) {
  const loaded = await loadPlayersFromApi();
  if (loaded) apiActive = true;
  if (!loaded) players = [...defaultPlayers, ...savedPlayers];
  const validRequested = preferRequested && requestedPlayer && players.some(p => p.id === requestedPlayer);
  selectedId = validRequested ? requestedPlayer : (players[0] || {}).id || null;
  renderList();
}

(async function initHome() {
  await refreshPlayers(true);
  loadFilters();
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
  // A criação de jogador é uma escrita: só faz sentido para o painel (role=admin).
  $('openModal').hidden = !(user && user.role === 'admin');
}
function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === 'register';
  const p = isRegister ? 'register' : 'login';
  $('authTitle').textContent = I18N.t('auth.title.' + p);
  $('authKicker').textContent = I18N.t('auth.kicker.' + p);
  $('authIntro').textContent = I18N.t('auth.intro.' + p);
  $('usernameField').hidden = !isRegister;
  $('authUsername').required = isRegister;
  $('authEmail').placeholder = I18N.t('auth.emailPlaceholder.' + p);
  $('authPassword').autocomplete = isRegister ? 'new-password' : 'current-password';
  $('authSubmit').textContent = I18N.t('auth.submit.' + p);
  // Antes o innerHTML recriava o <button> a cada troca e o listener era
  // religado, acumulando handlers no botão anterior. O botão agora é fixo no
  // HTML e só os textos mudam.
  $('authSwitchPrompt').textContent = I18N.t('auth.switch.prompt.' + p);
  $('authSwitch').textContent = I18N.t('auth.switch.action.' + p);
  setAuthMessage('');
}
$('authSwitch').addEventListener('click', () => setAuthMode(authMode === 'register' ? 'login' : 'register'));
function openAuth(mode = 'login') { setAuthMode(mode); authModal.showModal(); $('authEmail').focus(); }
$('authTrigger').addEventListener('click', () => openAuth());
$('authLogout').addEventListener('click', async () => {
  try { await API.logout(); } catch { /* ignora */ }
  currentUser = null;
  renderAuth();
  showToast(I18N.t('toast.sessionClosed'));
});
$('authClose').addEventListener('click', () => authModal.close());
$('forgotPassword').addEventListener('click', () => setAuthMessage(I18N.t('auth.forgotInfo')));
document.querySelectorAll('[data-provider]').forEach(button => button.addEventListener('click', () => setAuthMessage(I18N.t('auth.provider.demo', { provider: button.dataset.provider }))));
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
    showToast(authMode === 'register'
      ? I18N.t('auth.toast.registered')
      : I18N.t('auth.toast.welcome', { username: currentUser.username }));
  } catch (err) {
    setAuthMessage(err.message || I18N.t('auth.toast.failed'));
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
// O HTML do modal de auth vem em português como valor inicial; sem esta chamada
// o texto fixo ficaria visível até o usuário abrir o modal.
setAuthMode('login');
initAuth();
