const defaultLang = navigator.language.slice(0, 2);
const select = document.getElementById("languageSelect");
const elements = document.querySelectorAll("[data-i18n]");

// Fungsi untuk memuat data bahasa
function loadLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then((res) => {
      // Pastikan respons OK sebelum parsing JSON
      if (!res.ok) {
        console.error(`Error loading language file: ${res.statusText}`);
        return {}; // Mengembalikan objek kosong jika ada error
      }
      return res.json();
    })
    .then((data) => {
      elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (data[key]) {
          el.innerText = data[key];
        }
      });
      // Setelah bahasa dimuat, perbarui juga placeholder jika ada
      updatePlaceholders(data);
    })
    .catch(error => console.error("Fetch error for language file:", error));
}

// Fungsi untuk mendapatkan bahasa yang tersimpan
function getSavedLang() {
  return localStorage.getItem("lang") || defaultLang || "en";
}

// Fungsi untuk memperbarui placeholder input berdasarkan bahasa
function updatePlaceholders(langData) {
    document.getElementById('capital').placeholder = langData['placeholder_capital'] || 'Contoh: 100';
    document.getElementById('risk').placeholder = langData['placeholder_risk'] || 'Contoh: 1';
    document.getElementById('sl').placeholder = langData['placeholder_sl'] || 'Contoh: 15';
}


// Event listener untuk perubahan bahasa
// Pastikan elemen select ada sebelum menambahkan listener
if (select) {
    select.addEventListener("change", () => {
        const selectedLang = select.value;
        localStorage.setItem("lang", selectedLang);
        loadLanguage(selectedLang);
    });
}


// Ketika DOM sudah sepenuhnya dimuat
document.addEventListener("DOMContentLoaded", () => {
  // Inisialisasi fitur bahasa
  const savedLang = getSavedLang();
  // Pastikan elemen select ada sebelum menggunakannya
  if (select) {
      select.value = savedLang;
  }
  loadLanguage(savedLang); // Muat bahasa awal

  // --- Bagian Kalkulator Lot ---
  const calculateButton = document.getElementById("calculateBtn");
  const resultParagraph = document.getElementById("result");
  const capitalInput = document.getElementById("capital");
  const riskInput = document.getElementById("risk");
  const slInput = document.getElementById("sl");

  // Tambahkan event listener untuk tombol hitung
  // Pastikan hanya satu listener yang ditambahkan dengan memanggilnya di DOMContentLoaded
  if (calculateButton) {
      calculateButton.addEventListener("click", () => {
          const capital = parseFloat(capitalInput.value);
          const risk = parseFloat(riskInput.value);
          const sl = parseFloat(slInput.value);

          // Cek validasi input
          if (isNaN(capital) || isNaN(risk) || isNaN(sl) || capital <= 0 || risk <= 0 || sl <= 0) {
              resultParagraph.textContent = "Hasil: Masukkan semua nilai numerik yang valid!"; // Pesan error yang lebih jelas
              return;
          }

          const lot = ((capital / 100) * risk) / (sl * 10);
          const rounded = lot.toFixed(2);

          // Ambil teks "Hasil:" dari elemen data-i18n
          let resultPrefix = "Hasil: ";
          const resultTextElement = document.querySelector("[data-i18n='result_text']");
          if (resultTextElement && resultTextElement.innerText.trim() !== "") {
              resultPrefix = resultTextElement.innerText;
          }

          resultParagraph.textContent = resultPrefix + rounded + " lot";
      });
  }
});