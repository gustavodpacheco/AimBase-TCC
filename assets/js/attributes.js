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
