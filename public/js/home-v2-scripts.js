(function() {
  // ── Rotating top-bar messages — specific and credible ──
  const messages = [
    "Marie R. detected 3 job changes at key accounts — €40k opp opened",
    "Clément L. connected HubSpot — live in 4 min · 8,500 records queued",
    "Nadia B. verified 3,800 emails before a campaign — bounce rate → 0.4%",
    "Marc L. enriched 1,240 contacts · 89% match rate · 0 manual work",
    "Job change alert at Lectra: former champion re-engaged, demo booked",
    "Alexis K. uploaded 5,000 CSV rows — 4,201 enriched in 6 minutes",
    "Julie D. detected a VP promotion at a target account — warm intro sent",
    "Sarah P. closed a deal from a job change alert — pipeline: €65k",
  ];
  let idx = 0;
  const el = document.getElementById('js-live-text');
  if (el) {
    setInterval(() => {
      idx = (idx + 1) % messages.length;
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = messages[idx];
        el.style.transition = 'opacity .4s';
        el.style.opacity = '1';
      }, 300);
    }, 4000);
  }

  // ── Rotating live feed items ──
  const feedItems = [
    { initials: 'ML', color: 'blue',   name: 'Marc L.',    action: 'enriched 1,240 HubSpot contacts',           meta: '2 min ago · Match rate 89%' },
    { initials: 'MR', color: 'violet', name: 'Marie R.',   action: 'detected 3 job changes at key accounts',    meta: '4 min ago · €40k opp opened' },
    { initials: 'AK', color: 'green',  name: 'Alexis K.',  action: 'uploaded a 5,000-row CSV',                  meta: '11 min ago · 4,201 enriched' },
    { initials: 'SP', color: 'amber',  name: 'Sarah P.',   action: 'synced 620 enriched accounts to CRM',       meta: '17 min ago' },
    { initials: 'JD', color: 'rose',   name: 'Julie D.',   action: 'detected a VP promotion at a target acct',  meta: '23 min ago · Alert → demo booked' },
    { initials: 'CL', color: 'indigo', name: 'Clément L.', action: 'connected HubSpot — live in 4 minutes',     meta: '31 min ago · 8,500 records queued' },
    { initials: 'NB', color: 'teal',   name: 'Nadia B.',   action: 'verified 3,800 emails before a campaign',   meta: '38 min ago · Bounce rate → 0.4%' },
  ];
  const colorMap = {
    blue:   { bg: 'bg-blue-50/60',   border: 'border-blue-100',   avatar: 'bg-blue-100 text-blue-600' },
    violet: { bg: 'bg-violet-50/60', border: 'border-violet-100', avatar: 'bg-violet-100 text-violet-600' },
    green:  { bg: 'bg-green-50/60',  border: 'border-green-100',  avatar: 'bg-green-100 text-green-600' },
    amber:  { bg: 'bg-amber-50/60',  border: 'border-amber-100',  avatar: 'bg-amber-100 text-amber-600' },
    rose:   { bg: 'bg-rose-50/60',   border: 'border-rose-100',   avatar: 'bg-rose-100 text-rose-600' },
    indigo: { bg: 'bg-indigo-50/60', border: 'border-indigo-100', avatar: 'bg-indigo-100 text-indigo-600' },
    teal:   { bg: 'bg-teal-50/60',   border: 'border-teal-100',   avatar: 'bg-teal-100 text-teal-600' },
  };
  const feedEl = document.getElementById('js-activity-feed');
  if (feedEl) {
    let feedIdx = 0;
    const rows = Array.from(feedEl.children);
    setInterval(() => {
      feedIdx = (feedIdx + 1) % feedItems.length;
      const item = feedItems[feedIdx];
      const c = colorMap[item.color];
      // Update oldest row (first child) with new data, then move it to the end
      const row = rows[0];
      rows.push(rows.shift()); // rotate internal pointer
      row.className = `flex items-start gap-3 p-3 rounded-xl ${c.bg} border ${c.border}`;
      row.style.opacity = '0';
      row.querySelector('.font-bold.text-xs').className = `w-8 h-8 rounded-full ${c.avatar} flex items-center justify-center shrink-0 font-bold text-xs`;
      row.querySelector('.font-bold.text-xs').textContent = item.initials;
      row.querySelector('.font-bold.text-gray-800').textContent = item.name;
      row.querySelector('.text-gray-500').textContent = ' ' + item.action;
      row.querySelector('.text-xs.text-gray-400').textContent = item.meta;
      feedEl.appendChild(row);
      setTimeout(() => { row.style.transition = 'opacity .4s'; row.style.opacity = '1'; }, 100);
    }, 6000);
  }

  // ── Slowly incrementing counter ──
  const counterEl = document.getElementById('js-counter');
  if (counterEl) {
    let count = 12847 + Math.floor(Math.random() * 200);
    const fmt = (n) => n.toLocaleString('en-US');
    counterEl.textContent = fmt(count);
    setInterval(() => {
      count += Math.floor(Math.random() * 3) + 1;
      counterEl.textContent = fmt(count);
    }, 3500);
  }

  // ── Final section: randomize team count for freshness ──
  const finalEl = document.getElementById('js-final-count');
  if (finalEl) {
    finalEl.textContent = (10 + Math.floor(Math.random() * 8)) + ' teams';
  }

  // ── Demo widget ──
  (function() {
    const input   = document.getElementById('demo-domain-input');
    const btn     = document.getElementById('demo-enrich-btn');
    const results = document.getElementById('demo-results');
    const loading = document.getElementById('demo-loading');
    const loadTxt = document.getElementById('demo-loading-text');
    const output  = document.getElementById('demo-output');
    if (!input || !btn) return;

    const loadMsgs = [
      'Querying 12 sources…',
      'Scanning firmographic data…',
      'Fetching funding signals…',
      'Detecting tech stack…',
      'Pulling traffic metrics…',
      'Cross-referencing & verifying…',
      'Building enrichment report…',
    ];

    function cleanDomain(raw) {
      return raw.trim().replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0].toLowerCase().trim();
    }
    function escHtml(s) {
      return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    function fmtNum(n) {
      if (n == null || n === '') return null;
      n = Number(n);
      if (isNaN(n)) return null;
      if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
      if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
      if (n >= 1_000) return Math.round(n / 1_000) + 'k';
      return String(n);
    }
    function first(...vals) {
      for (const v of vals) if (v != null && v !== '' && v !== false) return v;
      return null;
    }
    function field(icon, label, value, color) {
      if (!value) return '';
      return `<div class="demo-field rounded-xl bg-gray-800/50 border border-gray-700/40 px-4 py-2.5 flex items-start gap-3" style="opacity:0">
        <i class="${icon} text-xs w-4 shrink-0 mt-0.5 ${color}"></i>
        <div class="min-w-0 flex-1">
          <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide leading-none mb-0.5">${label}</p>
          <p class="text-sm font-bold text-gray-200 leading-snug">${value}</p>
        </div>
      </div>`;
    }

    async function run() {
      const domain = cleanDomain(input.value);
      if (!domain || domain.length < 3) { input.focus(); return; }

      results.classList.remove('hidden');
      loading.classList.remove('hidden');
      output.classList.add('hidden');
      output.innerHTML = '';
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin text-xs"></i> Enriching…';

      let mi = 0;
      const interval = setInterval(() => {
        mi = (mi + 1) % loadMsgs.length;
        loadTxt.textContent = loadMsgs[mi];
      }, 900);

      try {
        const isLocal = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
        const tokenBase  = isLocal ? 'http://localhost:8791' : '';
        const companyUrl = isLocal ? 'http://localhost:8791/api/demo-company' : '/api/demo-company';

        const { token } = await fetch(tokenBase + '/api/demo-token').then(r => r.json());
        const res  = await fetch(`${companyUrl}?domain=${encodeURIComponent(domain)}&t=${encodeURIComponent(token)}`);
        const data = await res.json();
        clearInterval(interval);
        if (!res.ok) throw new Error(data.error || 'service_error');
        if (!data.company) throw new Error('company_not_found');

        const co = data.company || {};
        const f  = co.firmographic || {};
        const fu = co.funding      || {};
        const tr = co.traffic      || {};

        const name     = f.name;
        const industry = f.industry;
        const hc       = f.headcount;
        const hcRange  = f.headcountRange;
        const founded  = f.foundedYear;
        const hq       = f.hq;
        const desc     = f.description;
        const slogan   = f.slogan;
        const type     = f.type;

        const funding  = fu.totalUsd
          ? `$${fmtNum(fu.totalUsd)} raised · ${fu.numRounds || '?'} rounds${fu.lastRoundType ? ' · ' + fu.lastRoundType.replace('_',' ') : ''}${fu.ipoStatus === 'public' && fu.stockSymbol ? ' · ' + fu.stockSymbol.toUpperCase() : ''}`
          : null;
        const investors = fu.investors?.join(', ') || null;
        const traffic   = tr.monthlyVisits ? `${fmtNum(tr.monthlyVisits)} visits/month · rank #${fmtNum(tr.globalRank)}` : null;
        const bounce    = tr.bounceRate != null ? `${tr.bounceRate}% bounce · ${tr.pagesPerVisit} pages/visit` : null;

        const specialties = (f.specialties || []).slice(0, 6);

        const fieldsHtml = [
          field('fas fa-building',      'Company',        name,    'text-blue-400'),
          field('fas fa-tag',           'Type',           type,    'text-violet-400'),
          field('fas fa-industry',      'Industry',       industry,'text-violet-400'),
          field('fas fa-users',         'Employees',      hc ? fmtNum(hc) + (hcRange ? ` (${hcRange})` : '') : hcRange, 'text-green-400'),
          field('fas fa-map-marker-alt','HQ',             hq,      'text-gray-400'),
          field('fas fa-calendar-alt',  'Founded',        founded ? `${founded}` : null, 'text-gray-400'),
          field('fas fa-quote-left',    'Slogan',         slogan,  'text-gray-400'),
          field('fas fa-dollar-sign',   'Funding',        funding, 'text-amber-400'),
          field('fas fa-handshake',     'Investors',      investors,'text-amber-300'),
          field('fas fa-chart-bar',     'Web traffic',    traffic, 'text-blue-300'),
          field('fas fa-mouse-pointer', 'Engagement',     bounce,  'text-blue-200'),
          field('fas fa-align-left',    'About',          desc ? desc.slice(0, 140) + '…' : null, 'text-gray-500'),
        ].filter(Boolean).join('');

        const techHtml = specialties.length
          ? `<div class="rounded-xl bg-gray-800/50 border border-gray-700/40 px-4 py-3 mb-5">
               <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Specialties</p>
               <div class="flex flex-wrap gap-1.5">${specialties.map(s => `<span class="text-xs font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20 rounded-full px-2.5 py-0.5">${escHtml(s)}</span>`).join('')}</div>
             </div>`
          : '';

        const topKwHtml = tr.topKeywords?.length
          ? `<div class="rounded-xl bg-gray-800/50 border border-gray-700/40 px-4 py-3 mb-5">
               <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Top SEO keywords</p>
               <div class="flex flex-col gap-1">${tr.topKeywords.slice(0,5).map(k =>
                 `<div class="flex justify-between text-xs"><span class="text-gray-300 font-semibold">${escHtml(k.word)}</span><span class="text-gray-500">${fmtNum(k.volume)}/mo · $${k.cpc?.toFixed(2) ?? '–'} CPC</span></div>`
               ).join('')}</div>
             </div>`
          : '';

        const fieldCount = [name, industry, hc, hq, founded, funding, traffic, bounce, desc].filter(Boolean).length + specialties.length;

        output.innerHTML = `
          <div class="mb-5 flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-600 font-mono mb-0.5">domain: ${domain}</p>
              <p class="text-green-400 font-extrabold text-sm">✓ ${fieldCount} fields returned in &lt;6s</p>
            </div>
            <span class="text-xs font-bold text-green-400 bg-green-400/10 rounded-full px-3 py-1 border border-green-400/20">Live · not cached</span>
          </div>
          <div class="grid sm:grid-cols-2 gap-2 mb-5">${fieldsHtml}</div>
          ${techHtml}${topKwHtml}
          <div class="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-6 text-center">
            <p class="text-white font-extrabold text-base mb-1">This is just the company layer.</p>
            <p class="text-blue-200 text-sm mb-4 max-w-md mx-auto">Add contact enrichment — verified emails, job titles, seniority, job change alerts — for every person in your CRM. 500 contacts free.</p>
            <a href="https://app.enrich-crm.com/sign-up?utm_source=website&utm_medium=cta&utm_campaign=home_v2_demo_widget"
               class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm px-6 py-3 rounded-full transition-colors">
              <i class="fas fa-bolt text-xs"></i> Claim my 500 free credits
            </a>
            <p class="text-xs text-blue-400/50 mt-2">1 credit = 1 contact enriched · No card required</p>
          </div>`;

        loading.classList.add('hidden');
        output.classList.remove('hidden');

        // Stagger field animations
        output.querySelectorAll('.demo-field').forEach((el, i) => {
          setTimeout(() => {
            el.style.transition = 'opacity .35s, transform .35s';
            el.style.opacity    = '1';
            el.style.transform  = 'translateX(0)';
          }, i * 90);
          el.style.transform = 'translateX(8px)';
        });

      } catch (err) {
        clearInterval(interval);
        loading.classList.add('hidden');
        output.classList.remove('hidden');
        const errCode = err.message || '';
        const isNotFound = errCode === 'company_not_found';
        const icon  = isNotFound ? 'fa-rotate' : 'fa-wifi-slash';
        const title = isNotFound ? 'No data found for this domain' : 'Live demo temporarily unavailable';
        const body  = isNotFound
          ? 'We query live sources — coverage varies. Try a well-known domain like hubspot.com or shopify.com.'
          : 'Our enrichment service is momentarily unreachable. Try again in a few minutes.';
        const ctaHtml = `<button id="demo-err-retry" class="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-extrabold text-sm px-5 py-2.5 rounded-full transition-colors cursor-pointer">
               <i class="fas fa-arrow-left text-xs"></i> ${isNotFound ? 'Try another domain' : 'Try again'}
             </button>`;
        output.innerHTML = `
          <div class="rounded-2xl bg-gray-800/60 border border-gray-700/50 p-6 text-center">
            <div class="w-10 h-10 rounded-full bg-gray-700/60 flex items-center justify-center mx-auto mb-4">
              <i class="fas ${icon} text-gray-400"></i>
            </div>
            <p class="text-white font-extrabold mb-1">${title}</p>
            <p class="text-gray-400 text-sm mb-5 max-w-xs mx-auto">${body}</p>
            ${ctaHtml}
          </div>`;
        document.getElementById('demo-err-retry')?.addEventListener('click', () => {
          input.value = '';
          input.focus();
          output.classList.add('hidden');
          results.classList.add('hidden');
        });
      }

      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-bolt text-xs"></i> Enrich now →';
    }

    btn.addEventListener('click', run);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
  })();

  // ── CRM size calculator ──
  (function() {
    const inp = document.getElementById('crm-size-input');
    const out = document.getElementById('crm-calc-result');
    if (!inp || !out) return;
    inp.addEventListener('input', () => {
      const n = parseInt(inp.value, 10);
      if (!n || n < 10) { out.textContent = 'enter your number above'; return; }
      const changed = Math.round(n * 0.25);
      const ghosts  = Math.round(n * 0.12);
      out.innerHTML = `<span class="text-red-600">~${changed.toLocaleString('fr-FR')} have changed jobs</span> · <span class="text-amber-700">~${ghosts.toLocaleString('fr-FR')} unreachable today</span>`;
    });
  })();

  // ── Scarcity counter — slots available this month ──
  // Deterministic per day: starts at ~60 and decreases as month progresses
  const now = new Date();
  const dayOfMonth = now.getDate();   // 1–31
  const baseSlots = 62;
  const slotsLeft = Math.max(8, baseSlots - dayOfMonth - Math.floor(Math.random() * 4));
  ['js-slots-left', 'js-hero-slots'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = slotsLeft;
  });
  // Slowly tick down 1 slot every ~8 minutes to reinforce scarcity
  setInterval(() => {
    ['js-slots-left', 'js-hero-slots'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const cur = parseInt(el.textContent, 10);
        if (cur > 5) el.textContent = cur - 1;
      }
    });
  }, 480000);
})();
;
(function () {
  /* ── DOM refs ── */
  const btn     = document.getElementById('live-enrich-btn');
  const results = document.getElementById('live-results');
  const loading = document.getElementById('live-loading');
  const loadTxt = document.getElementById('live-loading-text');
  const output  = document.getElementById('live-output');
  if (!btn) return;

  /* ── Desc-toggle event delegation (output containers) ── */
  [output, document.getElementById('demo-output')].forEach(container => {
    if (!container) return;
    container.addEventListener('click', e => {
      const btn = e.target.closest('.desc-toggle');
      if (!btn) return;
      const body  = btn.nextElementSibling;
      const icon  = btn.querySelector('.desc-toggle-icon');
      const label = btn.querySelector('.desc-toggle-label');
      if (!body) return;
      const nowHidden = body.classList.toggle('hidden');
      btn.classList.toggle('open', !nowHidden);
      if (label) label.textContent = nowHidden ? 'Show description' : 'Hide description';
    });
  });

  /* ── Split layout helpers ── */
  function openSplitLayout() {
    document.getElementById('contact-layout')?.classList.add('results-open');
  }
  function closeSplitLayout() {
    document.getElementById('contact-layout')?.classList.remove('results-open');
  }

  const isLocal   = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const BASE      = isLocal ? 'http://localhost:8791' : '';
  const TOKEN_URL = BASE + '/api/demo-token';
  const STREAM_URL = BASE + '/api/demo-stream';
  let demoStartTime = 0;
  let demoRetryCount = 0;
  let activeEs = null; // track active EventSource to close before starting a new search

  /* ── Search logger (fire-and-forget → /api/log-search → Google Sheets) ── */
  function logSearch(payload) {
    try {
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      fetch('/api/log-search', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ts:     Date.now(),
          page:   location.pathname,
          device: isMobile ? 'mobile' : 'desktop',
          ...payload,
        }),
      }).catch(() => {}); // never throw
    } catch { /* ignore */ }
  }

  function detectSearchType(params) {
    if (params.email)                        return 'email';
    if (params.contactLinkedinSalesNavUrl)   return 'sales_nav';
    if (params.contactLinkedinUrl)           return 'linkedin';
    if (params.fullName && params.domain)    return 'name_domain';
    if (params.fullName)                     return 'name';
    if (params.domain)                       return 'domain';
    return 'other';
  }

  /* ── Quick-fill example buttons (unified form) ── */
  function clearContactFields() {
    ['live-email', 'live-linkedin-url', 'live-fullname', 'live-company-or-domain'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }

  /** Examples shown in the form and in the error state (same list). */
  const LIVE_DEMO_EXAMPLES = [
    { label: 'Brian Halligan', data: { email: 'bhalligan@hubspot.com' } },
    { label: 'Tobi Lütke', data: { email: 'tobi@shopify.com' } },
    { label: 'Peldi Guilizzoni', data: { email: 'peldi@balsamiq.com' } },
    { label: 'Kareem Amin', data: { fullname: 'Kareem Amin', company: 'clay.com' } },
    { label: 'Arthur Mensch', data: { fullname: 'Arthur Mensch', company: 'mistral.ai' } },
  ];

  function applyExampleAndRun(example) {
    demoRetryCount = 0;
    clearContactFields();
    const d = example.data;
    if (d.email) { const e = document.getElementById('live-email'); if (e) e.value = d.email; }
    if (d.linkedin) { const e = document.getElementById('live-linkedin-url'); if (e) e.value = d.linkedin; }
    if (d.fullname) { const e = document.getElementById('live-fullname'); if (e) e.value = d.fullname; }
    if (d.company) { const e = document.getElementById('live-company-or-domain'); if (e) e.value = d.company; }
    runDemo();
  }

  document.querySelectorAll('.live-example').forEach(el => {
    el.addEventListener('click', () => {
      const data = {};
      if (el.dataset.email) data.email = el.dataset.email;
      if (el.dataset.linkedin) data.linkedin = el.dataset.linkedin;
      if (el.dataset.fullname) data.fullname = el.dataset.fullname;
      if (el.dataset.company) data.company = el.dataset.company;
      applyExampleAndRun({ label: '', data });
    });
  });

  /* ── Loading messages ── */
  const loadMsgs = [
    'Querying LinkedIn profile…',
    'Fetching firmographic data…',
    'Pulling funding & investor data…',
    'Scanning website traffic…',
    'Detecting tech stack…',
    'Still working — live data takes a moment…',
    'Cross-referencing data sources…',
    'Assembling full profile…',
    'Live enrichment can take up to 90s — hang tight…',
    'Querying CRM history…',
    'Almost there…',
    'Finalising enrichment…',
  ];

  /* ── Helpers ── */
  function escHtml(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function fmtNum(n) {
    n = Number(n);
    if (isNaN(n)) return null;
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return Math.round(n / 1_000) + 'k';
    return String(n);
  }
  /* ── Collapsible job description ── */
  function collapsibleDesc(desc) {
    if (!desc || !desc.trim()) return '';
    const safe = escHtml(desc.trim()).replace(/\n/g, '<br>');
    return `<div class="mt-1.5">
      <button class="desc-toggle flex items-center gap-1 text-[10px] text-gray-400 hover:text-blue-600 font-semibold transition-colors cursor-pointer select-none">
        <i class="fas fa-chevron-right desc-toggle-icon text-[8px]"></i>
        <span class="desc-toggle-label">Show description</span>
      </button>
      <p class="desc-body hidden text-[11px] text-gray-500 mt-1.5 leading-relaxed italic border-l-2 border-gray-200 pl-2">${safe}</p>
    </div>`;
  }

  function field(icon, label, value, iconColor, delay) {
    if (value === null || value === undefined || value === '' || value === false) return '';
    iconColor = iconColor || 'text-blue-500';
    delay = delay || 0;
    return `<div class="rounded-xl bg-white border border-gray-100 px-4 py-3 flex items-start gap-3 shadow-sm" style="opacity:0;animation:enrich-appear .4s ease forwards;animation-delay:${delay}s">
      <i class="${icon} text-xs w-4 shrink-0 mt-0.5 ${iconColor}"></i>
      <div class="min-w-0">
        <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">${escHtml(label)}</p>
        <p class="text-sm font-bold text-gray-800 leading-snug">${escHtml(String(value)).replace(/\n/g, '<br>')}</p>
      </div>
    </div>`;
  }
  const TAG_STYLES = {
    violet: 'background:rgba(139,92,246,.1);color:#6d28d9;border:1px solid rgba(139,92,246,.2);',
    blue:   'background:rgba(59,130,246,.1);color:#1d4ed8;border:1px solid rgba(59,130,246,.2);',
    teal:   'background:rgba(20,184,166,.1);color:#0f766e;border:1px solid rgba(20,184,166,.2);',
    amber:  'background:rgba(245,158,11,.1);color:#b45309;border:1px solid rgba(245,158,11,.2);',
    gray:   'background:rgba(0,0,0,.04);color:#6b7280;border:1px solid rgba(0,0,0,.08);',
  };
  function tags(items, theme) {
    const style = TAG_STYLES[theme] || TAG_STYLES.gray;
    return items.filter(Boolean).map(t =>
      `<span style="display:inline-block;font-size:.72rem;font-weight:600;${style}border-radius:9999px;padding:.15rem .65rem;margin:.1rem 0;">${escHtml(String(t))}</span>`
    ).join('');
  }
  /* Expandable "see more" section */
  let expandCounter = 0;
  function expandable(items, delay) {
    const visible = items.filter(([,,v]) => v != null && v !== '' && v !== false);
    if (!visible.length) return '';
    const id = 'expand-' + (++expandCounter);
    const rows = visible.map(([icon, label, value, icolor]) => field(icon, label, value, icolor, 0)).join('');
    return `<div class="mt-3" style="opacity:0;animation:enrich-appear .4s ease forwards;animation-delay:${delay}s">
      <button id="btn-${id}" class="w-full flex items-center justify-between text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 transition-colors cursor-pointer">
        <span><i class="fas fa-chevron-down mr-2 text-[10px]" id="ico-${id}"></i>Show ${visible.length} more fields</span>
        <span class="text-gray-400">${visible.length} hidden</span>
      </button>
      <div id="pane-${id}" class="hidden mt-2 grid sm:grid-cols-2 gap-2">${rows}</div>
    </div>`;
  }
  function attachExpanders() {
    if (output._expanderAttached) return;
    output._expanderAttached = true;
    output.addEventListener('click', function(e) {
      const btn = e.target.closest('[id^="btn-expand-"]');
      if (!btn) return;
      const id   = btn.id.replace('btn-', '');
      const pane = document.getElementById('pane-' + id);
      const ico  = document.getElementById('ico-' + id);
      if (!pane) return;
      const isHidden = pane.classList.toggle('hidden');
      ico.classList.toggle('fa-chevron-down', isHidden);
      ico.classList.toggle('fa-chevron-up', !isHidden);
      if (!isHidden) {
        pane.querySelectorAll('[style*="opacity:0"]').forEach((el, i) => {
          setTimeout(() => { el.style.opacity = '1'; }, i * 60);
        });
      }
    });
  }

  /* ── Contact tab ── */
  function buildContactTab(c, email) {
    const photoHTML = `<div class="w-14 h-14 rounded-full bg-blue-600/20 border-2 border-blue-500/20 flex items-center justify-center shrink-0"><i class="fas fa-user text-blue-400 text-xl"></i></div>`;

    const jobSeeker = c.isJobSeeker
      ? '<span class="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-2 py-0.5">🟡 Open to opportunities</span>'
      : '';
    const statusBadge = c.status === 'NEW_COMPANY'
      ? '<span class="text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30 rounded-full px-2 py-0.5">🔴 Job change detected</span>'
      : '';

    const fields = [
      field('fas fa-briefcase',      'Job title',          c.jobTitle, 'text-blue-400', .2),
      field('fas fa-building',       'Company',            c.company,  'text-blue-400', .3),
      field('fas fa-map-marker-alt', 'Location',           c.location, 'text-gray-400', .4),
      field('fas fa-layer-group',    'Seniority · Role',
        c.seniority && c.role ? `${c.seniority} · ${c.role}` : (c.seniority || c.role || null),
        'text-violet-400', .5),
      field('fas fa-clock',          'Years in role',      c.yearsInRole, 'text-amber-400', .55),
      field('fas fa-calendar-check', 'Years at company',   c.yearsInCompany, 'text-amber-400', .6),
      field('fas fa-history',        'Total experience',   c.yearsOfExp ? `${c.yearsOfExp} yrs exp` : null, 'text-gray-400', .65),
      field('fas fa-users',          'LinkedIn followers', c.followers ? fmtNum(c.followers) + ' followers' : null, 'text-blue-400', .7),
    ].filter(Boolean);

    const skillsHTML = (c.skills || []).length
      ? `<div class="rounded-xl bg-gray-800/50 border border-gray-700/40 px-4 py-3 mt-2" style="opacity:0;animation:enrich-appear .4s ease forwards;animation-delay:.8s">
          <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-2">Top skills</p>
          <div class="flex flex-wrap gap-1.5">${tags(c.skills, 'blue')}</div>
        </div>` : '';

    const eduHTML = (c.education || []).filter(e => e.school).length
      ? `<div class="rounded-xl bg-gray-800/50 border border-gray-700/40 px-4 py-3 mt-2" style="opacity:0;animation:enrich-appear .4s ease forwards;animation-delay:.9s">
          <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-2">Education</p>
          ${c.education.filter(e => e.school).map(e =>
            `<p class="text-sm text-gray-200 font-bold leading-snug">${escHtml(e.school)}${e.field ? ` <span class="text-gray-500 font-normal">· ${escHtml(e.field)}</span>` : ''}${e.years ? ` <span class="text-gray-600 text-xs">(${escHtml(e.years)})</span>` : ''}</p>`
          ).join('')}
        </div>` : '';

    const ex = c.extra || {};
    const moreContactFields = [
      ['fas fa-twitter',        'Twitter',            ex.twitter,       'text-sky-400'],
      ['fas fa-globe',          'Website',            ex.website,       'text-blue-400'],
      ['fas fa-language',       'Languages',          ex.languages,     'text-gray-400'],
      ['fas fa-venus-mars',     'Gender',             ex.gender,        'text-gray-400'],
      ['fas fa-briefcase',      'Active companies',   ex.activeCompanies,'text-blue-400'],
      ['fas fa-building',       'Former companies',   ex.formerCompanies?.join(', '), 'text-gray-400'],
      ['fas fa-star',           'Creator',            ex.isCreator ? 'Yes — LinkedIn creator' : null, 'text-amber-400'],
      ['fas fa-hashtag',        'Concurrent positions', ex.numCurrentCompanies ? `${ex.numCurrentCompanies} active positions` : null, 'text-gray-400'],
    ];
    const moreEdu = (ex.allEducation || []).slice(2).map(e =>
      `<p class="text-sm text-gray-200 font-bold leading-snug">${escHtml(e.school)}${e.field ? ` <span class="text-gray-500 font-normal">· ${escHtml(e.field)}</span>` : ''}${e.years ? ` <span class="text-gray-600 text-xs">(${escHtml(e.years)})</span>` : ''}</p>`
    ).join('');
    const moreEduHTML = moreEdu ? `<div class="mt-1 pt-2 border-t border-gray-700/40">${moreEdu}</div>` : '';
    const moreSkillsHTML = (ex.allSkills || []).length > 10
      ? `<div class="mt-1 pt-2 border-t border-gray-700/40 flex flex-wrap gap-1.5">${tags(ex.allSkills.slice(10), 'blue')}</div>` : '';

    return `
      <div class="flex items-center gap-4 bg-gray-800/40 border border-gray-700/40 rounded-2xl p-4 mb-4" style="opacity:0;animation:enrich-appear .4s ease forwards;animation-delay:.05s">
        ${photoHTML}
        <div class="min-w-0 flex-1">
          <p class="text-white font-extrabold text-lg leading-tight truncate">${escHtml(c.name || 'Contact')}</p>
          <p class="text-gray-400 text-sm truncate">${escHtml(c.headline || [c.jobTitle, c.company].filter(Boolean).join(' @ ') || '')}</p>
          <div class="flex flex-wrap gap-1.5 mt-1.5">${jobSeeker}${statusBadge}</div>
        </div>
        ${c.linkedInUrl ? `<a href="${escHtml(c.linkedInUrl)}" target="_blank" rel="noopener" class="shrink-0 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1.5 hover:bg-blue-500/20 transition-colors"><i class="fab fa-linkedin mr-1"></i>LinkedIn</a>` : ''}
      </div>
      <div class="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 mb-4 flex items-center gap-3" style="opacity:0;animation:enrich-appear .4s ease forwards;animation-delay:.1s">
        <i class="fas fa-check-circle text-green-400"></i>
        <div>
          <p class="text-[10px] text-green-400 font-semibold uppercase tracking-wide leading-none mb-0.5">Verified professional email</p>
          <p class="text-base font-extrabold text-green-300 font-mono">${escHtml(email)}</p>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 gap-2">${fields.join('')}</div>
      ${skillsHTML}${moreSkillsHTML ? `<div class="rounded-xl bg-gray-800/50 border border-gray-700/40 px-4 py-3 mt-2">${moreSkillsHTML}</div>` : ''}
      ${eduHTML}${moreEduHTML}
      ${expandable(moreContactFields, 1.1)}`;
  }

  /* ── Company tab ── */
  function buildCompanyTab(co) {
    if (!co) return `<p class="text-gray-500 text-sm text-center py-8">Company data not available for this domain.</p>`;
    const f  = co.firmographic || {};
    const fu = co.funding      || {};
    const tr = co.traffic      || {};
    const ts = co.techStack;

    const firmFields = [
      field('fas fa-building',       'Company name',      f.name, 'text-white', .1),
      field('fas fa-industry',       'Industry',          f.industry, 'text-violet-400', .15),
      field('fas fa-tag',            'Type',              f.type, 'text-violet-400', .17),
      field('fas fa-users',          'Headcount',
        f.headcount ? fmtNum(f.headcount) + (f.headcountRange ? ` (${f.headcountRange})` : '') : f.headcountRange,
        'text-green-400', .2),
      field('fas fa-map-marker-alt', 'HQ',                f.hq, 'text-gray-400', .25),
      field('fas fa-calendar-alt',   'Founded',           f.foundedYear ? `${f.foundedYear}` : null, 'text-gray-400', .3),
      field('fab fa-linkedin',       'LinkedIn followers', f.followers ? fmtNum(f.followers) + ' followers' : null, 'text-blue-400', .35),
      field('fas fa-quote-left',     'Slogan',            f.slogan, 'text-gray-400', .38),
    ].filter(Boolean);

    const fundFields = fu.totalUsd || fu.ipoStatus ? [
      fu.totalUsd ? field('fas fa-dollar-sign', 'Total raised',
        `$${fmtNum(fu.totalUsd)} across ${fu.numRounds || '?'} rounds`, 'text-amber-400', .4) : '',
      fu.lastRoundType ? field('fas fa-chart-line', 'Last round',
        `${fu.lastRoundType.replace('_',' ').toUpperCase()}${fu.lastRoundUsd ? ' · $' + fmtNum(fu.lastRoundUsd) : ''}${fu.lastRoundDate ? ' (' + fu.lastRoundDate.slice(0,4) + ')' : ''}`,
        'text-amber-300', .45) : '',
      fu.ipoStatus === 'public' && fu.stockSymbol ? field('fas fa-landmark', 'Public company',
        `${fu.stockSymbol.toUpperCase()} · IPO ${fu.ipoDate ? fu.ipoDate.slice(0,4) : ''}`, 'text-green-400', .5) : '',
    ].filter(Boolean) : [];

    const trafficFields = tr.monthlyVisits ? [
      field('fas fa-chart-bar',  'Monthly visits',   fmtNum(tr.monthlyVisits), 'text-blue-400', .55),
      field('fas fa-globe',      'Global rank',      tr.globalRank ? `#${fmtNum(tr.globalRank)}` : null, 'text-blue-400', .58),
      field('fas fa-mouse-pointer','Bounce rate',    tr.bounceRate != null ? `${tr.bounceRate}%` : null, 'text-gray-400', .6),
      field('fas fa-clock',      'Avg session',      tr.avgSessionSec ? `${Math.floor(tr.avgSessionSec/60)}m ${tr.avgSessionSec%60}s` : null, 'text-gray-400', .62),
    ].filter(Boolean) : [];

    const topKw = (tr.topKeywords || []).length
      ? `<div class="rounded-xl bg-gray-800/50 border border-gray-700/40 px-4 py-3 mt-2" style="opacity:0;animation:enrich-appear .4s ease forwards;animation-delay:.7s">
          <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-2">Top SEO keywords</p>
          <div class="flex flex-col gap-1">
            ${tr.topKeywords.slice(0,5).map(k =>
              `<div class="flex justify-between text-xs"><span class="text-gray-300 font-semibold">${escHtml(k.word)}</span><span class="text-gray-500">${fmtNum(k.volume)}/mo · CPC $${k.cpc?.toFixed(2) ?? '–'}</span></div>`
            ).join('')}
          </div>
        </div>` : '';

    const descHTML = f.description
      ? `<div class="rounded-xl bg-gray-800/50 border border-gray-700/40 px-4 py-3 mt-2 col-span-2" style="opacity:0;animation:enrich-appear .4s ease forwards;animation-delay:.72s">
          <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-1">About</p>
          <p class="text-sm text-gray-300 leading-relaxed">${escHtml(f.description)}</p>
        </div>` : '';

    const specialties = f.specialties?.length
      ? `<div class="rounded-xl bg-gray-800/50 border border-gray-700/40 px-4 py-3 mt-2" style="opacity:0;animation:enrich-appear .4s ease forwards;animation-delay:.75s">
          <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-2">Specialties</p>
          <div class="flex flex-wrap gap-1.5">${tags(f.specialties, 'violet')}</div>
        </div>` : '';

    const techHTML = ts?.length
      ? `<div class="rounded-xl bg-gray-800/50 border border-gray-700/40 px-4 py-3 mt-2" style="opacity:0;animation:enrich-appear .4s ease forwards;animation-delay:.8s">
          <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-2">Tech stack detected</p>
          <div class="flex flex-wrap gap-1.5">${tags(ts.map(t => t.name), 'teal')}</div>
        </div>` : '';

    const investors = fu.investors?.length
      ? `<div class="rounded-xl bg-gray-800/50 border border-gray-700/40 px-4 py-3 mt-2" style="opacity:0;animation:enrich-appear .4s ease forwards;animation-delay:.65s">
          <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-2">Notable investors</p>
          <div class="flex flex-wrap gap-1.5">${tags(fu.investors, 'amber')}</div>
        </div>` : '';

    const moreCompanyFields = [
      ['fas fa-globe',       'Website',            f.website,           'text-blue-400'],
      ['fas fa-industry',    'HubSpot Industry',   f.hubspotIndustry,   'text-violet-400'],
      ['fas fa-layer-group', 'Sector',             f.hubspotSector,     'text-violet-400'],
      ['fas fa-map-pin',     'Number of offices',  f.numLocations ? `${f.numLocations} locations` : null, 'text-gray-400'],
      ['fas fa-flag',        'Country',            f.country,           'text-gray-400'],
    ];

    return `
      <div class="grid sm:grid-cols-2 gap-2">${[...firmFields, ...fundFields, ...trafficFields].join('')}</div>
      ${descHTML}${investors}${specialties}${topKw}${techHTML}
      ${expandable(moreCompanyFields, 1.0)}`;
  }

  /* ── Full result renderer ── */
  function renderResult(data) {
    const c  = data.contact || {};
    const co = data.company;

    // Count total data points
    const contactPoints = [c.name, c.jobTitle, c.company, c.location, c.seniority, c.yearsInRole, c.followers, c.isJobSeeker]
      .filter(Boolean).length + (c.skills?.length || 0) + (c.education?.length || 0) + 1;
    const companyPoints = co ? [co.firmographic?.name, co.firmographic?.industry, co.firmographic?.headcount,
      co.funding?.totalUsd, co.traffic?.monthlyVisits, co.traffic?.globalRank].filter(Boolean).length
      + (co.techStack?.length || 0) + (co.firmographic?.specialties?.length || 0) : 0;
    const totalPoints = contactPoints + companyPoints;

    const hasCompany = !!co;

    return `
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-xs text-gray-500 font-mono mb-0.5">5 APIs · live enrichment</p>
          <p class="text-green-400 font-extrabold text-sm">✓ ${totalPoints}+ data points in &lt;5s</p>
        </div>
        <span class="text-xs font-bold text-green-400 bg-green-400/10 rounded-full px-3 py-1 border border-green-400/20">
          <span class="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>Live
        </span>
      </div>

      <!-- Tabs (no onclick= — listeners attached after render to satisfy CSP) -->
      <div class="flex gap-1 bg-gray-800/60 rounded-xl p-1 mb-5 border border-gray-700/40">
        <button id="result-tab-contact"
          class="flex-1 text-xs font-extrabold py-2 rounded-lg bg-blue-600 text-white transition-all cursor-pointer">
          <i class="fas fa-user mr-1.5"></i>Contact · ${contactPoints} fields
        </button>
        <button id="result-tab-company"
          class="flex-1 text-xs font-extrabold py-2 rounded-lg text-gray-400 hover:text-gray-200 transition-all ${!hasCompany ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}">
          <i class="fas fa-building mr-1.5"></i>Company${hasCompany ? ` · ${companyPoints} fields` : ' · no data'}
        </button>
      </div>
      <div id="result-pane-contact">${buildContactTab(c, data.email)}</div>
      <div id="result-pane-company" class="hidden">${buildCompanyTab(co)}</div>

      <!-- CTA -->
      <div class="rounded-2xl bg-blue-600/15 border border-blue-500/25 p-6 text-center mt-5">
        <p class="text-white font-extrabold mb-1">Now imagine this for your entire CRM.</p>
        <p class="text-blue-200 text-sm mb-4 max-w-sm mx-auto">
          Every contact enriched automatically — job changes, funding alerts, verified emails — synced to HubSpot.
        </p>
        <a href="https://app.enrich-crm.com/sign-up?utm_source=website&utm_medium=cta&utm_campaign=home_v2_demo_widget"
           class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm px-6 py-3 rounded-full transition-colors">
          <i class="fas fa-bolt text-xs"></i> Enrich my 500 free contacts
        </a>
        <p class="text-xs text-blue-300/50 mt-2">1 credit = 1 contact · No card · Cancel anytime</p>
      </div>`;
  }

  /* ── Tab switcher — attached after render (CSP blocks onclick=) ── */
  function switchResultTab(tab) {
    const tabs  = { contact: document.getElementById('result-tab-contact'),  company: document.getElementById('result-tab-company') };
    const panes = { contact: document.getElementById('result-pane-contact'), company: document.getElementById('result-pane-company') };

    // Contact tab styles
    const c = tabs.contact;
    if (c) {
      const isContact = tab === 'contact';
      c.className = `flex-1 text-xs font-bold py-2 rounded-lg transition-all cursor-pointer ${
        isContact
          ? 'bg-white text-blue-700 shadow-sm border border-gray-200'
          : 'text-gray-400 hover:text-gray-600'
      }`;
    }
    // Company tab styles
    const co = tabs.company;
    if (co) {
      const isCompany = tab === 'company';
      co.className = `relative flex-1 text-xs font-bold py-2 rounded-lg transition-all cursor-pointer ${
        isCompany
          ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md'
          : 'bg-violet-50 text-violet-600 border border-violet-200 hover:bg-violet-100'
      }`;
    }

    Object.keys(panes).forEach(k => {
      if (panes[k]) panes[k].classList.toggle('hidden', k !== tab);
    });
  }
  function attachResultTabs() {
    document.getElementById('result-tab-contact')?.addEventListener('click', () => switchResultTab('contact'));
    document.getElementById('result-tab-company')?.addEventListener('click', () => switchResultTab('company'));
  }

  /* ── Error display ── */
  function showError(msg, containerOrMeta, meta) {
    // Overload: showError(msg, container) or showError(msg, meta)
    let container = output; // default to contact+company output
    if (containerOrMeta instanceof HTMLElement) {
      container = containerOrMeta;
    } else if (containerOrMeta) {
      meta = containerOrMeta;
    }
    let resetLabel = '';
    if (meta?.resetAt) {
      const t = new Date(meta.resetAt);
      resetLabel = ' — resets at ' + t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const friendly = {
      too_many_requests: { __custom: true, resetLabel },
      contact_not_found: {
        icon: 'fa-rotate', title: 'Profile not found in real time',
        body: 'Enrich-CRM queries live sources — not a static database. Coverage varies by identifier (email, LinkedIn, name + company). Try another input or pick an example below.',
        cta: { label: 'Try another input', action: 'reset' },
        showExamples: true,
      },
      api_timeout: {
        icon: 'fa-hourglass-half', title: 'First lookup is slow right now',
        body: 'Our data sources are under load — response can take 90–120 seconds. Click "Try again" and the result will often be cached already.',
        cta: { label: 'Try again', action: 'reset' },
      },
      invalid_token: {
        icon: 'fa-rotate', title: 'Session expired',
        body: 'Please refresh the page and try again.',
        cta: { label: 'Refresh', action: 'reload' },
      },
      demo_credits_exhausted: {
        icon: 'fa-wifi-slash', title: 'Live demo temporarily unavailable',
        body: 'Our enrichment service is momentarily unreachable. Try again in a few minutes.',
        cta: { label: 'Try again', action: 'reset' },
      },
    };
    // ── Rate-limit block : panneau de conversion dédié ───────────────────────
    if (friendly[msg]?.__custom) {
      const rl = friendly[msg];
      container.innerHTML = `
        <div class="rounded-2xl overflow-hidden border-2 border-blue-200 shadow-lg">
          <!-- Header gradient -->
          <div class="bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-4 text-center">
            <div class="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-2">
              <i class="fas fa-bolt text-white text-lg"></i>
            </div>
            <p class="text-white font-black text-base leading-tight">You've used your 10 free demo searches</p>
            ${rl.resetLabel ? `<p class="text-blue-200 text-xs mt-1">New searches available${rl.resetLabel}</p>` : ''}
          </div>
          <!-- Body -->
          <div class="bg-white px-5 py-4">
            <p class="text-gray-600 text-sm text-center mb-4 leading-relaxed">
              You've seen what Enrich-CRM can do.<br>
              <strong class="text-gray-900">Create your free account to keep going.</strong>
            </p>
            <!-- What you get -->
            <div class="grid grid-cols-2 gap-2 mb-4">
              <div class="flex items-start gap-2 bg-blue-50 rounded-xl p-2.5">
                <i class="fas fa-database text-blue-500 text-xs mt-0.5 shrink-0"></i>
                <div>
                  <p class="text-xs font-extrabold text-gray-800">500 contacts free</p>
                  <p class="text-[10px] text-gray-500 leading-tight">No credit card needed</p>
                </div>
              </div>
              <div class="flex items-start gap-2 bg-violet-50 rounded-xl p-2.5">
                <i class="fas fa-bolt text-violet-500 text-xs mt-0.5 shrink-0"></i>
                <div>
                  <p class="text-xs font-extrabold text-gray-800">Unlimited demo</p>
                  <p class="text-[10px] text-gray-500 leading-tight">Try any contact or company</p>
                </div>
              </div>
              <div class="flex items-start gap-2 bg-green-50 rounded-xl p-2.5">
                <i class="fas fa-bell text-green-500 text-xs mt-0.5 shrink-0"></i>
                <div>
                  <p class="text-xs font-extrabold text-gray-800">Job change alerts</p>
                  <p class="text-[10px] text-gray-500 leading-tight">Real-time on your CRM</p>
                </div>
              </div>
              <div class="flex items-start gap-2 bg-amber-50 rounded-xl p-2.5">
                <i class="fas fa-plug text-amber-500 text-xs mt-0.5 shrink-0"></i>
                <div>
                  <p class="text-xs font-extrabold text-gray-800">API + integrations</p>
                  <p class="text-[10px] text-gray-500 leading-tight">HubSpot, Salesforce…</p>
                </div>
              </div>
            </div>
            <!-- CTA -->
            <a href="https://app.enrich-crm.com/sign-up?utm_source=website&utm_medium=cta&utm_campaign=home_v2_ratelimit"
               class="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-extrabold text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-200 mb-2">
              <i class="fas fa-bolt text-xs"></i>
              Start enriching free — 500 contacts included
            </a>
            <p class="text-[10px] text-gray-400 text-center">No card · Setup in 2 min · Cancel anytime</p>
          </div>
        </div>`;
      return;
    }

    const e = friendly[msg] || {
      icon: 'fa-wifi-slash', title: 'Temporarily unavailable',
      body: 'Our demo service hit a snag. Try again in a moment.',
      cta: { label: 'Try again', action: 'reset' },
    };

    const action = e.cta?.action || null;
    let ctaHTML = '';
    if (action === 'reset') {
      ctaHTML = `<button id="live-err-cta" class="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-sm px-5 py-2.5 rounded-full transition-colors cursor-pointer border border-gray-200">
        <i class="fas fa-arrow-left text-xs"></i> ${e.cta.label}
      </button>`;
    } else if (action === 'reload') {
      ctaHTML = `<button id="live-err-cta" class="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-sm px-5 py-2.5 rounded-full transition-colors cursor-pointer border border-gray-200">
        <i class="fas fa-rotate text-xs"></i> ${e.cta.label}
      </button>`;
    } else if (e.cta?.href) {
      ctaHTML = `<a href="${e.cta.href}" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-5 py-2.5 rounded-full transition-colors">
        <i class="fas fa-bolt text-xs"></i> ${e.cta.label}
      </a>
      <p class="text-xs text-gray-400 mt-3">No card · 1 credit = 1 contact</p>`;
    }

    let examplesHTML = '';
    if (e.showExamples && msg === 'contact_not_found' && typeof LIVE_DEMO_EXAMPLES !== 'undefined') {
      examplesHTML = `
        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-5 mb-3">Try an example</p>
        <div class="flex flex-wrap gap-2 justify-center">
          ${LIVE_DEMO_EXAMPLES.map((ex, idx) => `<button type="button" class="live-err-example shrink-0 flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer whitespace-nowrap" data-example-index="${idx}">${ex.label}</button>`).join('')}
        </div>`;
    }

    container.innerHTML = `
      <div class="rounded-2xl bg-gray-50 border border-gray-200 p-6 text-center">
        <div class="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-4">
          <i class="fas ${e.icon} text-gray-400"></i>
        </div>
        <p class="text-gray-900 font-extrabold mb-1">${e.title}</p>
        <p class="text-gray-500 text-sm mb-5 max-w-xs mx-auto">${e.body}</p>
        ${ctaHTML}
        ${examplesHTML}
      </div>`;

    // Attach action — no inline onclick (blocked by CSP)
    const ctaBtn = document.getElementById('live-err-cta');
    if (ctaBtn && action === 'reset') {
      ctaBtn.addEventListener('click', () => {
        clearContactFields();
        const emailInput = document.getElementById('live-email');
        if (emailInput) emailInput.focus();
        container.classList.add('hidden');
      });
    } else if (ctaBtn && action === 'reload') {
      ctaBtn.addEventListener('click', () => location.reload());
    }

    // Attach example buttons (contact_not_found)
    if (e.showExamples && msg === 'contact_not_found' && typeof LIVE_DEMO_EXAMPLES !== 'undefined') {
      container.querySelectorAll('.live-err-example').forEach(btn => {
        const idx = parseInt(btn.getAttribute('data-example-index'), 10);
        const example = LIVE_DEMO_EXAMPLES[idx];
        if (example) {
          btn.addEventListener('click', () => applyExampleAndRun(example));
        }
      });
    }
  }

  /* ── Progressive SSE rendering ─────────────────────────────────────────── */

  /* Skeleton shown while a section is loading */
  function skeleton(label) {
    return `<div class="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 flex items-center gap-3 animate-pulse">
      <div class="w-4 h-4 rounded bg-gray-200 shrink-0"></div>
      <div class="flex-1">
        <div class="h-2 w-16 rounded bg-gray-200 mb-1.5"></div>
        <div class="h-3 w-32 rounded bg-gray-100"></div>
      </div>
      <span class="text-[10px] text-gray-300 font-mono">${label}</span>
    </div>`;
  }

  /* Colored section label */
  function sectionLabel(color, text) {
    return `<div class="flex items-center gap-2 mt-5 mb-3">
      <div class="w-1 h-4 rounded-full ${color}"></div>
      <p class="text-[10px] font-bold uppercase tracking-widest text-gray-500">${text}</p>
    </div>`;
  }

  /* Build the progressive shell — tabs + company sections */
  function buildShell(queryLabel, opts = {}) {
    const { notMatched = false, fullName: fn = '', domain: dm = '' } = opts;
    const isEmail = queryLabel?.includes('@');
    const inputBadge = notMatched
      ? `<span class="font-semibold">Not matched</span> — ${escHtml(fn)} @ ${escHtml(dm)}`
      : isEmail
      ? `<i class="fas fa-check-circle mr-1 opacity-80"></i><span class="font-bold font-mono">${escHtml(queryLabel)}</span>`
      : `<i class="fas fa-check-circle mr-1 opacity-80"></i><span class="font-bold">${escHtml(queryLabel)}</span>`;
    return `
      <!-- Header placeholder -->
      <div id="s-contact-header" class="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-3 mb-3 animate-pulse">
        <div class="w-12 h-12 rounded-full bg-gray-200 shrink-0"></div>
        <div class="flex-1 space-y-1.5">
          <div class="h-4 w-40 rounded bg-gray-200"></div>
          <div class="h-3 w-52 rounded bg-gray-100"></div>
          <div class="h-3 w-28 rounded bg-gray-100"></div>
        </div>
      </div>

      <!-- Tab bar -->
      <div class="flex gap-1.5 bg-gray-100 rounded-xl p-1 mb-3 border border-gray-200">
        <button id="result-tab-contact" class="flex-1 text-xs font-bold py-2 rounded-lg bg-white text-blue-700 shadow-sm border border-gray-200 transition-all cursor-pointer">
          <i class="fas fa-user mr-1.5"></i>Contact
        </button>
        <button id="result-tab-company" class="relative flex-1 text-xs font-bold py-2 rounded-lg bg-violet-50 text-violet-600 border border-violet-200 transition-all hover:bg-violet-100 cursor-pointer">
          <i class="fas fa-building mr-1"></i>
          Company
          <span id="s-company-count" class="inline-flex items-center gap-0.5 ml-1">
            <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block"></span>
          </span>
        </button>
      </div>

      <!-- ── Contact pane ──────────────────────────────────────────────── -->
      <div id="result-pane-contact">
        ${notMatched
          ? `<div class="rounded-xl bg-gray-50 border border-gray-200 px-4 py-6 text-center">
            <i class="fas fa-user-slash text-gray-300 text-2xl mb-3"></i>
            <p class="text-sm text-gray-600 font-semibold mb-1">${escHtml(fn)} — no match found</p>
            <p class="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">Matching by name alone has low precision.<br>Try with an <strong class="text-gray-600">email</strong> or <strong class="text-gray-600">LinkedIn URL</strong>.</p>
          </div>`
          : `          <div id="s-job-change"></div>
          <!-- 2-col layout: positions left (3fr) | stats+skills+edu right (2fr) — stacks on mobile -->
          <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
            <!-- LEFT : position principale + autres postes + previous exp + education -->
            <div class="md:col-span-3 min-w-0">
              <div id="s-contact-fields">
                <div class="rounded-xl bg-blue-50 border border-blue-100 px-3 py-2.5 mb-2 animate-pulse space-y-1.5">
                  <div class="h-4 bg-blue-100 rounded w-3/4"></div>
                  <div class="h-3 bg-blue-100 rounded w-1/2"></div>
                  <div class="h-3 bg-blue-100 rounded w-1/3"></div>
                </div>
              </div>
              <div id="s-skills"></div>
              <div id="s-edu"></div>
            </div>
            <!-- RIGHT : stat cards + signaux/bio + skills en bas -->
            <div class="md:col-span-2 min-w-0 flex flex-col">
              <div id="s-contact-stats">
                <div class="grid grid-cols-2 gap-1.5 mb-2 animate-pulse">
                  ${[1,2,3,4].map(() => `<div class="bg-gray-50 border border-gray-100 rounded-xl p-3 h-14"></div>`).join('')}
                </div>
              </div>
              <div id="s-contact-extra" class="flex-1"></div>
            </div>
          </div>`}
      </div>

      <!-- ── Company pane ─────────────────────────────────────────────── -->
      <div id="result-pane-company" class="hidden">
        <div id="s-firm">
          <div class="grid grid-cols-2 gap-2 animate-pulse mb-2">
            ${[1,2,3,4].map(() => `<div class="bg-gray-50 border border-gray-100 rounded-xl p-3 h-12"></div>`).join('')}
          </div>
        </div>
        <div class="flex items-center gap-2 mt-4 mb-2">
          <div class="w-1 h-4 rounded-full bg-amber-400"></div>
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Financials & Funding</p>
        </div>
        <div id="s-fund">
          ${[1,2].map(() => skeleton('funding')).join('')}
        </div>
        <div class="flex items-center gap-2 mt-4 mb-2">
          <div class="w-1 h-4 rounded-full bg-blue-400"></div>
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Web Traffic & SEO</p>
        </div>
        <div id="s-traffic">
          ${[1,2].map(() => skeleton('traffic')).join('')}
        </div>
        <div class="flex items-center gap-2 mt-4 mb-2">
          <div class="w-1 h-4 rounded-full bg-teal-400"></div>
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tech Stack</p>
        </div>
        <div id="s-tech"></div>
        <div id="s-company-extra"></div>
      </div>`;
  }

  /* Stats mini-card */
  function statCard(val, label, iconClass, colorClass) {
    return `<div class="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
      <i class="${iconClass} text-[11px] ${colorClass} mb-1 block"></i>
      <p class="text-xl font-black text-gray-900 leading-none">${escHtml(String(val))}</p>
      <p class="text-[9px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5 leading-tight">${escHtml(label)}</p>
    </div>`;
  }

  /* Section header with colored bar */
  function secHeader(barClass, textClass, text, count) {
    return `<div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <div class="w-1 h-4 rounded-full ${barClass}"></div>
        <p class="text-[10px] font-bold ${textClass} uppercase tracking-widest">${text}</p>
      </div>
      ${count != null ? `<span class="text-[10px] text-gray-400 font-semibold">${count}</span>` : ''}
    </div>`;
  }

  /* Update contact pane when contact event arrives */
  function updateContact(c, email, elapsed) {
    const ex = c.extra || {};
    const allSkills    = ex.allSkills?.length ? ex.allSkills : (c.skills || []);
    const allEdu       = ex.allEducation?.length ? ex.allEducation : (c.education || []);
    const formerCos    = ex.formerCompanies || [];
    const pastPositions = ex.pastPositions || [];
    // Other active positions (exclude primary)
    const otherPositions = (c.positions || []).slice(1);

    // ── Header ───────────────────────────────────────────────────────────────
    const nameParts = (c.name || '?').split(' ').filter(Boolean);
    const initials  = nameParts.slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const avatarGrads = ['from-blue-500 to-indigo-600','from-violet-500 to-purple-600',
      'from-teal-500 to-green-600','from-amber-500 to-orange-500','from-rose-500 to-pink-600'];
    const avatarGrad = avatarGrads[(c.name || '').charCodeAt(0) % avatarGrads.length];
    const photoHTML = `<div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center shrink-0 shadow-md">
      <span class="text-white font-black text-sm tracking-tight">${initials}</span>
    </div>`;

    const badges = [
      (c.status === 'NEW_COMPANY' || c.status === 'MOST_PROBABLE_NEW_COMPANY')
        ? `<span class="text-[9px] font-bold bg-orange-50 text-orange-600 border border-orange-300 rounded-full px-2 py-0.5">🔥 Job change</span>` : '',
      c.isJobSeeker ? `<span class="text-[9px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-2 py-0.5">🟡 Open to work</span>` : '',
      c.isPremium   ? `<span class="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">⭐ Premium</span>` : '',
      c.isOpenLink  ? `<span class="text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5">Open Link</span>` : '',
    ].filter(Boolean).join('');

    const elapsedBadge = elapsed
      ? `<span class="text-[9px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 whitespace-nowrap">⚡ ${elapsed}s</span>`
      : '';

    const hdr = document.getElementById('s-contact-header');
    if (hdr) hdr.outerHTML = `
      <div class="bg-gradient-to-r from-white via-white to-blue-50/40 border border-gray-200 rounded-2xl p-3 mb-3 shadow-sm" style="opacity:0;animation:enrich-appear .4s ease forwards">
        <div class="flex items-start gap-3">
          ${photoHTML}
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="text-gray-900 font-extrabold text-base leading-tight truncate">${escHtml(c.name || 'Contact')}</p>
                ${c.location ? `<p class="text-[10px] text-gray-500 mt-0.5 truncate"><i class="fas fa-map-marker-alt mr-0.5 text-gray-400"></i>${escHtml(c.location)}</p>` : ''}
              </div>
              <div class="flex flex-col items-end gap-1 shrink-0">
                ${elapsedBadge}
                ${c.linkedInUrl ? `<a href="${escHtml(c.linkedInUrl)}" target="_blank" rel="noopener" class="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5 hover:bg-blue-100 transition-colors"><i class="fab fa-linkedin mr-0.5"></i>Profile</a>` : ''}
              </div>
            </div>
            <div class="flex flex-wrap gap-1 mt-1.5">
              ${c.yearsOfExp ? `<span class="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5"><i class="fas fa-history mr-0.5 text-[8px]"></i>${escHtml(c.yearsOfExp)} yrs exp</span>` : ''}
              ${c.seniority  ? `<span class="text-[9px] font-bold text-violet-700 bg-violet-50 border border-violet-100 rounded-full px-2 py-0.5">${escHtml(c.seniority)}</span>` : ''}
              ${c.role       ? `<span class="text-[9px] font-bold text-violet-700 bg-violet-50 border border-violet-100 rounded-full px-2 py-0.5">${escHtml(c.role)}</span>` : ''}
              ${badges}
            </div>
          </div>
        </div>
      </div>`;

    // ── Job change alert ──────────────────────────────────────────────────────
    const jobChangeEl = document.getElementById('s-job-change');
    if (jobChangeEl) {
      jobChangeEl.innerHTML = ''; // toujours vider avant de décider
      const isJobChange = c.status === 'NEW_COMPANY'
        || c.status === 'MOST_PROBABLE_NEW_COMPANY';
      if (isJobChange) {
        const newTitle   = c.jobTitle   ? escHtml(c.jobTitle)   : null;
        const newCompany = c.company    ? escHtml(c.company)     : null;
        const newRole    = [newTitle, newCompany ? `@ ${newCompany}` : null].filter(Boolean).join(' ');
        jobChangeEl.innerHTML = `
          <div class="rounded-xl border-2 border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 mb-3 shadow-sm"
               style="opacity:0;animation:enrich-appear .35s ease forwards">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-xl bg-orange-400 flex items-center justify-center shrink-0 shadow">
                <i class="fas fa-bolt text-white text-sm"></i>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-xs font-black text-orange-700 uppercase tracking-wider mb-0.5">
                  🔥 ${c.status === 'MOST_PROBABLE_NEW_COMPANY' ? 'Probable job change detected' : 'Job change detected'}
                </p>
                ${newRole ? `<p class="text-sm font-bold text-gray-900 leading-tight">${newRole}</p>` : ''}
                <p class="text-[11px] text-orange-600 mt-1 leading-snug">
                  ${c.status === 'MOST_PROBABLE_NEW_COMPANY'
                    ? 'A recent job change is <strong>likely</strong> for this contact — high buying intent window. Reach out now before competitors do.'
                    : 'This contact recently changed position — <strong>high buying intent window</strong>. Reach out now before competitors do.'}
                </p>
              </div>
              ${c.linkedInUrl ? `<a href="${escHtml(c.linkedInUrl)}" target="_blank" rel="noopener"
                class="shrink-0 text-[10px] font-bold bg-orange-400 hover:bg-orange-500 text-white rounded-lg px-2.5 py-1.5 transition-colors whitespace-nowrap">
                <i class="fab fa-linkedin mr-1"></i>Contact
              </a>` : ''}
            </div>
          </div>`;
      }
    }

    // ── Core B2B identity block ───────────────────────────────────────────────
    const fieldsEl = document.getElementById('s-contact-fields');
    if (fieldsEl) {
      // Primary position — prominent single block
      const primaryPos = c.positions?.[0] || null;
      const jobLine = c.jobTitle
        ? `<p class="text-base font-extrabold text-gray-900 leading-tight">${escHtml(c.jobTitle)}${c.company ? `<span class="text-gray-500 font-normal"> @ ${escHtml(c.company)}</span>` : ''}</p>`
        : '';
      const seniorityLine = [c.seniority, c.role, c.yearsOfExp ? `${c.yearsOfExp} yrs exp` : null]
        .filter(Boolean).join(' · ');
      const tenureLine = [
        c.yearsInRole    ? `${c.yearsInRole} in role`    : null,
        c.yearsInCompany ? `${c.yearsInCompany} at company` : null,
      ].filter(Boolean).join(' · ');
      const domainLine = c.companyDomain ? `@${c.companyDomain}` : (c.companyWebsite || null);

      const primaryStarted = primaryPos?.startTime ? `Since ${primaryPos.startTime}` : null;
      const primaryWebsite = primaryPos?.website || null;
      const primaryDesc    = primaryPos?.description || null;

      const cleanTenure = tenureLine && tenureLine !== 'No data' ? tenureLine : null;
      const coInitial  = (c.company || c.jobTitle || '?')[0].toUpperCase();
      const coGrads    = ['from-blue-500 to-indigo-600','from-violet-500 to-purple-600',
        'from-teal-500 to-green-600','from-amber-500 to-orange-500','from-rose-500 to-pink-600'];
      const coGrad     = coGrads[(c.company || '').charCodeAt(0) % coGrads.length];

      const primaryBlock = (c.jobTitle || c.company) ? `
        <div class="rounded-2xl bg-white border-2 border-blue-100 shadow-sm px-4 py-3.5 mb-2" style="opacity:0;animation:enrich-appear .4s .08s ease forwards">
          <!-- label -->
          <p class="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span> Current position
          </p>
          <!-- company avatar + title -->
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br ${coGrad} flex items-center justify-center shrink-0 shadow-sm">
              <span class="text-white font-black text-sm">${coInitial}</span>
            </div>
            <div class="min-w-0 flex-1">
              ${c.jobTitle ? `<p class="text-sm font-extrabold text-gray-900 leading-tight">${escHtml(c.jobTitle)}</p>` : ''}
              ${c.company  ? `<p class="text-xs font-semibold text-blue-600 mt-0.5">${escHtml(c.company)}</p>` : ''}
              <div class="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                ${cleanTenure    ? `<span class="text-[10px] text-gray-500 flex items-center gap-1"><i class="fas fa-clock text-[8px] text-gray-400"></i>${escHtml(cleanTenure)}</span>` : ''}
                ${primaryStarted ? `<span class="text-[10px] text-gray-400 flex items-center gap-1"><i class="fas fa-calendar-alt text-[8px]"></i>${escHtml(primaryStarted)}</span>` : ''}
              </div>
              ${primaryWebsite ? `<a href="${escHtml(primaryWebsite.startsWith('http') ? primaryWebsite : 'https://'+primaryWebsite)}" target="_blank" rel="noopener" class="text-[10px] text-blue-400 hover:text-blue-600 mt-1 inline-flex items-center gap-1 max-w-full overflow-hidden"><i class="fas fa-globe text-[8px] shrink-0"></i><span class="truncate">${escHtml(primaryWebsite)}</span></a>` : ''}
            </div>
          </div>
          ${collapsibleDesc(primaryDesc)}
        </div>` : '';

      fieldsEl.innerHTML = primaryBlock;
    }

    // ── Stat mini-cards (right column) ───────────────────────────────────────
    const statsEl = document.getElementById('s-contact-stats');
    if (statsEl) {
      const cards = [
        c.yearsOfExp   ? statCard(c.yearsOfExp,          'yrs experience',    'fas fa-history',   'text-blue-500')   : '',
        c.followers    ? statCard(fmtNum(c.followers),   'LI followers',      'fab fa-linkedin',  'text-blue-600')   : '',
        allSkills.length ? statCard(allSkills.length,    'skills detected',   'fas fa-star',      'text-violet-500') : '',
        (pastPositions.length || formerCos.length)
          ? statCard(pastPositions.length || formerCos.length, 'past roles', 'fas fa-briefcase', 'text-gray-400')   : '',
      ].filter(Boolean);
      statsEl.innerHTML = cards.length
        ? `<div class="grid grid-cols-2 sm:grid-cols-2 gap-1.5 mb-3" style="opacity:0;animation:enrich-appear .4s .15s ease forwards">${cards.join('')}</div>`
        : '';
    }

    // ── Skills + Other active positions ──────────────────────────────────────
    const skillsEl = document.getElementById('s-skills');
    if (skillsEl) {
      let html = '';

      // Other active positions — 2-col grid
      if (otherPositions.length) {
        const cols = otherPositions.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2 gap-2' : 'flex flex-col gap-2';
        html += `<div class="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5 mb-2" style="opacity:0;animation:enrich-appear .4s .2s ease forwards">
          ${secHeader('bg-amber-400', 'text-amber-600', 'Also active at', `${otherPositions.length} other position${otherPositions.length > 1 ? 's' : ''}`)}
          <div class="${cols}">
            ${otherPositions.map(p => {
              const period = p.startTime ? `Since ${p.startTime}` : null;
              return `
              <div class="flex items-start gap-1.5 bg-white/70 rounded-lg p-2 border border-amber-100/60">
                <div class="w-5 h-5 rounded bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span class="text-[8px] font-black text-amber-600">${(p.company || p.title || '?')[0].toUpperCase()}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs text-gray-800 font-semibold leading-tight">${escHtml(p.title || '')}${p.company ? `<span class="text-gray-500 font-normal"> · ${escHtml(p.company)}</span>` : ''}</p>
                  ${p.tenure && p.tenure !== 'No data' ? `<p class="text-[10px] text-gray-500">${escHtml(p.tenure)}</p>` : ''}
                  ${period   ? `<p class="text-[10px] text-gray-400">${escHtml(period)}</p>` : ''}
                  ${collapsibleDesc(p.description)}
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }

      // Previous experiences — cards si données riches, chips 2-col si noms seuls
      const cleanVal = v => (v && v !== 'No data' && v !== 'null' && v !== 'undefined') ? v : null;
      const hasPastDetail = pastPositions.length > 0;
      const pastItems     = hasPastDetail ? pastPositions : formerCos.map(co => ({ company: co }));

      if (pastItems.length) {
        // Vérifie si au moins un item a plus qu'un simple nom de société
        const anyRich = pastItems.some(p =>
          cleanVal(p.title) || cleanVal(p.startTime) || cleanVal(p.endTime) ||
          cleanVal(p.yearsInRole) || cleanVal(p.yearsInCompany) || cleanVal(p.description)
        );

        let pastHtml;
        if (anyRich) {
          // Mode cards — 1 colonne toujours (lisible sur mobile)
          pastHtml = `<div class="grid grid-cols-1 gap-1.5">
            ${pastItems.map(p => {
              const name    = cleanVal(p.company) || cleanVal(p.title) || '?';
              const initial = name[0]?.toUpperCase() || '?';
              const period  = [cleanVal(p.startTime), cleanVal(p.endTime)].filter(Boolean).join(' → ');
              const years   = cleanVal(p.yearsInRole) || cleanVal(p.yearsInCompany);
              const meta    = period || (years ? `${years} in role` : null);
              return `<div class="flex items-start gap-1.5 bg-white rounded-lg border border-gray-100 p-2">
                <div class="w-5 h-5 rounded bg-gray-100 flex items-center justify-center shrink-0 mt-0.5 text-[8px] font-black text-gray-500">${initial}</div>
                <div class="min-w-0 flex-1">
                  ${cleanVal(p.title)   ? `<p class="text-[10px] text-gray-800 font-semibold leading-tight truncate">${escHtml(p.title)}</p>` : ''}
                  ${cleanVal(p.company) ? `<p class="text-[10px] text-gray-500 truncate">${escHtml(p.company)}</p>` : ''}
                  ${meta                ? `<p class="text-[10px] text-gray-400">${escHtml(meta)}</p>` : ''}
                  ${collapsibleDesc(p.description)}
                </div>
              </div>`;
            }).join('')}
          </div>`;
        } else {
          // Mode chips compacts — noms de société uniquement
          pastHtml = `<div class="flex flex-wrap gap-1.5">
            ${pastItems.map(p => {
              const name    = cleanVal(p.company) || cleanVal(p.title) || '?';
              const initial = name[0]?.toUpperCase() || '?';
              return `<span class="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-gray-700">
                <span class="w-4 h-4 rounded bg-gray-100 text-[7px] font-black text-gray-500 flex items-center justify-center shrink-0">${initial}</span>
                ${escHtml(name)}
              </span>`;
            }).join('')}
          </div>`;
        }

        html += `<div class="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 mb-2" style="opacity:0;animation:enrich-appear .4s .25s ease forwards">
          ${secHeader('bg-gray-400', 'text-gray-500', 'Previous experiences', `${pastItems.length}`)}
          ${pastHtml}
        </div>`;
      }

      skillsEl.innerHTML = html;
    }

    // ── Education ─────────────────────────────────────────────────────────────
    const eduEl = document.getElementById('s-edu');
    if (eduEl) {
      let html = '';

      // Education (former companies now shown above in s-skills)
      if (allEdu.length) {
        html += `<div class="rounded-xl bg-green-50 border border-green-100 px-3 py-2.5 mb-2" style="opacity:0;animation:enrich-appear .4s .35s ease forwards">
          ${secHeader('bg-green-400', 'text-green-600', 'Education', `${allEdu.length}`)}
          <div class="flex flex-col gap-1.5">
            ${allEdu.map(e => `
              <div class="flex items-start gap-1.5 bg-white/60 rounded-lg p-1.5">
                <div class="w-5 h-5 rounded bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <i class="fas fa-graduation-cap text-green-500 text-[7px]"></i>
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-gray-800 font-semibold leading-tight">${escHtml(e.school || '')}</p>
                  ${e.field ? `<p class="text-[10px] text-gray-500">${escHtml(e.field)}</p>` : ''}
                  ${e.years ? `<p class="text-[10px] text-gray-400">${escHtml(e.years)}</p>` : ''}
                </div>
              </div>`).join('')}
          </div>
        </div>`;
      }

      eduEl.innerHTML = html;
    }

    // ── Right column: signals + bio + skills (bottom) ────────────────────────
    const extraEl = document.getElementById('s-contact-extra');
    if (extraEl) {
      let html = '';

      // Compact signal rows
      const clean = v => (v && v !== 'No data' && v !== 'null' && v !== 'undefined') ? v : null;
      const sigRow = (icon, iconCls, label, content) =>
        `<div class="flex items-start gap-2 py-1.5 border-b border-gray-100 last:border-0">
          <i class="${icon} ${iconCls} text-[9px] mt-0.5 w-3 shrink-0"></i>
          <div class="min-w-0 flex-1">
            <p class="text-[9px] text-gray-400 uppercase font-bold tracking-wide leading-none mb-0.5">${label}</p>
            <p class="text-xs text-gray-700 leading-snug break-words">${content}</p>
          </div>
        </div>`;

      const sigItems = [
        ex.certifications?.length ? sigRow('fas fa-certificate','text-amber-400','Certifications', escHtml(ex.certifications.join(', '))) : '',
        clean(ex.languages)       ? sigRow('fas fa-language',   'text-gray-400', 'Languages',      escHtml(ex.languages))                 : '',
        clean(ex.twitter)         ? sigRow('fab fa-twitter',    'text-sky-400',  'Twitter / X',    `<a href="https://twitter.com/${escHtml(ex.twitter.replace('@',''))}" target="_blank" class="text-blue-500 hover:underline">${escHtml(ex.twitter)}</a>`) : '',
        clean(ex.website)         ? sigRow('fas fa-globe',      'text-blue-400', 'Website',        `<a href="${escHtml(ex.website.startsWith('http')?ex.website:'https://'+ex.website)}" target="_blank" class="text-blue-500 hover:underline break-all">${escHtml(ex.website)}</a>`) : '',
        clean(ex.gender)          ? sigRow('fas fa-venus-mars', 'text-gray-400', 'Gender',         escHtml(ex.gender))                    : '',
      ].filter(Boolean);

      if (sigItems.length) {
        html += `<div class="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2 mb-2" style="opacity:0;animation:enrich-appear .4s .4s ease forwards">
          ${secHeader('bg-gray-300', 'text-gray-500', 'Signals', null)}
          <div>${sigItems.join('')}</div>
        </div>`;
      }

      if (c.summary) {
        html += `<div class="rounded-xl bg-blue-50 border border-blue-100 px-3 py-2.5 mb-2" style="opacity:0;animation:enrich-appear .4s .45s ease forwards">
          ${secHeader('bg-blue-400', 'text-blue-600', 'LinkedIn Bio', null)}
          <p class="text-xs text-gray-600 leading-relaxed italic line-clamp-4">${escHtml(c.summary)}</p>
        </div>`;
      }

      // Skills — en bas, limité à 8 tags visibles (coupe nette entre tags)
      if (allSkills.length) {
        const VISIBLE = 8;
        const shown  = allSkills.slice(0, VISIBLE);
        const rest   = allSkills.slice(VISIBLE);
        const uid    = 'skills-' + Math.random().toString(36).slice(2,7);
        html += `<div class="rounded-xl bg-violet-50 border border-violet-100 px-3 py-2.5 mt-auto" style="opacity:0;animation:enrich-appear .4s .5s ease forwards">
          ${secHeader('bg-violet-400', 'text-violet-600', 'Skills', `${allSkills.length}`)}
          <div class="flex flex-wrap gap-1">
            ${tags(shown, 'violet')}
            ${rest.length ? `<span id="${uid}-rest" class="contents" style="display:none">${tags(rest, 'violet')}</span>` : ''}
          </div>
          ${rest.length ? `<button onclick="
            var r=document.getElementById('${uid}-rest');
            r.style.display='contents';
            this.style.display='none';
          " class="mt-1.5 text-[10px] font-bold text-violet-500 hover:text-violet-700 cursor-pointer transition-colors">
            <i class='fas fa-chevron-down text-[8px] mr-0.5'></i>+ ${rest.length} more skills
          </button>` : ''}
        </div>`;
      }

      extraEl.innerHTML = html;
    }

    _prefillCompanyFromContact(c);
  }

  /* Pre-populate company tab from contact's job data — shown while firmographic loads */
  function _prefillCompanyFromContact(c) {
    const firmEl = document.getElementById('s-firm');
    if (!firmEl || !firmEl.querySelector('.animate-pulse')) return;
    const basics = [c.company, c.companyDomain ? `@${c.companyDomain}` : null, c.companyWebsite].filter(Boolean);
    if (!basics.length) return;
    firmEl.className = 'mb-2';
    firmEl.innerHTML = `<div class="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 mb-2" style="opacity:0;animation:enrich-appear .4s ease forwards">
      <p class="text-sm font-bold text-gray-800">${escHtml(c.company || '')}</p>
      ${c.companyDomain ? `<p class="text-xs text-gray-500 mt-0.5">@${escHtml(c.companyDomain)}${c.companyWebsite ? ` · ${escHtml(c.companyWebsite)}` : ''}</p>` : ''}
    </div>
    <p class="text-[10px] text-gray-400 text-center py-2 animate-pulse">Loading full company profile…</p>`;
  }

  /* Count non-null fields in company data */
  let companyFieldCount = 0;
  function updateCompanyCount() {
    const el = document.getElementById('s-company-count');
    const tab = document.getElementById('result-tab-company');
    if (el && companyFieldCount > 0) {
      // Badge adapté au fond violet clair (état inactif)
      el.innerHTML = `<span class="bg-violet-200 text-violet-700 text-[9px] font-extrabold rounded-full px-1.5 py-0.5">${companyFieldCount}</span>`;
      // Pulse flash pour attirer l'œil sur le tab
      if (tab && !tab.className.includes('from-violet-500')) {
        tab.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.35)';
        setTimeout(() => { if (tab) tab.style.boxShadow = ''; }, 1600);
      }
    }
  }

  function updateFirmographic(f) {
    const el = document.getElementById('s-firm');
    if (!el) return;
    el.className = 'mb-2';

    // Company header
    const coInitial = (f.name || '?')[0].toUpperCase();
    const coGrads = ['from-violet-500 to-purple-600','from-blue-500 to-indigo-600','from-teal-500 to-green-600'];
    const coGrad  = coGrads[(f.name || '').charCodeAt(0) % coGrads.length];
    const header = `<div class="bg-gradient-to-r from-white via-white to-violet-50/40 border border-gray-200 rounded-2xl p-3 mb-3 shadow-sm" style="opacity:0;animation:enrich-appear .4s ease forwards">
      <div class="flex items-start gap-3">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br ${coGrad} flex items-center justify-center shrink-0 shadow-md">
          <span class="text-white font-black text-sm">${coInitial}</span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="text-gray-900 font-extrabold text-base leading-tight truncate">${escHtml(f.name || '')}</p>
              ${f.slogan ? `<p class="text-[10px] text-gray-500 italic mt-0.5 line-clamp-1">"${escHtml(f.slogan)}"</p>` : ''}
            </div>
            <div class="flex flex-wrap justify-end gap-1 shrink-0">
              ${f.type ? `<span class="text-[9px] font-bold bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5">${escHtml(f.type)}</span>` : ''}
              ${f.linkedInUrl ? `<a href="${escHtml(f.linkedInUrl)}" target="_blank" rel="noopener" class="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5 hover:bg-blue-100 transition-colors"><i class="fab fa-linkedin mr-0.5"></i>LinkedIn</a>` : ''}
              ${f.crunchbaseUrl ? `<a href="${escHtml(f.crunchbaseUrl)}" target="_blank" rel="noopener" class="text-[9px] font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5 hover:bg-orange-100 transition-colors">Crunchbase</a>` : ''}
            </div>
          </div>
          ${f.hq ? `<p class="text-[10px] text-gray-400 mt-1"><i class="fas fa-map-marker-alt mr-0.5"></i>${escHtml(f.hq)}</p>` : ''}
        </div>
      </div>
    </div>`;

    // Stats strip — 4 cards (2 cols on mobile, 4 on sm+)
    const stats = `<div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3" style="opacity:0;animation:enrich-appear .4s .05s ease forwards">
      ${statCard(f.headcount ? fmtNum(f.headcount) : (f.headcountRange || '—'), 'employees', 'fas fa-users', 'text-green-500')}
      ${statCard(f.followers ? fmtNum(f.followers) : '—', 'LI followers', 'fab fa-linkedin', 'text-blue-500')}
      ${statCard(f.numLocations ? `${f.numLocations}` : '—', 'offices', 'fas fa-map-pin', 'text-gray-400')}
      ${statCard(f.foundedYear ? `${f.foundedYear}` : '—', 'founded', 'fas fa-calendar-alt', 'text-amber-500')}
    </div>`;

    // Identity fields — 2-col grid, compact
    const identity = `<div class="rounded-xl bg-violet-50 border border-violet-100 px-3 py-2.5 mb-2" style="opacity:0;animation:enrich-appear .4s .1s ease forwards">
      ${secHeader('bg-violet-500', 'text-violet-600', 'Company Identity', null)}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-1.5">
        ${[
          field('fas fa-industry',       'Industry',    f.industry,     'text-violet-500', 0),
          field('fas fa-globe',          'Website',     f.website,      'text-blue-500',   0),
          field('fas fa-flag',           'Country',     f.country,      'text-gray-400',   0),
          f.phone ? field('fas fa-phone','HQ phone',    f.phone,        'text-gray-400',   0) : '',
          f.countries ? field('fas fa-earth-americas','Presence', f.countries, 'text-gray-400', 0) : '',
          f.hubspotIndustry ? field('fas fa-tag','HubSpot industry', f.hubspotIndustry, 'text-violet-400', 0) : '',
        ].filter(Boolean).join('')}
      </div>
    </div>`;

    // About
    const about = f.description ? `<div class="rounded-xl bg-blue-50 border border-blue-100 px-3 py-2.5 mb-2" style="opacity:0;animation:enrich-appear .4s .15s ease forwards">
      ${secHeader('bg-blue-400', 'text-blue-600', 'About', null)}
      <p class="text-xs text-gray-600 leading-relaxed line-clamp-4">${escHtml(f.description)}</p>
    </div>` : '';

    // Specialties
    const specialties = f.specialties?.length ? `<div class="rounded-xl bg-violet-50 border border-violet-100 px-4 py-4 mb-3" style="opacity:0;animation:enrich-appear .4s .2s ease forwards">
      ${secHeader('bg-violet-500', 'text-violet-600', 'Specialties & Expertise Areas', `${f.specialties.length} areas`)}
      <div class="flex flex-wrap gap-1.5">${tags(f.specialties, 'violet')}</div>
    </div>` : '';

    // Office locations
    const officesHTML = f.locations?.length > 1 ? `<div class="rounded-xl bg-gray-50 border border-gray-200 px-4 py-4 mb-3" style="opacity:0;animation:enrich-appear .4s .25s ease forwards">
      ${secHeader('bg-gray-300', 'text-gray-500', 'Office Locations', `${f.locations.length} offices`)}
      <div class="flex flex-col gap-2">
        ${f.locations.map(l => `
          <div class="flex items-start gap-2">
            <i class="fas fa-map-pin text-[10px] ${l.hq ? 'text-green-500' : 'text-gray-400'} mt-1 shrink-0"></i>
            <div class="min-w-0">
              ${l.description ? `<p class="text-xs text-gray-600 font-semibold leading-none mb-0.5">${escHtml(l.description)}</p>` : ''}
              <p class="text-xs text-gray-500">${escHtml(l.address)}${l.hq ? ' <span class="text-green-600 font-bold">(HQ)</span>' : ''}</p>
            </div>
          </div>`).join('')}
      </div>
    </div>` : '';

    el.innerHTML = header + stats + identity + about + specialties + officesHTML;
    companyFieldCount += 12 + (f.locations?.length || 0);
    updateCompanyCount();
  }

  function updateFunding(fu) {
    const el = document.getElementById('s-fund');
    if (!el) return;
    el.className = 'mb-2';
    let html = '';

    // IPO hero card
    if (fu.ipoStatus === 'public') {
      html += `<div class="rounded-xl bg-green-50 border border-green-200 px-4 py-4 mb-3" style="opacity:0;animation:enrich-appear .4s .25s ease forwards">
        ${secHeader('bg-green-500', 'text-green-600', 'Publicly traded', null)}
        <div class="flex items-center justify-between">
          <div>
            <p class="text-3xl font-black text-gray-900">${escHtml(fu.stockSymbol?.toUpperCase() || '')}</p>
            ${fu.ipoDate ? `<p class="text-xs text-gray-500 mt-0.5">IPO: ${escHtml(fu.ipoDate.slice(0,4))}</p>` : ''}
          </div>
          ${fu.totalUsd ? `<div class="text-right">
            <p class="text-2xl font-black text-amber-600">$${fmtNum(fu.totalUsd)}</p>
            <p class="text-xs text-gray-500">raised before IPO · ${fu.numRounds || '?'} rounds</p>
          </div>` : ''}
        </div>
      </div>`;
    }

    // Funding overview fields
    const fundFields = [
      !fu.ipoStatus && fu.totalUsd ? field('fas fa-dollar-sign', 'Total raised', `$${fmtNum(fu.totalUsd)} across ${fu.numRounds || '?'} rounds`, 'text-amber-500', 0) : '',
      fu.lastRoundType ? field('fas fa-chart-line', 'Last round',
        `${fu.lastRoundType.replace(/_/g,' ').toUpperCase()}${fu.lastRoundUsd ? ' · $' + fmtNum(fu.lastRoundUsd) : ''}${fu.lastRoundDate ? ' (' + fu.lastRoundDate.slice(0,4) + ')' : ''}`,
        'text-amber-500', 0) : '',
      fu.operatingStatus ? field('fas fa-circle-check', 'Operating status', fu.operatingStatus.replace(/_/g,' '), 'text-green-500', 0) : '',
      fu.employeeRange   ? field('fas fa-users',         'Employee range',   fu.employeeRange,   'text-green-500', 0) : '',
      fu.numAcquisitions ? field('fas fa-handshake',     'Acquisitions',     `${fu.numAcquisitions} companies acquired`, 'text-violet-500', 0) : '',
      fu.hqLocation      ? field('fas fa-map-marker-alt','HQ region',        fu.hqLocation,      'text-gray-400',  0) : '',
      fu.contactEmail    ? field('fas fa-envelope',      'Contact email',    fu.contactEmail,    'text-blue-500',  0) : '',
    ].filter(Boolean);
    if (fundFields.length) {
      html += `<div class="grid sm:grid-cols-2 gap-2 mb-3" style="opacity:0;animation:enrich-appear .4s .3s ease forwards">${fundFields.join('')}</div>`;
    }

    // Founders
    if (fu.founders?.length) {
      html += `<div class="rounded-xl bg-blue-50 border border-blue-100 px-4 py-4 mb-3" style="opacity:0;animation:enrich-appear .4s .32s ease forwards">
        ${secHeader('bg-blue-400', 'text-blue-600', 'Founders', `${fu.founders.length} identified`)}
        <div class="flex flex-wrap gap-1.5">${tags(fu.founders, 'blue')}</div>
      </div>`;
    }

    // Categories
    if (fu.categories?.length) {
      html += `<div class="rounded-xl bg-violet-50 border border-violet-100 px-4 py-4 mb-3" style="opacity:0;animation:enrich-appear .4s .34s ease forwards">
        ${secHeader('bg-violet-500', 'text-violet-600', 'Product Categories', `${fu.categories.length} categories`)}
        <div class="flex flex-wrap gap-1.5">${tags(fu.categories, 'violet')}</div>
      </div>`;
    }

    // Company description from Crunchbase (different from LinkedIn's)
    if (fu.description) {
      html += `<div class="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 mb-3" style="opacity:0;animation:enrich-appear .4s .35s ease forwards">
        ${secHeader('bg-gray-300', 'text-gray-500', 'Crunchbase description', null)}
        <p class="text-xs text-gray-600 leading-relaxed italic">${escHtml(fu.description)}</p>
      </div>`;
    }

    // All investors
    if (fu.investors?.length) {
      html += `<div class="rounded-xl bg-amber-50 border border-amber-100 px-4 py-4 mb-3" style="opacity:0;animation:enrich-appear .4s .38s ease forwards">
        ${secHeader('bg-amber-400', 'text-amber-600', 'Notable Investors', `${fu.investors.length} identified`)}
        <div class="flex flex-wrap gap-1.5">${tags(fu.investors, 'amber')}</div>
      </div>`;
    }

    // Crunchbase link
    if (fu.crunchbaseUrl) {
      html += `<div class="text-center mb-3" style="opacity:0;animation:enrich-appear .4s .4s ease forwards">
        <a href="${escHtml(fu.crunchbaseUrl)}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-3 py-1.5 hover:bg-orange-100 transition-colors">
          <i class="fas fa-external-link-alt text-[9px]"></i> View on Crunchbase
        </a>
      </div>`;
    }

    el.innerHTML = html || '';
    companyFieldCount += fundFields.length + (fu.founders?.length || 0) + (fu.investors?.length || 0) + (fu.categories?.length || 0);
    updateCompanyCount();
  }

  function updateTraffic(tr) {
    const el = document.getElementById('s-traffic');
    if (!el) return;
    el.className = 'mb-2';

    // Stats dashboard
    const statsCards = [
      tr.monthlyVisits ? [fmtNum(tr.monthlyVisits), 'visits / month',   'fas fa-chart-bar',      'text-blue-400']  : null,
      tr.globalRank    ? [`#${fmtNum(tr.globalRank)}`, 'global rank',   'fas fa-globe',          'text-blue-400']  : null,
      tr.bounceRate != null ? [`${tr.bounceRate}%`, 'bounce rate',      'fas fa-mouse-pointer',   'text-gray-400']  : null,
      tr.pagesPerVisit != null ? [`${tr.pagesPerVisit}`, 'pages / visit','fas fa-file-alt',       'text-gray-400']  : null,
      tr.avgSessionSec ? [`${Math.floor(tr.avgSessionSec/60)}m ${tr.avgSessionSec%60}s`, 'avg session', 'fas fa-clock', 'text-gray-400'] : null,
    ].filter(Boolean);

    let html = `<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3" style="opacity:0;animation:enrich-appear .4s .4s ease forwards">
      ${statsCards.slice(0, 3).map(([v,l,i,c]) => statCard(v, l, i, c)).join('')}
    </div>`;
    if (statsCards.length > 3) {
      html += `<div class="grid grid-cols-2 gap-2 mb-3" style="opacity:0;animation:enrich-appear .4s .42s ease forwards">
        ${statsCards.slice(3).map(([v,l,i,c]) => statCard(v, l, i, c)).join('')}
      </div>`;
    }

    // Traffic sources breakdown (visual channel bars)
    if (tr.trafficSources?.length) {
      const CHANNEL_COLORS = {
        'Direct':         { bar: 'bg-blue-500',   text: 'text-blue-700'   },
        'Search':         { bar: 'bg-green-500',  text: 'text-green-700'  },
        'Referrals':      { bar: 'bg-violet-500', text: 'text-violet-700' },
        'Social':         { bar: 'bg-pink-500',   text: 'text-pink-700'   },
        'Mail':           { bar: 'bg-amber-500',  text: 'text-amber-700'  },
        'Paid Referrals': { bar: 'bg-orange-500', text: 'text-orange-700' },
      };
      html += `<div class="rounded-xl bg-blue-50 border border-blue-100 px-4 py-4 mb-3" style="opacity:0;animation:enrich-appear .4s .43s ease forwards">
        ${secHeader('bg-blue-400', 'text-blue-600', 'Traffic by Channel', null)}
        <div class="flex flex-col gap-2.5">
          ${tr.trafficSources.map(s => {
            const col = CHANNEL_COLORS[s.channel] || { bar: 'bg-gray-400', text: 'text-gray-600' };
            return `<div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-semibold ${col.text}">${escHtml(s.channel)}</span>
                <span class="text-xs font-black text-gray-700">${s.pct}%</span>
              </div>
              <div class="h-1.5 rounded-full bg-gray-200">
                <div class="h-1.5 rounded-full ${col.bar} transition-all" style="width:${Math.min(s.pct, 100)}%"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }

    // Category rank
    if (tr.categoryRank?.rank) {
      html += `<div class="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 mb-3" style="opacity:0;animation:enrich-appear .4s .44s ease forwards">
        ${secHeader('bg-gray-300', 'text-gray-500', 'Category Ranking', null)}
        <div class="flex items-center gap-3">
          <p class="text-2xl font-black text-gray-900">#${escHtml(String(tr.categoryRank.rank))}</p>
          <p class="text-xs text-gray-500 leading-snug">${escHtml(tr.categoryRank.category || tr.category || '')}</p>
        </div>
      </div>`;
    }

    // SEO keywords table
    if (tr.topKeywords?.length) {
      html += `<div class="rounded-xl bg-gray-50 border border-gray-200 px-4 py-4 mb-3" style="opacity:0;animation:enrich-appear .4s .45s ease forwards">
        ${secHeader('bg-blue-400', 'text-blue-600', 'Top SEO Keywords', `${tr.topKeywords.length} keywords`)}
        <div class="flex flex-col gap-2">
          ${tr.topKeywords.map(k => `
            <div class="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
              <span class="text-sm text-gray-800 font-bold">${escHtml(k.word)}</span>
              <div class="flex items-center gap-4 text-xs">
                <span class="text-gray-500">${fmtNum(k.volume)}<span class="text-gray-400">/mo</span></span>
                <span class="text-amber-600 font-bold">$${k.cpc?.toFixed(2) ?? '–'} CPC</span>
              </div>
            </div>`).join('')}
        </div>
      </div>`;
    }

    el.innerHTML = html;
    companyFieldCount += statsCards.length + (tr.trafficSources?.length || 0) + (tr.topKeywords?.length || 0) + (tr.categoryRank ? 1 : 0);
    updateCompanyCount();
  }

  function updateTechStack(ts) {
    const el = document.getElementById('s-tech');
    if (!el || !ts?.length) return;
    const byCategory = {};
    ts.forEach(t => {
      const cat = t.category || 'Other';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(t.name);
    });
    const catEntries = Object.entries(byCategory).sort((a, b) => b[1].length - a[1].length);
    el.innerHTML = `<div class="rounded-xl bg-teal-50 border border-teal-100 px-4 py-4 mb-3" style="opacity:0;animation:enrich-appear .4s .5s ease forwards">
      ${secHeader('bg-teal-400', 'text-teal-600', 'Tech Stack Detected', `${ts.length} tools`)}
      <div class="flex flex-col gap-3">
        ${catEntries.map(([cat, tools]) => `
          <div>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-1.5">${escHtml(cat)}</p>
            <div class="flex flex-wrap gap-1.5">${tags(tools, 'teal')}</div>
          </div>`).join('')}
      </div>
    </div>`;
    companyFieldCount += ts.length;
    updateCompanyCount();
  }

  /* Replace skeleton sections that never got data (called on 'done') */
  function _clearRemainingSkeletons() {
    // Firmographic skeleton → empty state
    const firmEl = document.getElementById('s-firm');
    if (firmEl?.querySelector('.animate-pulse')) {
      firmEl.innerHTML = `<div class="col-span-2 text-center py-4 text-xs text-gray-400 italic">Company firmographic data unavailable for this domain</div>`;
    }
    // Funding skeleton → empty
    const fundEl = document.getElementById('s-fund');
    if (fundEl?.querySelector('.animate-pulse')) {
      fundEl.innerHTML = '';
    }
    // Traffic skeleton → empty
    const trafficEl = document.getElementById('s-traffic');
    if (trafficEl?.querySelector('.animate-pulse')) {
      trafficEl.innerHTML = '';
    }
  }

  /* ── Main enrichment flow (SSE) ── */
  async function runDemo() {
    // Collect all available identifiers from the unified form
    const email       = (document.getElementById('live-email')?.value || '').trim();
    const linkedinUrl = (document.getElementById('live-linkedin-url')?.value || '').trim();
    const fullName    = (document.getElementById('live-fullname')?.value || '').trim();
    const companyOrDomain = (document.getElementById('live-company-or-domain')?.value || '').trim();

    // Need at least one identifier
    if (!email && !linkedinUrl && !fullName) {
      document.getElementById('live-email')?.focus();
      return;
    }

    // Detect if companyOrDomain looks like a domain (contains a dot, no spaces)
    const looksLikeDomain = companyOrDomain && /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(companyOrDomain.replace(/^https?:\/\//, '').split('/')[0]);

    // Ensure LinkedIn URL has protocol prefix
    const normalizeLinkedinUrl = (u) => {
      if (!u) return u;
      return /^https?:\/\//i.test(u) ? u : 'https://www.' + u.replace(/^www\./, '');
    };
    const normalizedLinkedin = normalizeLinkedinUrl(linkedinUrl);

    // Detect Sales Nav vs profile URL and map to correct API param names
    const isSalesNav = normalizedLinkedin && normalizedLinkedin.includes('/sales/');

    // Build params — use exact API param names from swagger
    const streamParams = {};
    if (email)    streamParams.email = email;
    if (fullName) streamParams.fullName = fullName;
    if (normalizedLinkedin) {
      if (isSalesNav) streamParams.contactLinkedinSalesNavUrl = normalizedLinkedin;
      else            streamParams.contactLinkedinUrl = normalizedLinkedin;
    }
    if (companyOrDomain) {
      if (looksLikeDomain) streamParams.domain = companyOrDomain.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
      else                 streamParams.companyName = companyOrDomain;
    }

    const displayLabel = email || fullName || linkedinUrl || '';

    // Clear company-only output to avoid duplicate IDs (s-firm, s-fund…)
    if (coOutput) { coOutput.innerHTML = ''; coOutput.classList.add('hidden'); }
    document.getElementById('company-layout')?.classList.remove('results-open');

    // Close any previous EventSource still running (prevents race conditions with concurrent searches)
    if (activeEs) { try { activeEs.close(); } catch {} activeEs = null; }

    demoStartTime = Date.now();
    openSplitLayout();
    loading.classList.remove('hidden');
    output.classList.add('hidden');
    output.innerHTML = '';
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin text-xs"></i> Enriching…';
    if (loadTxt) loadTxt.textContent = loadMsgs[0];

    let msgIdx = 0;
    const msgTimer = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadMsgs.length;
      if (loadTxt) loadTxt.textContent = loadMsgs[msgIdx];
    }, 4000);

    let es = null;
    try {
      const tokenRes = await fetch(TOKEN_URL);
      if (tokenRes.status === 429) {
        const body = await tokenRes.json().catch(() => ({}));
        clearInterval(msgTimer);
        loading.classList.add('hidden');
        output.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-bolt text-xs"></i> Enrich now →';
        showError('too_many_requests', { resetAt: body.resetAt || null });
        return;
      }
      if (!tokenRes.ok) throw new Error('token_unavailable');
      const { token } = await tokenRes.json();

      const qs = new URLSearchParams({ ...streamParams, t: token });
      const url = `${STREAM_URL}?${qs}`;
      es = new EventSource(url);
      activeEs = es; // track so next runDemo() call can close it
      companyFieldCount = 0;
      let sseHandled = false; // prevents onerror from double-processing after SSE events

      // Buffer events that arrive before the contact event sets up the DOM
      const buf = {};

      es.addEventListener('contact', e => {
        sseHandled = true;
        const c = JSON.parse(e.data);
        const elapsed = demoStartTime ? ((Date.now() - demoStartTime) / 1000).toFixed(1) : null;
        clearInterval(msgTimer);
        loading.classList.add('hidden');
        output.classList.remove('hidden');
        expandCounter = 0;
        output.innerHTML = buildShell(displayLabel);
        attachResultTabs();
        updateContact(c, streamParams.email || displayLabel, elapsed);
        // Flush buffered events that arrived before contact
        if (buf.firmographic) { updateFirmographic(buf.firmographic); delete buf.firmographic; }
        if (buf.funding)      { updateFunding(buf.funding);           delete buf.funding; }
        if (buf.traffic)      { updateTraffic(buf.traffic);           delete buf.traffic; }
        if (buf.techstack)    { updateTechStack(buf.techstack);       delete buf.techstack; }
        // Log
        logSearch({
          searchType:  detectSearchType(streamParams),
          identifier:  streamParams.email || streamParams.contactLinkedinUrl || streamParams.contactLinkedinSalesNavUrl || streamParams.fullName || '',
          // All input fields
          inputEmail:      streamParams.email                      || '',
          inputLinkedin:   streamParams.contactLinkedinUrl         || '',
          inputSalesNav:   streamParams.contactLinkedinSalesNavUrl || '',
          inputFullName:   streamParams.fullName                   || '',
          inputCompany:    streamParams.companyName                || '',
          inputDomain:     streamParams.domain                     || '',
          inputSiren:      streamParams.sirenSiret                 || '',
          // Result
          found:       true,
          contactName: c.name    || '',
          company:     c.company || '',
          status:      c.status  || 'FOUND',
          elapsed:     elapsed   || '',
          fieldCount:  Object.keys(c).length,
        });
      });

      // name+domain mode: contact not matched but company data may exist
      es.addEventListener('contact_not_matched', e => {
        const { domain, fullName: fn } = JSON.parse(e.data);
        clearInterval(msgTimer);
        loading.classList.add('hidden');
        output.classList.remove('hidden');
        expandCounter = 0;
        output.innerHTML = buildShell(displayLabel, { notMatched: true, fullName: fn, domain });
        attachResultTabs();
        // Flush buffered company data → show company tab
        let hasCompany = false;
        if (buf.firmographic) { updateFirmographic(buf.firmographic); delete buf.firmographic; hasCompany = true; }
        if (buf.funding)      { updateFunding(buf.funding);           delete buf.funding; hasCompany = true; }
        if (buf.traffic)      { updateTraffic(buf.traffic);           delete buf.traffic; hasCompany = true; }
        if (buf.techstack)    { updateTechStack(buf.techstack);       delete buf.techstack; hasCompany = true; }
        // Auto-switch to company tab if we have company data
        if (hasCompany) {
          document.getElementById('result-tab-company')?.click();
        }
        // Log
        logSearch({
          searchType:  detectSearchType(streamParams),
          identifier:  streamParams.email || streamParams.contactLinkedinUrl || streamParams.contactLinkedinSalesNavUrl || streamParams.fullName || '',
          inputEmail:      streamParams.email                      || '',
          inputLinkedin:   streamParams.contactLinkedinUrl         || '',
          inputSalesNav:   streamParams.contactLinkedinSalesNavUrl || '',
          inputFullName:   streamParams.fullName                   || '',
          inputCompany:    streamParams.companyName                || '',
          inputDomain:     streamParams.domain                     || '',
          inputSiren:      streamParams.sirenSiret                 || '',
          found:       false,
          contactName: fn || '',
          company:     '',
          status:      'NOT_MATCHED',
          elapsed:     demoStartTime ? ((Date.now() - demoStartTime) / 1000).toFixed(1) : '',
          fieldCount:  0,
        });
      });

      es.addEventListener('error', e => {
        if (!e.data) return; // connection error, not an SSE error event — handled by onerror
        sseHandled = true;
        const data = JSON.parse(e.data);
        clearInterval(msgTimer);
        es.close();
        // Auto-retry on api_timeout (profile being fetched live, will be cached on 2nd call)
        if (data.error === 'api_timeout' && demoRetryCount < 2) {
          demoRetryCount++;
          loading.classList.remove('hidden');
          if (loadTxt) loadTxt.textContent = 'Profile being fetched live — retrying in 5s…';
          setTimeout(() => runDemo(), 5000);
          return;
        }
        demoRetryCount = 0;
        loading.classList.add('hidden');
        output.classList.remove('hidden');
        showError(data.error || 'unknown_error', data);
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-bolt text-xs"></i> Enrich now →';
        // Log
        logSearch({
          searchType:  detectSearchType(streamParams),
          identifier:  streamParams.email || streamParams.contactLinkedinUrl || streamParams.contactLinkedinSalesNavUrl || streamParams.fullName || '',
          inputEmail:      streamParams.email                      || '',
          inputLinkedin:   streamParams.contactLinkedinUrl         || '',
          inputSalesNav:   streamParams.contactLinkedinSalesNavUrl || '',
          inputFullName:   streamParams.fullName                   || '',
          inputCompany:    streamParams.companyName                || '',
          inputDomain:     streamParams.domain                     || '',
          inputSiren:      streamParams.sirenSiret                 || '',
          found:       false,
          contactName: '',
          company:     '',
          status:      data.error || 'ERROR',
          elapsed:     demoStartTime ? ((Date.now() - demoStartTime) / 1000).toFixed(1) : '',
          fieldCount:  0,
        });
      });

      es.addEventListener('firmographic', e => {
        const d = JSON.parse(e.data);
        if (output.classList.contains('hidden')) { buf.firmographic = d; return; }
        updateFirmographic(d);
      });
      es.addEventListener('funding', e => {
        const d = JSON.parse(e.data);
        if (output.classList.contains('hidden')) { buf.funding = d; return; }
        updateFunding(d);
      });
      es.addEventListener('traffic', e => {
        const d = JSON.parse(e.data);
        if (output.classList.contains('hidden')) { buf.traffic = d; return; }
        updateTraffic(d);
      });
      es.addEventListener('techstack', e => {
        const d = JSON.parse(e.data);
        if (output.classList.contains('hidden')) { buf.techstack = d; return; }
        updateTechStack(d);
      });

      es.addEventListener('done', () => {
        sseHandled = true;
        clearInterval(msgTimer);
        es.close();
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-bolt text-xs"></i> Enrich now →';
        // If no contact event was received, show error
        if (!output.classList.contains('hidden') === false) {
          loading.classList.add('hidden');
          output.classList.remove('hidden');
          showError('contact_not_found');
          return;
        }
        // Clean up remaining skeleton loaders that never got data
        _clearRemainingSkeletons();
      });

      es.onerror = () => {
        if (sseHandled) return; // SSE events already handled this cleanly — don't double-process
        clearInterval(msgTimer);
        es.close();
        const elapsed = demoStartTime ? Date.now() - demoStartTime : 0;
        // If connection dropped before any result and we waited >30s → auto-retry (Vercel timeout)
        if (output.innerHTML === '' && elapsed > 30_000 && demoRetryCount < 2) {
          demoRetryCount++;
          loading.classList.remove('hidden');
          if (loadTxt) loadTxt.textContent = 'Profile being fetched live — retrying…';
          setTimeout(() => runDemo(), 3000);
          return;
        }
        demoRetryCount = 0;
        loading.classList.add('hidden');
        output.classList.remove('hidden');
        if (output.innerHTML === '') {
          showError(elapsed > 30_000 ? 'api_timeout' : 'service_unavailable');
        }
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-bolt text-xs"></i> Enrich now →';
      };

    } catch (err) {
      clearInterval(msgTimer);
      if (es) es.close();
      loading.classList.add('hidden');
      output.classList.remove('hidden');
      showError('service_unavailable');
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-bolt text-xs"></i> Enrich now →';
    }
  }

  btn.addEventListener('click', () => { demoRetryCount = 0; runDemo(); });
  ['live-email', 'live-linkedin-url', 'live-fullname', 'live-company-or-domain'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => { if (e.key === 'Enter') runDemo(); });
  });

  // ── Company-only demo (tab 2) — must be in this IIFE to access TOKEN_URL, updateFirmographic, etc.
  const coBtn     = document.getElementById('demo-enrich-btn');
  const coResults = document.getElementById('demo-results');
  const coLoading = document.getElementById('demo-loading');
  const coLoadTxt = document.getElementById('demo-loading-text');
  const coOutput  = document.getElementById('demo-output');

  function buildCompanyOnlyShell() {
    const skel = `<div class="animate-pulse flex flex-col gap-2">
      <div class="h-4 bg-gray-200 rounded-full w-3/4"></div>
      <div class="h-3 bg-gray-100 rounded-full w-1/2"></div>
      <div class="h-3 bg-gray-100 rounded-full w-2/3"></div>
    </div>`;
    return `<div class="space-y-4">
      <div id="s-firm" class="rounded-2xl bg-gray-50 border border-gray-200 p-5">${skel}</div>
      <div id="s-fund" class="rounded-2xl bg-gray-50 border border-gray-200 p-5">${skel}</div>
      <div id="s-traffic" class="rounded-2xl bg-gray-50 border border-gray-200 p-5">${skel}</div>
      <div id="s-tech"></div>
    </div>`;
  }

  async function runCompanyOnly() {
    const linkedinUrl   = (document.getElementById('co-linkedin-url')?.value   || '').trim();
    const rawDomain     = (document.getElementById('co-domain')?.value          || '').trim();
    const companyNameV  = (document.getElementById('co-company-name')?.value    || '').trim();

    if (!linkedinUrl && !rawDomain && !companyNameV) {
      document.getElementById('co-linkedin-url')?.focus();
      return;
    }

    const cleanDomainVal = rawDomain.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();

    const streamParams = {};
    if (linkedinUrl)    streamParams.companyLinkedinUrl = linkedinUrl;
    if (cleanDomainVal) streamParams.domain             = cleanDomainVal;
    if (companyNameV)   streamParams.companyName        = companyNameV;

    // Clear contact+company output to avoid duplicate IDs (s-firm, s-fund…)
    if (output) { output.innerHTML = ''; output.classList.add('hidden'); }
    closeSplitLayout();

    document.getElementById('company-layout')?.classList.add('results-open');
    coLoading.classList.remove('hidden');
    coOutput.classList.add('hidden');
    coOutput.innerHTML = '';
    coBtn.disabled = true;
    coBtn.innerHTML = '<i class="fas fa-spinner fa-spin text-xs"></i> Enriching…';

    demoStartTime = Date.now();
    let coLogged = false; // log une seule fois par recherche

    function coLogOnce(payload) {
      if (coLogged) return;
      coLogged = true;
      logSearch({
        searchType:    'company',
        identifier:    streamParams.companyLinkedinUrl || streamParams.domain || streamParams.companyName || '',
        inputLinkedin: streamParams.companyLinkedinUrl || '',
        inputDomain:   streamParams.domain             || '',
        inputCompany:  streamParams.companyName        || '',
        elapsed:       demoStartTime ? ((Date.now() - demoStartTime) / 1000).toFixed(1) : '',
        ...payload,
      });
    }

    const coMsgs = ['Querying firmographic data…','Fetching funding signals…','Detecting tech stack…','Pulling traffic metrics…','Almost there…'];
    let msgIdx = 0;
    const msgTimer = setInterval(() => {
      msgIdx = (msgIdx + 1) % coMsgs.length;
      if (coLoadTxt) coLoadTxt.textContent = coMsgs[msgIdx];
    }, 3000);

    let es = null;
    try {
      const tokenRes = await fetch(TOKEN_URL);
      if (tokenRes.status === 429) {
        const body = await tokenRes.json().catch(() => ({}));
        clearInterval(msgTimer);
        coLoading.classList.add('hidden');
        coOutput.classList.remove('hidden');
        coBtn.disabled = false;
        coBtn.innerHTML = '<i class="fas fa-bolt text-xs"></i> Enrich now →';
        showError('too_many_requests', coOutput, { resetAt: body.resetAt || null });
        return;
      }
      if (!tokenRes.ok) throw new Error('token_unavailable');
      const { token } = await tokenRes.json();

      const qs  = new URLSearchParams({ ...streamParams, t: token });
      es = new EventSource(`${STREAM_URL}?${qs}`);

      es.addEventListener('firmographic', e => {
        clearInterval(msgTimer);
        coLoading.classList.add('hidden');
        coOutput.classList.remove('hidden');
        if (!coOutput.innerHTML) coOutput.innerHTML = buildCompanyOnlyShell();
        const f = JSON.parse(e.data);
        updateFirmographic(f);
        coLogOnce({ found: true, contactName: '', company: f.name || '', status: 'FOUND', fieldCount: Object.keys(f).length });
      });
      es.addEventListener('funding', e => {
        if (!coOutput.innerHTML) coOutput.innerHTML = buildCompanyOnlyShell();
        coLoading.classList.add('hidden');
        coOutput.classList.remove('hidden');
        updateFunding(JSON.parse(e.data));
      });
      es.addEventListener('traffic', e => {
        if (!coOutput.innerHTML) coOutput.innerHTML = buildCompanyOnlyShell();
        coLoading.classList.add('hidden');
        coOutput.classList.remove('hidden');
        updateTraffic(JSON.parse(e.data));
      });
      es.addEventListener('techstack', e => {
        if (!coOutput.innerHTML) coOutput.innerHTML = buildCompanyOnlyShell();
        coLoading.classList.add('hidden');
        coOutput.classList.remove('hidden');
        updateTechStack(JSON.parse(e.data));
      });
      es.addEventListener('error', e => {
        clearInterval(msgTimer);
        es.close();
        coLoading.classList.add('hidden');
        coOutput.classList.remove('hidden');
        const msg = e.data ? JSON.parse(e.data)?.error : 'service_unavailable';
        showError(msg, coOutput);
        coBtn.disabled = false;
        coBtn.innerHTML = '<i class="fas fa-bolt text-xs"></i> Enrich now →';
        coLogOnce({ found: false, contactName: '', company: '', status: msg || 'ERROR', fieldCount: 0 });
      });
      es.addEventListener('done', () => {
        clearInterval(msgTimer);
        es.close();
        coLoading.classList.add('hidden');
        _clearRemainingSkeletons();
        if (!coOutput.innerHTML) {
          coOutput.classList.remove('hidden');
          showError('service_unavailable', coOutput);
          coLogOnce({ found: false, contactName: '', company: '', status: 'NOT_FOUND', fieldCount: 0 });
        }
        coBtn.disabled = false;
        coBtn.innerHTML = '<i class="fas fa-bolt text-xs"></i> Enrich now →';
      });
      es.onerror = () => {
        clearInterval(msgTimer);
        es.close();
        coLoading.classList.add('hidden');
        coOutput.classList.remove('hidden');
        if (!coOutput.innerHTML) showError('service_unavailable', coOutput);
        coLogOnce({ found: false, contactName: '', company: '', status: 'SSE_ERROR', fieldCount: 0 });
        coBtn.disabled = false;
        coBtn.innerHTML = '<i class="fas fa-bolt text-xs"></i> Enrich now →';
      };
    } catch {
      clearInterval(msgTimer);
      if (es) es.close();
      coLoading.classList.add('hidden');
      coOutput.classList.remove('hidden');
      showError('service_unavailable', coOutput);
      coLogOnce({ found: false, contactName: '', company: '', status: 'service_unavailable', fieldCount: 0 });
      coBtn.disabled = false;
      coBtn.innerHTML = '<i class="fas fa-bolt text-xs"></i> Enrich now →';
    }
  }

  if (coBtn) {
    coBtn.addEventListener('click', runCompanyOnly);
    ['co-linkedin-url','co-domain','co-company-name'].forEach(id => {
      document.getElementById(id)?.addEventListener('keydown', e => { if (e.key === 'Enter') runCompanyOnly(); });
    });
  }

  // Example buttons for company-only tab
  document.querySelectorAll('.co-example').forEach(el => {
    el.addEventListener('click', () => {
      ['co-linkedin-url','co-domain','co-company-name'].forEach(id => {
        const f = document.getElementById(id); if (f) f.value = '';
      });
      if (el.dataset.linkedin) { const f = document.getElementById('co-linkedin-url'); if (f) f.value = el.dataset.linkedin; }
      if (el.dataset.domain)   { const f = document.getElementById('co-domain');       if (f) f.value = el.dataset.domain; }
      if (el.dataset.name)     { const f = document.getElementById('co-company-name'); if (f) f.value = el.dataset.name; }
      runCompanyOnly();
    });
  });

})();

