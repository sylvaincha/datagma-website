// Page scripts extracted from `en/enrich-crm-charte-graphique.html`.

(function () {
  const btn = document.getElementById("downloadBtn");
  if (!btn) return;

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const html = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "enrich-crm-brand-guidelines.html";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.setTimeout(() => window.URL.revokeObjectURL(url), 100);
  });
})();

