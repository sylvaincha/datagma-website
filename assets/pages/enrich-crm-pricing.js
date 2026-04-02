// Page scripts extracted from `en/enrich-crm-pricing.html`.

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

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Pricing system functionality
  setupPricingSystem();
});

// Pricing data
const pricingData = {
  crm: {
    small: { monthly: 125, annual: 1250, credits: 1700 },
    medium: { monthly: 250, annual: 2500, credits: 5000 },
    large: { monthly: 500, annual: 5000, credits: 10000 },
  },
  growth: {
    small: { monthly: 37.5, annual: 375, credits: 1000 },
    medium: { monthly: 90, annual: 900, credits: 2500 },
    large: { monthly: 180, annual: 1800, credits: 5000 },
  },
};

// Currency conversion rates (base data is in EUR)
const currencyRates = { EUR: 1, USD: 1.08 };

function formatMoney(amount) {
  const rounded = Math.round(amount * 100) / 100;
  if (Number.isInteger(rounded)) {
    return rounded.toLocaleString();
  }
  return rounded.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
}

// Additional credits data
const additionalCredits = {
  crm: {
    5000: 250,
    10000: 500,
    20000: 950,
    30000: 1425,
    50000: 2250,
    100000: 4000,
  },
  growth: {
    5000: 175,
    10000: 350,
    20000: 700,
    30000: 990,
    50000: 1650,
    100000: 3000,
  },
};

// State management
let currentCurrency = "EUR";
let isAnnual = false;

function setupPricingSystem() {
  // Billing toggle
  const billingToggle = document.getElementById("billing-toggle");
  billingToggle.addEventListener("click", function () {
    isAnnual = !isAnnual;
    this.classList.toggle("annual", isAnnual);
    this.classList.toggle("monthly", !isAnnual);
    updateAllPrices();
    updateCreditOptions();
  });

  // Currency toggle
  document.querySelectorAll(".currency-toggle button").forEach((btn) => {
    btn.addEventListener("click", function () {
      const active = document.querySelector(".currency-toggle .active");
      if (active) active.classList.remove("active");
      this.classList.add("active");
      currentCurrency = (this.dataset.currency || "eur").toUpperCase();
      updateAllPrices();
      updateROICurrency();
      calculateROI();
    });
  });

  // Plan selectors
  document.getElementById("crm-select").addEventListener("change", updateCRM);
  document.getElementById("growth-select").addEventListener("change", updateGrowth);

  // Modal functionality
  setupModal();

  // Initial UI sync
  updateAllPrices();
  updateCreditOptions();
  initializeROI();
}

function updateAllPrices() {
  updateCRM();
  updateGrowth();
  updateFreePrice();
}

function updateCRM() {
  updatePlan("crm");
}

function updateGrowth() {
  updatePlan("growth");
}

function updatePlan(plan) {
  const selector = document.getElementById(`${plan}-select`);
  const size = selector.value;
  const data = pricingData[plan][size];

  const priceElement = document.getElementById(`${plan}-price`);

  let basePrice = isAnnual ? data.annual : data.monthly;
  const rate = currencyRates[currentCurrency] || 1;
  const converted = basePrice * rate;

  // Format prices with correct currency symbol
  const currencySymbol = currentCurrency === "EUR" ? "€" : "$";

  priceElement.innerHTML = `
        <span class="currency">${currencySymbol}</span><span class="price">${formatMoney(converted)}</span><span class="per-month">/${isAnnual ? "year" : "month"}</span>
      `;
}

function updateFreePrice() {
  const priceElement = document.getElementById("free-price");
  if (!priceElement) return;
  const currencySymbol = currentCurrency === "EUR" ? "€" : "$";
  priceElement.innerHTML = `
        <span class="currency">${currencySymbol}</span><span class="price">0</span><span class="per-month">/${isAnnual ? "year" : "month"}</span>
      `;
}

function updateCreditOptions() {
  // Update plan selector options
  document.querySelectorAll(".plan-selector option").forEach((option) => {
    const plan = option.closest("select").id.includes("crm") ? "crm" : "growth";
    const size = option.value;
    if (pricingData[plan] && pricingData[plan][size]) {
      const data = pricingData[plan][size];
      const credits = isAnnual ? data.credits * 12 : data.credits;
      const period = isAnnual ? "/year" : "/month";
      option.textContent = `${credits.toLocaleString()} credits${period}`;
    }
  });
}

function setupModal() {
  const modal = document.getElementById("addon-credits-modal");
  const additionalCreditsButtons = document.querySelectorAll(
    ".additional-credits-button",
  );
  const closeModal = document.querySelector(".close-modal");

  // Open modal function (flex so overlay centers content)
  function openModal() {
    modal.style.display = "flex";
  }

  // Close modal function
  function closeModalFunc() {
    modal.style.display = "none";
  }

  // Event listeners for additional credits buttons
  additionalCreditsButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const plan = this.closest(".pricing-card").classList.contains("highlighted")
        ? "crm"
        : "growth";
      updateModalContent(plan);
      openModal();
    });
  });

  closeModal.addEventListener("click", (e) => {
    e.preventDefault();
    closeModalFunc();
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      closeModalFunc();
    }
  });

  // Close modal on Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.style.display === "flex") {
      closeModalFunc();
    }
  });
}

