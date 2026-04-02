const KEY = 'cookieconsent_status';

function getConsent() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}

function saveConsent(analytics) {
  const val = { analytics, ts: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(val));
  document.cookie = `cookieconsent_status=${analytics ? 'all' : 'essential'}; max-age=15552000; path=/; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent('cookieConsent', { detail: val }));
}

function el(id) { return document.getElementById(id); }

function hideBanner() { el('cc-banner')?.setAttribute('hidden', ''); }
function showBanner() { el('cc-banner')?.removeAttribute('hidden'); }
function hideModal() {
  el('cc-modal')?.setAttribute('hidden', '');
  document.body.style.overflow = '';
}
function showModal() {
  el('cc-modal')?.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function prefillToggles() {
  const consent = getConsent();
  const analyticsToggle = el('cc-toggle-analytics');
  if (analyticsToggle) analyticsToggle.checked = consent?.analytics ?? false;
}

document.addEventListener('DOMContentLoaded', () => {
  const consent = getConsent();
  if (!consent) showBanner();

  // Banner buttons
  el('cc-accept-all')?.addEventListener('click', () => {
    saveConsent(true);
    hideBanner();
    hideModal();
  });

  el('cc-reject')?.addEventListener('click', () => {
    saveConsent(false);
    hideBanner();
    hideModal();
  });

  el('cc-manage')?.addEventListener('click', () => {
    prefillToggles();
    showModal();
  });

  // Modal buttons
  el('cc-modal-accept-all')?.addEventListener('click', () => {
    saveConsent(true);
    hideBanner();
    hideModal();
  });

  el('cc-modal-reject')?.addEventListener('click', () => {
    saveConsent(false);
    hideBanner();
    hideModal();
  });

  el('cc-modal-close')?.addEventListener('click', hideModal);
  el('cc-modal-overlay')?.addEventListener('click', hideModal);

  el('cc-save-prefs')?.addEventListener('click', () => {
    const analytics = el('cc-toggle-analytics')?.checked ?? false;
    saveConsent(analytics);
    hideBanner();
    hideModal();
  });

  // "Manage cookies" links/buttons anywhere on the page
  document.querySelectorAll('[data-cc-manage]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      prefillToggles();
      showModal();
    });
  });
});
