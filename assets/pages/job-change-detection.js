// Page scripts extracted from `en/job-change-detection.html`.

(function () {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", () => menu.classList.toggle("hidden"));
  }
})();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

(function () {
  const prefersReducedMotion = !!(
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const els = Array.from(document.querySelectorAll("[data-rotate-words]"));
  if (!els.length || prefersReducedMotion) return;

  els.forEach((el) => {
    const raw = (el.getAttribute("data-rotate-words") || "").trim();
    const words = raw
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
    if (words.length < 2) return;

    const interval = Number(el.getAttribute("data-rotate-interval")) || 2000;
    const fadeMs = 180;
    let idx = Math.max(0, words.indexOf((el.textContent || "").trim()));

    // Prevent layout shift by reserving width.
    const maxLen = words.reduce((m, w) => Math.max(m, String(w).length), 0);
    el.style.minWidth = `${maxLen}ch`;
    el.style.textAlign = "left";

    setInterval(() => {
      el.classList.add("opacity-0");
      window.setTimeout(() => {
        idx = (idx + 1) % words.length;
        el.textContent = words[idx];
        el.classList.remove("opacity-0");
      }, fadeMs);
    }, interval);
  });
})();

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
    try {
      s.value = currentLang;
    } catch (e) {}
  });
  const onChange = (e) => {
    const target = e && e.target && e.target.value ? e.target.value : currentLang;
    const newSegments = segments.slice();
    if (langIndex >= 0) {
      newSegments[langIndex] = target;
    } else {
      newSegments.push(target);
    }
    const newPath = "/" + newSegments.concat([file]).join("/");
    url.pathname = newPath;
    window.location.href = url.toString();
  };
  selects.forEach((s) => s.addEventListener("change", onChange));
})();

