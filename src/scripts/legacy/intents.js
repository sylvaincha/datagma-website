// Page scripts for the Buying Intents page (en/intents.html)

// Mobile menu
(function () {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", () => menu.classList.toggle("hidden"));
  }
})();

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Language selector
(function () {
  const selects = Array.from(document.querySelectorAll("[data-lang-select]"));
  if (!selects.length) return;
  const langs = ["fr", "en", "de", "nl", "it", "es", "pt"];
  const url = new URL(window.location.href);
  const segments = url.pathname.split("/").filter(Boolean);
  let file = segments.pop() || "home.html";
  let langIndex = segments.findIndex((s) => langs.includes(s));
  let currentLang = langIndex >= 0 ? segments[langIndex] : "fr";
  selects.forEach((s) => {
    try { s.value = currentLang; } catch (e) {}
  });
  const onChange = (e) => {
    const target = e && e.target && e.target.value ? e.target.value : currentLang;
    const newSegments = segments.slice();
    if (langIndex >= 0) newSegments[langIndex] = target;
    else newSegments.push(target);
    url.pathname = "/" + newSegments.concat([file]).join("/");
    window.location.href = url.toString();
  };
  selects.forEach((s) => s.addEventListener("change", onChange));
})();

// Signup counter: display a realistic random number and slowly increment it
(function () {
  const ids = ["signup-counter", "signup-counter-bottom"];
  const base = Math.floor(Math.random() * 6) + 10; // 10-15
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = base + " teams";
  });

  let count = base;
  setInterval(() => {
    if (Math.random() < 0.15) {
      count++;
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = count + " teams";
      });
    }
  }, 8000);
})();

// Workflow timeline animation: steps light up sequentially when section enters viewport
(function () {
  const section = document.getElementById("workflow-section");
  if (!section) return;

  const steps = Array.from(section.querySelectorAll(".workflow-step"));
  if (!steps.length) return;

  const delays = [0, 800, 1600, 2400];

  function animateSteps() {
    steps.forEach((step, i) => {
      setTimeout(() => {
        step.classList.remove("opacity-30");
        step.classList.add("opacity-100");
      }, delays[i]);
    });
  }

  let animated = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateSteps();
          setInterval(() => {
            steps.forEach((step) => {
              step.classList.add("opacity-30");
              step.classList.remove("opacity-100");
            });
            setTimeout(animateSteps, 400);
          }, 6000);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
})();

// Pipeline calculator: real-time computation as sliders move
(function () {
  const crmInput   = document.getElementById("crm-size");
  const dealInput  = document.getElementById("deal-size");
  const closeInput = document.getElementById("close-rate");

  if (!crmInput || !dealInput || !closeInput) return;

  const crmDisplay   = document.getElementById("crm-size-display");
  const dealDisplay  = document.getElementById("deal-size-display");
  const closeDisplay = document.getElementById("close-rate-display");
  const calcChanges  = document.getElementById("calc-changes");
  const calcIcp      = document.getElementById("calc-icp");
  const calcDeals    = document.getElementById("calc-deals");
  const pipelineEl   = document.getElementById("missed-pipeline");

  // Detect currency: € for European timezones, $ otherwise
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const isEurope = tz.startsWith("Europe/");
  const sym = isEurope ? "€" : "$";

  function fmt(n) {
    return n.toLocaleString("en-US");
  }

  function fmtMoney(n) {
    if (n >= 1000000) return sym + (n / 1000000).toFixed(1) + "M";
    if (n >= 1000)    return sym + Math.round(n / 1000) + "k";
    return sym + n;
  }

  function compute() {
    const crm       = parseInt(crmInput.value, 10);
    const deal      = parseInt(dealInput.value, 10);
    const closeRate = parseInt(closeInput.value, 10) / 100;

    if (crmDisplay)   crmDisplay.textContent  = fmt(crm);
    if (dealDisplay)  dealDisplay.textContent  = sym + fmt(deal);
    if (closeDisplay) closeDisplay.textContent = closeInput.value + "%";

    const changesPerQ = Math.round(crm * 0.25 / 4);
    const icpCount    = Math.round(changesPerQ * 0.30);
    const dealCount   = Math.round(icpCount * closeRate);
    const pipeline    = dealCount * deal;

    if (calcChanges) calcChanges.textContent = fmt(changesPerQ);
    if (calcIcp)     calcIcp.textContent     = fmt(icpCount);
    if (calcDeals)   calcDeals.textContent   = fmt(dealCount);
    if (pipelineEl)  pipelineEl.textContent  = fmtMoney(pipeline);
  }

  crmInput.addEventListener("input", compute);
  dealInput.addEventListener("input", compute);
  closeInput.addEventListener("input", compute);

  compute(); // initial render (also sets correct currency symbol on load)
})();

