(() => {
  const version = "2026-06-09";
  const key = "smartrobots_cookie_consent";
  const gaId = window.SMARTROBOTS_GA_MEASUREMENT_ID;

  function readConsent() {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      window.localStorage.setItem(key, JSON.stringify({
        analytics: value,
        version,
        updatedAt: new Date().toISOString()
      }));
    } catch {
      // Consent still applies for this page view even if storage is blocked.
    }
  }

  function loadAnalytics() {
    if (!gaId || window.__smartrobotsGaLoaded) return;
    window.__smartrobotsGaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
    window.gtag('consent', 'update', {
      analytics_storage: 'granted'
    });
    window.gtag('js', new Date());
    window.gtag('config', gaId, { anonymize_ip: true });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
    document.head.appendChild(script);
  }

  function hideBanner(banner) {
    if (banner) banner.hidden = true;
  }

  function showBanner(banner) {
    if (banner) banner.hidden = false;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const banner = document.querySelector('[data-cookie-banner]');
    const consent = readConsent();

    if (consent && consent.version === version) {
      if (consent.analytics === true) loadAnalytics();
      hideBanner(banner);
      return;
    }

    showBanner(banner);

    document.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
      saveConsent(true);
      loadAnalytics();
      hideBanner(banner);
    });

    document.querySelector('[data-cookie-reject]')?.addEventListener('click', () => {
      saveConsent(false);
      hideBanner(banner);
    });
  });
})();
