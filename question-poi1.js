document.addEventListener('DOMContentLoaded', () => {
  const optionButtons = document.querySelectorAll('.option-btn');
  const validateButton = document.querySelector('.validate-btn');
  let selectedOption = null;

  // Fonction pour gérer la sélection d'une option
  optionButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Désélectionner l'option précédemment sélectionnée
      if (selectedOption) {
        selectedOption.classList.remove('selected');
      }
      // Sélectionner la nouvelle option
      button.classList.add('selected');
      selectedOption = button;
      validateButton.disabled = false; // Activer le bouton de validation une fois une option sélectionnée
      validateButton.textContent = 'Valider'; // Réinitialiser le texte du bouton si on change de sélection après un mauvais essai
      // Si une mauvaise réponse a été donnée et que l'utilisateur sélectionne une nouvelle option,
      // on remet le background par défaut si nécessaire (pas de dégradé orange)
      validateButton.style.background = ''; // Remettre le background par défaut (via CSS)
    });
  });

  // Gérer le clic sur le bouton "Valider"
  validateButton.addEventListener('click', () => {
    if (selectedOption) {
      const isCorrect = selectedOption.dataset.correct === 'true';

      console.log('Réponse sélectionnée :', selectedOption.textContent);
      console.log('Est correcte :', isCorrect);

      if (isCorrect) {
        // Désactiver tous les boutons d'option et le bouton Valider
        optionButtons.forEach(button => {
          button.disabled = true;
        });
        validateButton.disabled = true;

        // Changer le texte du bouton de validation
        validateButton.textContent = 'Bonne réponse !';
        // Changer le background du bouton de validation en dégradé orange
        validateButton.style.background = 'linear-gradient(to right, var(--btn-gradient-start), var(--btn-gradient-end))';

        // Petite pause avant la redirection
        setTimeout(() => {
          window.location.href = 'reponse-poi1.html'; // Redirection vers la page vidéos
        }, 1500); // Redirige après 1.5 secondes
      } else {
        // Réponse mauvaise
        // alert('Mauvaise réponse.'); // Cette ligne est supprimée
        validateButton.textContent = 'Réessaie encore'; // Changer le texte du bouton
        // Le bouton reste activé et les options aussi pour permettre un nouvel essai
        validateButton.disabled = false; // S'assurer qu'il est activé
      }
    } else {
      alert('Veuillez sélectionner une option avant de valider.');
    }
  });

  // Le bouton Valider est désactivé par défaut au chargement de la page
  validateButton.disabled = true;
});