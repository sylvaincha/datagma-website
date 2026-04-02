function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function splitTags(s) {
  return normalize(s)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function setupSidebar(sidebar) {
  const search = sidebar.querySelector("[data-blog-search]");
  const tagSelect = sidebar.querySelector("[data-blog-tag-filter]");
  const items = Array.from(sidebar.querySelectorAll("[data-blog-item]"));

  function apply() {
    const q = normalize(search?.value || "");
    const tag = normalize(tagSelect?.value || "");

    let visible = 0;
    for (const el of items) {
      const isCurrent = el.getAttribute("data-current") === "true";
      const title = normalize(el.getAttribute("data-title") || "");
      const tags = splitTags(el.getAttribute("data-tags") || "");
      const okQ = !q || title.includes(q) || tags.some((t) => t.includes(q));
      const okTag = !tag || tags.includes(tag);
      const ok = isCurrent || (okQ && okTag);
      el.classList.toggle("hidden", !ok);
      if (ok && !isCurrent) visible++;
    }

    const counter = sidebar.querySelector("[data-blog-count]");
    if (counter) counter.textContent = String(visible);
  }

  if (search) search.addEventListener("input", apply);
  if (tagSelect) tagSelect.addEventListener("change", apply);

  apply();
}

function setupActiveToc(root) {
  // Optional: highlight current section in TOC while scrolling.
  const toc = root.querySelector("[data-blog-toc]");
  if (!toc) return;
  const links = Array.from(toc.querySelectorAll("a[href^='#']"));
  const ids = links
    .map((a) => decodeURIComponent(a.getAttribute("href") || "").slice(1))
    .filter(Boolean);
  if (!ids.length) return;

  const headings = ids
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!headings.length) return;

  const setActive = (id) => {
    for (const a of links) {
      const href = decodeURIComponent(a.getAttribute("href") || "");
      a.classList.toggle("is-active", href === `#${id}`);
      a.setAttribute("aria-current", href === `#${id}` ? "true" : "false");
    }
  };

  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (a.boundingClientRect.top || 0) - (b.boundingClientRect.top || 0));
      const top = visible[0];
      if (!top) return;
      const id = top.target && top.target.id;
      if (id) setActive(id);
    },
    { rootMargin: "-25% 0px -65% 0px", threshold: [0, 1] },
  );

  for (const h of headings) obs.observe(h);
}

document.addEventListener("DOMContentLoaded", () => {
  const sidebars = document.querySelectorAll("[data-blog-sidebar]");
  sidebars.forEach((s) => setupSidebar(s));
  setupActiveToc(document);
});

