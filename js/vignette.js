// js/vignette.js
// Gère l'animation d'entrée (fondu bleu) et la transition de sortie (trou circulaire)

// Ajoute l'overlay de vignette si absent
function createVignetteOverlay() {
    if (document.getElementById('vignette-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'vignette-overlay';
    document.body.appendChild(overlay);
}

// Animation d'entrée : fondu bleu
function playEntryVignette() {
    createVignetteOverlay();
    const overlay = document.getElementById('vignette-overlay');
    overlay.className = 'vignette-entry';
    overlay.style.display = 'block';
    overlay.addEventListener('animationend', () => {
        overlay.style.display = 'none';
    }, { once: true });
}

// Animation de sortie : trou circulaire
function playExitVignetteAndRedirect(url) {
    createVignetteOverlay();
    const overlay = document.getElementById('vignette-overlay');
    overlay.className = 'vignette-exit';
    overlay.style.display = 'block';
    overlay.addEventListener('animationend', () => {
        window.location.href = url;
    }, { once: true });
}

// Lancer automatiquement l'animation d'entrée à l'ouverture de la page
window.addEventListener('DOMContentLoaded', playEntryVignette);

// Pour utiliser la sortie : playExitVignetteAndRedirect('url');
