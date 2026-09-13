/* ============================================================
   AimBase — i18n (vanilla JS)
   Tradução da interface por atributos data-i18n.
   Carregar ANTES dos scripts que usam `I18N.t`.

   Uso no HTML:
     <span data-i18n="nav.home">Início</span>
     <input data-i18n-placeholder="search.heroPlaceholder">
     <a data-i18n-title="tooltip.key">link</a>
     <button data-i18n-aria-label="modal.close">x</button>
     Interpolação:  data-i18n-vars='{"count":2}'  +  chave "{{count}}"

   API pública:
     setLanguage('en')            -> troca o idioma sem reload
     I18N.t('chave', { count: 2 }) -> retorna tradução interpolada
     I18N.lang                     -> idioma atual
     I18N.apply()                  -> reaplica data-i18n no DOM
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'aimbase-lang';
  var DEFAULT_LANG = 'pt-BR';
  var PATH = 'assets/i18n/';

  var SUPPORTED = {
    'pt-BR': { flag: '🇧🇷', label: 'Português' },
    en: { flag: '🇺🇸', label: 'English' },
    es: { flag: '🇪🇸', label: 'Español' },
    fr: { flag: '🇫🇷', label: 'Français' },
    de: { flag: '🇩🇪', label: 'Deutsch' },
  };

  // Fallbacks para strings geradas por JS dinamicamente (antes do JSON carregar).
  var JS_FALLBACKS = {
    'directory.players': { one: '{{count}} jogador', other: '{{count}} jogadores' },
    'directory.noResults': 'Nenhum jogador encontrado.',
  };

  var state = { lang: DEFAULT_LANG, dict: null, cache: {} };
  var initialized = new WeakSet();

  function normalize(lang) {
    return Object.prototype.hasOwnProperty.call(SUPPORTED, lang) ? lang : DEFAULT_LANG;
  }

  function getValue(key) {
    if (!state.dict) return JS_FALLBACKS[key];
    if (Object.prototype.hasOwnProperty.call(state.dict, key)) return state.dict[key];
    var node = state.dict;
    var parts = key.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return JS_FALLBACKS[key] !== undefined ? JS_FALLBACKS[key] : key;
      node = node[parts[i]];
    }
    return node === undefined ? (JS_FALLBACKS[key] !== undefined ? JS_FALLBACKS[key] : key) : node;
  }

  function pickPlural(value, vars) {
    if (value && typeof value === 'object') {
      if ('one' in value && 'other' in value) {
        var n = Number((vars && vars.count) != null ? vars.count : 0);
        return n === 1 ? value.one : value.other;
      }
      var keys = Object.keys(value);
      return keys.length ? value[keys[0]] : '';
    }
    return value;
  }

  function interpolate(value, vars) {
    var text = pickPlural(value, vars);
    if (typeof text !== 'string') text = String(text == null ? '' : text);
    if (!vars) return text;
    return text.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, function (match, name) {
      var v = vars[name];
      return v === undefined || v === null ? match : String(v);
    });
  }

  function t(key, vars) {
    return interpolate(getValue(key), vars);
  }

  function readVars(el) {
    var raw = el.getAttribute('data-i18n-vars');
    if (!raw) return undefined;
    try { return JSON.parse(raw); } catch (e) { return undefined; }
  }

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n'), readVars(el));
      if (el.textContent !== val) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n-placeholder'));
      if ('placeholder' in el && el.placeholder !== val) el.placeholder = val;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n-title'));
      if (el.title !== val) el.title = val;
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n-aria-label'));
      if (el.getAttribute('aria-label') !== val) el.setAttribute('aria-label', val);
    });
  }

  function load(lang) {
    if (state.cache[lang]) return Promise.resolve(state.cache[lang]);
    return fetch(PATH + lang + '.json', { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (dict) {
        state.cache[lang] = dict;
        return dict;
      })
      .catch(function () { return null; });
  }

  function updateSwitcherUI() {
    document.querySelectorAll('[data-lang-switcher]').forEach(function (root) {
      var button = root.querySelector('.lang-current');
      var meta = SUPPORTED[state.lang] || SUPPORTED[DEFAULT_LANG];
      if (button) {
        button.setAttribute('aria-expanded', root.classList.contains('is-open') ? 'true' : 'false');
        var flagEl = button.querySelector('.lang-flag');
        var nameEl = button.querySelector('.lang-name');
        if (flagEl) flagEl.textContent = meta.flag;
        if (nameEl) nameEl.textContent = meta.label;
      }
      root.querySelectorAll('.lang-option').forEach(function (opt) {
        var active = opt.dataset.lang === state.lang;
        opt.classList.toggle('is-active', active);
        opt.setAttribute('aria-selected', String(active));
      });
    });
  }

  function closeMenus(root) {
    if (root) {
      root.classList.remove('is-open');
      var b = root.querySelector('.lang-current');
      if (b) b.setAttribute('aria-expanded', 'false');
    } else {
      document.querySelectorAll('[data-lang-switcher]').forEach(closeMenus);
    }
  }

  function menuOptions(root) {
    return Array.prototype.slice.call(root.querySelectorAll('.lang-option'));
  }

  function setupSwitcher(root) {
    if (initialized.has(root)) return;
    initialized.add(root);
    var button = root.querySelector('.lang-current');

    button.addEventListener('click', function (event) {
      event.stopPropagation();
      var open = root.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });

    root.querySelectorAll('.lang-option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (opt.dataset.lang) setLanguage(opt.dataset.lang);
        closeMenus(root);
        button.focus();
      });
    });

    root.addEventListener('keydown', function (event) {
      var opts = menuOptions(root);
      if (!opts.length) return;
      var index = opts.indexOf(document.activeElement);
      if (event.key === 'Escape') {
        closeMenus(root);
        button.focus();
        event.preventDefault();
      } else if (event.key === 'ArrowDown') {
        var next = index === -1 ? 0 : (index + 1) % opts.length;
        opts[next].focus();
        event.preventDefault();
      } else if (event.key === 'ArrowUp') {
        var prev = index === -1 ? opts.length - 1 : (index - 1 + opts.length) % opts.length;
        opts[prev].focus();
        event.preventDefault();
      } else if (event.key === 'Home') {
        opts[0].focus();
        event.preventDefault();
      } else if (event.key === 'End') {
        opts[opts.length - 1].focus();
        event.preventDefault();
      }
    });

    document.addEventListener('click', function (event) {
      if (!root.contains(event.target)) closeMenus(root);
    });
  }

  function setLanguage(lang) {
    lang = normalize(lang);
    return load(lang).then(function (dict) {
      if (!dict) return false;
      state.lang = lang;
      state.dict = dict;
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* armazenamento indisponível */ }
      document.documentElement.lang = lang;
      apply();
      updateSwitcherUI();
      document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: lang } }));
      return true;
    });
  }

  // Reaplica traduções se algum script sobrescrever um elemento data-i18n.
  var applying = false;
  var scheduled = null;

  function observeDynamicContent() {
    if (typeof MutationObserver === 'undefined' || !document.body) return;
    var observer = new MutationObserver(function () {
      if (applying || scheduled) return;
      scheduled = requestAnimationFrame(function () {
        scheduled = null;
        applying = true;
        apply();
        applying = false;
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['data-i18n', 'data-i18n-vars', 'data-i18n-placeholder', 'data-i18n-title', 'data-i18n-aria-label'],
    });
  }

  function init() {
    var stored = DEFAULT_LANG;
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s && SUPPORTED[s]) stored = s;
    } catch (e) { /* ignora */ }

    state.lang = stored;
    load(stored).then(function (dict) {
      if (!dict) return load(DEFAULT_LANG);
      return dict;
    }).then(function (dict) {
      state.dict = dict;
      document.documentElement.lang = state.lang;
      apply();
      updateSwitcherUI();
      document.querySelectorAll('[data-lang-switcher]').forEach(setupSwitcher);
      observeDynamicContent();
    });
  }

  // API pública
  window.setLanguage = setLanguage;
  window.I18N = {
    get lang() { return state.lang; },
    get supported() { return SUPPORTED; },
    t: t,
    apply: apply,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();