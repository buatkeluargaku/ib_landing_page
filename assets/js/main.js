const supportedLangs = ['en', 'id', 'zh', 'es', 'ja', 'ko'];
const elements = document.querySelectorAll("[data-i18n]");
const resultParagraph = document.getElementById("result");

// Fungsi: Deteksi dan pilih bahasa awal
function detectLanguage() {
  const savedLang = localStorage.getItem("lang");
  if (savedLang && supportedLangs.includes(savedLang)) {
    return savedLang;
  }

  const browserLang = navigator.language.slice(0, 2);
  return supportedLangs.includes(browserLang) ? browserLang : "en";
}

// Fungsi: Muat file bahasa JSON
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
      updateResultPrefix(data);
      localStorage.setItem("lang", lang); // Simpan bahasa agar konsisten kunjungan berikutnya
    })
    .catch(error => console.error("Error loading language:", error));
}

// Fungsi: Update placeholder input
function updatePlaceholders(data) {
  document.getElementById('capital').placeholder = data['placeholder_capital'] || 'Example: 100';
  document.getElementById('risk').placeholder = data['placeholder_risk'] || 'Example: 1';
  document.getElementById('sl').placeholder = data['placeholder_sl'] || 'Example: 15';
}

// Fungsi: Update label "Result:"
function updateResultPrefix(data) {
  const resultKey = data['result_text'] || 'Result: ';
  resultParagraph.setAttribute("data-result-prefix", resultKey);
  resultParagraph.textContent = resultKey;
}

// Saat DOM sudah siap
document.addEventListener("DOMContentLoaded", () => {
  const lang = detectLanguage();
  loadLanguage(lang);

  // Kalkulator lot
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
        resultParagraph.textContent = resultParagraph.getAttribute("data-result-prefix") + "Please enter valid numeric values!";
        return;
      }

      const lot = ((capital / 100) * risk) / (sl * 10);
      const rounded = lot.toFixed(2);

      const resultPrefix = resultParagraph.getAttribute("data-result-prefix") || "Result: ";
      resultParagraph.textContent = `${resultPrefix} ${rounded} lot`;
    });
  }
});
