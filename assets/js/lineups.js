// ============================================================
// lineups.js - Página de lineups (lineups.html)
// Depende de: shared.js (applyTheme), data.js (valLineups).
// ============================================================

if (document.body.dataset.page === 'lineups') {
  const lineups = [
    {
      game: 'CS2',
      gameClass: 'cs2',
      map: 'Dust 2',
      id: 'dust2',
      items: [
        { src: 'https://www.youtube.com/watch?v=cwcjhxBDCMY&t=7s', label: 'Smokes de Dust 2' },
      ],
    },
    {
      game: 'CS2',
      gameClass: 'cs2',
      map: 'Inferno',
      id: 'inferno',
      items: [
        { src: 'https://www.youtube.com/watch?v=ZgxBySyBpUU', label: 'Smoke útil (linha fixa)' },
      ],
    },
    {
      game: 'CS2',
      gameClass: 'cs2',
      map: 'Mirage',
      id: 'mirage',
      items: [
        { src: 'https://www.youtube.com/watch?v=CjmGAXJySjc&t=2s', label: 'Smokes de Mirage' },
      ],
    },
    {
      game: 'CS2',
      gameClass: 'cs2',
      map: 'Anubis',
      id: 'anubis',
      items: [
        { src: 'https://www.youtube.com/watch?v=bImn0A5eL80&t=5s', label: 'Lineup de Anubis' },
      ],
    },
    {
      game: 'CS2',
      gameClass: 'cs2',
      map: 'Cache',
      id: 'cache',
      items: [
        { src: 'https://www.youtube.com/watch?v=9VYb8AJd9Qw&t=17s', label: 'Lineup de Cache' },
      ],
    },
    {
      game: 'CS2',
      gameClass: 'cs2',
      map: 'Overpass',
      id: 'overpass',
      items: [
        { src: 'https://www.youtube.com/watch?v=BaSEAcxxgQE', label: 'Lineup de Overpass' },
      ],
    },
    {
      game: 'CS2',
      gameClass: 'cs2',
      map: 'Nuke',
      id: 'nuke',
      items: [
        { src: 'https://www.youtube.com/watch?v=OZvf_eCiMWE', label: 'Lineup de Nuke' },
      ],
    },
    ...valLineups.map(group => ({
      game: 'VALORANT',
      gameClass: 'valorant',
      map: group.map,
      id: group.id,
      items: group.items,
    })),
  ];

  const colorTitles = { orange: 'Feita/aprendida por mim', purple: 'VCT', black: 'Guia Tseeky', yellow: 'YouTube (comunidade)' };

  function ytEmbed(url) {
    const str = String(url);
    const short = str.match(/youtu\.be\/([\w-]{6,})/);
    const watch = str.match(/[?&]v=([\w-]{6,})/);
    const id = (watch && watch[1]) || (short && short[1]);
    if (!id) return null;
    const t = str.match(/[?&]t=(\d+)s?/);
    let embed = `https://www.youtube.com/embed/${id}`;
    if (t) embed += `?start=${t[1]}`;
    return embed;
  }

  function buildMedia(src, label) {
    const embed = ytEmbed(src);
    if (embed) {
      return `<iframe src="${embed}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen title="${esc(label)}"></iframe>`;
    }
    return `<video src="${safeUrl(src)}" controls preload="metadata" playsinline></video>`;
  }

  function clipCard(item) {
    const tags = [];
    if (item.agent) tags.push(`<span class="clip-agent">${esc(item.agent)}</span>`);
    if (item.side) tags.push(`<span class="clip-side clip-side--${esc(item.side)}">${item.side === 'attack' ? 'ATK' : 'DEF'}</span>`);
    const dot = item.color ? `<span class="clip-color clip-color--${esc(item.color)}" title="${esc(colorTitles[item.color] || '')}"></span>` : '';
    const tagsHtml = (tags.length || item.color) ? `<div class="clip-tags">${dot}${tags.join('')}</div>` : '';
    const labelHtml = `<div class="clip-label">${tagsHtml}<small>${esc(item.label)}</small></div>`;

    if (item.portraitOnly) {
      return `<div class="clip-card clip-portrait clip-mobile-only">${buildMedia(item.src, item.label)}${labelHtml}</div>`;
    }
    const landscapeClass = item.portraitSrc ? 'clip-card clip-landscape clip-desktop-only' : 'clip-card clip-landscape';
    let out = `<div class="${landscapeClass}">${buildMedia(item.src, item.label)}${labelHtml}</div>`;
    if (item.portraitSrc) {
      out += `<div class="clip-card clip-portrait clip-mobile-only">${buildMedia(item.portraitSrc, item.label)}${labelHtml}</div>`;
    }
    return out;
  }

  const container = document.getElementById('lineupMaps');
  if (container) {
    container.innerHTML = lineups.map(group => {
      const hasDesktop = group.items.some(item => !item.portraitOnly);
      const gameBadge = `<span class="lineup-game lineup-game--${esc(group.gameClass)}">${esc(group.game)}</span>`;
      return `
      <section class="lineup-map ${hasDesktop ? '' : 'lineup-map--portrait-only'}" id="map-${esc(group.id)}">
        <div class="section-heading">
          <span class="section-icon">◈</span>
          <h2>${esc(group.map)}</h2>
          ${gameBadge}
          <span class="lineup-count">${group.items.length} ${group.items.length === 1 ? 'lineup' : 'lineups'}</span>
        </div>
        <div class="clips-grid">
          ${group.items.map(clipCard).join('')}
        </div>
      </section>`;
    }).join('');
  }

  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.addEventListener('click', () => applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark'));
  applyTheme(localStorage.getItem('val-tactical-theme') || 'dark');
}