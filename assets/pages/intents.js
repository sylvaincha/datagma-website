// intents.js — Buying Intents page scripts

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

  const delays = [0, 800, 1600, 2400]; // ms between each step lighting up

  function animateSteps() {
    steps.forEach((step, i) => {
      setTimeout(() => {
        step.classList.remove("opacity-30");
        step.classList.add("opacity-100");
        // Also add a subtle highlight border
        step.style.borderColor = "rgba(255,255,255,0.2)";
        step.style.backgroundColor = "rgba(255,255,255,0.08)";
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
          // Loop: reset and replay every 6s
          setInterval(() => {
            steps.forEach((step) => {
              step.classList.add("opacity-30");
              step.classList.remove("opacity-100");
              step.style.borderColor = "";
              step.style.backgroundColor = "";
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
  const crmInput = document.getElementById("crm-size");
  const dealInput = document.getElementById("deal-size");
  const closeInput = document.getElementById("close-rate");

  if (!crmInput || !dealInput || !closeInput) return;

  const crmDisplay = document.getElementById("crm-size-display");
  const dealDisplay = document.getElementById("deal-size-display");
  const closeDisplay = document.getElementById("close-rate-display");
  const calcChanges = document.getElementById("calc-changes");
  const calcIcp = document.getElementById("calc-icp");
  const calcDeals = document.getElementById("calc-deals");
  const pipelineEl = document.getElementById("missed-pipeline");

  function fmt(n) {
    return n.toLocaleString("en-US");
  }

  function fmtEur(n) {
    if (n >= 1000000) return "€" + (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return "€" + Math.round(n / 1000) + "k";
    return "€" + n;
  }

  function compute() {
    const crm = parseInt(crmInput.value, 10);
    const deal = parseInt(dealInput.value, 10);
    const closeRate = parseInt(closeInput.value, 10) / 100;

    if (crmDisplay) crmDisplay.textContent = fmt(crm);
    if (dealDisplay) dealDisplay.textContent = "€" + fmt(deal);
    if (closeDisplay) closeDisplay.textContent = closeInput.value + "%";

    const changesPerQ = Math.round(crm * 0.25 / 4);
    const icpCount = Math.round(changesPerQ * 0.30);
    const dealCount = Math.round(icpCount * closeRate);
    const pipeline = dealCount * deal;

    if (calcChanges) calcChanges.textContent = fmt(changesPerQ);
    if (calcIcp) calcIcp.textContent = fmt(icpCount);
    if (calcDeals) calcDeals.textContent = fmt(dealCount);
    if (pipelineEl) pipelineEl.textContent = fmtEur(pipeline);
  }

  crmInput.addEventListener("input", compute);
  dealInput.addEventListener("input", compute);
  closeInput.addEventListener("input", compute);

  compute(); // initial render
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
                : el.classList.contains("delay-200") ? "0.2s" : "0s";
    el.style.transitionDelay = delay;
    obs.observe(el);
  });
})();