/* ── Demo type tab switcher (Contact ↔ Company) ── */
(function () {
  const btnContact = document.getElementById('tab-btn-contact');
  const btnCompany = document.getElementById('tab-btn-company');
  const paneContact = document.getElementById('demo-tab-contact');
  const paneCompany = document.getElementById('demo-tab-company');
  if (!btnContact || !btnCompany) return;

  function switchDemo(active) {
    const isContact = active === 'contact';
    paneContact?.classList.toggle('hidden', !isContact);
    paneCompany?.classList.toggle('hidden', isContact);
    btnContact.className = `flex items-center gap-2 text-sm font-extrabold px-6 py-3 rounded-2xl transition-all cursor-pointer ${
      isContact
        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
        : 'bg-white/80 border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 shadow-sm'
    }`;
    btnCompany.className = `flex items-center gap-2 text-sm font-extrabold px-6 py-3 rounded-2xl transition-all cursor-pointer ${
      !isContact
        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200'
        : 'bg-white/80 border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 shadow-sm'
    }`;
  }

  btnContact.addEventListener('click', () => switchDemo('contact'));
  btnCompany.addEventListener('click', () => switchDemo('company'));
})();

/* ── Mini ROI calculator (top of page) ── */
(function () {
  const input  = document.getElementById('crm-size-input-top');
  const result = document.getElementById('crm-calc-result-top');
  if (!input || !result) return;
  input.addEventListener('input', function () {
    const n = parseInt(this.value, 10);
    if (!n || n < 1) { result.textContent = 'enter your number above'; return; }
    const changed   = Math.round(n * 0.25);
    const perMonth  = Math.round(changed / 12);
    result.textContent = `~${changed.toLocaleString('en-US')} contacts changed jobs — that's ~${perMonth.toLocaleString('en-US')} per month going undetected`;
  });
})();

