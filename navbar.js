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