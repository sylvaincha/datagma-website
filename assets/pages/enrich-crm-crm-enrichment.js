// Page-specific scripts extracted from `en/enrich-crm-crm-enrichment.html`.

document.addEventListener("DOMContentLoaded", function () {
  // FAQ accordion: toggle based on computed display (works even when answers are visible by default)
  const cards = Array.from(document.querySelectorAll(".bg-gray-50.rounded-xl")).filter(
    (card) => !!card.querySelector(".fa-chevron-down"),
  );
  cards.forEach((card) => {
    const header = card.querySelector(":scope > div:first-child");
    if (!header) return;
    const answer = header.nextElementSibling;
    if (!answer) return;

    const icon = header.querySelector(".fa-chevron-down");
    if (icon) {
      icon.style.transition = "transform 200ms ease";
    }

    const toggle = () => {
      const isOpen = window.getComputedStyle(answer).display !== "none";
      answer.style.display = isOpen ? "none" : "block";
      if (icon) icon.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
      header.setAttribute("aria-expanded", isOpen ? "false" : "true");
    };

    header.setAttribute("role", "button");
    header.setAttribute("tabindex", "0");
    header.setAttribute("aria-expanded", "true");
    header.addEventListener("click", toggle);
    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });
});

