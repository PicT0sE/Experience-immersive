document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.welcome-card, .info-card, .info2-card');
  const button = document.querySelector('.cta-btn');
  const buttonImage = button.querySelector('img');
  let currentIndex = 0;

  function updateCardOpacity() {
    cards.forEach((card, index) => {
      card.style.opacity = (index === currentIndex) ? 1 : 0.5;
    });
  }

  updateCardOpacity();

  button.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      // Tant qu'on n'a pas atteint la dernière carte, on fait défiler
      currentIndex++;
      cards[currentIndex].scrollIntoView({ behavior: 'smooth' });
      updateCardOpacity();

      // Si on vient d'atteindre la dernière carte, on change le bouton
      if (currentIndex === cards.length - 1) {
        button.textContent = 'Place à la visite ';
        const newImg = document.createElement('img');
        newImg.src = 'svg/Flèche Bouton.svg'; // chemin vers la nouvelle image
        newImg.alt = 'Flèche';
        newImg.className = 'btn-arrow';
        button.appendChild(newImg);
      }
    } else {
      // À partir du 2e clic (après la dernière carte), redirection vers une nouvelle page
      window.location.href = 'map.html'; // remplace par l'URL souhaitée
    }
  });
});
