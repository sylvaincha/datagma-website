// Page scripts extracted from `en/home.html` (EN homepage).

function switchDataTab(index) {
  const buttons = document.querySelectorAll(".data-tab-btn");
  buttons.forEach((btn, i) => {
    const rawDataIndex = btn.getAttribute("data-tab-index");
    const btnIndex = rawDataIndex !== null ? parseInt(rawDataIndex, 10) : i;

    if (btnIndex === index) {
      btn.classList.add("bg-white", "shadow-sm", "border", "border-gray-200", "text-gray-900");
      btn.classList.remove("text-gray-600", "hover:bg-gray-100", "hover:text-gray-900");
    } else {
      btn.classList.remove("bg-white", "shadow-sm", "border", "border-gray-200", "text-gray-900");
      btn.classList.add("text-gray-600", "hover:bg-gray-100", "hover:text-gray-900");
    }
  });

  const contents = document.querySelectorAll(".data-tab-content");
  contents.forEach((content, i) => {
    const rawDataIndex = content.getAttribute("data-tab-index");
    const contentIndex = rawDataIndex !== null ? parseInt(rawDataIndex, 10) : i;
    const isActive = contentIndex === index;

    if (isActive) {
      content.classList.remove("hidden");
      content.classList.add("block");
    } else {
      content.classList.add("hidden");
      content.classList.remove("block");
    }
  });
}

function copyActiveDataTabResponse() {
  const activePre = document.querySelector(".data-tab-content:not(.hidden) pre");
  const text = activePre ? activePre.innerText : "";
  if (!text) return;

  const copyBtn = document.querySelector(".data-tab-copy-btn");
  const icon = copyBtn ? copyBtn.querySelector("i") : null;
  const prevTitle = (copyBtn && copyBtn.getAttribute("title")) || "Copy";

  let feedbackTimerId = null;
  const setCopiedFeedback = (ok) => {
    if (!copyBtn) return;
    copyBtn.setAttribute("title", ok ? "Copied" : "Copy failed");
    if (icon) {
      icon.classList.remove("fa-copy");
      icon.classList.add("fa-check");
    }
    if (feedbackTimerId) window.clearTimeout(feedbackTimerId);
    feedbackTimerId = window.setTimeout(() => {
      copyBtn.setAttribute("title", prevTitle);
      if (icon) {
        icon.classList.remove("fa-check");
        icon.classList.add("fa-copy");
      }
    }, 1200);
  };

  if (navigator.clipboard && window.isSecureContext) {
    // Give immediate UI feedback (clipboard can be async / blocked).
    setCopiedFeedback(true);
    navigator.clipboard
      .writeText(text)
      .then(() => setCopiedFeedback(true))
      .catch(() => {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try {
          const ok = document.execCommand("copy");
          setCopiedFeedback(!!ok);
        } finally {
          document.body.removeChild(ta);
        }
      });
    return;
  }

  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } finally {
    document.body.removeChild(ta);
  }
  setCopiedFeedback(!!ok);
}

// Expose functions for inline HTML handlers (legacy markup uses onclick="switchDataTab(x)")
// because this file is loaded as an ES module in Astro.
window.switchDataTab = switchDataTab;
window.copyActiveDataTabResponse = copyActiveDataTabResponse;

// Also bind events (works even if inline handlers are removed later).
window.addEventListener("DOMContentLoaded", () => {
  const buttons = Array.from(document.querySelectorAll(".data-tab-btn"));
  buttons.forEach((btn) => {
    if (btn.__enrichBound) return;
    btn.__enrichBound = true;
    btn.addEventListener("click", () => {
      const raw = btn.getAttribute("data-tab-index");
      const idx = raw !== null ? parseInt(raw, 10) : NaN;
      if (Number.isFinite(idx)) switchDataTab(idx);
    });
  });

  const copyBtn = document.querySelector(".data-tab-copy-btn");
  if (copyBtn && !copyBtn.__enrichBound) {
    copyBtn.__enrichBound = true;
    copyBtn.addEventListener("click", copyActiveDataTabResponse);
  }

  // Ensure a sane initial state (some legacy HTML has a default "block" panel).
  // Prefer the first visible panel index; fallback to 0.
  const visible = document.querySelector(".data-tab-content:not(.hidden)");
  const idxAttr = visible ? visible.getAttribute("data-tab-index") : null;
  const initial = idxAttr ? parseInt(idxAttr, 10) : 0;
  if (Number.isFinite(initial)) {
    switchDataTab(initial);
  }
});

