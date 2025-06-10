// --- Gestion du menu burger (ouverture/fermeture) ---
const burgerMenu = document.querySelector(".burger-menu");
const menuOverlay = document.querySelector(".menu-overlay");
const closeMenuBtn = document.querySelector(".close-menu");
const ctaBtn = document.querySelector(".cta-btn");

burgerMenu.addEventListener("click", () => {
  menuOverlay.classList.add("active");
  menuOverlay.setAttribute("aria-hidden", "false");
  ctaBtn.classList.add("hidden");
});

closeMenuBtn.addEventListener("click", () => {
  menuOverlay.classList.remove("active");
  menuOverlay.setAttribute("aria-hidden", "true");
  ctaBtn.classList.remove("hidden");
});

// --- Gestion de la sélection de la langue (opacité 100%) ---
function setupLangueSelection() {
  const langueImages = document.querySelectorAll(".langues-images img");
  if (langueImages.length === 0) return;
  // Sélectionne le premier drapeau (Français) par défaut
  langueImages.forEach(i => i.classList.remove("selected"));
  if (langueImages[0]) langueImages[0].classList.add("selected");
  // Ajout : Compteur de clics sur le drapeau français
  let frClickCount = 0;
  langueImages.forEach((img, idx) => {
    img.addEventListener("click", () => {
      langueImages.forEach(i => i.classList.remove("selected"));
      img.classList.add("selected");
      // Si c'est le drapeau français (premier de la liste)
      if (idx === 0) {
        frClickCount++;
        if (frClickCount === 7) {
          window.location.href = "../mini-space-invader.html";
        }
      } else {
        frClickCount = 0; // reset si on clique sur un autre drapeau
      }
    });
  });
}

// S'assurer que le DOM est prêt ET que le menu est chargé dynamiquement
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupLangueSelection);
} else {
  setupLangueSelection();
}