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
  const cards = document.querySelectorAll('.welcome-card, .info-card, .info2-card');
  const button = document.querySelector('.cta-btn');
  let currentIndex = 0;

  // Fonction pour mettre à jour l'opacité des cartes
  function updateCardOpacity() {
    cards.forEach((card, index) => {
      card.style.opacity = (index === currentIndex) ? 1 : 0.5;
    });
  }

  // Initialisation de l'opacité au chargement de la page
  updateCardOpacity();

  button.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length;
    cards[currentIndex].scrollIntoView({ behavior: 'smooth' });
    updateCardOpacity(); // Mise à jour de l'opacité après le clic
  });
});