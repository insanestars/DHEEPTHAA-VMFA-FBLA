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

  // Member area: reserve button (logged in) or sign-in prompt
  var memberArea = document.getElementById('panelMemberArea');
  if (memberArea) {
    var status = (el.dataset.badge || '').toLowerCase();
    if (status === 'past') {
      memberArea.innerHTML = '';
    } else if (window.vmfaUser) {
      memberArea.innerHTML = '<button class="btn-red panel-reserve-btn" onclick="openReserveModal()">Reserve Tickets →</button>';
    } else {
      memberArea.innerHTML = '<a href="login.html" class="panel-signin-link">✧ Sign in to reserve tickets</a>';
    }
  }

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
  calState.statusFilter = filter;

  document.querySelectorAll('.exhibit-row').forEach(function(row) {
    var status = row.getAttribute('data-status');
    if (filter === 'all' || filter === status) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });

  if (calState.view === 'calendar') renderCalendar();
}

// ============================================================
// Exhibition Calendar
// ============================================================

var EXHIBITION_DATA = [
  {
    title: 'Giants: Art from the Dean Collection of Swizz Beatz and Alicia Keys',
    img: 'images/giants.jpg',
    badge: 'past', badgeLabel: 'Closed',
    category: 'Special Exhibition · Altria Group Gallery',
    start: new Date(2025, 10, 22), end: new Date(2026, 2, 1),
    desc: 'Celebrating Black artistic excellence across generations, this landmark exhibition featured over 130 works by Jean-Michel Basquiat, Kerry James Marshall, Amy Sherald, Derrick Adams, and Kehinde Wiley.',
    ticket: 'This exhibition has closed.', status: 'past'
  },
  {
    title: 'Monet & the Impressionists: French Masterworks',
    img: 'images/monet.jpg',
    badge: 'current', badgeLabel: 'Now On View',
    category: 'Permanent Collection · Mellon Galleries',
    start: null, end: null, ongoing: true,
    desc: 'VMFA houses one of the finest collections of Impressionist paintings in the American South, including landmark works by Claude Monet, Edgar Degas, Pierre-Auguste Renoir, and Mary Cassatt.',
    ticket: '✦ Free with General Admission', status: 'current'
  },
  {
    title: "India’s Great Mughals: Art, Power, and Opulence",
    img: 'images/mughals.jpg',
    badge: 'current', badgeLabel: 'Now On View',
    category: 'Special Exhibition · Altria Group Gallery',
    start: new Date(2026, 4, 9), end: new Date(2026, 7, 23),
    desc: 'An unprecedented exhibition drawing on rarely seen manuscripts, jewels, textiles, and paintings from the Mughal dynasty, organized by the Victoria and Albert Museum.',
    ticket: '✦ Ticketed Exhibition – Members Free', status: 'current'
  },
  {
    title: 'Jazz & Visual Art: The Richmond Renaissance',
    img: 'images/jazz.jpg',
    badge: 'upcoming', badgeLabel: 'Upcoming',
    category: 'Special Exhibition · NewMarket Gallery',
    start: new Date(2026, 6, 12), end: new Date(2026, 9, 25),
    datesLabel: 'Summer 2026 (Dates TBA)',
    desc: 'A celebration of the deep connections between jazz music and the visual arts in Richmond, Virginia, tracing the city’s vibrant jazz scene from the 1920s through today.',
    ticket: '✦ Free with General Admission', status: 'upcoming'
  },
  {
    title: 'Fabergé: Romance to Revolution',
    img: 'images/faberge.jpg',
    badge: 'upcoming', badgeLabel: 'Upcoming',
    category: 'Special Exhibition',
    start: new Date(2026, 8, 20), end: new Date(2027, 0, 18),
    datesLabel: 'Fall 2026 (Dates TBA)',
    desc: "Drawing on VMFA’s unparalleled Fabergé holdings, this exhibition traces the extraordinary craftsmanship of the Fabergé firm from Imperial Russia to the revolution that ended it all.",
    ticket: '✦ Ticketed Exhibition – Members Free', status: 'upcoming'
  }
];

var CAL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

var calState = (function() {
  var n = new Date();
  return { year: n.getFullYear(), month: n.getMonth(), view: 'list', statusFilter: 'all' };
}());

