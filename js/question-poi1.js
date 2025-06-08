document.addEventListener('DOMContentLoaded', () => {
  const optionButtons = document.querySelectorAll('.option-btn');
  const validateButton = document.querySelector('.validate-btn');
  let selectedOption = null;

  // Fonction pour gérer la sélection d'une option
  optionButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Si l'option n'est pas déjà marquée comme incorrecte (désactivée)
      if (!button.classList.contains('incorrect-answer')) {
        // Désélectionner l'option précédemment sélectionnée
        if (selectedOption) {
          selectedOption.classList.remove('selected');
        }
        // Sélectionner la nouvelle option
        button.classList.add('selected');
        selectedOption = button;
        validateButton.disabled = false; // Activer le bouton de validation
        validateButton.textContent = 'Valider'; // Réinitialiser le texte du bouton
        validateButton.style.background = ''; // Réinitialiser le background du bouton (retour au style CSS par défaut)
      }
    });
  });

  // Gérer le clic sur le bouton "Valider"
  validateButton.addEventListener('click', () => {
    if (selectedOption) {
      const isCorrect = selectedOption.dataset.correct === 'true';

      console.log('Réponse sélectionnée :', selectedOption.textContent);
      console.log('Est correcte :', isCorrect);

      if (isCorrect) {
        // Appliquer le style de bonne réponse à l'option sélectionnée
        selectedOption.classList.add('correct-answer');
        optionButtons.forEach(button => {
          button.disabled = true;
          button.style.cursor = 'default';
          button.style.pointerEvents = 'none';
        });
        validateButton.disabled = true;
        validateButton.textContent = 'Bonne réponse !';
        validateButton.style.background = 'linear-gradient(to right, var(--btn-gradient-start), var(--btn-gradient-end))';
        // Redirection immédiate vers la page de réponse
        window.location.href = 'reponse-poi1.html';
      } else {
        // Réponse mauvaise
        selectedOption.classList.add('incorrect-answer'); // Appliquer le style de mauvaise réponse
        selectedOption.disabled = true; // Désactiver l'option incorrecte spécifiquement
        selectedOption.style.cursor = 'not-allowed';
        selectedOption.style.pointerEvents = 'none'; // Rendre l'élément non cliquable

        validateButton.textContent = 'Réessaie encore'; // Changer le texte du bouton

        // Désélectionner l'option pour que l'utilisateur puisse en choisir une autre
        selectedOption.classList.remove('selected');
        selectedOption = null;
        validateButton.disabled = true; // Désactiver le bouton Valider jusqu'à nouvelle sélection
      }
    } else {
      // Si aucun bouton n'est sélectionné mais que l'utilisateur clique sur Valider
      alert('Veuillez sélectionner une option avant de valider.');
    }
  });

  // Le bouton Valider est désactivé par défaut au chargement de la page
  validateButton.disabled = true;
});