// Page scripts extracted from `en/home.html` (EN homepage).

(function () {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", () => menu.classList.toggle("hidden"));
  }
})();

function switchDataTab(index) {
  const buttons = document.querySelectorAll(".data-tab-btn");
  buttons.forEach((btn, i) => {
    const rawDataIndex = btn.getAttribute("data-tab-index");
    let btnIndex = rawDataIndex !== null ? parseInt(rawDataIndex, 10) : NaN;

    if (!Number.isFinite(btnIndex)) {
      const onclick = btn.getAttribute("onclick") || "";
      const match = onclick.match(/switchDataTab\((\d+)\)/);
      btnIndex = match ? parseInt(match[1], 10) : i;
    }

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

(function () {
  const btn = document.querySelector("[data-copy-response]");
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    copyActiveDataTabResponse();
  });
})();

// Reorder: logos -> how it works -> stack -> data depth.
const logos = document.getElementById("logo-carousel");
const howItWorks = document.getElementById("how-it-works-block");
const stack = document.getElementById("stack-section");
const dataDepth = document.getElementById("data-depth-explorer");

if (logos && howItWorks) {
  logos.insertAdjacentElement("afterend", howItWorks);
}
if (howItWorks && stack) {
  howItWorks.insertAdjacentElement("afterend", stack);
} else if (logos && stack) {
  logos.insertAdjacentElement("afterend", stack);
}
if (stack && dataDepth) {
  stack.insertAdjacentElement("afterend", dataDepth);
} else if (howItWorks && dataDepth) {
  howItWorks.insertAdjacentElement("afterend", dataDepth);
} else if (logos && dataDepth) {
  logos.insertAdjacentElement("afterend", dataDepth);
}

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