function exInMonth(ex, y, m) {
  if (ex.ongoing) return true;
  var ms = new Date(y, m, 1);
  var me = new Date(y, m + 1, 0, 23, 59, 59);
  return ex.start <= me && ex.end >= ms;
}

function exDateLabel(ex) {
  if (ex.datesLabel) return ex.datesLabel;
  if (ex.ongoing) return 'Ongoing · Permanent Collection';
  var o = { month: 'long', day: 'numeric', year: 'numeric' };
  return ex.start.toLocaleDateString('en-US', o) + ' – ' + ex.end.toLocaleDateString('en-US', o);
}

function renderCalendar() {
  var labelEl = document.getElementById('calMonthLabel');
  var countEl = document.getElementById('calCount');
  var container = document.getElementById('calView');
  if (!container) return;

  if (labelEl) labelEl.textContent = CAL_MONTHS[calState.month] + ' ' + calState.year;

  var visible = EXHIBITION_DATA.filter(function(ex) {
    var statusOk = calState.statusFilter === 'all' || ex.status === calState.statusFilter;
    return statusOk && exInMonth(ex, calState.year, calState.month);
  });

  if (countEl) {
    countEl.textContent = visible.length + (visible.length === 1 ? ' exhibition' : ' exhibitions');
  }

  if (visible.length === 0) {
    container.innerHTML = '<div class="cal-empty"><p>No exhibitions match for ' +
      CAL_MONTHS[calState.month] + ' ' + calState.year + '.</p></div>';
    return;
  }

  container.innerHTML = visible.map(function(ex) {
    var st = ex.title.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    var sd = ex.desc.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    return '<article class="cal-card" onclick="openDetailPanel(this)" style="cursor:pointer;"' +
      ' data-img="' + ex.img + '"' +
      ' data-badge="' + ex.badge + '" data-badge-label="' + ex.badgeLabel + '"' +
      ' data-category="' + ex.category + '"' +
      ' data-title="' + st + '"' +
      ' data-dates="' + exDateLabel(ex) + '"' +
      ' data-desc="' + sd + '"' +
      ' data-ticket="' + ex.ticket + '">' +
      '<div class="cal-card-img-wrap">' +
        '<img src="' + ex.img + '" alt="' + st + '" loading="lazy"/>' +
        '<span class="exhibit-badge ' + ex.badge + '">' + ex.badgeLabel + '</span>' +
      '</div>' +
      '<div class="cal-card-body">' +
        '<p class="exhibit-category">' + ex.category + '</p>' +
        '<h3>' + ex.title + '</h3>' +
        '<p class="cal-dates-line">' + exDateLabel(ex) + '</p>' +
        '<p class="exhibit-desc">' + ex.desc + '</p>' +
        '<span class="ticket-note">' + ex.ticket + '</span>' +
      '</div>' +
    '</article>';
  }).join('');

  if (window.vmfaUser) attachExhibitionHearts();
}

