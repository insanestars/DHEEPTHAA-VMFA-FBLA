(function () {
  'use strict';

  // ── Hours map (matches site logic) ──────────────────────────
  var HOURS = { 0:'10 am – 5 pm', 1:'10 am – 5 pm', 2:'10 am – 9 pm', 3:'10 am – 9 pm', 4:'10 am – 9 pm', 5:'10 am – 9 pm', 6:'10 am – 5 pm' };
  var DAYS  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  // ── Intent library ───────────────────────────────────────────
  var INTENTS = [
    {
      keys: ['hello','hi ','hey ','good morning','good afternoon','good evening','howdy','greetings','what can you','help me','what do you'],
      reply: function () {
        return pick([
          'Hello! I\'m the VMFA AI assistant. I can help with exhibitions, hours, tickets, events, directions, and more. What would you like to know?',
          'Hi there! Welcome to VMFA. Ask me about our current exhibitions, upcoming events, admission, or how to get here.',
          'Hello and welcome! I know all about VMFA\'s exhibitions, events, hours, and collection. How can I help?'
        ]);
      }
    },
    {
      keys: ['hour','open','close','closing','when','time','tonight','today','schedule','what day','weekday','weekend'],
      reply: function () {
        var d = new Date().getDay();
        return 'VMFA is open today (' + DAYS[d] + ') from ' + HOURS[d] + '.\n\nFull weekly schedule:\n• Monday & Sunday — 10 am – 5 pm\n• Tuesday through Friday — 10 am – 9 pm\n• Saturday — 10 am – 5 pm\n\nWe\'re open 365 days a year — no days off!';
      }
    },
    {
      keys: ['ticket','admission','cost','price','free','pay','charge','entry','fee','how much','entrance','afford'],
      reply: function () {
        return 'General admission to VMFA is always free — no tickets needed for the permanent collection!\n\nSpecial exhibitions like India\'s Great Mughals and the upcoming Fabergé show are ticketed. VMFA members get free admission to every ticketed exhibition.\n\nAsk me about a specific show for details.';
      }
    },
    {
      keys: ['location','address','where is','direction','get there','how do i get','find you','map','drive','parking','park','navigate','near'],
      reply: function () {
        return 'VMFA is located at:\n200 N Arthur Ashe Blvd\nRichmond, VA 23220\n\nParking is available on-site. Members park free.\nPhone: (804) 340-1400';
      }
    },
    {
      keys: ['monet','impressionist','degas','renoir','cassatt','french masterwork','mellon','water lil','impressionism','claude monet'],
      reply: function () {
        return 'Monet & the Impressionists: French Masterworks is on permanent view in the Mellon Galleries — free with general admission.\n\nVMFA holds one of the finest Impressionist collections in the American South, including landmark works by Claude Monet, Edgar Degas, Pierre-Auguste Renoir, and Mary Cassatt.';
      }
    },
    {
      keys: ['mughal','india','jewel','south asia','victoria and albert','opulence','emperor','dynasty','jade','manuscript','mughal court'],
      reply: function () {
        return 'India\'s Great Mughals: Art, Power, and Opulence is on view through August 23, 2026 in the Altria Group Gallery.\n\nThis landmark show features rarely seen manuscripts, jewels, textiles, and paintings from the Mughal dynasty, organized by the Victoria and Albert Museum.\n\nTickets required · VMFA members get in free.';
      }
    },
    {
      keys: ['faberg','russian art','imperial egg','romanov','easter egg','tsar','czar','enamel','revolution','faberge'],
      reply: function () {
        return 'Fabergé: Romance to Revolution opens Fall 2026!\n\nDrawing on VMFA\'s unparalleled Fabergé holdings — the largest collection outside Russia — this exhibition traces the extraordinary craftsmanship from Imperial Russia to the revolution that ended it all.\n\nTicketed exhibition · Members get in free.';
      }
    },
    {
      keys: ['jazz','richmond renaissance','music and visual','richmond jazz'],
      reply: function () {
        return 'Jazz & Visual Art: The Richmond Renaissance opens Summer 2026!\n\nThis exhibition celebrates the deep connections between jazz and the visual arts in Richmond — tracing the city\'s vibrant scene from the 1920s through today.\n\nFree with general admission.';
      }
    },
    {
      keys: ['giant','swizz','alicia key','basquiat','dean collection','kerry james','amy sherald','kehinde wiley','black art'],
      reply: function () {
        return 'Giants: Art from the Dean Collection of Swizz Beatz and Alicia Keys closed March 1, 2026.\n\nThis landmark exhibition celebrated Black artistic excellence with over 130 works by Jean-Michel Basquiat, Kerry James Marshall, Amy Sherald, and Kehinde Wiley — drawn from the personal collection of Swizz Beatz and Alicia Keys.';
      }
    },
    {
      keys: ['event','program','workshop','family art','lecture','tour','activity','upcoming','calendar','class','3 in 30','gallery talk'],
      reply: function () {
        return 'Upcoming events at VMFA:\n\n🎨 Family Art Making: Colors of the Mughal Empire\nSaturday, June 28 · 10 am · Art Education Center\nFree for all ages\n\n🎙 3 in 30: Highlights from India\'s Great Mughals\nTuesday, July 8 · 11 am · Altria Group Gallery\nFree with exhibition admission — no registration needed';
      }
    },
    {
      keys: ['member','membership','join vmfa','benefit','discount','perk','privilege','sign up'],
      reply: function () {
        return 'VMFA membership benefits:\n\n✦ Free admission to all ticketed exhibitions\n✦ Exclusive member events & opening previews\n✦ Travel opportunities\n✦ Dining & shopping discounts at the museum\n✦ Free on-site parking\n\nVisit vmfa.museum/membership to join!';
      }
    },
    {
      keys: ['collection','permanent collection','artwork','painting','sculpture','photograph','ceramic','ancient','african american art','modern art','contemporary','all art'],
      reply: function () {
        return 'VMFA\'s permanent collection spans 5,000 years of world art:\n\n• Impressionist & European art (Mellon Galleries)\n• African American art — Lawrence, Walker, Shabazz\n• Ancient Greek, Roman & Egyptian art\n• Fabergé — largest collection outside Russia\n• Modern & Contemporary — Mehretu, Gilliam, Bourgeois\n\nAll permanent galleries are free with general admission.';
      }
    },
    {
      keys: ['contact','phone','call','email','number','reach','speak to','get in touch'],
      reply: function () {
        return 'You can reach VMFA at:\n📞 (804) 340-1400\n📍 200 N Arthur Ashe Blvd, Richmond, VA 23220\n\nIs there anything else I can help with?';
      }
    },
    {
      keys: ['exhibit','exhibition','show','on view','gallery','what\'s on','what is on','current show','now showing'],
      reply: function () {
        return 'Currently on view at VMFA:\n\n🖼 Monet & the Impressionists: French Masterworks\nOngoing · Mellon Galleries · Free with admission\n\n🏛 India\'s Great Mughals: Art, Power, and Opulence\nThrough August 23, 2026 · Ticketed (Members free)\n\nComing soon: Jazz & Visual Art (Summer 2026) and Fabergé: Romance to Revolution (Fall 2026).\n\nWant details on any of these?';
      }
    },
    {
      keys: ['thank','thanks','appreciate','helpful','great job','awesome','perfect','wonderful','love it','nice'],
      reply: function () {
        return pick([
          'You\'re welcome! Enjoy your visit to VMFA. 🎨',
          'Happy to help! Feel free to ask if anything else comes up.',
          'Of course! Have a wonderful time at the museum.'
        ]);
      }
    },
    {
      keys: ['bye','goodbye','see you','see ya','later','ciao','take care'],
      reply: function () {
        return pick([
          'Goodbye! We hope to see you at VMFA soon. 🎨',
          'Take care! Come visit us at 200 N Arthur Ashe Blvd, Richmond.',
          'See you soon! VMFA is open 365 days a year.'
        ]);
      }
    }
  ];

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function norm(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function getReply(input) {
    var t = norm(input);
    var best = null, bestScore = 0;
    INTENTS.forEach(function (intent) {
      var score = 0;
      intent.keys.forEach(function (k) { if (t.indexOf(norm(k)) !== -1) score += k.length; });
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    if (best && bestScore > 0) return best.reply();
    return pick([
      'I\'m not sure about that, but I can help with VMFA exhibitions, hours, tickets, directions, and more!',
      'That\'s a bit outside my knowledge. Try asking about our current exhibitions, events, or admission.',
      'I didn\'t quite catch that. Ask me about hours, exhibitions, events, or how to get here!'
    ]);
  }

  // ── Build widget DOM ─────────────────────────────────────────
  var wrap = document.createElement('div');
  wrap.id = 'vmfa-ai-wrap';
  wrap.innerHTML =
    '<button id="vmfa-ai-btn" aria-label="Open VMFA AI Assistant">' +
      '<svg class="vmfa-ai-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>' +
      '<svg class="vmfa-ai-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    '</button>' +
    '<div id="vmfa-ai-win" role="dialog" aria-label="VMFA AI Assistant">' +
      '<div class="vmfa-ai-hd">' +
        '<div class="vmfa-ai-av"><span>AI</span></div>' +
        '<div class="vmfa-ai-hd-text">' +
          '<strong>VMFA Assistant</strong>' +
          '<span class="vmfa-ai-status"><i class="vmfa-ai-dot"></i>Online</span>' +
        '</div>' +
      '</div>' +
      '<div id="vmfa-ai-msgs">' +
        '<div class="vmfa-ai-msg vmfa-ai-msg--bot">' +
          '<p>Hello! I\'m the VMFA AI assistant. Ask me about exhibitions, hours, tickets, events, or directions to the museum.</p>' +
        '</div>' +
      '</div>' +
      '<div class="vmfa-ai-suggestions">' +
        '<button class="vmfa-ai-chip" data-q="What\'s currently on view?">What\'s on view?</button>' +
        '<button class="vmfa-ai-chip" data-q="What are your hours today?">Today\'s hours</button>' +
        '<button class="vmfa-ai-chip" data-q="Is admission free?">Admission</button>' +
        '<button class="vmfa-ai-chip" data-q="Upcoming events">Events</button>' +
      '</div>' +
      '<div class="vmfa-ai-foot">' +
        '<input id="vmfa-ai-in" type="text" placeholder="Ask me anything about VMFA…" autocomplete="off" maxlength="200" />' +
        '<button id="vmfa-ai-send" aria-label="Send">' +
          '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>' +
        '</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(wrap);

  var btn   = document.getElementById('vmfa-ai-btn');
  var win   = document.getElementById('vmfa-ai-win');
  var msgs  = document.getElementById('vmfa-ai-msgs');
  var input = document.getElementById('vmfa-ai-in');
  var sendB = document.getElementById('vmfa-ai-send');
  var chips = wrap.querySelectorAll('.vmfa-ai-chip');
  var isOpen = false;

  btn.addEventListener('click', function () {
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    btn.classList.toggle('open', isOpen);
    if (isOpen) setTimeout(function () { input.focus(); }, 200);
  });

  function addMsg(text, isBot) {
    var d = document.createElement('div');
    d.className = 'vmfa-ai-msg ' + (isBot ? 'vmfa-ai-msg--bot' : 'vmfa-ai-msg--user');
    d.innerHTML = '<p>' + (isBot ? text.replace(/\n/g, '<br>') : esc(text)) + '</p>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var d = document.createElement('div');
    d.className = 'vmfa-ai-typing';
    d.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function doSend(text) {
    var t = (text || input.value).trim();
    if (!t) return;
    input.value = '';
    addMsg(t, false);
    var typing = showTyping();
    var delay = 480 + Math.floor(Math.random() * 640);
    setTimeout(function () {
      if (typing.parentNode) msgs.removeChild(typing);
      addMsg(getReply(t), true);
    }, delay);
  }

  sendB.addEventListener('click', function () { doSend(); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSend(); });

  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      doSend(chip.getAttribute('data-q'));
    });
  });

}());
