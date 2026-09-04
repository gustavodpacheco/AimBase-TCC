// ============================================================
// profile.js - Lógica da página de perfil (player.html)
// Depende de: shared.js (esc, safeUrl, showToast, applyTheme, copyText),
//             api.js (API, mapPlayerForUi).
// ============================================================

if (document.body.dataset.page === 'profile') {
  const $ = id => document.getElementById(id);

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
    if (!player) {
      const profilePlayers = [...defaultPlayers, ...savedPlayers];
      player = profilePlayers.find(item => item.id === id || item.slug === id) || defaultPlayers[0];
    }

    renderProfile(player, apiActive);
  })();

  function renderProfile(player, apiActive) {
    document.title = `${player.tag} — AimBase`;
    // Cartão do jogador (carta personalizada p/ Pacheco, dinâmico p/ os demais).
    const fifaCardEl = $('fifaCard');
    if (fifaCardEl) fifaCardEl.innerHTML = fifaCardHTML(player, { large: true });

    // Hero lado a lado (carta | informações) apenas com carta personalizada.
    const hero = $('playerHero');
    if (hero) hero.classList.toggle('has-card', !!(player.cardImage && player.photo));

    // Botão "Ver carta completa" (modal) — só para quem tem carta personalizada.
    const viewBtn = $('viewCardBtn');
    if (viewBtn && player.cardImage) {
      viewBtn.hidden = false;
      viewBtn.addEventListener('click', () => openCardModal(player));
    }
    $('crumbName').textContent = player.tag.toUpperCase();
    const bc = document.querySelector('.breadcrumb');
    if (bc && bc.childNodes[2]) bc.childNodes[2].nodeValue = ` ${player.game || 'VALORANT'} `;
    $('playerName').textContent = player.name;
    $('playerTag').textContent = player.tag;
    const teamLogo = player.teamLogo ? `<img class="profile-team-logo" src="${safeUrl(player.teamLogo)}" alt="Logo ${esc(player.team)}">` : '';
    $('playerTeam').innerHTML = `${teamLogo}${esc(player.team)}`;
    $('playerRole').textContent = player.role;
    $('playerCountry').textContent = player.country;
    $('profilePhoto').style.backgroundImage = player.photo ? `url("${player.photo}")` : 'none';
    $('dpi').textContent = player.dpi ?? '–';
    $('sensitivity').textContent = player.sensitivity != null ? Number(player.sensitivity).toFixed(2) : '–';
    const edpi = player.edpi != null ? player.edpi : (player.dpi && player.sensitivity ? Math.round(player.dpi * player.sensitivity) : null);
    $('edpi').textContent = edpi ?? '–';
    const scoped = document.querySelector('.data-grid > div:last-child strong');
    if (scoped) scoped.textContent = Number(player.scopedSensitivity ?? 1).toFixed(2);
    $('mouseName').textContent = player.mouse || 'Não informado';
    $('keyboardName').textContent = player.keyboard || 'Não informado';
    $('mousepadName').textContent = player.mousepad || 'Não informado';
    $('monitorName').textContent = player.monitor || 'Não informado';
    $('crosshairText').textContent = player.crosshair || 'Não informado';
    $('crosshairImage').src = player.crosshairImage || 'assets/mira.png?v=4';

    Object.entries(player.links || {}).forEach(([key, value]) => {
      const link = $(`${key}Link`);
      if (link) { link.href = value || '#'; link.style.display = value ? '' : 'none'; }
    });

    const gearGrid = document.querySelector('#gear .gear-grid');
    if (player.productImages && gearGrid) {
      const products = [['monitor', 'Monitor', player.monitor, player.links?.monitor], ['mouse', 'Mouse', player.mouse, player.links?.mouse], ['keyboard', 'Keyboard', player.keyboard, player.links?.keyboard], ['headset', 'Headset', player.headset?.name, player.headset?.link], ['mousepad', 'Mousepad', player.mousepad, player.links?.mousepad]];
      gearGrid.classList.add('product-grid');
      gearGrid.innerHTML = products.map(([id, label, name, href]) => `<a class="gear-card product-card" href="${safeUrl(href)}" target="_blank" rel="noopener">${player.productImages[id] ? `<span class="product-photo"><img src="${safeUrl(player.productImages[id])}" alt="${esc(name) || label}"></span>` : ''}<small>${label}</small><strong>${esc(name) || 'Não informado'}</strong><span>Ver produto ↗</span></a>`).join('');
    } else if (player.headset && gearGrid && !gearGrid.querySelector('[id="headsetLink"]')) {
      gearGrid.insertAdjacentHTML('beforeend', `<a class="gear-card" id="headsetLink" href="${safeUrl(player.headset.link)}" target="_blank" rel="noopener"><small>HEADSET</small><strong>${esc(player.headset.name)}</strong><span>Ver produto ↗</span></a>`);
    }

    if (player.game || Object.keys(player.social || {}).length) {
      const socialIcons = { Instagram: 'assets/brands/instagram.ico', Tracker: 'assets/brands/tracker.png', VLR: 'assets/brands/vlr.png' };
      const social = Object.entries(player.social || {}).map(([label, href]) => `<a class="social-${esc(label.toLowerCase())}" href="${safeUrl(href)}" target="_blank" rel="noopener"><img src="${esc(socialIcons[label] || '')}" alt="" aria-hidden="true">${esc(label)} <span>↗</span></a>`).join('');
      if (!document.querySelector('.player-meta')) {
        document.querySelector('.profile-card').insertAdjacentHTML('afterend', `<section class="player-meta"><div><small>JOGO</small><strong>${esc(player.game) || 'Não informado'}</strong></div><div><small>AGENTE</small><strong>${esc(player.agents) || 'Não informado'}</strong></div>${social ? `<div class="player-social">${social}</div>` : ''}</section>`);
      }
    }
    if (player.videoSettings && player.videoSettings.length && !document.querySelector('.video-settings')) {
      document.querySelector('.crosshair-block').insertAdjacentHTML('afterend', `<section class="settings-block video-settings"><div class="section-heading"><span class="section-icon">◫</span><h2>Vídeo</h2></div><div class="video-settings-grid">${player.videoSettings.map(([label, value]) => `<div><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`).join('')}</div></section>`);
    }
    if (player.pcSpecs && player.pcSpecs.length && !document.querySelector('.pc-specs')) {
      document.querySelector('#gear').insertAdjacentHTML('afterend', `<section class="settings-block pc-specs"><div class="section-heading"><span class="section-icon">▣</span><h2>PC</h2></div><div class="gear-grid product-grid">${player.pcSpecs.map(([label, value, href, image]) => `<a class="gear-card product-card" href="${safeUrl(href)}" target="_blank" rel="noopener">${image ? `<span class="product-photo"><img src="${safeUrl(image)}" alt="${esc(value)}"></span>` : ''}<small>${esc(label)}</small><strong>${esc(value)}</strong><span>Ver produto ↗</span></a>`).join('')}</div></section>`);
    }
    if (player.clips && player.clips.length && !document.querySelector('.clips-section')) {
      const gear = document.querySelector('#gear');
      if (gear) {
        gear.insertAdjacentHTML('afterend', `<section class="settings-block clips-section"><div class="section-heading"><span class="section-icon">▶</span><h2>Clips</h2></div><div class="clips-grid">${player.clips.map(clip => `<div class="clip-card clip-${esc(clip.orientation || 'landscape')} ${clip.orientation === 'landscape' ? 'clip-desktop-only' : 'clip-mobile-only'}"><video src="${safeUrl(clip.src)}" controls preload="metadata" playsinline></video><small>${esc(clip.label || '')}</small></div>`).join('')}</div></section>`);
      }
    }

    $('copySettings').addEventListener('click', () => copyText(`${player.name} — ${player.tag}\nDPI: ${player.dpi}\nSensibilidade: ${player.sensitivity}\neDPI: ${edpi ?? ''}\nRetícula: ${player.crosshair}`, 'Settings copiadas.'));
    $('crosshairCode').addEventListener('click', () => copyText(player.crosshair, 'Código da retícula copiado.'));
    applyTheme(localStorage.getItem('val-tactical-theme') || 'dark');
    $('themeToggle').addEventListener('click', () => applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark'));
    setupCardModal();
    setupComments($, player, apiActive);
    $('toast').insertAdjacentHTML('beforebegin', '<footer class="site-footer"><div class="footer-brand"><a class="logo" href="index.html"><span class="logo-dot">A</span>Aim<span>Base</span></a><p>Configurações competitivas de múltiplos jogos, feitas pela comunidade.</p></div><div><h3>Explorar</h3><a href="index.html#players">Jogadores</a><a href="#comments">Comentários</a></div><div><h3>Contato</h3><a href="mailto:contato@aimbase.gg">contato@aimbase.gg</a></div><div class="footer-credit"><span>© 2026 AIMBASE</span><span>CRIADO PARA COMPETIR</span></div></footer>');
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
    $('toast').insertAdjacentHTML('beforebegin', '<section class="comments-section profile-comments" id="comments"><div class="comments-intro"><p class="kicker">COMUNIDADE</p><h2>Comentários</h2><p>Deixe uma dica ou opinião sobre o setup deste jogador.</p></div><div class="comments-panel"><form class="comment-form" id="commentForm"><div class="comment-fields">' + (isDb ? '' : '<input name="author" maxlength="32" required placeholder="Seu nome">') + '<textarea name="message" maxlength="500" required placeholder="Escreva um comentário..."></textarea></div><button type="submit">Publicar</button></form><div class="comment-list" id="commentList"></div></div></section>');
    const commentsKey = `val-tactical-comments-${player.id}`;
    let comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
    const playerId = isDb ? Number(player.id) : null;

    async function reload() {
      if (isDb) {
        try {
          const res = await API.listComments(playerId);
          comments = (res.data && res.data.comments) || [];
        } catch { /* mantém vazio */ }
      }
      renderComments();
    }
    const renderComments = () => { $('commentList').innerHTML = comments.length ? comments.map(comment => `<article class="comment-item"><span class="comment-avatar">${esc(comment.author.slice(0, 2).toUpperCase())}</span><div><strong>${esc(comment.author)}</strong><time>${new Date(comment.created_at || comment.date).toLocaleDateString('pt-BR')}</time><p>${esc(comment.message)}</p></div></article>`).join('') : '<p class="empty-comments">Ainda não há comentários neste perfil.</p>'; };
    $('commentForm').addEventListener('submit', async event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget));
      if (isDb) {
        try {
          await API.createComment({ player_id: playerId, author: data.author ? data.author.trim() : 'Visitante', message: data.message.trim() });
          event.currentTarget.reset();
          await reload();
          showToast('Comentário publicado.');
        } catch (err) {
          showToast(err.message || 'Não foi possível publicar o comentário.');
        }
      } else {
        comments.unshift({ author: (data.author || 'Visitante').trim(), message: data.message.trim(), date: new Date().toISOString() });
        localStorage.setItem(commentsKey, JSON.stringify(comments));
        event.currentTarget.reset();
        renderComments();
        showToast('Comentário publicado.');
      }
    });
    reload();
  }
}
