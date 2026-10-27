// ============================================================
// lineups.js - Página de lineups (lineups.html)
// Depende de: shared.js (esc, safeUrl, initTheme), data.js (valLineups).
// ============================================================

if (document.body.dataset.page === 'lineups') {
  const rawLineups = [
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

  const lineups = rawLineups.map(group => ({
    ...group,
    items: group.items.map(item => ({ ...item, groupMap: group.map, groupGame: group.game }))
  }));

  // Fonte (tooltip) de cada cor de clipe, por idioma.
  const colorTitles = { orange: 'lineups.color.orange', purple: 'lineups.color.purple', black: 'lineups.color.black', yellow: 'lineups.color.yellow' };
  const sideTitles = { attack: 'lineups.side.attack', defense: 'lineups.side.defense' };

  function ytId(url) {
    const str = String(url);
    const short = str.match(/youtu\.be\/([\w-]{6,})/);
    const watch = str.match(/[?&]v=([\w-]{6,})/);
    return (watch && watch[1]) || (short && short[1]) || null;
  }

  function ytEmbed(url) {
    const id = ytId(url);
    if (!id) return null;
    const str = String(url);
    const t = str.match(/[?&]t=(\d+)s?/);
    let embed = `https://www.youtube.com/embed/${id}`;
    if (t) embed += `?start=${t[1]}`;
    return embed;
  }

  function buildMediaFacade(item) {
    const id = ytId(item.src);
    if (id) {
      const thumb = `https://img.youtube.com/vi/${esc(id)}/hqdefault.jpg`;
      const embed = ytEmbed(item.src);
      const label = item.label || '';
      return `<button class="clip-facade" type="button" data-embed="${esc(embed)}" aria-label="Reproduzir ${esc(label)}"><img src="${thumb}" alt="${esc(label)}" loading="lazy"><span class="clip-facade-play" aria-hidden="true">▶</span></button>`;
    }
    if (item.portraitSrc) {
      // keep existing behavior for portrait variants handled elsewhere
    }
    return `<video src="${safeUrl(item.src)}" controls preload="none" playsinline></video>`;
  }

  function buildMedia(src, label) {
    const embed = ytEmbed(src);
    if (embed) {
      return `<iframe src="${embed}" loading="lazy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen title="${esc(label)}"></iframe>`;
    }
    return `<video src="${safeUrl(src)}" controls preload="none" playsinline></video>`;
  }

  function getLabelText(label) {
    if (!label) return '';
    const key = String(label);
    if (typeof I18N !== 'undefined' && I18N.t) {
      const translated = I18N.t(key);
      if (translated && translated !== key) return translated;
    }
    return label;
  }

  function clipCard(item) {
    const tags = [];
    if (item.agent) tags.push(`<span class="clip-agent">${esc(item.agent)}</span>`);
    if (item.side) tags.push(`<span class="clip-side clip-side--${esc(item.side)}">${esc(I18N.t(sideTitles[item.side] || 'lineups.side.attack'))}</span>`);
    const dot = item.color ? `<span class="clip-color clip-color--${esc(item.color)}" title="${esc(I18N.t(colorTitles[item.color] || 'lineups.color.orange'))}"></span>` : '';
    const tagsHtml = (tags.length || item.color) ? `<div class="clip-tags">${dot}${tags.join('')}</div>` : '';
    const labelText = getLabelText(item.label);
    const labelHtml = `<div class="clip-label">${tagsHtml}<small>${esc(labelText)}</small></div>`;
    const media = buildMediaFacade(item);

    if (item.portraitOnly) {
      return `<div class="clip-card clip-portrait clip-mobile-only" data-agent="${esc(item.agent || '')}" data-side="${esc(item.side || '')}" data-color="${esc(item.color || '')}" data-label="${esc(labelText.toLowerCase())}" data-map="${esc(item.groupMap || '')}" data-game="${esc(item.groupGame || '')}">${media}${labelHtml}</div>`;
    }
    const landscapeClass = item.portraitSrc ? 'clip-card clip-landscape clip-desktop-only' : 'clip-card clip-landscape';
    let out = `<div class="${landscapeClass}" data-agent="${esc(item.agent || '')}" data-side="${esc(item.side || '')}" data-color="${esc(item.color || '')}" data-label="${esc(labelText.toLowerCase())}" data-map="${esc(item.groupMap || '')}" data-game="${esc(item.groupGame || '')}">${media}${labelHtml}</div>`;
    if (item.portraitSrc) {
      out += `<div class="clip-card clip-portrait clip-mobile-only" data-agent="${esc(item.portraitSrc ? item.agent || '' : item.agent || '')}" data-side="${esc(item.side || '')}" data-color="${esc(item.color || '')}" data-label="${esc(labelText.toLowerCase())}" data-map="${esc(item.groupMap || '')}" data-game="${esc(item.groupGame || '')}">${buildMediaFacade({ ...item, src: item.portraitSrc || item.src })}${labelHtml}</div>`;
    }
    return out;
  }

  const container = document.getElementById('lineupMaps');
  const gameFilter = document.getElementById('lineupGameFilter');
  const mapFilter = document.getElementById('lineupMapFilter');
  const agentFilter = document.getElementById('lineupAgentFilter');
  const sideFilter = document.getElementById('lineupSideFilter');
  const searchFilter = document.getElementById('lineupSearchFilter');
  const noResultsEl = document.getElementById('lineupNoResults');
  const agentGroup = document.querySelector('.filter-group--agent');

  function collectFilters() {
    if (!mapFilter) return;
    const maps = new Set();
    const agents = new Set();
    lineups.forEach(group => {
      if (gameFilter && gameFilter.value !== 'all' && group.game !== gameFilter.value) return;
      maps.add(group.map);
      group.items.forEach(item => {
        if (item.agent) agents.add(item.agent);
      });
    });
    const currentMap = mapFilter.value;
    const allMapsLabel = typeof I18N !== 'undefined' && I18N.t ? I18N.t('lineups.filters.allMaps') : 'Todos os mapas';
    mapFilter.innerHTML = `<option value="all">${esc(allMapsLabel)}</option>`;
    Array.from(maps).sort().forEach(map => {
      const opt = document.createElement('option');
      opt.value = map;
      opt.textContent = map;
      mapFilter.appendChild(opt);
    });
    if (Array.from(maps).includes(currentMap)) mapFilter.value = currentMap;
    else mapFilter.value = 'all';

    if (agentFilter) {
      const currentAgent = agentFilter.value;
      const allAgentsLabel = typeof I18N !== 'undefined' && I18N.t ? I18N.t('lineups.filters.allAgents') : 'Todos os agentes';
      agentFilter.innerHTML = `<option value="all">${esc(allAgentsLabel)}</option>`;
      Array.from(agents).sort().forEach(agent => {
        const opt = document.createElement('option');
        opt.value = agent;
        opt.textContent = agent;
        agentFilter.appendChild(opt);
      });
      if (Array.from(agents).includes(currentAgent)) agentFilter.value = currentAgent;
      else agentFilter.value = 'all';
      if (agentGroup) {
        if (agents.size > 0 && gameFilter && gameFilter.value === 'VALORANT') {
          agentGroup.classList.add('is-visible');
        } else {
          agentGroup.classList.remove('is-visible');
        }
      }
    }
  }

  function applyFilters() {
    if (!container) return;
    const gameVal = gameFilter ? gameFilter.value : 'all';
    const mapVal = mapFilter ? mapFilter.value : 'all';
    const agentVal = agentFilter ? agentFilter.value : 'all';
    const sideVal = sideFilter ? sideFilter.value : 'all';
    const searchVal = searchFilter ? searchFilter.value.toLowerCase().trim() : '';

    let visibleCount = 0;
    const sections = container.querySelectorAll('.lineup-map');
    sections.forEach(section => {
      const sectionGame = section.getAttribute('data-game');
      const sectionMap = section.getAttribute('data-map');
      let sectionVisible = true;
      if (gameVal !== 'all' && sectionGame !== gameVal) sectionVisible = false;
      if (mapVal !== 'all' && sectionMap !== mapVal) sectionVisible = false;
      section.style.display = sectionVisible ? '' : 'none';
      if (!sectionVisible) return;
      const cards = section.querySelectorAll('.clip-card');
      let cardsVisible = 0;
      cards.forEach(card => {
        let cardVisible = true;
        const cardAgent = card.getAttribute('data-agent') || '';
        const cardSide = card.getAttribute('data-side') || '';
        const cardLabel = card.getAttribute('data-label') || '';
        if (agentVal !== 'all' && cardAgent !== agentVal) cardVisible = false;
        if (sideVal !== 'all' && cardSide !== sideVal) cardVisible = false;
        if (searchVal) {
          if (!cardLabel.includes(searchVal)) cardVisible = false;
        }
        card.style.display = cardVisible ? '' : 'none';
        if (cardVisible) cardsVisible++;
      });
      if (cardsVisible === 0) {
        section.style.display = 'none';
      } else {
        visibleCount += cardsVisible;
      }
    });
    if (noResultsEl) {
      noResultsEl.style.display = visibleCount === 0 ? '' : 'none';
    }
  }

  function initFilters() {
    if (gameFilter) {
      gameFilter.removeEventListener('change', gameFilter._handler || (()=>{}));
      const h = () => { collectFilters(); applyFilters(); };
      gameFilter._handler = h;
      gameFilter.addEventListener('change', h);
    }
    if (mapFilter) { mapFilter.removeEventListener('change', mapFilter._h2); const h = applyFilters; mapFilter._h2 = h; mapFilter.addEventListener('change', h); }
    if (agentFilter) { agentFilter.removeEventListener('change', agentFilter._h3); const h = applyFilters; agentFilter._h3 = h; agentFilter.addEventListener('change', h); }
    if (sideFilter) { sideFilter.removeEventListener('change', sideFilter._h4); const h = applyFilters; sideFilter._h4 = h; sideFilter.addEventListener('change', h); }
    if (searchFilter) { searchFilter.removeEventListener('input', searchFilter._h5); const h = applyFilters; searchFilter._h5 = h; searchFilter.addEventListener('input', h); }
    collectFilters();
    applyFilters();
  }

  function renderLineups() {
    if (!container) return;
    container.innerHTML = lineups.map(group => {
      const hasDesktop = group.items.some(item => !item.portraitOnly);
      const gameBadge = `<span class="lineup-game lineup-game--${esc(group.gameClass)}">${esc(group.game)}</span>`;
      const count = typeof I18N !== 'undefined' && I18N.t ? I18N.t('lineups.count', { count: group.items.length }) : `${group.items.length} lineups`;
      return `
      <section class="lineup-map ${hasDesktop ? '' : 'lineup-map--portrait-only'}" id="map-${esc(group.id)}" data-map="${esc(group.map)}" data-game="${esc(group.game)}">
        <div class="section-heading" role="button" tabindex="0" aria-expanded="true">
          <div>
            <span class="section-icon">◈</span>
            <h2>${esc(group.map)}</h2>
          </div>
          <div>
            ${gameBadge}
            <span class="lineup-count">${esc(count)}</span>
            <span class="lineup-toggle" aria-hidden="true">▾</span>
          </div>
        </div>
        <div class="clips-grid">
          ${group.items.map(clipCard).join('')}
        </div>
      </section>`;
    }).join('');
    initFacade();
  }

  function initAccordion() {
    if (!container) return;
    const headings = container.querySelectorAll('.lineup-map .section-heading');
    headings.forEach(heading => {
      const section = heading.closest('.lineup-map');
      if (!section) return;
      heading.setAttribute('aria-expanded', 'true');
      section.classList.remove('is-collapsed');
      const toggle = () => {
        section.classList.toggle('is-collapsed');
        heading.setAttribute('aria-expanded', section.classList.contains('is-collapsed') ? 'false' : 'true');
      };
      heading.addEventListener('click', toggle);
      heading.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  function initFacade() {
    if (!container) return;
    container.querySelectorAll('.clip-facade').forEach(btn => {
      if (btn.dataset.facadeInit) return;
      btn.dataset.facadeInit = '1';
      btn.addEventListener('click', () => {
        const embed = btn.getAttribute('data-embed');
        if (!embed) return;
        const iframe = document.createElement('iframe');
        iframe.src = embed;
        iframe.loading = 'lazy';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;
        iframe.title = btn.getAttribute('aria-label') || '';
        btn.replaceWith(iframe);
      });
    });
  }

  renderLineups();
  initAccordion();
  initFilters();
  applyFilters();
  // Rótulos de cor/lado e a contagem plural são gerados por JS: redesenha ao
  // trocar de idioma (o i18n.js não tem data-i18n para reescrever sozinho).
  document.addEventListener('i18n:changed', () => {
    renderLineups();
    initAccordion();
    collectFilters();
    initFilters();
    applyFilters();
  });
  initTheme();
}