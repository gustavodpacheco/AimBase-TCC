// ============================================================
// profile.js - Lógica da página de perfil (player.html)
// Depende de: shared.js (esc, safeUrl, showToast, applyTheme, copyText),
//             api.js (API, mapPlayerForUi).
// ============================================================

if (document.body.dataset.page === 'profile') {
  let notFoundShown = false;
  // Estado do perfil em escopo de módulo para que a troca de idioma consiga
  // redesenhar a página sem repetir a busca dos dados.
  let currentPlayer = null;
  let currentApiActive = false;
  let listenersBound = false;

  (async function initProfile() {
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
      const profilePlayers = [...defaultPlayers, ...savedPlayers];
      player = profilePlayers.find(item => item.id === id || item.slug === id) || null;
    }

    if (!player) {
      showNotFound(id);
      setupPageChrome();
      return;
    }

    currentPlayer = player;
    currentApiActive = apiActive;
    renderProfile(player, apiActive);
    setupPageChrome();
  })();

  // A troca de idioma precisa redesenhar o perfil: os fallbacks traduzidos
  // (time, função, país, periféricos) são montados por JS e não têm
  // data-i18n para o i18n.js reescrever sozinho.
  document.addEventListener('i18n:changed', () => {
    if (currentPlayer) renderProfile(currentPlayer, currentApiActive);
    else setupPageChrome();
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
    document.title = `${I18N.t('page.notFoundTitle')} — AimBase`;
  }

  function renderProfile(player, apiActive) {
    document.title = `${player.tag} — AimBase`;
    // Cartão do jogador (carta personalizada p/ Pacheco, dinâmico p/ os demais).
    const fifaCardEl = $('fifaCard');
    if (fifaCardEl) fifaCardEl.innerHTML = fifaCardHTML(player, { large: true });

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
    const teamLogo = player.teamLogo ? `<img class="profile-team-logo" src="${safeUrl(player.teamLogo)}" alt="Logo ${esc(team)}">` : '';
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
        return `<a class="gear-card product-card" href="${safeUrl(href)}" target="_blank" rel="noopener">${player.productImages[id] ? `<span class="product-photo"><img src="${safeUrl(player.productImages[id])}" alt="${esc(name) || label}"></span>` : ''}<small>${label}</small><strong>${esc(name) || naoInformado}</strong><span>${verProduto}</span></a>`;
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
        return `<a class="social-${esc(slug)}" href="${link}" target="_blank" rel="noopener">${icon ? `<img src="${icon}" alt="" aria-hidden="true">` : ''}${esc(label)} <span>↗</span></a>`;
      }).join('');
      document.querySelector('.profile-card').insertAdjacentHTML('afterend', `<section class="player-meta"><div><small>${esc(I18N.t('player.game'))}</small><strong>${esc(player.game) || naoInformado}</strong></div><div><small>${esc(I18N.t('player.agent'))}</small><strong>${esc(player.agents) || naoInformado}</strong></div>${social ? `<div class="player-social">${social}</div>` : ''}</section>`);
    }
    if (player.videoSettings && player.videoSettings.length) {
      document.querySelector('.crosshair-block').insertAdjacentHTML('afterend', `<section class="settings-block video-settings"><div class="section-heading"><span class="section-icon">◫</span><h2>${esc(I18N.t('settings.video'))}</h2></div><div class="video-settings-grid">${player.videoSettings.map(([label, value]) => `<div><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`).join('')}</div></section>`);
    }
    if (player.pcSpecs && player.pcSpecs.length) {
      document.querySelector('#gear').insertAdjacentHTML('afterend', `<section class="settings-block pc-specs"><div class="section-heading"><span class="section-icon">▣</span><h2>${esc(I18N.t('settings.pc'))}</h2></div><div class="gear-grid product-grid">${player.pcSpecs.map(([label, value, href, image]) => `<a class="gear-card product-card" href="${safeUrl(href)}" target="_blank" rel="noopener">${image ? `<span class="product-photo"><img src="${safeUrl(image)}" alt="${esc(value)}"></span>` : ''}<small>${esc(label)}</small><strong>${esc(value)}</strong><span>${esc(I18N.t('settings.viewProduct'))}</span></a>`).join('')}</div></section>`);
    }
    if (player.clips && player.clips.length) {
      const gear = document.querySelector('#gear');
      if (gear) {
        gear.insertAdjacentHTML('afterend', `<section class="settings-block clips-section"><div class="section-heading"><span class="section-icon">▶</span><h2>${esc(I18N.t('settings.clips'))}</h2></div><div class="clips-grid">${player.clips.map(clip => `<div class="clip-card clip-${esc(clip.orientation || 'landscape')} ${clip.orientation === 'landscape' ? 'clip-desktop-only' : 'clip-mobile-only'}"><video src="${safeUrl(clip.src)}" controls preload="metadata" playsinline></video><small>${esc(clip.label || '')}</small></div>`).join('')}</div></section>`);
      }
    }

    // Os listeners são registrados uma vez: renderProfile roda de novo a cada
    // troca de idioma e religá-los a cada passada duplicaria os toasts.
    if (!listenersBound) {
      listenersBound = true;
      const viewBtn = $('viewCardBtn');
      if (viewBtn) {
        // Lê currentPlayer no clique: na troca de idioma o objeto é substituído
        // e o listener precisa enxergar o valor atualizado.
        viewBtn.addEventListener('click', () => { if (currentPlayer) openCardModal(currentPlayer); });
      }
      $('copySettings').addEventListener('click', () => copyText(`${player.name} — ${player.tag}\nDPI: ${player.dpi}\nSensibilidade: ${player.sensitivity}\neDPI: ${edpi ?? ''}\nRetícula: ${player.crosshair}`, I18N.t('toast.copySettings')));
      $('crosshairCode').addEventListener('click', () => copyText(player.crosshair, I18N.t('toast.crosshairCopied')));
      setupCardModal();
    }
    setupComments($, player, apiActive);
  }

  // Tema e rodapé: aplicados nos dois caminhos (perfil e 404) para que a
  // tela de erro não fique sem o toggle de tema funcionando.
  function setupPageChrome() {
    initTheme();
    // Recriado a cada chamada para o texto acompanhar a troca de idioma.
    const rodapeAntigo = document.querySelector('.site-footer');
    if (rodapeAntigo) rodapeAntigo.remove();
    const f = {
      desc: I18N.t('footer.desc'), explore: I18N.t('footer.explore'), players: I18N.t('nav.players'),
      comments: I18N.t('comments.title'), contact: I18N.t('footer.contact'), credit: I18N.t('footer.credit'),
    };
    $('toast').insertAdjacentHTML('beforebegin', `<footer class="site-footer"><div class="footer-brand"><a class="logo" href="index.html"><span class="logo-dot">A</span>Aim<span>Base</span></a><p>${esc(f.desc)}</p></div><div><h3>${esc(f.explore)}</h3><a href="index.html#players">${esc(f.players)}</a><a href="#comments">${esc(f.comments)}</a></div><div><h3>${esc(f.contact)}</h3><a href="mailto:contato@aimbase.gg">contato@aimbase.gg</a></div><div class="footer-credit"><span>© 2026 AIMBASE</span><span>${esc(f.credit)}</span></div></footer>`);
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

  function setupComments($, player, apiActive) {
    const isDb = apiActive && /^\d+$/.test(String(player.id));
    const commentsKey = `val-tactical-comments-${player.id}`;
    let comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
    const playerId = isDb ? Number(player.id) : null;

    // Quem está logado (necessário porque o autor do comentário vem da sessão).
    let currentUser = null;
    if (isDb) {
      API.me()
        .then(res => { currentUser = (res.data && res.data.user) || null; })
        .catch(() => { currentUser = null; })
        .finally(mountForm);
    } else {
      mountForm();
    }

    function mountForm() {
      // Sem API (modo demonstração) o formulário continua igual, com o campo de nome.
      // Com API, só quem está logado pode comentar — e o nome vem da sessão.
      const form = isDb
        ? (currentUser
            ? '<form class="comment-form" id="commentForm"><div class="comment-fields"><textarea name="message" maxlength="500" required placeholder="' + esc(I18N.t('comments.placeholder')) + '"></textarea></div><button type="submit">' + esc(I18N.t('comments.submitAs', { username: currentUser.username })) + '</button></form>'
            : '<p class="empty-comments">' + esc(I18N.t('comments.loginRequired')) + ' <a href="index.html">' + esc(I18N.t('comments.goHome')) + '</a></p>')
        : '<form class="comment-form" id="commentForm"><div class="comment-fields"><input name="author" maxlength="32" required placeholder="' + esc(I18N.t('comments.authorPlaceholder')) + '"><textarea name="message" maxlength="500" required placeholder="' + esc(I18N.t('comments.placeholder')) + '"></textarea></div><button type="submit">' + esc(I18N.t('comments.submit')) + '</button></form>';

      // A seção é remontada a cada troca de idioma: a anterior sai antes para
      // não duplicar (o id #comments é único).
      const anterior = $('comments');
      if (anterior) anterior.remove();
      $('toast').insertAdjacentHTML('beforebegin', '<section class="comments-section profile-comments" id="comments"><div class="comments-intro"><p class="kicker">' + esc(I18N.t('comments.kicker')) + '</p><h2>' + esc(I18N.t('comments.title')) + '</h2><p>' + esc(I18N.t('comments.intro')) + '</p></div><div class="comments-panel">' + form + '<div class="comment-list" id="commentList"></div></div></section>');

      const formEl = $('commentForm');
      if (formEl) {
        formEl.addEventListener('submit', async event => {
          event.preventDefault();
          const data = Object.fromEntries(new FormData(event.currentTarget));
          if (isDb) {
            try {
              await API.createComment({ player_id: playerId, message: data.message.trim() });
              event.currentTarget.reset();
              await reload();
              showToast(I18N.t('toast.commentPublished'));
            } catch (err) {
              showToast(err.message || I18N.t('toast.commentFailed'));
            }
          } else {
            comments.unshift({ author: (data.author || I18N.t('common.visitor')).trim(), message: data.message.trim(), date: new Date().toISOString() });
            localStorage.setItem(commentsKey, JSON.stringify(comments));
            event.currentTarget.reset();
            renderComments();
            showToast(I18N.t('toast.commentPublished'));
          }
        });
      }
    }

    async function reload() {
      if (isDb) {
        try {
          const res = await API.listComments(playerId);
          comments = (res.data && res.data.comments) || [];
        } catch { /* mantém vazio */ }
      }
      renderComments();
    }
    const renderComments = () => { $('commentList').innerHTML = comments.length ? comments.map(comment => `<article class="comment-item"><span class="comment-avatar">${esc(String(comment.author || '?').slice(0, 2).toUpperCase())}</span><div><strong>${esc(comment.author)}</strong><time>${esc(formatDate(comment.created_at || comment.date))}</time><p>${esc(comment.message)}</p></div></article>`).join('') : '<p class="empty-comments">' + esc(I18N.t('comments.empty')) + '</p>'; };
    reload();
  }
}
