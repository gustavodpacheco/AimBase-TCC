// ============================================================
// lineups.js - Página de lineups (lineups.html)
// Depende de: shared.js (applyTheme), data.js (valLineups).
// ============================================================

if (document.body.dataset.page === 'lineups') {
  const baseSovaClips = {
    Haven: [
      { agent: 'Sova', side: '', color: '', src: 'assets/lineups/C.mp4', portraitSrc: 'assets/lineups/C retrato.mp4', label: 'C Site — Pixel de reconhecimento' },
      { agent: 'Sova', side: '', color: '', src: 'assets/lineups/garage.mp4', portraitSrc: 'assets/lineups/garage retrato.mp4', label: 'Double Doors — Recon' },
      { agent: 'Sova', side: '', color: '', src: 'assets/lineups/haven a long dart lineup.mp4', portraitSrc: 'assets/lineups/haven a long dart lineup retrato.mp4', label: 'A Long — Dart lineup' },
    ],
    Ascent: [
      { agent: 'Sova', side: '', color: '', src: 'assets/lineups/ascent sova.mp4', portraitSrc: 'assets/lineups/Ascent sova retrato.mp4', label: 'B → A — Recon que spot a planta' },
    ],
  };

  const lineups = [
    {
      game: 'CS2',
      gameClass: 'cs2',
      map: 'Dust 2',
      id: 'dust2',
      items: [
        { src: 'assets/lineups/dust2lineups.mp4', portraitSrc: 'assets/lineups/spawnsmoke.mp4', label: 'Smokes de Dust 2' },
      ],
    },
    {
      game: 'CS2',
      gameClass: 'cs2',
      map: 'Inferno',
      id: 'inferno',
      items: [
        { src: 'assets/lineups/inferno.mp4', portraitSrc: 'assets/lineups/usefulsmoke.mp4', label: 'Smoke útil (linha fixa)' },
      ],
    },
    {
      game: 'CS2',
      gameClass: 'cs2',
      map: 'Mirage',
      id: 'mirage',
      items: [
        { src: 'assets/lineups/cs2 mirage lineups.mp4', portraitSrc: 'assets/lineups/miragesmokes.mp4', label: 'Smokes de Mirage' },
      ],
    },
    {
      game: 'CS2',
      gameClass: 'cs2',
      map: 'Anubis',
      id: 'anubis',
      items: [
        { src: 'assets/lineups/anubislineup.mp4', label: 'Lineup de Anubis' },
      ],
    },
    {
      game: 'CS2',
      gameClass: 'cs2',
      map: 'Cache',
      id: 'cache',
      items: [
        { src: 'assets/lineups/cachelineup.mp4', label: 'Lineup de Cache' },
      ],
    },
    {
      game: 'CS2',
      gameClass: 'cs2',
      map: 'Overpass',
      id: 'overpass',
      items: [
        { src: 'assets/lineups/overpass.mp4', label: 'Lineup de Overpass' },
      ],
    },
    {
      game: 'CS2',
      gameClass: 'cs2',
      map: 'Nuke',
      id: 'nuke',
      items: [
        { src: 'assets/lineups/nuke.mp4', label: 'Lineup de Nuke' },
      ],
    },
    ...valLineups.map(group => ({
      game: 'VALORANT',
      gameClass: 'valorant',
      map: group.map,
      id: group.id,
      items: [...(baseSovaClips[group.map] || []), ...group.items],
    })),
  ];

  const colorTitles = { orange: 'Feita/aprendida por mim', purple: 'VCT', black: 'Guia Tseeky', yellow: 'YouTube (comunidade)' };

  function clipCard(item) {
    const tags = [];
    if (item.agent) tags.push(`<span class="clip-agent">${esc(item.agent)}</span>`);
    if (item.side) tags.push(`<span class="clip-side clip-side--${esc(item.side)}">${item.side === 'attack' ? 'ATK' : 'DEF'}</span>`);
    const dot = item.color ? `<span class="clip-color clip-color--${esc(item.color)}" title="${esc(colorTitles[item.color] || '')}"></span>` : '';
    const tagsHtml = (tags.length || item.color) ? `<div class="clip-tags">${dot}${tags.join('')}</div>` : '';
    const labelHtml = `<div class="clip-label">${tagsHtml}<small>${esc(item.label)}</small></div>`;

    const video = `<video src="${safeUrl(item.src)}" controls preload="metadata" playsinline></video>`;

    if (item.portraitOnly) {
      return `<div class="clip-card clip-portrait clip-mobile-only">${video}${labelHtml}</div>`;
    }
    const landscapeClass = item.portraitSrc ? 'clip-card clip-landscape clip-desktop-only' : 'clip-card clip-landscape';
    let out = `<div class="${landscapeClass}">${video}${labelHtml}</div>`;
    if (item.portraitSrc) {
      out += `<div class="clip-card clip-portrait clip-mobile-only"><video src="${safeUrl(item.portraitSrc)}" controls preload="metadata" playsinline></video>${labelHtml}</div>`;
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