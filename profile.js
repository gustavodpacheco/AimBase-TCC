// ============================================================
// profile.js - Lógica da página de perfil (player.html)
// Depende de: shared.js (esc, safeUrl, initTheme, copyText),
//             api.js (API, mapPlayerForUi).
// ============================================================

if (document.body.dataset.page === 'profile') {
  let notFoundShown = false;
  // Estado do perfil em escopo de módulo para que a troca de idioma consiga
  // redesenhar a página sem repetir a busca dos dados.
  let currentPlayer = null;
  let currentApiActive = false;
  let listenersBound = false;

  /**
   * Espera o dicionário inicial do i18n. Se o fetch falhar, I18N.ready também
   * resolve e a página segue com os fallbacks embutidos/português.
   */
  function waitForI18n() {
    try {
      if (typeof I18N !== 'undefined' && I18N.ready) {
        return Promise.resolve(I18N.ready).catch(() => {});
      }
    } catch (e) { /* segue sem esperar */ }
    return Promise.resolve();
  }

  /**
   * Tradução com reserva em português. I18N.t pode devolver '' enquanto o
   * dicionário carrega (ou a própria chave quando ela não existe); nesses
   * casos usamos o texto de reserva para o conteúdo montado por JS nunca
   * aparecer vazio.
   */
  function tr(key, fallbackPtBR, vars) {
    let text = '';
    try {
      if (typeof I18N !== 'undefined' && I18N.t) text = I18N.t(key, vars);
    } catch (e) { /* usa a reserva */ }
    if (!text || text === key) text = fallbackPtBR != null ? fallbackPtBR : key;
    if (vars && typeof text === 'string') {
      text = text.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (match, name) => {
        const value = vars[name];
        return value === undefined || value === null ? match : String(value);
      });
    }
    return text;
  }

  (async function initProfile() {
    const i18nReady = waitForI18n();
    try {
      const id = new URLSearchParams(window.location.search).get('player');
      let player = null;
      let apiActive = false;

      if (id) {
        try {
          const res = await API.getPlayerBySlug(id);
          if (res.success && res.data) {
            player = mapPlayerForUi(res.data);
            apiActive = true;

            // Mescla dados estáticos (card personalizado, atributos FIFA e clips)
            // quando o jogador também existe no fallback (data.js).
            const staticProfile = defaultPlayers.find(dp => dp.id === player.slug || dp.slug === player.slug);
            if (staticProfile) {
              if (!player.cardImage && staticProfile.cardImage) player.cardImage = staticProfile.cardImage;
              if (!player.clips && staticProfile.clips) player.clips = staticProfile.clips;
              const staticAttrs = staticProfile.attrs || {};
              Object.keys(staticAttrs).forEach(key => {
                if (staticAttrs[key] != null && player.attrs && player.attrs[key] == null) {
                  player.attrs[key] = staticAttrs[key];
                }
              });
            }
          }
        } catch (err) { /* fallback abaixo */ }
      }
      // Sem ?player= na URL não há perfil a exibir: mostro a tela 404 em vez
      // de abrir o primeiro jogador da lista sem contexto.
      if (!player) {
        const profilePlayers = [...(defaultPlayers || []), ...(savedPlayers || [])];
        player = profilePlayers.find(item => item.id === id || item.slug === id) || null;
      }

      // Nada é renderizado antes do dicionário terminar de carregar (ou de o
      // fetch falhar e os fallbacks entrarem em vigor).
      await i18nReady;

      if (!player) {
        showNotFound(id);
        setupPageChrome();
        return;
      }

      currentPlayer = player;
      currentApiActive = apiActive;
      renderProfile(player, apiActive);
      setupPageChrome();
    } catch (e) {
      await i18nReady;
      setupPageChrome();
    }
  })();

  // A troca de idioma precisa redesenhar o perfil: os fallbacks traduzidos
  // (time, função, país, periféricos) são montados por JS e não têm
  // data-i18n para o i18n.js reescrever sozinho.
  document.addEventListener('i18n:changed', async () => {
    await waitForI18n();
    try {
      if (currentPlayer) renderProfile(currentPlayer, currentApiActive);
      else setupPageChrome();
    } catch (e) {
      setupPageChrome();
    }
  });

  /** Tela 404: esconde o perfil e mostra o aviso de "não encontrado". */
  function showNotFound(requestedId) {
    const notFound = $('profileNotFound');
    if (notFound) notFound.hidden = false;
    // O slug vem da query string. Usa textContent (não innerHTML) para não
    // interpretar marcação, e fica num elemento separado do texto traduzido
    // para o i18n.js não sobrescrever o valor na troca de idioma.
    const slugEl = $('notFoundSlug');
    if (slugEl && requestedId) {
      slugEl.textContent = `?player=${requestedId}`;
      slugEl.hidden = false;
    }
    ['playerHero', 'settings'].forEach(id => { const el = $(id); if (el) el.hidden = true; });
    // O <title> é sobrescrito por JS, então o i18n.js não o traduz sozinho:
    // usamos a chave e reagimos a i18n:changed.
    notFoundShown = true;
    updateNotFoundTitle();
    document.addEventListener('i18n:changed', updateNotFoundTitle);
  }

  /** Mantém o título da aba traduzido enquanto a tela 404 estiver visível. */
  function updateNotFoundTitle() {
    if (!notFoundShown) return;
    document.title = `${tr('page.notFoundTitle', 'Jogador não encontrado')} — AimBase`;
  }

  function renderProfile(player, apiActive) {
    try {
      document.title = `${player.tag} — AimBase`;
    } catch (e) {}
    // Cartão do jogador (carta personalizada p/ Pacheco, dinâmico p/ os demais).
    const fifaCardEl = $('fifaCard');
    if (fifaCardEl) {
      try { fifaCardEl.innerHTML = fifaCardHTML(player, { large: true }); } catch (e) {}
    }

    // Seções montadas por JS: removidas antes de recriar, senão a troca de
    // idioma (que chama renderProfile de novo) duplicaria cada bloco.
    ['.player-meta', '.video-settings', '.pc-specs', '.clips-section'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.remove();
    });

    // Hero lado a lado (carta | informações) apenas com carta personalizada.
    const hero = $('playerHero');
    if (hero) hero.classList.toggle('has-card', !!(player.cardImage && player.photo));

    // Botão "Ver carta completa" (modal) — só para quem tem carta personalizada.
    // O listener vive no bloco de listenersBound para não acumular a cada
    // redesenho (troca de idioma).
    const viewBtn = $('viewCardBtn');
    if (viewBtn && player.cardImage) viewBtn.hidden = false;
    $('crumbName').textContent = player.tag.toUpperCase();
    // id próprio: o seletor antigo pegava childNodes[2] e quebrava se a
    // ordem dos nós da breadcrumb mudasse.
    $('crumbGame').textContent = (player.game || 'VALORANT').toUpperCase();
    $('playerName').textContent = player.name;
    $('playerTag').textContent = player.tag;
    // Traduzido aqui, e não no mapeamento, para acompanhar troca de idioma.
    const team = textOr(player.team, 'common.noTeam');
    const teamLogo = player.teamLogo ? `<img class="profile-team-logo" src="${safeUrl(player.teamLogo)}" alt="Logo ${esc(team)}" decoding="async">` : '';
    $('playerTeam').innerHTML = `${teamLogo}${esc(team)}`;
    $('playerRole').textContent = textOr(player.role, 'common.notInformed');
    $('playerCountry').textContent = textOr(player.country, 'common.notInformed');
    // safeCssUrl escapa aspas e parênteses: impede quebrar a regra CSS
    // com uma URL maliciosa vinda do banco.
    $('profilePhoto').style.backgroundImage = safeCssUrl(player.photo);
    $('dpi').textContent = player.dpi ?? '–';
    $('sensitivity').textContent = player.sensitivity != null ? Number(player.sensitivity).toFixed(2) : '–';
    const edpi = player.edpi != null ? player.edpi : (player.dpi && player.sensitivity ? Math.round(player.dpi * player.sensitivity) : null);
    $('edpi').textContent = edpi ?? '–';
    // id próprio: '.data-grid > div:last-child strong' dependia da ordem das
    // divs e quebrava se alguém inserisse outro campo no grid.
    // Sem valor no banco => '–' (o padrão 1.00 antigo era um número inventado).
    // '' e texto não-numérico também viram '–'; zero é um valor válido.
    const scopedRaw = player.scopedSensitivity;
    const scopedNum = Number(scopedRaw);
    $('scopedSensitivity').textContent =
      scopedRaw != null && String(scopedRaw).trim() !== '' && Number.isFinite(scopedNum) ? scopedNum.toFixed(2) : '–';
    const naoInformado = I18N.t('common.notInformed');
    $('mouseName').textContent = player.mouse || naoInformado;
    const mouseThumbWrap = $('mouseThumbWrap');
    const mouseThumb = $('mouseThumb');
    const mouseFallback = $('mouseFallback');
    const mouseImage = player.productImages?.mouse;
    if (mouseThumbWrap && mouseThumb && mouseFallback) {
      const hasMouseImage = Boolean(mouseImage);
      mouseThumbWrap.hidden = !hasMouseImage;
      mouseFallback.hidden = hasMouseImage;
      if (hasMouseImage) {
        mouseThumb.src = safeUrl(mouseImage);
        mouseThumb.alt = player.mouse ? `${I18N.t('settings.productMouse')}: ${player.mouse}` : I18N.t('settings.productMouse');
      } else {
        mouseThumb.removeAttribute('src');
        mouseThumb.alt = '';
      }
    }
    $('keyboardName').textContent = player.keyboard || naoInformado;
    $('mousepadName').textContent = player.mousepad || naoInformado;
    $('monitorName').textContent = player.monitor || naoInformado;
    $('crosshairText').textContent = player.crosshair || naoInformado;
    // safeUrl já devolve o valor escapado e validado (http(s) ou relativo).
    $('crosshairImage').src = safeUrl(player.crosshairImage || 'assets/mira.png?v=4');

    Object.entries(player.links || {}).forEach(([key, value]) => {
      const link = $(`${key}Link`);
      if (link) { link.href = safeUrl(value); link.style.display = value ? '' : 'none'; }
    });

    const gearGrid = document.querySelector('#gear .gear-grid');
    if (player.productImages && gearGrid) {
      const products = [
        ['monitor', 'gear.monitor', player.monitor, player.links?.monitor],
        ['mouse', 'gear.mouse', player.mouse, player.links?.mouse],
        ['keyboard', 'gear.keyboard', player.keyboard, player.links?.keyboard],
        ['headset', 'gear.headset', player.headset?.name, player.headset?.link],
        ['mousepad', 'gear.mousepad', player.mousepad, player.links?.mousepad],
      ];
      const verProduto = I18N.t('settings.viewProduct');
      gearGrid.classList.add('product-grid');
      gearGrid.innerHTML = products.map(([id, labelKey, name, href]) => {
        const label = I18N.t(labelKey);
        return `<a class="gear-card product-card" href="${safeUrl(href)}" target="_blank" rel="noopener">${player.productImages[id] ? `<span class="product-photo"><img src="${safeUrl(player.productImages[id])}" alt="${esc(name) || label}" loading="lazy" decoding="async"></span>` : ''}<small>${label}</small><strong>${esc(name) || naoInformado}</strong><span>${verProduto}</span></a>`;
      }).join('');
    } else if (player.headset && gearGrid) {
      // Recria o card (removendo o anterior) para o rótulo acompanhar o idioma.
      const antigo = gearGrid.querySelector('[id="headsetLink"]');
      if (antigo) antigo.remove();
      gearGrid.insertAdjacentHTML('beforeend', `<a class="gear-card" id="headsetLink" href="${safeUrl(player.headset.link)}" target="_blank" rel="noopener"><small>${esc(I18N.t('gear.headset'))}</small><strong>${esc(player.headset.name)}</strong><span>${esc(I18N.t('settings.viewProduct'))}</span></a>`);
    }

    if (player.game || Object.keys(player.social || {}).length) {
      const socialIcons = { Instagram: 'assets/brands/instagram.ico', Tracker: 'assets/brands/tracker.png', VLR: 'assets/brands/vlr.png' };
      const social = Object.entries(player.social || {}).map(([label, href]) => {
        // platform (Instagram, VLR...) também vem do banco: limita a classe CSS.
        const slug = String(label).toLowerCase().replace(/[^a-z0-9_-]/g, '');
        // ícone: safeUrl (não esc) porque o valor é um src de atributo
        const icon = socialIcons[label] ? safeUrl(socialIcons[label]) : '';
        const link = safeUrl(href);
        return `<a class="social-${esc(slug)}" href="${link}" target="_blank" rel="noopener">${icon ? `<img src="${icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">` : ''}${esc(label)} <span>↗</span></a>`;
      }).join('');
      document.querySelector('.profile-card').insertAdjacentHTML('afterend', `<section class="player-meta"><div><small>${esc(I18N.t('player.game'))}</small><strong>${esc(player.game) || naoInformado}</strong></div><div><small>${esc(I18N.t('player.agent'))}</small><strong>${esc(player.agents) || naoInformado}</strong></div>${social ? `<div class="player-social">${social}</div>` : ''}</section>`);
    }
    if (player.videoSettings && player.videoSettings.length) {
      document.querySelector('.crosshair-block').insertAdjacentHTML('afterend', `<section class="settings-block video-settings"><div class="section-heading"><span class="section-icon">◫</span><h2>${esc(I18N.t('settings.video'))}</h2></div><div class="video-settings-grid">${player.videoSettings.map(([label, value]) => `<div><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`).join('')}</div></section>`);
    }
    if (player.pcSpecs && player.pcSpecs.length) {
      document.querySelector('#gear').insertAdjacentHTML('afterend', `<section class="settings-block pc-specs"><div class="section-heading"><span class="section-icon">▣</span><h2>${esc(I18N.t('settings.pc'))}</h2></div><div class="gear-grid product-grid">${player.pcSpecs.map(([label, value, href, image]) => `<a class="gear-card product-card" href="${safeUrl(href)}" target="_blank" rel="noopener">${image ? `<span class="product-photo"><img src="${safeUrl(image)}" alt="${esc(value)}" loading="lazy" decoding="async"></span>` : ''}<small>${esc(label)}</small><strong>${esc(value)}</strong><span>${esc(I18N.t('settings.viewProduct'))}</span></a>`).join('')}</div></section>`);
    }
    if (player.clips && player.clips.length) {
      const gear = document.querySelector('#gear');
      if (gear) {
        gear.insertAdjacentHTML('afterend', `<section class="settings-block clips-section"><div class="section-heading"><span class="section-icon">▶</span><h2>${esc(I18N.t('settings.clips'))}</h2></div><div class="clips-grid">${player.clips.map(clip => `<div class="clip-card clip-${esc(clip.orientation || 'landscape')} ${clip.orientation === 'landscape' ? 'clip-desktop-only' : 'clip-mobile-only'}"><video src="${safeUrl(clip.src)}" controls preload="none" playsinline></video><small>${esc(clip.label || '')}</small></div>`).join('')}</div></section>`);
      }
    }

    // Os listeners são registrados uma vez: renderProfile roda de novo a cada
    // troca de idioma e religá-los a cada passada duplicaria os toasts.
    if (!listenersBound) {
      try {
        listenersBound = true;
        const viewBtn = $('viewCardBtn');
        if (viewBtn) {
          // Lê currentPlayer no clique: na troca de idioma o objeto é substituído
          // e o listener precisa enxergar o valor atualizado.
          viewBtn.addEventListener('click', () => { if (currentPlayer) openCardModal(currentPlayer); });
        }
        const copyBtn = $('copySettings');
        if (copyBtn) copyBtn.addEventListener('click', () => { try { copyText(`${player.name} — ${player.tag}\nDPI: ${player.dpi}\nSensibilidade: ${player.sensitivity}\neDPI: ${edpi ?? ''}\nRetícula: ${player.crosshair}`, (typeof I18N !== 'undefined' && I18N.t ? I18N.t('toast.copySettings') : 'Settings copiadas.')); } catch(e){} });
        const crossBtn = $('crosshairCode');
        if (crossBtn) crossBtn.addEventListener('click', () => { try { copyText(player.crosshair, (typeof I18N !== 'undefined' && I18N.t ? I18N.t('toast.crosshairCopied') : 'Código da retícula copiado.')); } catch(e){} });
        setupCardModal();
      } catch (e) {}
    }
  }

  // Tema: aplicado nos dois caminhos (perfil e 404) para que a tela de erro
  // não fique sem o toggle funcionando. O rodapé é estático no HTML e o
  // i18n.js cuida da tradução pelos atributos data-i18n.
  function setupPageChrome() {
    try { initTheme(); } catch (e) {}
  }

  function openCardModal(player) {
    const modal = $('cardModal');
    const body = $('cardModalBody');
    if (!modal || !body) return;
    body.innerHTML = fifaCardHTML(player, { large: true });
    modal.showModal();
  }

  function setupCardModal() {
    const modal = $('cardModal');
    if (!modal) return;
    $('cardModalClose').addEventListener('click', () => modal.close());
    // Fecha ao clicar fora da carta (no backdrop / área externa do dialog).
    modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
    // ESC fecha nativamente (evento cancel do <dialog> só confirma o fechamento).
    modal.addEventListener('cancel', () => modal.close());
  }

}
