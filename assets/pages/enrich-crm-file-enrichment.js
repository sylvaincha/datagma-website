// Page scripts extracted from `en/enrich-crm-file-enrichment.html`.

(function () {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", () => menu.classList.toggle("hidden"));
  }
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

