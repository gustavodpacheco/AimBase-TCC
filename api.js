// ============================================================
// Camada de comunicação com a API PHP (REST)
// Todas as chamadas retornam Promise de JSON padronizado:
//   { success, message, data }
// ============================================================
const API = {
  base: 'api',

  // ---- Players ----
  async listPlayers(filters = {}) {
    const qs = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, v);
    });
    const query = qs.toString() ? `?${qs.toString()}` : '';
    const res = await fetch(`${this.base}/players.php${query}`);
    return this.handle(res);
  },

  async getPlayer(id) {
    const res = await fetch(`${this.base}/player.php?id=${encodeURIComponent(id)}`);
    return this.handle(res);
  },

  async getPlayerBySlug(slug) {
    const res = await fetch(`${this.base}/player.php?slug=${encodeURIComponent(slug)}`);
    return this.handle(res);
  },

  async createPlayer(payload) {
    const res = await fetch(`${this.base}/players.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return this.handle(res);
  },

  async updatePlayer(payload) {
    const res = await fetch(`${this.base}/players.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return this.handle(res);
  },

  async deletePlayer(id) {
    const res = await fetch(`${this.base}/players.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    return this.handle(res);
  },

  // ---- Games ----
  async listGames() {
    const res = await fetch(`${this.base}/games.php`);
    return this.handle(res);
  },

  // ---- Teams ----
  async listTeams() {
    const res = await fetch(`${this.base}/teams.php`);
    return this.handle(res);
  },

  // ---- Filters ----
  async listFilters() {
    const res = await fetch(`${this.base}/filters.php`);
    return this.handle(res);
  },

  async createTeam(payload) {
    const res = await fetch(`${this.base}/teams.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return this.handle(res);
  },

  // ---- Peripherals ----
  async listPeripherals(type) {
    const qs = type ? `?type=${encodeURIComponent(type)}` : '';
    const res = await fetch(`${this.base}/peripherals.php${qs}`);
    return this.handle(res);
  },

  async createPeripheral(payload) {
    const res = await fetch(`${this.base}/peripherals.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return this.handle(res);
  },

  async updatePeripheral(payload) {
    const res = await fetch(`${this.base}/peripherals.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return this.handle(res);
  },

  async deletePeripheral(id) {
    const res = await fetch(`${this.base}/peripherals.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    return this.handle(res);
  },

  // ---- Auth ----
  async register(credentials) {
    const res = await fetch(`${this.base}/auth.php?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'same-origin',
    });
    return this.handle(res);
  },

  async login(credentials) {
    const res = await fetch(`${this.base}/auth.php?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'same-origin',
    });
    return this.handle(res);
  },

  async logout() {
    const res = await fetch(`${this.base}/auth.php?action=logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
      credentials: 'same-origin',
    });
    return this.handle(res);
  },

  async me() {
    const res = await fetch(`${this.base}/auth.php?action=me`, { credentials: 'same-origin' });
    return this.handle(res);
  },

  // ---- Comments ----
  async listComments(playerId) {
    const res = await fetch(`${this.base}/comments.php?player_id=${encodeURIComponent(playerId)}`);
    return this.handle(res);
  },

  async createComment(payload) {
    const res = await fetch(`${this.base}/comments.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return this.handle(res);
  },

  async deleteComment(id) {
    const res = await fetch(`${this.base}/comments.php?id=${encodeURIComponent(id)}`, { method: 'DELETE', credentials: 'same-origin' });
    return this.handle(res);
  },

  async handle(res) {
    let json;
    try {
      json = await res.json();
    } catch {
      return { success: false, message: 'Resposta inválida do servidor.', data: null };
    }
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Erro na requisição.');
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
  const pcSpecs = (row.pc_specs || []).map(s => [s.label, s.label, s.link, s.image]);

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
    team: row.team_name || 'Sem time',
    role: row.role || 'Não informado',
    country: row.country || 'Não informado',
    photo: row.photo,
    slug: row.slug,
    game: row.game_name || 'VALORANT',
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
