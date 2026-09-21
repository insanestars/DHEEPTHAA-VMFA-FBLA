/* ============================================================
   VMFA — theme.js
   Accessibility settings: Theme (Light default · Dark · High Contrast · Match Device), Text size, Reduce motion.

   Loaded synchronously in <head>, BEFORE the stylesheet, so the saved theme
   is on <html data-theme="..."> before the first paint (no flash).
   The saved preference is one of: light | dark | contrast | auto.
   "auto" is resolved here to light/dark from the device setting, and
   re-resolved live if the device setting changes.

   Also handles Reduce motion: the saved choice is 'reduce' or 'full'; with no saved
   choice it follows the device's "reduce motion" setting. The result is on
   <html data-motion="reduce|full"> before the first paint, and a 'vmfa:motionchange'
   event tells other scripts (the hero video) when it changes.
   ============================================================ */
(function () {
  'use strict';

  var KEY   = 'vmfa-theme';
  var VALID = ['light', 'dark', 'contrast', 'auto'];
  var root  = document.documentElement;
  var mq    = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function read() {
    try {
      var v = localStorage.getItem(KEY);
      return VALID.indexOf(v) !== -1 ? v : 'light';
    } catch (e) { return 'light'; }
  }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function resolve(pref) { return pref === 'auto' ? (mq && mq.matches ? 'dark' : 'light') : pref; }

  var pref = read();
  function apply() {
    root.setAttribute('data-theme', resolve(pref));
    root.setAttribute('data-theme-pref', pref);
  }
  apply();                                   // runs before first paint

  /* ── Motion: Reduce motion (saved choice, otherwise the device setting) ─────────── */
  var MKEY = 'vmfa-motion';                  // 'reduce' | 'full' | (nothing saved = follow the device)
  var mqm  = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function readMotion() {
    try { var v = localStorage.getItem(MKEY); return (v === 'reduce' || v === 'full') ? v : 'system'; }
    catch (e) { return 'system'; }
  }
  var motionPref = readMotion();
  function motionResolved() { return motionPref === 'system' ? (mqm && mqm.matches ? 'reduce' : 'full') : motionPref; }
  function applyMotion(announce) {
    root.setAttribute('data-motion', motionResolved());
    if (announce) { try { document.dispatchEvent(new CustomEvent('vmfa:motionchange', { detail: { motion: motionResolved() } })); } catch (e) {} }
  }
  applyMotion(false);                        // runs before first paint
  function setMotion(v) {
    if (v !== 'reduce' && v !== 'full') return;
    motionPref = v;
    try { localStorage.setItem(MKEY, v); } catch (e) {}
    applyMotion(true); refresh();
  }
  function onMotionDeviceChange() { if (motionPref === 'system') { applyMotion(true); refresh(); } }
  if (mqm) {
    if (mqm.addEventListener) mqm.addEventListener('change', onMotionDeviceChange);
    else if (mqm.addListener) mqm.addListener(onMotionDeviceChange);
  }
  window.addEventListener('storage', function (e) {
    if (e.key === MKEY) { motionPref = readMotion(); applyMotion(true); refresh(); }
  });


  /* ── Text size: Default / Large (115%) / Largest (130%) of the browser's own default size ─── */
  var SKEY = 'vmfa-textsize';
  var SIZE_VALID = ['default', 'large', 'largest'];
  function readSize() {
    try { var v = localStorage.getItem(SKEY); return SIZE_VALID.indexOf(v) !== -1 ? v : 'default'; }
    catch (e) { return 'default'; }
  }
  var sizePref = readSize();
  function applySize() { root.setAttribute('data-textsize', sizePref); }
  applySize();                               // runs before first paint
  function setSize(v) {
    if (SIZE_VALID.indexOf(v) === -1) return;
    sizePref = v;
    try { localStorage.setItem(SKEY, v); } catch (e) {}
    applySize(); refresh();
  }
  window.addEventListener('storage', function (e) {
    if (e.key === SKEY) { sizePref = readSize(); applySize(); refresh(); }
  });
  // While motion is reduced, scripted "smooth" scrolling (page changes, jumps to a result) happens instantly.
  function calmScroll(orig) {
    return function (a) {
      if (root.getAttribute('data-motion') === 'reduce' && a && typeof a === 'object' && a.behavior === 'smooth') {
        var c = {}; for (var k in a) c[k] = a[k]; c.behavior = 'auto'; arguments[0] = c;
      }
      return orig.apply(this, arguments);
    };
  }
  ['scrollTo', 'scroll', 'scrollBy'].forEach(function (n) { if (window[n]) window[n] = calmScroll(window[n]); });
  ['scrollIntoView', 'scrollTo', 'scroll', 'scrollBy'].forEach(function (n) { if (Element.prototype[n]) Element.prototype[n] = calmScroll(Element.prototype[n]); });

  // Follow the device while "Match Device" is selected
  function onDeviceChange() { if (pref === 'auto') { apply(); refresh(); } }
  if (mq) {
    if (mq.addEventListener) mq.addEventListener('change', onDeviceChange);
    else if (mq.addListener) mq.addListener(onDeviceChange);
  }
  // Keep other open tabs in sync
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { pref = read(); apply(); refresh(); }
  });

  /* ── UI: one "Accessibility" button + settings panel (theme, text size, reduce motion, reset) ── */
  var OPTIONS = [
    { id: 'light',    label: 'Light',         icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>' },
    { id: 'dark',     label: 'Dark',          icon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>' },
    { id: 'contrast', label: 'High Contrast', icon: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>' },
    { id: 'auto',     label: 'Match Device',  icon: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>' }
  ];
  var SIZES = [
    { id: 'default', label: 'Default' },
    { id: 'large',   label: 'Large (115%)' },
    { id: 'largest', label: 'Largest (130%)' }
  ];
  var A11Y_ICON = '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="7.2" r="1.4" fill="currentColor" stroke="none"/><path d="M7 10.2l5 1 5-1M12 11.2v3.6M9.6 19.4L12 14.8l2.4 4.6"/>';
  function svg(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }

  var uid = 0;
  var widgets = [];

  function build(host) {
    var n = ++uid;
    var panelId = 'a11yPanel' + n;
    host.innerHTML =
      '<div class="theme-drop">' +
        '<button type="button" class="theme-toggle a11y-toggle" aria-expanded="false" aria-controls="' + panelId + '">' +
          '<span class="theme-toggle-icon">' + svg(A11Y_ICON) + '</span>' +
          '<span class="theme-toggle-label">Accessibility</span>' +
          '<span class="a11y-tip" aria-hidden="true">Accessibility</span>' +
        '</button>' +
        '<div class="a11y-panel" id="' + panelId + '" role="group" aria-label="Accessibility settings" hidden>' +
          '<fieldset class="a11y-fs">' +
            '<legend>Theme</legend>' +
            OPTIONS.map(function (o) {
              return '<label class="a11y-choice"><input type="radio" name="a11yTheme' + n + '" value="' + o.id + '" data-theme-value="' + o.id + '">' +
                       svg(o.icon) + '<span class="a11y-choice-text">' + o.label + '</span><span class="a11y-check" aria-hidden="true">&#10003;</span></label>';
            }).join('') +
          '</fieldset>' +
          '<fieldset class="a11y-fs">' +
            '<legend>Text size</legend>' +
            SIZES.map(function (s) {
              return '<label class="a11y-choice"><input type="radio" name="a11ySize' + n + '" value="' + s.id + '" data-size-value="' + s.id + '">' +
                       '<span class="a11y-choice-text">' + s.label + '</span><span class="a11y-check" aria-hidden="true">&#10003;</span></label>';
            }).join('') +
          '</fieldset>' +
          '<div class="a11y-fs a11y-fs--motion">' +
            '<button type="button" class="a11y-switch" role="switch" aria-checked="false">' +
              '<span class="a11y-switch-label">Reduce motion</span>' +
              '<span class="a11y-switch-state" aria-hidden="true">Off</span>' +
              '<span class="a11y-switch-track" aria-hidden="true"><span class="a11y-switch-knob"></span></span>' +
            '</button>' +
          '</div>' +
          '<button type="button" class="a11y-reset">Reset to defaults</button>' +
        '</div>' +
      '</div>';

    var btn   = host.querySelector('.a11y-toggle');
    var panel = host.querySelector('.a11y-panel');
    var sw    = host.querySelector('.a11y-switch');

    function isOpen() { return !panel.hidden; }
    function open(focusIn) {
      closeAll(host);
      panel.hidden = false; btn.setAttribute('aria-expanded', 'true');
      if (focusIn !== false) {
        var cur = panel.querySelector('input[data-theme-value]:checked') || panel.querySelector('input');
        if (cur) cur.focus();
      }
    }
    function close(focusBtn) {
      if (!isOpen()) return;
      panel.hidden = true; btn.setAttribute('aria-expanded', 'false');
      if (focusBtn) btn.focus();
    }

    btn.addEventListener('click', function () { if (isOpen()) close(true); else open(); });
    btn.addEventListener('keydown', function (e) { if (e.key === 'Escape') btn.classList.add('tip-dismissed'); });
    ['mouseleave', 'blur'].forEach(function (ev) { btn.addEventListener(ev, function () { btn.classList.remove('tip-dismissed'); }); });
    host.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { e.preventDefault(); e.stopPropagation(); close(true); }
    });

    panel.addEventListener('change', function (e) {
      var t = e.target;
      if (t.hasAttribute('data-theme-value')) set(t.value);
      else if (t.hasAttribute('data-size-value')) setSize(t.value);
    });
    sw.addEventListener('click', function () { setMotion(motionResolved() === 'reduce' ? 'full' : 'reduce'); });
    host.querySelector('.a11y-reset').addEventListener('click', resetAll);

    widgets.push({ host: host, btn: btn, panel: panel, sw: sw, open: open, close: close, isOpen: isOpen });
  }

  function closeAll(except) {
    widgets.forEach(function (w) { if (w.host !== except && w.isOpen()) w.close(); });
  }

  function refresh() {
    var mOn = motionResolved() === 'reduce';
    widgets.forEach(function (w) {
      var inputs = w.panel.querySelectorAll('input[type=radio]');
      for (var i = 0; i < inputs.length; i++) {
        var t = inputs[i];
        t.checked = t.hasAttribute('data-theme-value') ? t.value === pref : t.value === sizePref;
      }
      w.sw.setAttribute('aria-checked', mOn ? 'true' : 'false');
      w.sw.querySelector('.a11y-switch-state').textContent = mOn ? 'On' : 'Off';
    });
  }

  function set(v) {
    if (VALID.indexOf(v) === -1) return;
    pref = v; save(v); apply(); refresh();
  }
  function resetAll() {
    set('light'); setSize('default');
    motionPref = 'system'; try { localStorage.removeItem(MKEY); } catch (e) {}
    applyMotion(true); refresh();
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-a11y-open]')) return;   // the mobile-menu item opens the panel itself
    widgets.forEach(function (w) { if (w.isOpen() && !w.host.contains(e.target)) w.close(); });
  });
  // Tabbing out of an open panel closes it (no focus is stolen)
  document.addEventListener('focusin', function (e) {
    widgets.forEach(function (w) { if (w.isOpen() && !w.host.contains(e.target)) w.close(); });
  });

  // Any control marked data-a11y-open (the mobile menu item) opens the header panel
  function openFromTrigger() {
    var w = widgets[0]; if (!w) return;
    if (typeof window.closeMobileNav === 'function') window.closeMobileNav();
    w.open();
  }
  function init() {
    var hosts = document.querySelectorAll('[data-theme-switcher]');
    for (var i = 0; i < hosts.length; i++) build(hosts[i]);
    var trig = document.querySelectorAll('[data-a11y-open]');
    for (var j = 0; j < trig.length; j++) trig[j].addEventListener('click', function (e) { e.preventDefault(); openFromTrigger(); });
    refresh();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.VMFATheme = { get: function () { return pref; }, set: set, size: { get: function () { return sizePref; }, set: setSize }, motion: { get: motionResolved, set: setMotion }, reset: resetAll };
})();