// Live signals from Rodz API — hero card + activity strip
(function () {
  const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Format timestamp with day context so "22:06" from yesterday isn't confusing
  function localTime(dateStr) {
    const d   = new Date(dateStr);
    const now = new Date();
    const fmt = { timeZone: userTZ };

    // Compare calendar dates in the user's TZ using ISO date string (YYYY-MM-DD)
    const toDate = (dt) => dt.toLocaleDateString('en-CA', fmt); // 'en-CA' → YYYY-MM-DD
    const todayDate = toDate(now);
    const eventDate = toDate(d);

    const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', ...fmt });

    if (eventDate === todayDate) return `Today · ${timeStr}`;

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (eventDate === toDate(yesterday)) return `Yesterday · ${timeStr}`;

    // Older: show short weekday
    const weekday = d.toLocaleDateString('en-GB', { weekday: 'short', ...fmt });
    return `${weekday} · ${timeStr}`;
  }

  // Short city + country
  function shortLocation(loc) {
    if (!loc) return '';
    const parts = loc.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length === 1) return parts[0];
    return parts[0] + ', ' + parts[parts.length - 1];
  }

  function initials(name) {
    return name.split(/[\s\-&]+/).slice(0, 2).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  function buildSignalHTML(signal, type) {
    const time    = localTime(signal.detected_at);
    const loc     = shortLocation(signal.location);
    const isJob   = type === 'job';
    const label   = isJob ? 'Job change' : 'Funding round';
    const pillCls = isJob
      ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
      : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    const avatarCls = isJob
      ? 'bg-rose-900/50 border-rose-700/40 text-rose-300'
      : 'bg-emerald-900/50 border-emerald-700/40 text-emerald-300';
    const av     = initials(signal.company_name);
    // Realistic variation: job changes enrich more person fields (32–42), funding less (28–36)
    const fields = isJob
      ? 32 + Math.floor(Math.random() * 11)   // 32–42
      : 28 + Math.floor(Math.random() * 9);   // 28–36

    return `<div class="flex items-center gap-3 px-4 py-3 border-b border-gray-800/60 transition-colors hover:bg-gray-900/60">
      <div class="w-8 h-8 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 ${avatarCls}">${av}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5 mb-0.5">
          <span class="text-[9px] font-extrabold uppercase tracking-widest border rounded px-1.5 py-0.5 ${pillCls}">${label}</span>
        </div>
        <div class="text-white text-[13px] font-semibold leading-tight truncate">${signal.company_name}</div>
        <div class="text-gray-500 text-[11px] truncate">${loc}</div>
      </div>
      <div class="shrink-0 text-right">
        <div class="font-mono text-[13px] font-bold text-gray-300">${time}</div>
        <div class="text-[10px] text-gray-600 mt-0.5">${fields} fields</div>
      </div>
    </div>`;
  }

  // If all signals share the same batch timestamp (e.g. midnight cron),
  // spread them naturally over the past N hours so timestamps look organic.
  function naturalizeTimestamps(signals, spreadHours = 5) {
    if (signals.length < 2) return signals;
    const times  = signals.map(s => new Date(s.detected_at).getTime());
    const window = Math.max(...times) - Math.min(...times);
    if (window > 15 * 60 * 1000) return signals; // already varied — leave as-is

    const batchTime  = Math.max(...times);
    const spreadMs   = spreadHours * 60 * 60 * 1000;
    // Distribute with deterministic-ish offsets (stable within the same API response)
    return signals.map((s, i) => {
      const step   = spreadMs / (signals.length + 1);
      const jitter = (i % 3) * 4 * 60 * 1000; // 0 / 4 / 8 min jitter
      const offset = step * (i + 1) + jitter;
      return { ...s, detected_at: new Date(batchTime - offset).toISOString() };
    });
  }

  async function loadSignals() {
    try {
      const [jobsRes, fundsRes] = await Promise.all([
        fetch('/api/signals?type=job_changes'),
        fetch('/api/signals?type=fundraising'),
      ]);
      const jobsData  = jobsRes.ok  ? await jobsRes.json()  : {};
      const fundsData = fundsRes.ok ? await fundsRes.json() : {};
      const jobs  = naturalizeTimestamps(jobsData.sample_leads  || []);
      const funds = naturalizeTimestamps(fundsData.sample_leads || []);
      return { jobs, funds };
    } catch { return null; }
  }

  loadSignals().then(data => {
    if (!data) return;
    const { jobs, funds } = data;

    // ── Hero signal card ──────────────────────────────────────────
    const heroCard = document.getElementById('hero-signal-card');
    const list     = document.getElementById('hero-signals-list');

    if (list && (jobs.length >= 2 || funds.length >= 1)) {
      // Update "updated HH:MM" in sub-header
      const updatedEl = document.getElementById('hero-feed-updated');
      if (updatedEl) {
        updatedEl.textContent = 'updated ' + new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit', minute: '2-digit', timeZone: userTZ,
        });
      }

      // Build interleaved pool
      const pool = [];
      const maxLen = Math.max(jobs.length, funds.length);
      for (let i = 0; i < maxLen; i++) {
        if (jobs[i])  pool.push({ type: 'job',  data: jobs[i] });
        if (funds[i]) pool.push({ type: 'fund', data: funds[i] });
      }

      // Clear fallback rows and render first 5 real signals
      list.innerHTML = pool.slice(0, 5).map(s => buildSignalHTML(s.data, s.type)).join('');

      // Cycle: slide new signal in from top, push others down, remove last
      let idx = 5;
      setInterval(() => {
        const s = pool[idx % pool.length];
        const wrapper = document.createElement('div');
        wrapper.innerHTML = buildSignalHTML(s.data, s.type);
        const newNode = wrapper.firstElementChild;

        // 1. Prep new node: positioned above, invisible
        newNode.style.transform    = 'translateY(-60px)';
        newNode.style.opacity      = '0';
        newNode.style.marginBottom = '-60px'; // collapse space while offscreen

        // 2. Fade out the last item simultaneously
        const last = list.lastElementChild;
        if (last) {
          last.style.transition = 'opacity .3s ease';
          last.style.opacity    = '0';
        }

        // 3. Prepend
        list.insertBefore(newNode, list.firstElementChild);

        // 4. Slide new node down into place (double rAF ensures transition fires)
        requestAnimationFrame(() => requestAnimationFrame(() => {
          newNode.style.transition  = 'transform .45s cubic-bezier(.22,.68,0,1.05), opacity .35s ease, margin .45s ease';
          newNode.style.transform   = 'translateY(0)';
          newNode.style.opacity     = '1';
          newNode.style.marginBottom = '0';
        }));

        // 5. Remove last after its fade-out
        setTimeout(() => {
          if (last && last.parentNode === list) list.removeChild(last);
        }, 320);

        idx++;
      }, 4500);
    }

    // ── HubSpot tasks footer — vary count ────────────────────────
    const hubspotEl = document.getElementById('widget-hubspot-tasks');
    if (hubspotEl) {
      const taskCounts = [1, 2, 3, 4, 5, 3, 2, 4];
      const base = taskCounts[Math.floor(Math.random() * taskCounts.length)];
      hubspotEl.textContent = base + ' task' + (base > 1 ? 's' : '') + ' created in HubSpot';
      // Slowly increment every 12s to simulate live activity
      let count = base;
      setInterval(() => {
        if (Math.random() < 0.4) {
          count++;
          hubspotEl.textContent = count + ' tasks created in HubSpot';
        }
      }, 12000);
    }

    // ── Live activity strip ───────────────────────────────────────
    const strip = document.getElementById('live-activity-strip');
    if (strip) {
      const items   = strip.querySelectorAll('.live-signal-item');
      const signals = [
        ...(jobs.slice(0,  2).map(j => ({ type: 'job',  data: j }))),
        ...(funds.slice(0, 1).map(f => ({ type: 'fund', data: f }))),
      ];

      const countEl = document.getElementById('signals-count');
      const total = (jobs.length + funds.length) * Math.floor(Math.random() * 40 + 380);
      if (countEl) countEl.textContent = total.toLocaleString('en-US');

      items.forEach((item, i) => {
        const s = signals[i];
        if (!s) return;
        const avatarEl  = item.querySelector('.signal-avatar');
        const companyEl = item.querySelector('.signal-company');
        const descEl    = item.querySelector('.signal-desc');
        const timeEl    = item.querySelector('.signal-time');
        const resultEl  = item.querySelector('.signal-result');

        if (companyEl) companyEl.textContent = s.data.company_name;
        if (descEl)    descEl.textContent    = ' ' + (s.type === 'job' ? 'job change' : 'funding round') + ' detected';
        if (timeEl)    timeEl.textContent    = localTime(s.data.detected_at);
        if (resultEl)  resultEl.textContent  = s.data.enriched_fields + ' fields enriched';
        if (avatarEl)  avatarEl.textContent  = initials(s.data.company_name);
      });
    }
  });
})();

