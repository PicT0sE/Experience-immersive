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

document.addEventListener('DOMContentLoaded', () => {
  const languesImages = document.querySelectorAll('.langues-images img');
  const defaultSelectedIndex = 0; // Français par défaut

  function updateOpacity(selectedIndex) {
    languesImages.forEach((img, index) => {
      img.style.opacity = (index === selectedIndex) ? '1' : '0.3';
      img.style.cursor = 'pointer';
    });
  }

  // Initialisation : français sélectionné
  updateOpacity(defaultSelectedIndex);

  // Ajout des événements clic
  languesImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      updateOpacity(index);
      // Ici tu peux ajouter du code pour changer la langue de l'app si besoin
      console.log(`Langue sélectionnée : ${img.alt}`);
    });
  });
});