/* ── Hero persona scenario widget ── */
(function () {
  const scenarios = [
    {
      before: '"My SDR just called Marc H. — who left the company 4 months ago. Sequence reply rate: 2%. We have no idea why."',
      after:  'Enrich-CRM detects the job change in 24h. Rep gets an alert with new company + title. Warm intro window captured — before your competitor calls.',
    },
    {
      before: '"A lead filled our form with a Gmail address. Score: 34. No job title, no company size. CMO or intern — genuinely impossible to tell."',
      after:  'In 6 seconds: CMO at CloudScale (Series B, HubSpot user, traffic +22%). Lead score → 87. Sequence auto-personalized to their exact context.',
    },
    {
      before: '"50k contacts. 35% missing job titles. 12% bouncing emails. My scoring model is guessing. CAC climbs every quarter."',
      after:  'Field mapping configured once. Auto-enriches every new record. Bulk CSV for existing contacts. 71% less time on data cleanup.',
    },
  ];

  const tabs      = document.querySelectorAll('.hero-persona-tab');
  const beforeEl  = document.getElementById('hero-scenario-before');
  const afterEl   = document.getElementById('hero-scenario-after');
  if (!beforeEl || !afterEl || !tabs.length) return;

  let current = 0;
  let timer;

  function showScenario(idx) {
    current = idx;
    const s = scenarios[idx];
    [beforeEl, afterEl].forEach(el => { el.style.opacity = '0'; el.style.transition = 'opacity .2s'; });
    setTimeout(() => {
      beforeEl.textContent = s.before;
      afterEl.textContent  = s.after;
      [beforeEl, afterEl].forEach(el => { el.style.transition = 'opacity .35s'; el.style.opacity = '1'; });
    }, 220);
    tabs.forEach((t, i) => {
      t.className = `hero-persona-tab text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
        i === idx ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`;
    });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { clearInterval(timer); showScenario(i); timer = setInterval(rotate, 6000); });
  });

  function rotate() { showScenario((current + 1) % scenarios.length); }
  showScenario(0);
  timer = setInterval(rotate, 6000);
})();

/* ── Demo starts only when user clicks "Enrich now" or an example (no auto-trigger) ── */