document.addEventListener('DOMContentLoaded', () => {
  const optionButtons = document.querySelectorAll('.option-btn');
  const validateButton = document.querySelector('.validate-btn');
  let selectedOption = null;

  // Fonction pour gérer la sélection d'une option
  optionButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!button.classList.contains('incorrect-answer')) {
        if (selectedOption) {
          selectedOption.classList.remove('selected');
        }
        button.classList.add('selected');
        selectedOption = button;
        validateButton.disabled = false;
        validateButton.textContent = 'Valider';
        validateButton.style.background = '';
      }
    });
  });

  validateButton.addEventListener('click', () => {
    if (selectedOption) {
      const isCorrect = selectedOption.dataset.correct === 'true';
      if (isCorrect) {
        selectedOption.classList.add('correct-answer');
        optionButtons.forEach(button => {
          button.disabled = true;
          button.style.cursor = 'default';
          button.style.pointerEvents = 'none';
        });
        validateButton.disabled = true;
        validateButton.textContent = 'Bonne réponse !';
        validateButton.style.background = 'linear-gradient(to right, var(--btn-gradient-start), var(--btn-gradient-end))';
        setTimeout(() => {
          window.location.href = 'reponse-poi6.html';
        }, 2000); // Redirection après 2 secondes
      } else {
        selectedOption.classList.add('incorrect-answer');
        selectedOption.disabled = true;
        selectedOption.style.cursor = 'not-allowed';
        selectedOption.style.pointerEvents = 'none';
        validateButton.textContent = 'Réessaie encore';
        selectedOption.classList.remove('selected');
        selectedOption = null;
        validateButton.disabled = true;
      }
    } else {
      alert('Veuillez sélectionner une option avant de valider.');
    }
  });

  validateButton.disabled = true;
});