// Pricing line — adapt currency to user timezone
(function () {
  const el = document.getElementById('hero-pricing-line');
  if (!el) return;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const isEU = /^(Europe|Africa\/Abidjan|Africa\/Accra|Atlantic\/Reykjavik)/.test(tz);
    if (!isEU) {
      el.innerHTML = 'Paid plans from $49/mo &middot; upgrade only when you&rsquo;re ready';
    }
  } catch (e) {}
})();

// Demo wiring for intents page
// Note: auto-trigger is handled by home-v2-scripts.js (sessionStorage-based, fires at 1400ms).
// We only add a capture-phase prefill safeguard in case the user clicks Enrich with empty fields.
(function () {
  setTimeout(function () {
    const enrichBtn = document.getElementById('live-enrich-btn');
    if (!enrichBtn) return;
    enrichBtn.addEventListener('click', function () {
      const email = (document.getElementById('live-email')?.value   || '').trim();
      const li    = (document.getElementById('live-linkedin-url')?.value || '').trim();
      const name  = (document.getElementById('live-fullname')?.value || '').trim();
      if (!email && !li && !name) {
        const f = document.getElementById('live-email');
        if (f) f.value = 'bhalligan@hubspot.com';
      }
    }, true); // capture phase → runs BEFORE home-v2-scripts.js listener
  }, 300);
})();

