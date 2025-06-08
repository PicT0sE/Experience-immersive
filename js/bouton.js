document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.info-card-1, .info-card-2, .info-card-3');
  const nextButton = document.querySelector('.cta-btn');
  const prevButton = document.querySelector('.cta-btn-prev');
  let currentIndex = 0;

  function updateCardOpacity() {
    cards.forEach((card, index) => {
      card.style.opacity = (index === currentIndex) ? 1 : 0.5;
    });
  }

  function scrollCardToCenter(card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function updatePrevButton() {
    if (prevButton) {
      prevButton.disabled = currentIndex === 0;
    }
  }

  // Affiche la flèche sur le bouton suivant
  function setButtonContent(isLastCard = false) {
    nextButton.textContent = '';
    const oldArrows = nextButton.querySelectorAll('.btn-arrow');
    oldArrows.forEach(img => img.remove());
    if (isLastCard) {
      // Ajoute le texte à gauche, sans flèche
      const span = document.createElement('span');
      span.textContent = 'Place à la visite';
      span.className = 'cta-btn-label';
      nextButton.appendChild(span);
    } else {
      // Affiche uniquement la flèche
      const newImg = document.createElement('img');
      newImg.src = '../svg/fleche-dir-bas.svg';
      newImg.alt = 'Flèche';
      newImg.className = 'btn-arrow';
      nextButton.appendChild(newImg);
    }
  }

  // Affiche la flèche sur le bouton précédent
  function setPrevButtonContent() {
    prevButton.textContent = '';
    const oldArrows = prevButton.querySelectorAll('.btn-arrow');
    oldArrows.forEach(img => img.remove());
    const newImg = document.createElement('img');
    newImg.src = '../svg/fleche-dir-haut.svg';
    newImg.alt = 'Flèche précédente';
    newImg.className = 'btn-arrow';
    prevButton.appendChild(newImg);
  }

  // Initialisation
  updateCardOpacity();
  updatePrevButton();
  setButtonContent();
  setPrevButtonContent();
  scrollCardToCenter(cards[currentIndex]);

  // Bouton suivant
  nextButton.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      scrollCardToCenter(cards[currentIndex]);
      updateCardOpacity();
      updatePrevButton();
      setButtonContent(currentIndex === cards.length - 1);
    } else {
      window.location.href = 'map.html';
    }
  });

  // Bouton précédent
  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      scrollCardToCenter(cards[currentIndex]);
      updateCardOpacity();
      updatePrevButton();
      setButtonContent(currentIndex === cards.length - 1);
    }
  });

  // Ajout : navigation par clic sur les cartes
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      if (index !== currentIndex) {
        currentIndex = index;
        scrollCardToCenter(cards[currentIndex]);
        updateCardOpacity();
        updatePrevButton();
        setButtonContent(currentIndex === cards.length - 1);
      }
    });
  });

  // --- Scroll spy : active card changes on scroll ---
  function getCardCenterY(card) {
    const rect = card.getBoundingClientRect();
    return rect.top + rect.height / 2;
  }

  function getViewportCenterY() {
    return window.innerHeight / 2;
  }

  function updateActiveCardOnScroll() {
    let minDist = Infinity;
    let newIndex = currentIndex;
    const viewportCenter = getViewportCenterY();
    cards.forEach((card, idx) => {
      const cardCenter = getCardCenterY(card);
      const dist = Math.abs(cardCenter - viewportCenter);
      if (dist < minDist) {
        minDist = dist;
        newIndex = idx;
      }
    });
    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
      updateCardOpacity();
      updatePrevButton();
      setButtonContent(currentIndex === cards.length - 1);
    }
  }

  window.addEventListener('scroll', () => {
    updateActiveCardOnScroll();
  });
});