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

// Pricing data — explicit EUR and USD prices per plan/size
const pricingData = {
  crm: {
    small:  { EUR: { monthly:  75, annual:  750 }, USD: { monthly:  90, annual:  900 }, credits: 1700  },
    medium: { EUR: { monthly: 150, annual: 1500 }, USD: { monthly: 190, annual: 1900 }, credits: 4000  },
    large:  { EUR: { monthly: 300, annual: 3000 }, USD: { monthly: 350, annual: 3500 }, credits: 10000 },
  },
  growth: {
    small:  { EUR: { monthly:  29, annual:  290 }, USD: { monthly:  35, annual:  350 }, credits: 1000  },
    medium: { EUR: { monthly:  65, annual:  650 }, USD: { monthly:  75, annual:  750 }, credits: 2500  },
    large:  { EUR: { monthly: 120, annual: 1200 }, USD: { monthly: 150, annual: 1500 }, credits: 5000  },
  },
};

// Kept for modal additional-credits conversion (modal prices are EUR-based)
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
  if (billingToggle) {
    billingToggle.addEventListener("click", function () {
      isAnnual = !isAnnual;
      this.classList.toggle("annual", isAnnual);
      this.classList.toggle("monthly", !isAnnual);
      updateAllPrices();
      updateCreditOptions();
    });
  }

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
  const crmSelect = document.getElementById("crm-select");
  if (crmSelect) crmSelect.addEventListener("change", updateCRM);
  const growthSelect = document.getElementById("growth-select");
  if (growthSelect) growthSelect.addEventListener("change", updateGrowth);

  // Modal functionality
  setupModal();
  setupPrimaryActions();

  // Initial UI sync
  updateAllPrices();
  updateCreditOptions();
  initializeROI();
}

function getSelectedPlanPayload(card) {
  const isHighlighted = card.classList.contains("highlighted");
  const plan = isHighlighted ? "crm" : card.querySelector("#growth-select") ? "growth" : "free";

  if (plan === "free") {
    return { plan, tier: "free", credits: 100, billing: isAnnual ? "annual" : "monthly" };
  }

  const select = card.querySelector("select.plan-selector");
  const tier = select?.value || "small";
  const entry = pricingData[plan]?.[tier];
  const monthlyCredits = entry?.credits || 0;
  const credits = isAnnual ? monthlyCredits * 12 : monthlyCredits;
  return { plan, tier, credits, billing: isAnnual ? "annual" : "monthly" };
}

function setupPrimaryActions() {
  const buttons = document.querySelectorAll(".primary-action");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const card = this.closest(".pricing-card");
      if (!card) {
        window.location.href =
          "https://app.enrich-crm.com/sign-up?utm_source=website&utm_medium=cta&utm_campaign=pricing_en_card";
        return;
      }

      const payload = getSelectedPlanPayload(card);
      const url = new URL("https://app.enrich-crm.com/sign-up");
      url.searchParams.set("utm_source", "website");
      url.searchParams.set("utm_medium", "cta");
      url.searchParams.set("utm_campaign", "pricing_en_card");
      url.searchParams.set("plan", payload.plan);
      url.searchParams.set("tier", payload.tier);
      url.searchParams.set("billing", payload.billing);
      url.searchParams.set("currency", currentCurrency.toLowerCase());
      url.searchParams.set("credits", String(payload.credits));
      window.location.href = url.toString();
    });
  });
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
  if (!selector) return;
  const size = selector.value;
  const data = pricingData[plan][size];

  const priceElement = document.getElementById(`${plan}-price`);
  if (!priceElement) return;

  const currencyData = data[currentCurrency] || data["EUR"];
  const basePrice = isAnnual ? currencyData.annual : currencyData.monthly;
  const currencySymbol = currentCurrency === "EUR" ? "€" : "$";

  priceElement.innerHTML = `<span class="currency">${currencySymbol}</span><span class="price">${formatMoney(basePrice)}</span><span class="per-month">/${isAnnual ? "year" : "month"}</span>`;
}