// Widget footer: vary HubSpot task count + update pricing currency
(function () {
  // HubSpot tasks: pick a realistic number based on the current minute (stable per session)
  const taskOptions = [1, 2, 3, 4, 5, 3, 2, 4];
  const taskCount = taskOptions[new Date().getMinutes() % taskOptions.length];
  const hsEl = document.getElementById('widget-hubspot-tasks');
  if (hsEl) hsEl.textContent = taskCount + ' task' + (taskCount > 1 ? 's' : '') + ' created in HubSpot';

  // Pricing line: € for Europe, $ otherwise
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const isEurope = /^(Europe|Africa\/Abidjan|Africa\/Accra|Atlantic\/Reykjavik)/.test(tz);
  const currency = isEurope ? '€' : '$';
  const priceEl = document.getElementById('hero-pricing-line');
  if (priceEl) priceEl.textContent = `Paid plans from ${currency}49/mo · upgrade only when you're ready`;
})();

// Fade-up scroll animations
(function () {
  const els = Array.from(document.querySelectorAll(".fade-up"));
  if (!els.length || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("opacity-100"));
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    const delay = el.classList.contains("delay-100") ? "0.1s"
                : el.classList.contains("delay-200") ? "0.2s"
                : el.classList.contains("delay-300") ? "0.3s" : "0s";
    el.style.transitionDelay = delay;
    obs.observe(el);
  });
})();
