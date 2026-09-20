/* ============================================================
   VMFA — theme.js
   Theme switcher: Light (default) · Dark · High Contrast · Match Device.

   Loaded synchronously in <head>, BEFORE the stylesheet, so the saved theme
   is on <html data-theme="..."> before the first paint (no flash).
   The saved preference is one of: light | dark | contrast | auto.
   "auto" is resolved here to light/dark from the device setting, and
   re-resolved live if the device setting changes.
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

  /* ── UI ───────────────────────────────────────────────── */
  var OPTIONS = [
    { id: 'light',    label: 'Light',         icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>' },
    { id: 'dark',     label: 'Dark',          icon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>' },
    { id: 'contrast', label: 'High Contrast', icon: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>' },
    { id: 'auto',     label: 'Match Device',  icon: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>' }
  ];
  function svg(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }
  function byId(id) { for (var i = 0; i < OPTIONS.length; i++) if (OPTIONS[i].id === id) return OPTIONS[i]; return OPTIONS[0]; }

  var uid = 0;
  var widgets = [];

  function build(host) {
    var n = ++uid;
    var menuId = 'themeMenu' + n;
    host.innerHTML =
      '<button type="button" class="theme-toggle" aria-haspopup="true" aria-expanded="false" aria-controls="' + menuId + '">' +
        '<span class="theme-toggle-icon"></span>' +
        '<span class="theme-toggle-label">Theme</span>' +
      '</button>' +
      '<div class="theme-menu" id="' + menuId + '" role="group" aria-label="Color theme" hidden>' +
        '<p class="theme-menu-title" aria-hidden="true">Theme</p>' +
        OPTIONS.map(function (o) {
          return '<button type="button" class="theme-option" role="menuitemradio" aria-checked="false" data-theme-value="' + o.id + '">' +
                   svg(o.icon) + '<span>' + o.label + '</span><span class="theme-option-check" aria-hidden="true">&#10003;</span>' +
                 '</button>';
        }).join('') +
      '</div>';

    var btn  = host.querySelector('.theme-toggle');
    var menu = host.querySelector('.theme-menu');
    var opts = Array.prototype.slice.call(menu.querySelectorAll('.theme-option'));

    function open()  { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
    function close(focusBtn) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (focusBtn) btn.focus(); }
    function isOpen() { return !menu.hidden; }

    btn.addEventListener('click', function () {
      if (isOpen()) { close(); return; }
      closeAll(host); open();
      var cur = menu.querySelector('[aria-checked="true"]') || opts[0];
      cur.focus();
    });
    opts.forEach(function (o, i) {
      o.addEventListener('click', function () { set(o.getAttribute('data-theme-value')); close(true); });
      o.addEventListener('keydown', function (e) {
        var k = e.key, next = null;
        if (k === 'ArrowDown' || k === 'ArrowRight') next = opts[(i + 1) % opts.length];
        else if (k === 'ArrowUp' || k === 'ArrowLeft') next = opts[(i - 1 + opts.length) % opts.length];
        else if (k === 'Home') next = opts[0];
        else if (k === 'End')  next = opts[opts.length - 1];
        else if (k === 'Escape') { e.preventDefault(); close(true); return; }
        else if (k === 'Tab') { close(); return; }
        if (next) { e.preventDefault(); next.focus(); }
      });
    });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' && !isOpen()) { e.preventDefault(); closeAll(host); open(); (menu.querySelector('[aria-checked="true"]') || opts[0]).focus(); }
      if (e.key === 'Escape' && isOpen()) { close(true); }
    });

    widgets.push({ host: host, btn: btn, menu: menu, opts: opts, close: close, isOpen: isOpen });
  }

  function closeAll(except) {
    widgets.forEach(function (w) { if (w.host !== except && w.isOpen()) w.close(); });
  }

  function refresh() {
    var cur = byId(pref);
    widgets.forEach(function (w) {
      w.btn.querySelector('.theme-toggle-icon').innerHTML = svg(cur.icon);
      w.btn.setAttribute('aria-label', 'Color theme: ' + cur.label + '. Change theme');
      w.btn.setAttribute('title', 'Theme: ' + cur.label);
      w.opts.forEach(function (o) {
        o.setAttribute('aria-checked', o.getAttribute('data-theme-value') === pref ? 'true' : 'false');
      });
    });
  }

  function set(v) {
    if (VALID.indexOf(v) === -1) return;
    pref = v; save(v); apply(); refresh();
  }

  document.addEventListener('click', function (e) {
    widgets.forEach(function (w) { if (w.isOpen() && !w.host.contains(e.target)) w.close(); });
  });

  function init() {
    var hosts = document.querySelectorAll('[data-theme-switcher]');
    for (var i = 0; i < hosts.length; i++) build(hosts[i]);
    refresh();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.VMFATheme = { get: function () { return pref; }, set: set };
})();
