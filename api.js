// ============================================================
// Camada de comunicação com a API PHP (REST)
// Todas as chamadas retornam Promise de JSON padronizado:
//   { success, message, data }
//
// Escritas (POST/PUT/DELETE) passam por API.write(), que:
//   - envia o cookie de sessão (credentials: same-origin)
//   - envia o token CSRF no header X-CSRF-Token
//   - renova o token e repete UMA vez se a resposta for 403
// ============================================================
const API = {
  base: 'api',
  csrfToken: null,

  // ---- CSRF ----
  async csrf(force = false) {
    if (force) this.csrfToken = null;
    if (this.csrfToken) return this.csrfToken;
    // Mesmo tratamento das demais leituras: JSON inválido ou HTTP de erro viram
    // Error com mensagem útil, em vez de SyntaxError cru do res.json().
    const json = await this.get(`${this.base}/auth.php?action=csrf`, { credentials: 'same-origin' });
    this.csrfToken = (json && json.data && json.data.token) || null;
    if (!this.csrfToken) throw new Error('Não foi possível obter o token CSRF.');
    return this.csrfToken;
  },

  /**
   * Leitura: fetch + contrato único de erro via handle().
   * Aceita as mesmas opções do fetch (credentials, signal, ...).
   */
  async get(url, options) {
    return this.handle(await fetch(url, options));
  },

  /** Escrita autenticada: sessão + token CSRF. */
  async write(url, method, payload) {
    const token = await this.csrf();
    const send = tk => fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': tk },
      body: payload === undefined ? undefined : JSON.stringify(payload),
      credentials: 'same-origin',
    });

    let res = await send(token);
    // Token expirado/sessão renovada: busca um novo e tenta mais uma vez.
    if (res.status === 403) {
      const fresh = await this.csrf(true);
      res = await send(fresh);
    }
    return this.handle(res);
  },

  // ---- Players ----
  async listPlayers(filters = {}) {
    const qs = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, v);
    });
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return this.get(`${this.base}/players.php${query}`);
  },

  async getPlayer(id) {
    return this.get(`${this.base}/player.php?id=${encodeURIComponent(id)}`);
  },

  async getPlayerBySlug(slug) {
    return this.get(`${this.base}/player.php?slug=${encodeURIComponent(slug)}`);
  },

  async createPlayer(payload) {
    return this.write(`${this.base}/players.php`, 'POST', payload);
  },

  async updatePlayer(payload) {
    return this.write(`${this.base}/players.php`, 'PUT', payload);
  },

  async deletePlayer(id) {
    return this.write(`${this.base}/players.php?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  // ---- Games ----
  async listGames() {
    return this.get(`${this.base}/games.php`);
  },

  // ---- Teams ----
  async listTeams() {
    return this.get(`${this.base}/teams.php`);
  },

  // ---- Filters ----
  async listFilters() {
    return this.get(`${this.base}/filters.php`);
  },

  async createTeam(payload) {
    return this.write(`${this.base}/teams.php`, 'POST', payload);
  },

  // ---- Peripherals ----
  async listPeripherals(type) {
    const qs = type ? `?type=${encodeURIComponent(type)}` : '';
    return this.get(`${this.base}/peripherals.php${qs}`);
  },

  async createPeripheral(payload) {
    return this.write(`${this.base}/peripherals.php`, 'POST', payload);
  },

  async updatePeripheral(payload) {
    return this.write(`${this.base}/peripherals.php`, 'PUT', payload);
  },

  async deletePeripheral(id) {
    return this.write(`${this.base}/peripherals.php?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  // ---- Auth ----
  async register(credentials) {
    return this.write(`${this.base}/auth.php?action=register`, 'POST', credentials);
  },

  async login(credentials) {
    return this.write(`${this.base}/auth.php?action=login`, 'POST', credentials);
  },

  async logout() {
    return this.write(`${this.base}/auth.php?action=logout`, 'POST', {});
  },

  async me() {
    return this.get(`${this.base}/auth.php?action=me`, { credentials: 'same-origin' });
  },

  // ---- Comments ----
  async listComments(playerId) {
    return this.get(`${this.base}/comments.php?player_id=${encodeURIComponent(playerId)}`);
  },

  async createComment(payload) {
    return this.write(`${this.base}/comments.php`, 'POST', payload);
  },

  async deleteComment(id) {
    return this.write(`${this.base}/comments.php?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  async handle(res) {
    // JSON inválido também é erro: lançar sempre mantém um único contrato
    // (try/catch) para o chamador, em vez de um retorno "sucesso" que
    // mentia — o chamador antigo só checava res.success e engolia o erro.
    let json = null;
    try {
      json = await res.json();
    } catch { /* resposta não-JSON: cai no throw abaixo */ }
    if (!res.ok || !json || !json.success) {
      // Em erro de rede/5xx costuma vir HTML (page de erro do PHP) e não há
      // message: incluí o status para o log do Laragon ajudar a diagnosticar.
      const detail = (json && json.message)
        || (res.ok ? 'Resposta inválida do servidor.' : `Falha na requisição (HTTP ${res.status}).`);
      throw new Error(detail);
    }
    return json;
  },
};

// ============================================================
// Mapeamento: registros do banco -> objeto usado pela UI
// ============================================================
function mapPlayerForUi(row) {
  const settings = row.settings || {};

  const socialObj = {};
  (row.social || []).forEach(s => { socialObj[s.platform] = s.url; });

  const videoSettings = (row.video_settings || []).map(v => [v.setting_key, v.setting_value]);
  // A UI (profile.js e attributes.js) lê [tipo, modelo, link, imagem]:
  // o "small" é o tipo (Processador, Placa de vídeo...) e o "strong" o modelo.
  const pcSpecs = (row.pc_specs || []).map(s => [s.spec_type, s.label, s.link, s.image]);

  const hasProductImages = settings.product_image_mouse || settings.product_image_keyboard ||
    settings.product_image_mousepad || settings.product_image_monitor || settings.product_image_headset;

  const productImages = hasProductImages ? {
    mouse: settings.product_image_mouse,
    keyboard: settings.product_image_keyboard,
    mousepad: settings.product_image_mousepad,
    monitor: settings.product_image_monitor,
    headset: settings.product_image_headset,
  } : undefined;

  const links = {
    mouse: settings.product_link_mouse,
    keyboard: settings.product_link_keyboard,
    mousepad: settings.product_link_mousepad,
    monitor: settings.product_link_monitor,
    headset: settings.product_link_headset,
  };

  const headset = settings.headset_model ? {
    name: settings.headset_model,
    link: links.headset,
  } : undefined;

  return {
    id: String(row.id),
    name: row.real_name || row.nickname,
    tag: row.nickname,
    // Vazio fica como null de propósito: o texto de fallback é traduzido em
    // textOr() na hora da exibição (ver shared.js), para não ficar preso ao
    // idioma carregado no momento do mapeamento.
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
    scopedSensitivity: settings.scoped_sensitivity,
    edpi: settings.edpi,
    mouse: settings.mouse_model,
    keyboard: settings.keyboard_model,
    mousepad: settings.mousepad_model,
    monitor: settings.monitor_model,
    crosshair: settings.crosshair,
    crosshairImage: settings.crosshair_image,
    agents: settings.agents,
    social: socialObj,
    videoSettings,
    pcSpecs,
    headset,
    productImages,
    links,
    settings,
    // Atributos do card estilo "FIFA" (0-100). Se ainda não vierem do
    // servidor, ficam undefined e a UI exibe "—" no lugar.
    attrs: {
      overall: row.overall ?? null,
      operator: row.operator ?? null,
      rifle: row.rifle ?? null,
      pistol: row.pistol ?? null,
      clutch: row.clutch ?? null,
      trashtalk: row.trashtalk ?? null,
    },
  };
}
