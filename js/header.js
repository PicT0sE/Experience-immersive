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
  langueImages.forEach(img => {
    img.addEventListener("click", () => {
      langueImages.forEach(i => i.classList.remove("selected"));
      img.classList.add("selected");
    });
  });
}

// S'assurer que le DOM est prêt ET que le menu est chargé dynamiquement
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupLangueSelection);
} else {
  setupLangueSelection();
}