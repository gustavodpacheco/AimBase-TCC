// ============================================================
// shared.js - Helpers compartilhados entre as páginas
// Carregado antes de script.js e profile.js
// ============================================================

/** Escapa texto para uso seguro em HTML (previne XSS). */
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

/**
 * Valida uma URL e devolve a forma normalizada (sem escape), ou null.
 *
 * Regras:
 *  - recusa javascript:, data:, vbscript:, file: e qualquer esquema fora de http(s);
 *  - remove controles/tabs/newlines, que o parser de URL ignora e que
 *    esconderiam esquemas perigosos ("java\tscript:alert(1)");
 *  - normaliza via URL() para pegar "//evil.com" e "/\evil.com";
 *  - recusa credenciais embutidas (https://user:pass@host);
 *  - aceita apenas http(s) absolutos e caminhos relativos à própria origem.
 */
const validatedUrl = value => {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  const cleaned = raw.replace(/[\u0000-\u001F\u007F]/g, '');
  if (!cleaned) return null;

  let parsed;
  try {
    parsed = new URL(cleaned, window.location.origin);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
  if (parsed.username || parsed.password) return null;

  const isRelative = !/^[a-z][a-z0-9+.-]*:/i.test(cleaned) && !cleaned.startsWith('//');
  return isRelative ? cleaned : parsed.href;
};

/**
 * URL segura para atributos href/src: validada por validatedUrl e
 * escapada com esc(), pronta para ser interpolada em aspas.
 * Devolve '#' quando inválida.
 */
const safeUrl = value => {
  const safe = validatedUrl(value);
  return safe === null ? '#' : esc(safe);
};

/**
 * URL segura para valores de CSS (ex.: style.backgroundImage).
 * Devolve 'none' quando inválida e escapa " ' \ e ) para não
 * conseguir fechar a regra url("...").
 */
const safeCssUrl = value => {
  const safe = validatedUrl(value);
  if (safe === null) return 'none';
  return `url("${safe.replace(/["'()\\]/g, char => '\\' + char)}")`;
};

/** Exibe um toast breve. */
function showToast(text) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

/** Aplica (e alterna) o tema claro/escuro. */
function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.textContent = theme === 'dark' ? '☼' : '◐';
  localStorage.setItem('val-tactical-theme', theme);
}

/** Copia texto para a área de transferência com feedback. */
async function copyText(text, successMsg) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMsg);
  } catch {
    showToast('Não foi possível copiar.');
  }
}
