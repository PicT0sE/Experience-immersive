document.addEventListener('DOMContentLoaded', () => {
  const optionButtons = document.querySelectorAll('.option-btn');
  let selectedOption = null;

  // Détection dynamique du numéro de POI (ex: 1, 2, 3a, 3b, ...)
  // On cherche dans l'URL le pattern question-poiX.html
  const match = window.location.pathname.match(/question-poi([0-9a-zA-Z]+)\.html$/);
  const poiKey = match ? match[1] : null;
  const localStorageKey = poiKey ? `poi${poiKey}_valid` : null;
  const reponsePage = poiKey ? `reponse-poi${poiKey}.html` : null;

  optionButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!button.classList.contains('incorrect-answer') && !button.disabled) {
        if (selectedOption) {
          selectedOption.classList.remove('selected');
        }
        button.classList.add('selected');
        selectedOption = button;
        // Validation automatique
        const isCorrect = button.dataset.correct === 'true';
        if (isCorrect) {
          // Débloque la vidéo du POI correspondant
          if (localStorageKey) localStorage.setItem(localStorageKey, 'true');
          button.classList.add('correct-answer');
          optionButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = 'default';
            btn.style.pointerEvents = 'none';
          });
          button.textContent = 'Bonne réponse !';
          button.style.background = 'linear-gradient(to right, var(--btn-gradient-start), var(--btn-gradient-end))';
          button.style.fontFamily = "'Kufam', sans-serif";
          button.style.fontSize = '16px';
          button.style.fontWeight = '700';
          // Lecture du son de validation puis redirection
          const audio = new Audio('../audio/validation.mp3');
          audio.play().catch(() => {
            // Si la lecture échoue (ex: autoplay bloqué), on redirige quand même après 1s
            setTimeout(() => {
              if (reponsePage) window.location.href = reponsePage;
            }, 1000);
          });
          audio.addEventListener('ended', () => {
            if (reponsePage) window.location.href = reponsePage;
          });
        } else {
          // Ajout de l'effet shake sur la question-card 
          const questionCard = document.querySelector('.question-card');
          if (questionCard) {
            if (!document.getElementById('shake-style')) {
              const style = document.createElement('style');
              style.id = 'shake-style';
              style.textContent = `
                @keyframes shake {
                  0% { transform: translateX(0); }
                  20% { transform: translateX(-10px); }
                  40% { transform: translateX(10px); }
                  60% { transform: translateX(-10px); }
                  80% { transform: translateX(10px); }
                  100% { transform: translateX(0); }
                }
                .question-card.shake {
                  animation: shake 0.5s;
                }
              `;
              document.head.appendChild(style);
            }
            questionCard.classList.add('shake');
            setTimeout(() => {
              questionCard.classList.remove('shake');
            }, 500);
          }
          button.classList.add('incorrect-answer');
          button.disabled = true;
          button.style.cursor = 'not-allowed';
          button.style.pointerEvents = 'none';
          button.classList.remove('selected');
          selectedOption = null;
        }
      }
    });
  });
});
