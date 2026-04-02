// Page scripts extracted from `en/data-coverage.html`.

// Mobile menu toggle
(function () {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", () => menu.classList.toggle("hidden"));
  }
})();

// Schema / table UX
(function () {
  // Expand / collapse endpoint specs.
  const specsContainer = document.getElementById("enrichment-accordions");
  const specDetails = specsContainer
    ? Array.from(specsContainer.querySelectorAll('details[id^="spec-"]'))
    : [];
  const btnExpandAll = document.querySelector("[data-expand-all]");
  const btnCollapseAll = document.querySelector("[data-collapse-all]");
  const setAll = (open) => specDetails.forEach((d) => (d.open = open));
  if (btnExpandAll) btnExpandAll.addEventListener("click", () => setAll(true));
  if (btnCollapseAll) btnCollapseAll.addEventListener("click", () => setAll(false));

  // Open details on hash navigation.
  const openDetailsForHash = () => {
    const id = (window.location.hash || "").replace("#", "");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const toOpen = [];
    let cursor = el;
    while (cursor) {
      if (cursor.tagName === "DETAILS") toOpen.push(cursor);
      cursor = cursor.parentElement;
    }
    toOpen.reverse().forEach((d) => (d.open = true));
  };
  window.addEventListener("hashchange", () => setTimeout(openDetailsForHash, 0));
  window.addEventListener("DOMContentLoaded", () => setTimeout(openDetailsForHash, 0));

  // Search across output tables (per endpoint).
  const fieldInput = document.getElementById("field-search");
  const fieldClear = document.getElementById("field-search-clear");
  const rows = specsContainer
    ? Array.from(specsContainer.querySelectorAll("[data-field-row]"))
    : [];
  const index = rows.map((row) => ({
    row,
    haystack: (
      (row.getAttribute("data-search") || row.textContent || "") + ""
    ).toLowerCase(),
  }));

  const apply = () => {
    const q = ((fieldInput && fieldInput.value) || "").trim().toLowerCase();
    if (!rows.length) return;

    const matchedSpecs = new Set();
    index.forEach(({ row, haystack }) => {
      const ok = !q || haystack.includes(q);
      row.hidden = !ok;
      if (ok) {
        const spec = row.closest('details[id^="spec-"]');
        if (spec) matchedSpecs.add(spec);
      }
    });

    // When searching, auto-open endpoints with matches.
    if (q) {
      specDetails.forEach((d) => (d.open = matchedSpecs.has(d)));
    }

    // Toggle per-endpoint empty states.
    specDetails.forEach((d) => {
      const empty = d.querySelector("[data-empty-state]");
      if (!empty) return;
      empty.hidden = !q ? true : matchedSpecs.has(d);
    });
  };

  if (fieldInput && rows.length) {
    fieldInput.addEventListener("input", apply);
    fieldInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        fieldInput.value = "";
        apply();
      }
    });
  }
  if (fieldClear && fieldInput) {
    fieldClear.addEventListener("click", () => {
      fieldInput.value = "";
      apply();
      fieldInput.focus();
    });
  }
})();

// Language switcher
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
    const target =
      e && e.target && e.target.value ? e.target.value : currentLang;
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

