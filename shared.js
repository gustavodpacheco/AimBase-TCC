// ============================================================
// shared.js - Helpers compartilhados entre as páginas
// Carregado antes de script.js e profile.js
// ============================================================

/** Escapa texto para uso seguro em HTML (previne XSS). */
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

/** Sanitiza URLs de atributos href/src, bloqueando javascript: e afins. */
const safeUrl = value => {
  const url = String(value || '').trim();
  if (!url) return '#';
  try {
    const p = new URL(url, window.location.origin);
    if (p.protocol === 'javascript:' || p.protocol === 'data:') return '#';
  } catch { return '#'; }
  return url;
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
