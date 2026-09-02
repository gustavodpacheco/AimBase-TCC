// ============================================================
// attributes.js - Helper do card estilo "FIFA" (carta colecionável)
// Lê os atributos (escala 0-100) de um jogador e devolve rótulos
// seguros para exibição, mostrando "—" quando o campo está ausente
// (nunca "undefined"/"null" e sem quebrar o layout).
// Carregado antes de script.js e profile.js.
// ============================================================

/** Atributos do card, na ordem de exibição do rodapé (sem o Trashtalk, que vai separado). */
const FIFA_ATTRS = [
  { key: 'operator', label: 'Operator' },
  { key: 'rifle', label: 'Rifle' },
  { key: 'pistol', label: 'Pistol' },
  { key: 'clutch', label: 'Clutch' },
];

/**
 * Lê um atributo numérico do jogador (0-100).
 * Aceita `player.attrs` (estrutura nova, mock/API). Retorna null quando ausente.
 * `0` é um valor válido (ex.: Trashtalk 0) e NÃO é tratado como ausente.
 */
function fifaAttr(player, key) {
  const a = player && player.attrs;
  if (!a) return null;
  const v = a[key];
  return (v === null || v === undefined) ? null : Number(v);
}

/**
 * Devolve a string de exibição para um atributo: o número, ou "—" se ausente.
 */
function fifaValue(player, key) {
  const v = fifaAttr(player, key);
  return (v === null) ? '—' : String(v);
}

/** Overall (rating geral) — valor próprio do jogador, não calculado. */
function fifaOverall(player) {
  return fifaValue(player, 'overall');
}

/** Tag/normaliza para data-game usada na cor da moldura. */
function fifaGameTag(game) {
  const g = String(game || '').toUpperCase();
  return g.startsWith('COUNTER') || g === 'CS2' ? 'CS2' : (g || 'VALORANT');
}

/**
 * Gera o HTML completo do card estilo "FIFA".
 * @param {object} player - jogador (data.js ou mapPlayerForUi).
 * @param {object} [opts]
 * @param {boolean} [opts.large] - usa o modificador --lg (perfil) em vez do compacto.
 * @param {object} [opts.links] - se informado, faz o card ser navegável (a / href do perfil).
 * @returns {string} HTML seguro (usa esc/safeUrl de shared.js).
 */
function fifaCardHTML(player, opts = {}) {
  const large = !!opts.large;
  const gameTag = fifaGameTag(player.game);
  const photo = player.photo ? `<img src="${safeUrl(player.photo)}" alt="${esc(player.name)}">` : '';
  const initials = photo ? '' : `<span class="fifa-card__initials">${esc(initialsOf(player.name))}</span>`;
  const meta = esc([player.team, player.country].filter(Boolean).join(' · '));

  const statCell = key => `
    <div class="fifa-card__stat">
      <span class="fifa-card__stat-value">${fifaValue(player, key)}</span>
      <span class="fifa-card__stat-label">${FIFA_ATTRS.find(a => a.key === key).label}</span>
    </div>`;

  const stats = FIFA_ATTRS.map(a => statCell(a.key)).join('');

  const cls = `fifa-card${large ? ' fifa-card--lg' : ''}${opts.active ? ' active' : ''}`;
  const tag = large ? 'div' : 'button';
  const attr = large ? (opts.links && opts.links.href ? ` data-href="${safeUrl(opts.links.href)}"` : '') : ` data-id="${esc(player.id)}" type="button"`;

  return `<${tag} class="${cls}" data-game="${esc(gameTag)}"${attr}>
    <div class="fifa-card__head">
      <span class="fifa-card__overall">${fifaOverall(player)}</span>
      <div class="fifa-card__head-meta">
        <span class="fifa-card__role">${esc(player.role || '—')}</span>
        <span class="fifa-card__game">${esc(gameTag)}</span>
      </div>
    </div>
    <div class="fifa-card__avatar">${photo}${initials}</div>
    <div class="fifa-card__body">
      <${large ? 'h1' : 'h3'} class="fifa-card__name">${esc(player.name)}</${large ? 'h1' : 'h3'}>
      <p class="fifa-card__meta">${meta}</p>
    </div>
    <div class="fifa-card__stats">${stats}</div>
    <div class="fifa-card__trash">
      <span class="fifa-card__stat-value">${fifaValue(player, 'trashtalk')}</span>
      <span class="fifa-card__stat-label">Trashtalk</span>
    </div>
  </${tag}>`;
}

/** Iniciais para o fallback de avatar quando não há foto. */
function initialsOf(name) {
  return String(name || '').split(' ').map(p => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';
}
