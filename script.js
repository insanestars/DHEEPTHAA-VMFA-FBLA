/**
 * VMFA — script.js
 */

// ============================================================
// SPA Page Routing
// ============================================================

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });

  var target = document.getElementById(pageId);
  if (target) target.classList.add('active');

  document.querySelectorAll('nav a[data-page]').forEach(function(link) {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageId) link.classList.add('active');
  });

  // When navigating to exhibitions normally, always reset to Exhibitions tab
  if (pageId === 'exhibitions') {
    showMainTab('exhibitions', document.getElementById('tabExhibitions'));
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// Collection Category Routing
// Called from home page tiles AND from within the collection page tabs
// ============================================================

function showCollection(category, tabBtn) {
  // First navigate to the collection page
  showPage('collection');

  // Hide all category sections
  document.querySelectorAll('.col-section').forEach(function(s) {
    s.classList.remove('active');
  });

  // Show the requested one
  var target = document.getElementById('col-' + category);
  if (target) target.classList.add('active');

  // Update tab pill active state
  document.querySelectorAll('.col-tab').forEach(function(t) {
    t.classList.remove('active');
  });

  // If called from a tab button inside the collection page use that button,
  // otherwise find the matching tab by data attribute or position
  if (tabBtn) {
    tabBtn.classList.add('active');
  } else {
    // find the tab whose onclick contains this category
    document.querySelectorAll('.col-tab').forEach(function(t) {
      if (t.getAttribute('onclick') && t.getAttribute('onclick').indexOf("'" + category + "'") !== -1) {
        t.classList.add('active');
      }
    });
  }
}

// ============================================================
// Mobile Navigation
// ============================================================

function openMobileNav() {
  var nav = document.getElementById('mobileNav');
  if (nav) { nav.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeMobileNav() {
  var nav = document.getElementById('mobileNav');
  if (nav) { nav.classList.remove('open'); document.body.style.overflow = ''; }
}

// ============================================================
// Exhibition / Events Main Tab Switcher
// ============================================================

function showMainTab(tab, btn) {
  // Update main tab active state
  document.querySelectorAll('.main-tab').forEach(function(t) { t.classList.remove('active'); });
  if (btn) btn.classList.add('active');

  var exContent = document.getElementById('exhibitionsContent');
  var evContent = document.getElementById('eventsContent');
  if (tab === 'events') {
    if (exContent) exContent.style.display = 'none';
    if (evContent) evContent.style.display = 'block';
  } else {
    if (exContent) exContent.style.display = 'block';
    if (evContent) evContent.style.display = 'none';
  }
}

// Navigate to Exhibitions page and immediately open the Events tab
function showPageEvents() {
  showPage('exhibitions');
  setTimeout(function() {
    showMainTab('events', document.getElementById('tabEvents'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 50);
}

// Navigate to the Events tab and scroll to a specific event card by id
function showEvent(eventId) {
  showPage('exhibitions');
  setTimeout(function() {
    showMainTab('events', document.getElementById('tabEvents'));
    setTimeout(function() {
      var target = document.getElementById(eventId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('event-highlight');
        setTimeout(function() { target.classList.remove('event-highlight'); }, 1800);
      }
    }, 80);
  }, 50);
}

// ============================================================
// Exhibition Detail Panel
// ============================================================

function openDetailPanel(el) {
  var panel   = document.getElementById('exhibitPanel');
  var overlay = document.getElementById('exhibitOverlay');

  document.getElementById('epImg').src              = el.dataset.img || '';
  document.getElementById('epImg').alt              = el.dataset.title || '';
  document.getElementById('epCategory').textContent = el.dataset.category || '';
  document.getElementById('epTitle').innerHTML      = el.dataset.title || '';
  document.getElementById('epDates').textContent    = el.dataset.dates || '';
  document.getElementById('epDesc').textContent     = el.dataset.desc || '';
  document.getElementById('epTicket').textContent   = el.dataset.ticket || '';

  var badge = document.getElementById('epBadge');
  badge.textContent = el.dataset.badgeLabel || '';
  badge.className   = 'exhibit-badge ' + (el.dataset.badge || '');

  panel.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openExhibitDetail(el) { openDetailPanel(el); }

function closeExhibitDetail() {
  document.getElementById('exhibitPanel').classList.remove('open');
  document.getElementById('exhibitOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ============================================================
// Exhibition Filter Tabs (sub-tabs within Exhibitions)
// ============================================================

function filterExhibitions(filter, btn) {
  document.querySelectorAll('.tab').forEach(function(tab) { tab.classList.remove('active'); });
  if (btn) btn.classList.add('active');

  document.querySelectorAll('.exhibit-row').forEach(function(row) {
    var status = row.getAttribute('data-status');
    if (filter === 'all' || filter === status) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });
}

// ============================================================
// Sticky Header
// ============================================================

function handleScroll() {
  var header = document.getElementById('site-header');
  if (!header) return;
  if (window.scrollY > 10) { header.classList.add('scrolled'); }
  else { header.classList.remove('scrolled'); }
}

// ============================================================
// Scroll Reveal
// ============================================================

function revealOnScroll() {
  if (!('IntersectionObserver' in window)) return;

  var grids = document.querySelectorAll('.events-grid, .collection-grid, .artists-grid, .visit-grid, .col-works-grid');
  grids.forEach(function(grid) {
    Array.from(grid.children).forEach(function(child, i) {
      child.classList.add('pre-reveal');
      child.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  var singles = document.querySelectorAll(
    '.section-header, .exhibit-row, .current-exhibition .inner, ' +
    '.member-cta-text, .member-cta-img, .newsletter-inner, .footer-top, .col-about'
  );
  singles.forEach(function(el) { el.classList.add('pre-reveal'); });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll('.pre-reveal').forEach(function(el) { observer.observe(el); });
}

// ============================================================
// Search
// ============================================================

// Strip accents so "fabergé" indexes as "faberge", etc.
function normalizeStr(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Optimal String Alignment distance (Damerau-Levenshtein variant).
// Counts adjacent transpositions (re→er) as 1 edit, not 2.
// This means "fabreje" → "faberge" costs 2 (one swap + one sub) instead of 3.
function editDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  var m = a.length, n = b.length, i, j;
  var d = [];
  for (i = 0; i <= m; i++) { d[i] = [i]; }
  for (j = 1; j <= n; j++) { d[0][j] = j; }
  for (i = 1; i <= m; i++) {
    for (j = 1; j <= n; j++) {
      var cost = a[i-1] === b[j-1] ? 0 : 1;
      d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + cost);
      if (i > 1 && j > 1 && a[i-1] === b[j-2] && a[i-2] === b[j-1]) {
        d[i][j] = Math.min(d[i][j], d[i-2][j-2] + 1);
      }
    }
  }
  return d[m][n];
}

// Tolerance scales with word length so short words still need exact matches.
function fuzzyTolerance(len) {
  if (len < 4) return 0;
  if (len < 6) return 1;
  if (len < 10) return 2;
  return 3;
}

// Jaro similarity — handles scrambled/garbled strings by counting shared
// characters within a sliding window (order-flexible matching).
function jaro(a, b) {
  if (a === b) return 1;
  var la = a.length, lb = b.length;
  if (!la || !lb) return 0;
  var win = Math.max(Math.floor(Math.max(la, lb) / 2) - 1, 0);
  var am = new Array(la).fill(false);
  var bm = new Array(lb).fill(false);
  var matches = 0;
  for (var i = 0; i < la; i++) {
    var lo = Math.max(0, i - win), hi = Math.min(i + win + 1, lb);
    for (var j = lo; j < hi; j++) {
      if (bm[j] || a[i] !== b[j]) continue;
      am[i] = bm[j] = true; matches++; break;
    }
  }
  if (!matches) return 0;
  var t = 0, k = 0;
  for (var i = 0; i < la; i++) {
    if (!am[i]) continue;
    while (!bm[k]) k++;
    if (a[i] !== b[k]) t++;
    k++;
  }
  return (matches / la + matches / lb + (matches - t / 2) / matches) / 3;
}

// Jaro-Winkler boosts the score further when strings share a common prefix.
function jaroWinkler(a, b) {
  var j = jaro(a, b);
  var p = 0, max = Math.min(4, a.length, b.length);
  while (p < max && a[p] === b[p]) p++;
  return j + p * 0.1 * (1 - j);
}

function toggleSearch() {
  var overlay = document.getElementById('searchOverlay');
  if (!overlay) return;
  var isOpen = overlay.classList.toggle('open');
  if (isOpen) {
    var input = document.getElementById('searchInput');
    if (input) { input.focus(); input.value = ''; }
    var resultsEl = document.getElementById('searchResults');
    if (resultsEl) resultsEl.innerHTML = '';
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

var _searchIndex = null;
var PAGE_LABELS = {
  home: 'Home',
  exhibitions: 'Exhibitions',
  collection: 'Collection',
  artists: 'Featured Artists',
  visit: 'Plan Your Visit'
};

function buildSearchIndex() {
  var index = [];
  var pageSelectors = {
    home:        ['.event-card', '.current-exhibition .inner', '.info-bar-item', '.collection-tile', '.member-cta-text'],
    exhibitions: ['.exhibit-row'],
    collection:  ['.col-section', '.col-work'],
    artists:     ['.artist-card'],
    visit:       ['.visit-card']
  };
  Object.keys(pageSelectors).forEach(function(pageId) {
    pageSelectors[pageId].forEach(function(sel) {
      document.querySelectorAll('#' + pageId + ' ' + sel).forEach(function(el) {
        var titleEl = el.querySelector('h1, h2, h3, .col-work-title, .col-work-artist') || el.querySelector('strong, .tile-label');
        var title = titleEl ? titleEl.textContent.trim() : el.textContent.trim().substring(0, 60);
        var text = normalizeStr(el.textContent);
        var words = text.split(/[^a-z0-9]+/).filter(function(w) { return w.length >= 2; });
        index.push({ page: pageId, el: el, title: title, text: text, words: words });
      });
    });
  });
  return index;
}

function goToResult(item) {
  var overlay = document.getElementById('searchOverlay');
  if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  var resultsEl = document.getElementById('searchResults');
  if (resultsEl) resultsEl.innerHTML = '';
  var input = document.getElementById('searchInput');
  if (input) input.value = '';

  showPage(item.page);
  setTimeout(function() {
    item.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    item.el.classList.add('search-highlight');
    setTimeout(function() { item.el.classList.remove('search-highlight'); }, 2400);
  }, 120);
}

function performSearch(query) {
  var resultsEl = document.getElementById('searchResults');
  if (!resultsEl) return;
  resultsEl.innerHTML = '';
  var q = (query || '').trim().toLowerCase();
  if (q.length < 2) return;
  if (!_searchIndex) _searchIndex = buildSearchIndex();

  // Normalize query the same way as the index (strip accents, lowercase)
  var queryWords = normalizeStr(q).split(/[^a-z0-9]+/).filter(function(w) { return w.length >= 2; });
  if (!queryWords.length) return;

  var matches = [];
  _searchIndex.forEach(function(item) {
    var score = 0;

    queryWords.forEach(function(qw) {
      // Tier 1: exact substring match — highest score
      if (item.text.indexOf(qw) !== -1) {
        score += qw.length * 4;
        return;
      }

      var matched = false;

      // Tier 2: edit distance (OSA) — handles 1-2 character typos
      var tol = fuzzyTolerance(qw.length);
      if (tol > 0) {
        for (var i = 0; i < item.words.length; i++) {
          var tw = item.words[i];
          if (Math.abs(tw.length - qw.length) > tol + 1) continue;
          var dist = editDistance(qw, tw);
          if (dist <= tol) {
            score += Math.max(1, (qw.length - dist) * 2);
            matched = true;
            break;
          }
        }
      }

      // Tier 3: Jaro-Winkler — handles garbled/scrambled spellings
      // e.g. "cliuiide" → "claude", "fbrega" → "faberge"
      if (!matched && qw.length >= 4) {
        var bestJW = 0, bestLen = 0;
        for (var i = 0; i < item.words.length; i++) {
          var tw = item.words[i];
          if (tw.length < 4) continue;
          var jw = jaroWinkler(qw, tw);
          if (jw > bestJW) { bestJW = jw; bestLen = tw.length; }
        }
        if (bestJW >= 0.72) {
          score += Math.round(bestJW * Math.min(qw.length, bestLen));
        }
      }
    });

    if (score > 0) matches.push({ score: score, item: item });
  });

  matches.sort(function(a, b) { return b.score - a.score; });

  // Deduplicate by title (same item can appear via multiple selectors)
  var seen = Object.create(null);
  matches = matches.filter(function(m) {
    if (seen[m.item.title]) return false;
    seen[m.item.title] = true;
    return true;
  });

  if (matches.length === 0) {
    var none = document.createElement('p');
    none.className = 'search-no-results';
    none.textContent = 'No results for “' + query.trim() + '”';
    resultsEl.appendChild(none);
    return;
  }

  var limit = Math.min(matches.length, 8);
  matches.slice(0, limit).forEach(function(m) {
    var btn = document.createElement('button');
    btn.className = 'search-result-item';
    btn.innerHTML =
      '<span class="sri-tag">' + (PAGE_LABELS[m.item.page] || m.item.page) + '</span>' +
      '<span class="sri-title">' + m.item.title + '</span>';
    btn.addEventListener('click', function() { goToResult(m.item); });
    resultsEl.appendChild(btn);
  });
}

function headerSearch() {
  var input = document.getElementById('headerSearchInput');
  if (!input || !input.value.trim()) return;
  var query = input.value.trim();
  input.value = '';
  var overlay = document.getElementById('searchOverlay');
  var overlayInput = document.getElementById('searchInput');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (overlayInput) overlayInput.value = query;
  performSearch(query);
}

// ============================================================
// Newsletter
// ============================================================

function handleNewsletter(e) {
  e.preventDefault();
  var form = document.getElementById('newsletterForm');
  var success = document.getElementById('newsletterSuccess');
  if (form) form.style.display = 'none';
  if (success) success.style.display = 'block';
}

// ============================================================
// Dynamic Today's Hours
// ============================================================

function updateTodaysHours() {
  var hoursMap = { 0:'10 am – 5 pm', 1:'10 am – 5 pm', 2:'10 am – 9 pm', 3:'10 am – 9 pm', 4:'10 am – 9 pm', 5:'10 am – 9 pm', 6:'10 am – 5 pm' };
  var todaysHours = hoursMap[new Date().getDay()];
  document.querySelectorAll('.todays-hours-display').forEach(function(el) { el.textContent = todaysHours; });
}

// ============================================================
// Init
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  var menuBtn   = document.getElementById('menuBtn');
  var menuClose = document.getElementById('menuClose');
  if (menuBtn)   menuBtn.addEventListener('click', openMobileNav);
  if (menuClose) menuClose.addEventListener('click', closeMobileNav);

  var searchBtn     = document.getElementById('searchBtn');
  var searchClose   = document.getElementById('searchClose');
  var searchOverlay = document.getElementById('searchOverlay');
  if (searchBtn)   searchBtn.addEventListener('click', toggleSearch);
  if (searchClose) searchClose.addEventListener('click', toggleSearch);

  var headerInput = document.getElementById('headerSearchInput');
  if (headerInput) {
    headerInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') headerSearch(); });
  }

  var searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() { performSearch(searchInput.value); });
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var first = document.querySelector('.search-result-item');
        if (first) first.click();
      }
    });
  }

  if (searchOverlay) {
    searchOverlay.addEventListener('click', function(e) { if (e.target === searchOverlay) toggleSearch(); });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileNav();
      if (searchOverlay && searchOverlay.classList.contains('open')) toggleSearch();
    }
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
  revealOnScroll();
  updateTodaysHours();
  showPage('home');

  console.log('VMFA site initialized.');
});