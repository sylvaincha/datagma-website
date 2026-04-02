// Datagma site-level JS

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }

  // Language selector
  const selects = document.querySelectorAll("[data-lang-select]");
  selects.forEach((sel) => {
    const current = window.location.pathname.split("/").filter(Boolean)[0];
    const supported = ["fr", "en", "de", "nl", "it", "es", "pt"];
    if (supported.includes(current)) {
      sel.value = current;
    }
    sel.addEventListener("change", (e) => {
      const newLang = e.target.value;
      const parts = window.location.pathname.split("/").filter(Boolean);
      if (supported.includes(parts[0])) {
        parts[0] = newLang;
      } else {
        parts.unshift(newLang);
      }
      window.location.pathname = "/" + parts.join("/");
    });
  });

  // Fade-up animation with IntersectionObserver
  const fadeEls = document.querySelectorAll(".fade-up");
  if ("IntersectionObserver" in window && fadeEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-up--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    fadeEls.forEach((el) => observer.observe(el));
  } else {
    fadeEls.forEach((el) => el.classList.add("fade-up--visible"));
  }
});