// Credits data for modal
const creditsData = {
  crm: [
    { package: "5000 Additional credits", credits: 5000, price: 250 },
    { package: "10000 Additional credits", credits: 10000, price: 500 },
    { package: "20000 Additional credits", credits: 20000, price: 950 },
    { package: "30000 Additional credits", credits: 30000, price: 1425 },
    { package: "50000 Additional credits", credits: 50000, price: 2250 },
    { package: "100000 Additional credits", credits: 100000, price: 4000 },
  ],
  growth: [
    { package: "5000 Additional credits", credits: 5000, price: 175 },
    { package: "10000 Additional credits", credits: 10000, price: 350 },
    { package: "20000 Additional credits", credits: 20000, price: 700 },
    { package: "30000 Additional credits", credits: 30000, price: 990 },
    { package: "50000 Additional credits", credits: 50000, price: 1650 },
    { package: "100000 Additional credits", credits: 100000, price: 3000 },
  ],
};

// Update modal content based on plan
function updateModalContent(plan) {
  const tableBody = document.getElementById("credits-table-body");
  const data = creditsData[plan];
  const currencySymbol = currentCurrency === "EUR" ? "€" : "$";

  tableBody.innerHTML = data
    .map((item) => {
      const rate = currencyRates[currentCurrency] || 1;
      const converted = item.price * rate;
      return `
          <tr>
            <td>${item.package}</td>
            <td>${item.credits.toLocaleString()}</td>
            <td>${currencySymbol}${formatMoney(converted)}</td>
          </tr>
        `;
    })
    .join("");
}

// ROI calculator
function initializeROI() {
  const repsInput = document.getElementById("roi-reps");
  const dealInput = document.getElementById("roi-deal");
  const salaryInput = document.getElementById("roi-salary");
  if (!repsInput || !dealInput || !salaryInput) return;
  [repsInput, dealInput, salaryInput].forEach((el) =>
    el.addEventListener("input", calculateROI),
  );
  updateROICurrency();
  calculateROI();
}

function calculateROI() {
  const reps = parseFloat(document.getElementById("roi-reps").value) || 0;
  const deal = parseFloat(document.getElementById("roi-deal").value) || 0;
  const annualGrossSalary =
    parseFloat(document.getElementById("roi-salary").value) || 0;

  // Hypothèses (base EUR)
  const weeksPerYear = 48; // semaines travaillées
  const hoursSavedPerRepPerWeek = 2; // CRM propre
  const closeRateLift = 0.1; // +10% relatif
  const baseCloseRate = 0.2; // 20% base
  const jobChangeLeadsPerRepPerMonth = 2;
  const jobChangeCloseRate = 0.15;
  const trafficKeywordLeadsPerRepPerMonth = 1;
  const trafficKeywordCloseRate = 0.12;

  // Gains CRM propre: temps économisé (utilise salaire annuel + 25% de management pour dériver le coût horaire)
  const managementOverhead = 0.25;
  const workingHoursPerWeek = 40;
  const hourlyCost =
    (annualGrossSalary * (1 + managementOverhead)) /
    (weeksPerYear * workingHoursPerWeek);
  const crmHoursSaved = reps * hoursSavedPerRepPerWeek * weeksPerYear;
  const crmSavingsEUR = crmHoursSaved * hourlyCost;

  // Gains lead scoring: uplift sur closing, approx. basé sur valeur deal et un volume implicite d'opportunités
  // On approxime un nombre d'opportunités/an par rep comme 12 (1/mois)
  const oppsPerRepPerYear = 12;
  const revenueBaseEUR = reps * oppsPerRepPerYear * deal * baseCloseRate;
  const revenueUpliftEUR = revenueBaseEUR * closeRateLift;

  // Gains job changes: leads/mois * reps * 12 * taux de closing * valeur deal
  const jobChangeRevenueEUR =
    reps * jobChangeLeadsPerRepPerMonth * 12 * jobChangeCloseRate * deal;

  // Gains traffic + keywords
  const trafficKeywordRevenueEUR =
    reps * trafficKeywordLeadsPerRepPerMonth * 12 * trafficKeywordCloseRate * deal;

  const totalEUR =
    crmSavingsEUR + revenueUpliftEUR + jobChangeRevenueEUR + trafficKeywordRevenueEUR;

  const rate = currencyRates[currentCurrency] || 1;
  const symbol = currentCurrency === "EUR" ? "€" : "$";

  // Sortie totale
  const outTotal = document.getElementById("roi-total");
  const outSymbol = document.getElementById("roi-symbol");
  if (outSymbol) outSymbol.textContent = symbol;
  if (outTotal) outTotal.textContent = formatMoney(totalEUR * rate);

  // Détails
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = `${symbol}${formatMoney(val * rate)}`;
  };
  setVal("roi-clean-crm", crmSavingsEUR);
  setVal("roi-lead-scoring", revenueUpliftEUR);
  setVal("roi-job-changes", jobChangeRevenueEUR);
  setVal("roi-traffic-keywords", trafficKeywordRevenueEUR);
}

function updateROICurrency() {
  const symbol = currentCurrency === "EUR" ? "€" : "$";
  const el = document.getElementById("roi-symbol");
  if (el) el.textContent = symbol;
}

// Mobile menu toggle
(function () {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", function () {
      menu.classList.toggle("hidden");
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