function renderMonthPills() {
  var container = document.getElementById('calMonthPills');
  if (!container) return;

  var months = [];
  var d = new Date(2025, 10, 1);
  var end = new Date(2027, 2, 1);
  while (d <= end) {
    var y = d.getFullYear(), m = d.getMonth();
    if (EXHIBITION_DATA.some(function(ex) { return exInMonth(ex, y, m); })) {
      months.push({ y: y, m: m });
    }
    d.setMonth(d.getMonth() + 1);
  }

  container.innerHTML = months.map(function(p) {
    var active = p.y === calState.year && p.m === calState.month;
    return '<button class="cal-pill' + (active ? ' active' : '') +
      '" onclick="jumpCalMonth(' + p.y + ',' + p.m + ')">' +
      CAL_MONTHS[p.m].substr(0, 3) + ' ’' + String(p.y).slice(2) + '</button>';
  }).join('');

  setTimeout(function() {
    var a = container.querySelector('.cal-pill.active');
    if (a) a.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, 60);
}

function jumpCalMonth(year, month) {
  calState.year = year; calState.month = month;
  renderCalendar(); renderMonthPills();
}

function shiftCalMonth(delta) {
  calState.month += delta;
  if (calState.month > 11) { calState.month = 0; calState.year++; }
  if (calState.month < 0)  { calState.month = 11; calState.year--; }
  renderCalendar(); renderMonthPills();
}

function setExhibitionView(view, btn) {
  calState.view = view;
  document.querySelectorAll('.vtb').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');

  var listEl    = document.getElementById('exhibitionsList');
  var calViewEl = document.getElementById('calView');
  var toolbar   = document.getElementById('calToolbar');
  var pills     = document.getElementById('calMonthPills');

  if (view === 'calendar') {
    if (listEl)    listEl.style.display    = 'none';
    if (calViewEl) calViewEl.style.display = 'block';
    if (toolbar)   toolbar.style.display   = 'flex';
    if (pills)     pills.style.display     = 'flex';
    renderCalendar(); renderMonthPills();
  } else {
    if (listEl)    listEl.style.display    = '';
    if (calViewEl) calViewEl.style.display = 'none';
    if (toolbar)   toolbar.style.display   = 'none';
    if (pills)     pills.style.display     = 'none';
  }
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

function mobileNavSearch() {
  var input = document.getElementById('mobileNavSearchInput');
  var query = input ? input.value.trim() : '';
  closeMobileNav();
  var overlay = document.getElementById('searchOverlay');
  var overlayInput = document.getElementById('searchInput');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (overlayInput) { overlayInput.value = query; }
  if (query) performSearch(query);
  else if (overlayInput) overlayInput.focus();
  if (input) input.value = '';
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

  var mobileNavInput = document.getElementById('mobileNavSearchInput');
  if (mobileNavInput) {
    mobileNavInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') mobileNavSearch(); });
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
      var rm = document.getElementById('reserveModal');
      if (rm && rm.classList.contains('open')) closeReserveModal();
      var rp = document.getElementById('myReservationsPanel');
      var cp = document.getElementById('myCollectionPanel');
      if ((rp && rp.classList.contains('open')) || (cp && cp.classList.contains('open'))) closeMyPanels();
    }
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
  revealOnScroll();
  updateTodaysHours();
  showPage('home');
  initAuth();


  console.log('VMFA site initialized. Member features active:', !!window.vmfaUser);
});

// ============================================================
// Auth & Member System
// ============================================================

window.vmfaUser = null;

function initAuth() {
  try { window.vmfaUser = JSON.parse(localStorage.getItem('vmfa_user')); } catch(e) {}
  if (window.vmfaUser) enableMemberMode();
}

function enableMemberMode() {
  var user = window.vmfaUser;

  // Update utility bar
  var utilGuest  = document.getElementById('utilGuest');
  var utilMember = document.getElementById('utilMember');
  if (utilGuest)  utilGuest.style.display = 'none';
  if (utilMember) {
    var initials = user.name.split(' ').map(function(n) { return n[0] || ''; }).slice(0, 2).join('').toUpperCase();
    utilMember.style.display = 'flex';
    utilMember.innerHTML =
      '<div class="util-avatar">' + escHtml(initials) + '</div>' +
      '<span class="util-greeting">Welcome, <strong>' + escHtml(user.name) + '</strong></span>' +
      '<span class="util-divider">&middot;</span>' +
      '<a href="#" class="util-link" onclick="openMyReservations(); return false;">My Reservations</a>' +
      '<span class="util-divider">&middot;</span>' +
      '<a href="#" class="util-link" onclick="openMyCollection(); return false;">My Collection</a>' +
      '<span class="util-divider">&middot;</span>' +
      '<a href="#" class="util-link" onclick="logout(); return false;">Sign Out</a>';
  }

  // Mobile nav auth item
  var mobileAuth = document.getElementById('mobileAuthItem');
  if (mobileAuth) {
    mobileAuth.innerHTML =
      '<a href="#" onclick="openMyReservations(); closeMobileNav(); return false;">My Reservations</a>' +
      '&nbsp;&middot;&nbsp;' +
      '<a href="#" onclick="logout(); return false;">Sign Out</a>';
  }

  // Add heart (favorite) buttons to artwork and artist cards
  document.querySelectorAll('.col-work, .artist-card').forEach(function(card) {
    if (card.querySelector('.fav-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'fav-btn';
    btn.setAttribute('aria-label', 'Save to My Collection');
    btn.innerHTML = '&#9829;';
    btn.addEventListener('click', function(e) { e.stopPropagation(); toggleFavorite(card, btn); });
    card.appendChild(btn);
  });

  attachExhibitionHearts();
}

function attachExhibitionHearts() {
  if (!window.vmfaUser) return;
  document.querySelectorAll('.exhibit-row, .cal-card').forEach(function(card) {
    var wrap = card.querySelector('.exhibit-img-wrap, .cal-card-img-wrap');
    if (!wrap || wrap.querySelector('.fav-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'fav-btn';
    btn.setAttribute('aria-label', 'Save to My Collection');
    btn.innerHTML = '&#9829;';
    btn.addEventListener('click', function(e) { e.stopPropagation(); toggleFavorite(card, btn); });
    wrap.appendChild(btn);
  });
  restoreFavorites();
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function closeUserDropdown() {}  // kept for any stale calls

function logout() {
  localStorage.removeItem('vmfa_user');
  window.location.href = 'login.html';
}

// ============================================================
// Reservation System
// ============================================================

var _resContext = { title: '', dates: '', ticketText: '', isTicketed: false, lastRef: '', savedDate: '' };
var _ticketCounts = { adults: 0, seniors: 0, students: 0, children: 0 };
var _ticketPrices = { adults: 20, seniors: 16, students: 12, children: 0 };

function openReserveModal() {
  _resContext.title      = document.getElementById('epTitle')  ? document.getElementById('epTitle').textContent  : '';
  _resContext.dates      = document.getElementById('epDates')  ? document.getElementById('epDates').textContent  : '';
  _resContext.ticketText = document.getElementById('epTicket') ? document.getElementById('epTicket').textContent : '';
  _resContext.isTicketed = _resContext.ticketText.toLowerCase().indexOf('ticketed') !== -1;

  document.getElementById('reserveModalTitle').textContent = _resContext.title;
  document.getElementById('reserveModalDates').textContent = _resContext.dates;

  // Set prices and button text based on ticketed vs free
  if (_resContext.isTicketed) {
    _ticketPrices = { adults: 20, seniors: 16, students: 12, children: 0 };
    document.getElementById('priceAdults').textContent   = '$20 each';
    document.getElementById('priceSeniors').textContent  = '$16 each';
    document.getElementById('priceStudents').textContent = '$12 each';
    document.getElementById('reserveStep1Btn').innerHTML = 'Proceed to Payment &rarr;';
    document.getElementById('reserveMemberNote').textContent = '✦ Members receive complimentary admission to ticketed exhibitions.';
  } else {
    _ticketPrices = { adults: 0, seniors: 0, students: 0, children: 0 };
    document.getElementById('priceAdults').textContent   = 'Free';
    document.getElementById('priceSeniors').textContent  = 'Free';
    document.getElementById('priceStudents').textContent = 'Free';
    document.getElementById('reserveStep1Btn').innerHTML = 'Reserve Free Tickets &rarr;';
    document.getElementById('reserveMemberNote').textContent = '';
  }

  // Reset counts
  _ticketCounts = { adults: 0, seniors: 0, students: 0, children: 0 };
  ['Adults','Seniors','Students','Children'].forEach(function(k) {
    var el = document.getElementById('ct' + k);
    if (el) el.textContent = '0';
  });
  updateReserveTotal();

  // Set min date to today
  var today = new Date().toISOString().slice(0, 10);
  var dateInput = document.getElementById('reserveDate');
  if (dateInput) { dateInput.min = today; dateInput.value = today; }

  // Clear payment fields
  ['cardNumber','cardName','cardExpiry','cardCvv'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.value = '';
  });
  var errEl = document.getElementById('paymentError');
  if (errEl) errEl.textContent = '';
  var payBtn = document.getElementById('payBtnText');
  if (payBtn) payBtn.textContent = 'Complete Purchase →';

  goToStep(1);

  document.getElementById('reserveModal').classList.add('open');
  document.getElementById('reserveModalOverlay').classList.add('open');
}

function closeReserveModal() {
  document.getElementById('reserveModal').classList.remove('open');
  document.getElementById('reserveModalOverlay').classList.remove('open');
  setTimeout(function() { goToStep(1); }, 350);
}

function goToStep(n) {
  var steps = [1, 2, 3];
  steps.forEach(function(i) {
    var el = document.getElementById('reserveStep' + i);
    if (el) el.style.display = (i === n) ? 'block' : 'none';
  });
}

function proceedFromStep1() {
  var date = document.getElementById('reserveDate') ? document.getElementById('reserveDate').value : '';
  if (!date) { alert('Please select a visit date.'); return; }
  var totalTickets = Object.keys(_ticketCounts).reduce(function(s, k) { return s + _ticketCounts[k]; }, 0);
  if (totalTickets === 0) { alert('Please add at least one ticket.'); return; }

  if (_resContext.isTicketed) {
    var total = calcTotal();
    document.getElementById('paySummaryTitle').textContent = _resContext.title;
    document.getElementById('paySummaryTotal').textContent = '$' + total + '.00';
    var parts = [];
    if (_ticketCounts.adults)   parts.push(_ticketCounts.adults   + ' × Adult ($20)');
    if (_ticketCounts.seniors)  parts.push(_ticketCounts.seniors  + ' × Senior ($16)');
    if (_ticketCounts.students) parts.push(_ticketCounts.students + ' × Student ($12)');
    if (_ticketCounts.children) parts.push(_ticketCounts.children + ' × Child (Free)');
    document.getElementById('paySummaryBreakdown').textContent = parts.join(' · ');
    document.getElementById('paySummaryDate').textContent = 'Visit: ' + fmtDate(date);
    goToStep(2);
  } else {
    saveReservation(date);
    showConfirmation(date, false);
    goToStep(3);
  }
}

function processPayment() {
  var cardNum  = (document.getElementById('cardNumber').value  || '').replace(/\s/g, '');
  var cardName = (document.getElementById('cardName').value    || '').trim();
  var expiry   = (document.getElementById('cardExpiry').value  || '').replace(/\s/g, '');
  var cvv      = (document.getElementById('cardCvv').value     || '').trim();
  var errEl    = document.getElementById('paymentError');
  errEl.textContent = '';

  if (cardNum.length < 16)               { errEl.textContent = 'Please enter a valid 16-digit card number.'; return; }
  if (!cardName)                          { errEl.textContent = 'Please enter the name on your card.'; return; }
  if (!/^\d{2}\/\d{2}$/.test(expiry))    { errEl.textContent = 'Please enter a valid expiry date (MM/YY).'; return; }
  if (cvv.length < 3)                    { errEl.textContent = 'Please enter a valid CVV.'; return; }

  var payBtn = document.getElementById('payBtnText');
  if (payBtn) payBtn.textContent = 'Processing…';

  var date = document.getElementById('reserveDate').value;
  setTimeout(function() {
    if (payBtn) payBtn.textContent = 'Complete Purchase →';
    saveReservation(date);
    showConfirmation(date, true);
    goToStep(3);
  }, 1800);
}

function saveReservation(date) {
  _resContext.lastRef  = 'VMFA-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  _resContext.savedDate = date;
  var reservations = getReservations();
  reservations.push({
    id: Date.now(),
    ref: _resContext.lastRef,
    title: _resContext.title,
    dates: _resContext.dates,
    visitDate: date,
    tickets: JSON.parse(JSON.stringify(_ticketCounts)),
    cost: calcTotal(),
    isTicketed: _resContext.isTicketed
  });
  localStorage.setItem('vmfa_reservations', JSON.stringify(reservations));

  var memberArea = document.getElementById('panelMemberArea');
  if (memberArea) {
    memberArea.innerHTML = '<div class="panel-reserve-success">&#10003; ' + (_resContext.isTicketed ? 'Purchase' : 'Reservation') + ' confirmed for ' + fmtDate(date) + '</div>';
  }
}

function showConfirmation(date, isPurchase) {
  var total = calcTotal();
  var parts = [];
  if (_ticketCounts.adults)   parts.push(_ticketCounts.adults   + ' Adult ticket'   + (_ticketCounts.adults   > 1 ? 's' : ''));
  if (_ticketCounts.seniors)  parts.push(_ticketCounts.seniors  + ' Senior ticket'  + (_ticketCounts.seniors  > 1 ? 's' : ''));
  if (_ticketCounts.students) parts.push(_ticketCounts.students + ' Student ticket' + (_ticketCounts.students > 1 ? 's' : ''));
  if (_ticketCounts.children) parts.push(_ticketCounts.children + ' Child ticket'   + (_ticketCounts.children > 1 ? 's' : ''));

  document.getElementById('confirmMsg').textContent = isPurchase
    ? 'Your tickets have been purchased and confirmed. See you soon!'
    : 'Your reservation is confirmed. We look forward to seeing you!';

  document.getElementById('confirmDetails').innerHTML =
    '<p><strong>' + escHtml(_resContext.title) + '</strong></p>' +
    '<p>' + fmtDate(date) + '</p>' +
    '<p>' + parts.join(', ') + '</p>' +
    (total > 0 ? '<p>Total paid: $' + total + '.00</p>' : '<p>Free admission</p>');

  document.getElementById('confirmRef').textContent = _resContext.lastRef;
}

function calcTotal() {
  return Object.keys(_ticketCounts).reduce(function(s, k) { return s + (_ticketCounts[k] || 0) * (_ticketPrices[k] || 0); }, 0);
}

function fmtDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatCardNumber(input) {
  var v = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(input) {
  var v = input.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
  input.value = v;
}

function changeTicket(type, delta) {
  _ticketCounts[type] = Math.max(0, (_ticketCounts[type] || 0) + delta);
  var keyMap = { adults: 'ctAdults', seniors: 'ctSeniors', students: 'ctStudents', children: 'ctChildren' };
  var el = document.getElementById(keyMap[type]);
  if (el) el.textContent = _ticketCounts[type];
  updateReserveTotal();
}

function updateReserveTotal() {
  var total = calcTotal();
  var display = document.getElementById('reserveTotalDisplay');
  if (display) display.textContent = total > 0 ? '$' + total + '.00' : 'Free';
}

function getReservations() {
  try { return JSON.parse(localStorage.getItem('vmfa_reservations')) || []; } catch(e) { return []; }
}

// ============================================================
// My Reservations Panel
// ============================================================

function openMyReservations() {
  closeUserDropdown();
  var reservations = getReservations();
  var content = document.getElementById('myReservationsContent');
  if (!content) return;

  if (reservations.length === 0) {
    content.innerHTML =
      '<div class="my-panel-empty">' +
        '<p>No reservations yet.</p>' +
        '<p>Browse exhibitions and events, open a detail panel, and click <strong>Reserve Tickets</strong> to book your visit.</p>' +
      '</div>';
  } else {
    content.innerHTML = reservations.map(function(r) {
      var ticketParts = [];
      if (r.tickets.adults)   ticketParts.push(r.tickets.adults   + ' adult'   + (r.tickets.adults   > 1 ? 's' : ''));
      if (r.tickets.seniors)  ticketParts.push(r.tickets.seniors  + ' senior'  + (r.tickets.seniors  > 1 ? 's' : ''));
      if (r.tickets.students) ticketParts.push(r.tickets.students + ' student' + (r.tickets.students > 1 ? 's' : ''));
      if (r.tickets.children) ticketParts.push(r.tickets.children + ' child'   + (r.tickets.children > 1 ? 'ren' : ''));
      var dateStr = new Date(r.visitDate + 'T12:00:00').toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      return '<div class="res-item">' +
        '<div class="res-item-body">' +
          '<h3>' + escHtml(r.title) + '</h3>' +
          '<p class="res-date">' + dateStr + '</p>' +
          '<p class="res-tickets">' + ticketParts.join(', ') + '</p>' +
          '<p class="res-cost">' + (r.cost > 0 ? 'Total: $' + r.cost + '.00' : 'Free Admission') + '</p>' +
        '</div>' +
        '<button class="res-cancel-btn" onclick="cancelReservation(' + r.id + ')">Cancel</button>' +
      '</div>';
    }).join('');
  }

  document.getElementById('myReservationsPanel').classList.add('open');
  document.getElementById('myPanelOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cancelReservation(id) {
  var updated = getReservations().filter(function(r) { return r.id !== id; });
  localStorage.setItem('vmfa_reservations', JSON.stringify(updated));
  openMyReservations();
}

function closeMyPanels() {
  ['myReservationsPanel', 'myCollectionPanel'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('open');
  });
  var overlay = document.getElementById('myPanelOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ============================================================
// Favorites / My Collection
// ============================================================

function getFavorites() {
  try { return JSON.parse(localStorage.getItem('vmfa_favorites')) || []; } catch(e) { return []; }
}

function toggleFavorite(card, btn) {
  var title = card.dataset.title || '';
  var isExhibition = card.classList.contains('exhibit-row') || card.classList.contains('cal-card');
  var favorites = getFavorites();
  var idx = favorites.findIndex(function(f) { return f.title === title; });

  if (idx >= 0) {
    favorites.splice(idx, 1);
    btn.classList.remove('saved');
    btn.setAttribute('aria-label', 'Save to My Collection');
  } else {
    favorites.push({
      type:       isExhibition ? 'exhibition' : 'artwork',
      title:      title,
      img:        card.dataset.img        || '',
      artist:     isExhibition ? (card.dataset.category || '') : (card.dataset.dates || '').split('·')[0].trim(),
      meta:       card.dataset.dates      || '',
      desc:       card.dataset.desc       || '',
      category:   card.dataset.category   || '',
      ticket:     card.dataset.ticket     || '',
      badge:      card.dataset.badge      || '',
      badgeLabel: card.dataset.badgeLabel || ''
    });
    btn.classList.add('saved');
    btn.setAttribute('aria-label', 'Remove from My Collection');
  }

  localStorage.setItem('vmfa_favorites', JSON.stringify(favorites));
}

function restoreFavorites() {
  var favorites = getFavorites();
  if (!favorites.length) return;
  document.querySelectorAll('.col-work, .artist-card, .exhibit-row, .cal-card').forEach(function(card) {
    var isSaved = favorites.some(function(f) { return f.title === card.dataset.title; });
    if (isSaved) {
      var btn = card.querySelector('.fav-btn');
      if (btn) { btn.classList.add('saved'); btn.setAttribute('aria-label', 'Remove from My Collection'); }
    }
  });
}

function openMyCollection() {
  closeUserDropdown();
  var favorites = getFavorites();
  var content = document.getElementById('myCollectionContent');
  if (!content) return;

  if (favorites.length === 0) {
    content.innerHTML =
      '<div class="my-panel-empty">' +
        '<p>No saved items yet.</p>' +
        '<p>Tap the &#9829; button on any <strong>exhibition</strong>, <strong>artwork</strong>, or <strong>artist</strong> to save it here.</p>' +
      '</div>';
  } else {
    content.innerHTML = '<div class="my-coll-grid">' +
      favorites.map(function(f) {
        var safeTitle      = escHtml(f.title);
        var safeMeta       = escHtml(f.meta);
        var safeDesc       = escHtml(f.desc);
        var safeCat        = escHtml(f.category);
        var safeTicket     = escHtml(f.ticket);
        var safeBadge      = escHtml(f.badge      || '');
        var safeBadgeLabel = escHtml(f.badgeLabel || '');
        var isExhibition   = f.type === 'exhibition';
        return '<div class="my-coll-item"' +
          ' data-img="'         + f.img         + '"' +
          ' data-category="'    + safeCat        + '"' +
          ' data-title="'       + safeTitle      + '"' +
          ' data-dates="'       + safeMeta       + '"' +
          ' data-desc="'        + safeDesc       + '"' +
          ' data-ticket="'      + safeTicket     + '"' +
          ' data-badge="'       + safeBadge      + '"' +
          ' data-badge-label="' + safeBadgeLabel + '"' +
          ' onclick="openSavedItem(this)">' +
          '<div class="my-coll-img" style="background-image:url(\'' + f.img + '\')">' +
            (isExhibition && safeBadge ? '<span class="exhibit-badge ' + safeBadge + ' my-coll-badge">' + safeBadgeLabel + '</span>' : '') +
          '</div>' +
          '<div class="my-coll-info">' +
            (isExhibition ? '<p class="my-coll-type-tag">Exhibition</p>' : '') +
            '<p class="my-coll-artist">' + escHtml(f.artist) + '</p>' +
            '<p class="my-coll-title">'  + safeTitle + '</p>' +
          '</div>' +
          '<button class="my-coll-remove" onclick="event.stopPropagation();removeFavorite(\'' + f.title.replace(/'/g,"\\'") + '\')" aria-label="Remove">&#10005;</button>' +
        '</div>';
      }).join('') + '</div>';
  }

  document.getElementById('myCollectionPanel').classList.add('open');
  document.getElementById('myPanelOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openSavedItem(el) {
  closeMyPanels();
  setTimeout(function() { openDetailPanel(el); }, 120);
}

function removeFavorite(title) {
  var updated = getFavorites().filter(function(f) { return f.title !== title; });
  localStorage.setItem('vmfa_favorites', JSON.stringify(updated));
  document.querySelectorAll('.col-work, .artist-card, .exhibit-row, .cal-card').forEach(function(card) {
    if (card.dataset.title === title) {
      var btn = card.querySelector('.fav-btn');
      if (btn) { btn.classList.remove('saved'); btn.setAttribute('aria-label', 'Save to My Collection'); }
    }
  });
  openMyCollection();
}