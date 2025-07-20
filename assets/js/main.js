const defaultLang = navigator.language.slice(0, 2);
const select = document.getElementById("languageSelect");
const elements = document.querySelectorAll("[data-i18n]");
const resultParagraph = document.getElementById("result");

// Fungsi memuat data bahasa
function loadLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then(res => res.ok ? res.json() : {})
    .then(data => {
      elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (data[key]) {
          el.innerText = data[key];
        }
      });
      updatePlaceholders(data);
      updateResultPrefix(data); // Tambahan agar "Hasil: " juga diganti saat bahasa berubah
    })
    .catch(error => console.error("Fetch error for language file:", error));
}

// Fungsi mengambil bahasa tersimpan
function getSavedLang() {
  return localStorage.getItem("lang") || defaultLang || "en";
}

// Fungsi memperbarui placeholder input
function updatePlaceholders(data) {
  document.getElementById('capital').placeholder = data['placeholder_capital'] || 'Example: 100';
  document.getElementById('risk').placeholder = data['placeholder_risk'] || 'Example: 1';
  document.getElementById('sl').placeholder = data['placeholder_sl'] || 'Example: 15';
}

// Fungsi memperbarui label hasil
function updateResultPrefix(data) {
  const resultKey = data['result_text'] || 'Result: ';
  resultParagraph.setAttribute("data-result-prefix", resultKey);
  resultParagraph.textContent = resultKey;
}

// Event listener untuk select bahasa
if (select) {
  select.addEventListener("change", () => {
    const selectedLang = select.value;
    localStorage.setItem("lang", selectedLang);
    loadLanguage(selectedLang);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Inisialisasi bahasa
  const savedLang = getSavedLang();
  if (select) select.value = savedLang;
  loadLanguage(savedLang);

  // --- Kalkulator Lot ---
  const calculateButton = document.getElementById("calculateBtn");
  const capitalInput = document.getElementById("capital");
  const riskInput = document.getElementById("risk");
  const slInput = document.getElementById("sl");

  if (calculateButton) {
    calculateButton.addEventListener("click", () => {
      const capital = parseFloat(capitalInput.value);
      const risk = parseFloat(riskInput.value);
      const sl = parseFloat(slInput.value);

      if (isNaN(capital) || isNaN(risk) || isNaN(sl) || capital <= 0 || risk <= 0 || sl <= 0) {
        resultParagraph.textContent = "Result: Please enter valid numeric values!";
        return;
      }

      const lot = ((capital / 100) * risk) / (sl * 10);
      const rounded = lot.toFixed(2);

      const resultPrefix = resultParagraph.getAttribute("data-result-prefix") || "Result: ";
      resultParagraph.textContent = `${resultPrefix} ${rounded} lot`;
    });
  }
});