function updateFreePrice() {
  const priceElement = document.getElementById("free-price");
  if (!priceElement) return;
  const currencySymbol = currentCurrency === "EUR" ? "€" : "$";
  priceElement.innerHTML = `<span class="currency">${currencySymbol}</span><span class="price">0</span><span class="per-month">/${isAnnual ? "year" : "month"}</span>`;
}

function updateCreditOptions() {
  // Update plan selector options
  document.querySelectorAll(".plan-selector option").forEach((option) => {
    const plan = option.closest("select").id.includes("crm") ? "crm" : "growth";
    const size = option.value;
    if (pricingData[plan] && pricingData[plan][size]) {
      const data = pricingData[plan][size];
      const credits = isAnnual ? data.credits * 12 : data.credits;
      const period = isAnnual ? `/${t("year")}` : `/${t("month")}`;
      option.textContent = `${credits.toLocaleString()} ${t("credits")}${period}`;
    }
  });
}

function setupModal() {
  const modal = document.getElementById("addon-credits-modal");
  if (!modal) return;
  const additionalCreditsButtons = document.querySelectorAll(
    ".additional-credits-button",
  );
  const closeModal = document.querySelector(".close-modal");
  if (!closeModal) return;

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
    { package: "5000", credits: 5000, price: 250 },
    { package: "10000", credits: 10000, price: 500 },
    { package: "20000", credits: 20000, price: 950 },
    { package: "30000", credits: 30000, price: 1425 },
    { package: "50000", credits: 50000, price: 2250 },
    { package: "100000", credits: 100000, price: 4000 },
  ],
  growth: [
    { package: "5000", credits: 5000, price: 175 },
    { package: "10000", credits: 10000, price: 350 },
    { package: "20000", credits: 20000, price: 700 },
    { package: "30000", credits: 30000, price: 990 },
    { package: "50000", credits: 50000, price: 1650 },
    { package: "100000", credits: 100000, price: 3000 },
  ],
};

// Update modal content based on plan
function updateModalContent(plan) {
  const tableBody = document.getElementById("credits-table-body");
  if (!tableBody) return;
  const data = creditsData[plan];
  const currencySymbol = currentCurrency === "EUR" ? "€" : "$";

  tableBody.innerHTML = data
    .map((item) => {
      const rate = currencyRates[currentCurrency] || 1;
      const converted = item.price * rate;
      return `
          <tr>
            <td>${item.package} ${t("additionalCreditsSuffix")}</td>
            <td>${item.credits.toLocaleString()}</td>
            <td>${currencySymbol}${formatMoney(converted)}</td>
          </tr>
        `;
    })
    .join("");
}

function getLang() {
  try {
    const langs = ["fr", "en", "de", "nl", "it", "es", "pt"];
    const segments = window.location.pathname.split("/").filter(Boolean);
    const idx = segments.findIndex((s) => langs.includes(s));
    return idx >= 0 ? segments[idx] : "en";
  } catch {
    return "en";
  }
}

function t(key) {
  const lang = getLang();
  const dict = {
    month: {
      en: "month",
      fr: "mois",
      de: "Monat",
      nl: "maand",
      it: "mese",
      es: "mes",
      pt: "mês",
    },
    year: {
      en: "year",
      fr: "an",
      de: "Jahr",
      nl: "jaar",
      it: "anno",
      es: "año",
      pt: "ano",
    },
    credits: {
      en: "credits",
      fr: "crédits",
      de: "Credits",
      nl: "credits",
      it: "crediti",
      es: "créditos",
      pt: "créditos",
    },
    additionalCreditsSuffix: {
      en: "Additional credits",
      fr: "crédits additionnels",
      de: "zusätzliche Credits",
      nl: "extra credits",
      it: "crediti aggiuntivi",
      es: "créditos adicionales",
      pt: "créditos adicionais",
    },
  };
  return (dict[key] && dict[key][lang]) || (dict[key] && dict[key].en) || key;
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
// Language switcher
