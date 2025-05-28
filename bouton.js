document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.welcome-card, .info-card, .info2-card');
  const button = document.querySelector('.cta-btn');
  let currentIndex = 0;

  function updateCardOpacity() {
    cards.forEach((card, index) => {
      card.style.opacity = (index === currentIndex) ? 1 : 0.5;
    });
  }

  updateCardOpacity();

  button.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      cards[currentIndex].scrollIntoView({ behavior: 'smooth' });
      updateCardOpacity();

      if (currentIndex === 1) {
        // Après le 1er clic (on est sur la 2e carte)
        button.textContent = 'Compris (2/3) ';
        const newImg = document.createElement('img');
        newImg.src = 'svg/flèche btn bas.svg'; // chemin vers la nouvelle image
        newImg.alt = 'Flèche';
        newImg.className = 'btn-arrow';
        button.appendChild(newImg);

      } else if (currentIndex === cards.length - 1) {
        // Dernière carte
        button.textContent = 'Place à la visite 3/3 ';
        const newImg = document.createElement('img');
        newImg.src = 'svg/Flèche Bouton.svg'; // chemin vers la nouvelle image
        newImg.alt = 'Flèche';
        newImg.className = 'btn-arrow';
        button.appendChild(newImg);
      }
    } else {
      // Après la dernière carte, redirection
      window.location.href = 'map.html';
    }
  });
});