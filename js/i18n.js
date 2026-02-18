(function () {
  function getQueryLang() {
    const params = new URLSearchParams(window.location.search);
    return params.get("lang");
  }

  function setQueryLang(lng) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lng);
    history.replaceState(null, "", url.toString());
  }

  function updateHtmlLang(lng) {
    document.documentElement.setAttribute("lang", lng);
  }

  function updateHreflangLinks() {
    const base = "./index.html";
    const langs = ["en", "uk", "pl"];
    langs.forEach((lng) => {
      const el = document.querySelector(`link[rel="alternate"][hreflang="${lng}"]`);
      if (el) el.setAttribute("href", `${base}?lang=${lng}`);
    });
  }

  function translatePage() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = i18next.t(key);
      if (value) {
        el.innerHTML = value;
      }
    });
  }

  function setLanguage(lng) {
    i18next.changeLanguage(lng).then(() => {
      localStorage.setItem("lang", lng);
      setQueryLang(lng);
      updateHtmlLang(lng);
      updateHreflangLinks();
      const select = document.getElementById("lang-switch");
      if (select) select.value = lng;
      translatePage();
    });
  }

  const detectorOptions = {
    order: ["querystring", "localStorage", "navigator"],
    lookupQuerystring: "lang",
    caches: ["localStorage"],
  };

  i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init(
      {
        fallbackLng: "en",
        supportedLngs: ["en", "uk", "pl"],
        debug: false,
        backend: {
          loadPath: "./locales/{{lng}}/translation.json",
        },
        detection: detectorOptions,
        interpolation: { escapeValue: false },
      },
      function () {
        const initial =
          getQueryLang() ||
          localStorage.getItem("lang") ||
          (navigator.language || "en").slice(0, 2);
        const normalized = ["en", "uk", "pl"].includes(initial) ? initial : "en";
        updateHtmlLang(normalized);
        updateHreflangLinks();
        translatePage();
        const select = document.getElementById("lang-switch");
        if (select) {
          select.value = normalized;
          select.addEventListener("change", function (e) {
            setLanguage(e.target.value);
          });
        }
      }
    );
})();
