// Latitude, Longitude, Zoom de BASE sur la map
// Initialisation de la carte Leaflet centrée sur une position de base
// On ne centre plus ici, le centrage sera fait dynamiquement plus bas
const map = L.map('map');

// Désactive toutes les interactions utilisateur (déplacement, zoom, etc.)
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();
if (map.tap) map.tap.disable();
map.zoomControl.remove();

// Ajoute le fond de carte OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 21,
}).addTo(map);

// Utilise l'API de géolocalisation du navigateur pour centrer la carte sur la position de l'utilisateur
navigator.geolocation.getCurrentPosition(success, erreur);

// Fonction appelée si la géolocalisation réussit
function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // On n'effectue plus de centrage ici, on affiche juste le marqueur utilisateur
    // L.marker([latitude, longitude], { icon: customIcon }).addTo(map); // sert a rien
}

// Fonction appelée si la géolocalisation échoue
function erreur(err) {
    switch (err.code) {
        case err.PERMISSION_DENIED:
            alert("Permission refusée. Vérifiez les paramètres de votre navigateur.");
            break;
        case err.POSITION_UNAVAILABLE:
            alert("Position indisponible. Essayez depuis un autre appareil ou réseau.");
            break;
        case err.TIMEOUT:
            alert("La localisation a pris trop de temps.");
            break;
        default:
            alert("Erreur inconnue.");
    }
}

// Affiche une image personnalisée comme fond de carte (plan du Fort Napoléon)
// Les coordonnées définissent les coins sud-ouest et nord-est de l'image
const imageBounds = [[43.093000,5.891740], [43.095499, 5.895184]]; // [sud-ouest, nord-est]
const imageOverlay = L.imageOverlay('../img/Fort-Napoléon-Carte.jpg', imageBounds, { opacity: 1}).addTo(map);

/* Ajout : Masquer le fond de carte Leaflet (OpenStreetMap) pour n'afficher que l'image Fort-Napoléon-Carte.jpg */
const style = document.createElement('style');
style.innerHTML = `
  .leaflet-tile-pane {
    display: none !important;
  }
`;
document.head.appendChild(style);

/* Ajout : Fond blanc pour la carte */
const styleBg = document.createElement('style');
styleBg.innerHTML = `
  #map {
    background: #fff !important;
  }
`;
document.head.appendChild(styleBg);

// --- Gestion de l'étape du parcours ---
let etape = parseInt(localStorage.getItem('etape') || '1'); // 1 par défaut

// --- Définition des POI avec leurs icônes dynamiques ---
const pois = [
    {
        id: 'poi1',
        name: 'POI 1',
        coords: [43.094023, 5.8939384],
        icons: {
            neutre: '../svg/pin-poi-1.svg',
            suivant: '../gif/pin-poi-1-suivant.gif',
            valide: '../svg/pin-poi-1-valide.svg'
        }
    },
    {
        id: 'poi2',
        name: 'POI 2',
        coords: [43.094578, 5.894156],
        icons: {
            neutre: '../svg/pin-poi-2.svg',
            suivant: '../gif/pin-poi-2-suivant.gif',
            valide: '../svg/pin-poi-2-valide.svg'
        }
    },
    {
        id: 'poi3a',
        name: 'POI 3a',
        coords: [43.094631, 5.893479],
        icons: {
            neutre: '../svg/pin-poi-3a.svg',
            suivant: '../gif/pin-poi-3a-suivant.gif',
            valide: '../svg/pin-poi-3a-valide.svg'
        }
    },
    {
        id: 'poi3b',
        name: 'POI 3b',
        coords: [43.094851, 5.893623],
        icons: {
            neutre: '../svg/pin-poi-3b.svg',
            suivant: '../gif/pin-poi-3b-suivant.gif',
            valide: '../svg/pin-poi-3b-valide.svg'
        }
    },
    {
        id: 'poi4',
        name: 'POI 4',
        coords: [43.094843, 5.892855],
        icons: {
            neutre: '../svg/pin-poi-4.svg',
            suivant: '../gif/pin-poi-4-suivant.gif',
            valide: '../svg/pin-poi-4-valide.svg'
        }
    },
    {
        id: 'poi5',
        name: 'POI 5',
        coords: [43.094441, 5.892704],
        icons: {
            neutre: '../svg/pin-poi-5.svg',
            suivant: '../gif/pin-poi-5-suivant.gif',
            valide: '../svg/pin-poi-5-valide.svg'
        }
    },
    {
        id: 'poi6',
        name: 'POI 6',
        coords: [43.093985, 5.892913],
        icons: {
            neutre: '../svg/pin-poi-6.svg',
            suivant: '../gif/pin-poi-6-suivant.gif',
            valide: '../svg/pin-poi-6-valide.svg'
        }
    }
];

// --- Centrage dynamique de la carte selon l'étape ou la progression du parcours ---
(function() {
    // Détermine le premier POI non validé
    const order = [
        'poi1_valid',
        'poi2_valid',
        'poi3a_valid',
        'poi3b_valid',
        'poi4_valid',
        'poi5_valid',
        'poi6_valid'
    ];
    let nextPoiIndex = order.findIndex(key => localStorage.getItem(key) !== 'true');
    if (nextPoiIndex === -1) nextPoiIndex = pois.length; // tous validés

    // Correction : après validation du POI 4, on centre bien entre le POI 4 (dernier validé) et le POI 5 (prochain à faire)
    if (nextPoiIndex === 0) {
        // Aucun POI validé, on centre sur le premier
        map.setView(pois[0].coords, 19);
        map.panBy([0, -window.innerHeight * 0.18]);
    } else if (nextPoiIndex > 0 && nextPoiIndex < pois.length) {
        // Cas particulier : après validation du POI 4, nextPoiIndex = 5, donc prev = 4, curr = 5
        const prev = pois[nextPoiIndex - 1].coords;
        const curr = pois[nextPoiIndex].coords;
        const lat = ((prev[0] + curr[0]) / 2);
        const lng = (prev[1] + curr[1]) / 2;
        map.setView([lat, lng], 19);
        map.panBy([0, -window.innerHeight * 0.18]);
    } else if (nextPoiIndex === pois.length) {
        // Tous les POI sont validés : laisse la carte là où elle est (ne recentre pas)
        // Pas d'appel à setView/panBy
    }
})();

// --- Affichage dynamique des pins ---
function getPoiIcon(poi, iconType, reduced = false) {
    const size = reduced ? 87.5 : 175;
    return L.icon({
        iconUrl: poi.icons[iconType],
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2]
    });
}

let reducedIcons = [
    'poi1_valid', 'poi2_valid', 'poi3a_valid', 'poi3b_valid', 'poi4_valid', 'poi5_valid', 'poi6_valid'
].every(key => localStorage.getItem(key) === 'true');

pois.forEach((poi, i) => {
    let iconType = 'neutre';
    if (i === 0 && localStorage.getItem('poi1_valid') === 'true') iconType = 'valide';
    else if (i === 1 && localStorage.getItem('poi2_valid') === 'true') iconType = 'valide';
    else if (i === 2 && localStorage.getItem('poi3a_valid') === 'true') iconType = 'valide';
    else if (i === 3 && localStorage.getItem('poi3b_valid') === 'true') iconType = 'valide';
    else if (i === 4 && localStorage.getItem('poi4_valid') === 'true') iconType = 'valide';
    else if (i === 5 && localStorage.getItem('poi5_valid') === 'true') iconType = 'valide';
    else if (i === 6 && localStorage.getItem('poi6_valid') === 'true') iconType = 'valide';
    else {
        const order = [
            'poi1_valid', 'poi2_valid', 'poi3a_valid', 'poi3b_valid', 'poi4_valid', 'poi5_valid', 'poi6_valid'
        ];
        for (let j = 0; j < order.length; j++) {
            if (localStorage.getItem(order[j]) !== 'true') {
                if (i === j) iconType = 'suivant';
                break;
            }
        }
    }
    const icon = getPoiIcon(poi, iconType, reducedIcons);
    L.marker(poi.coords, { icon }).addTo(map);
});

// --- Affichage de la position utilisateur avec taille dynamique ---
let userMarker = null; // Référence globale au marqueur utilisateur
function addUserMarker(userLat, userLng, reduced = false) {
    const size = reduced ? 75 : 150;
    const userIcon = L.icon({
        iconUrl: '../svg/user-position.svg',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2]
    });
    // Supprime l'ancien marqueur si présent
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
}

// --- Fonction pour centrer sur la vue finale ---
function centerOnFinalView() {
    map.setView([43.094306056316866, 5.8934325276797215], 18);
}

// --- Détection de proximité et redirection automatique ---
if (!window.location.search.includes('emulateGPS')) {
  navigator.geolocation.watchPosition(function(position) {
      if (localStorage.getItem('poi6_valid') === 'true') {
          centerOnFinalView();
          return;
      }
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      window.lastUserLat = userLat;
      window.lastUserLng = userLng;
      // Affiche la position de l'utilisateur avec taille dynamique
      addUserMarker(userLat, userLng, reducedIcons);
      // Vérifie la proximité avec le POI de l'étape
      const poi = pois[etape - 1];
      const dist = getDistance(userLat, userLng, poi.coords[0], poi.coords[1]);
      // Empêche la redirection si le POI a déjà été validé
      if (dist < 3) {
          const questionPages = [
              'question-poi1.html',
              'question-poi2.html',
              'question-poi3a.html',
              'question-poi3b.html',
              'question-poi4.html',
              'question-poi5.html',
              'question-poi6.html'
          ];
          const validKeys = [
              'poi1_valid',
              'poi2_valid',
              'poi3a_valid',
              'poi3b_valid',
              'poi4_valid',
              'poi5_valid',
              'poi6_valid'
          ];
          if (localStorage.getItem(validKeys[etape-1]) !== 'true') {
              const pinId = pois[etape-1].id.replace('poi','');
              shakePinAndRedirect(pinId, questionPages[etape-1], '../audio/validation.mp3');
              return;
          }
      }
      // Détermination dynamique de l'étape à valider (le premier POI non validé)
      const order = [
          'poi1_valid',
          'poi2_valid',
          'poi3a_valid',
          'poi3b_valid',
          'poi4_valid',
          'poi5_valid',
          'poi6_valid'
      ];
      let nextPoiIndex = order.findIndex(key => localStorage.getItem(key) !== 'true');
      if (nextPoiIndex === -1) nextPoiIndex = pois.length - 1; // tous validés, sécurité
      const nextPoi = pois[nextPoiIndex];
      const nextDist = getDistance(userLat, userLng, nextPoi.coords[0], nextPoi.coords[1]);
      if (nextDist < 10 && nextPoiIndex < pois.length - 1) {
          const questionPages = [
              'question-poi1.html',
              'question-poi2.html',
              'question-poi3a.html',
              'question-poi3b.html',
              'question-poi4.html',
              'question-poi5.html',
              'question-poi6.html'
          ];
          const pinId = nextPoi.id.replace('poi', '');
          shakePinAndRedirect(pinId, questionPages[nextPoiIndex], '../audio/validation.mp3');
      } else if (nextDist < 10 && nextPoiIndex === pois.length - 1 && localStorage.getItem('poi6_valid') !== 'true') {
          const pinId = nextPoi.id.replace('poi', '');
          shakePinAndRedirect(pinId, 'question-poi6.html', '../audio/validation.mp3');
      } else if (nextDist < 10 && nextPoiIndex === pois.length - 1 && localStorage.getItem('poi6_valid') === 'true') {
          map.setView([43.094526056316866, 5.8933725276797215], 18);
      }
  }, erreur, { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
}

// Quand la page de réponse d'un POI est atteinte, on marque l'étape comme validée
if (window.location.pathname.includes('reponse-poi1.html')) {
    if (parseInt(localStorage.getItem('etape')) === 1) {
        localStorage.setItem('etape', '2');
    }
}
if (window.location.pathname.includes('reponse-poi2.html')) {
    if (parseInt(localStorage.getItem('etape')) === 2) {
        localStorage.setItem('etape', '3');
    }
}
if (window.location.pathname.includes('reponse-poi3a.html')) {
    if (parseInt(localStorage.getItem('etape')) === 3) {
        localStorage.setItem('etape', '4');
    }
}
if (window.location.pathname.includes('reponse-poi3b.html')) {
    if (parseInt(localStorage.getItem('etape')) === 4) {
        localStorage.setItem('etape', '5');
    }
}
if (window.location.pathname.includes('reponse-poi4.html')) {
    if (parseInt(localStorage.getItem('etape')) === 5) {
        localStorage.setItem('etape', '6');
    }
}
if (window.location.pathname.includes('reponse-poi5.html')) {
    if (parseInt(localStorage.getItem('etape')) === 6) {
        localStorage.setItem('etape', '7');
    }
}
if (window.location.pathname.includes('reponse-poi6.html')) {
    if (parseInt(localStorage.getItem('etape')) === 7) {
        localStorage.setItem('etape', '8');
    }
}

// Icône personnalisée pour la position utilisateur (corrige l'erreur customIcon)
const customIcon = L.icon({
    iconUrl: '../svg/user-position.svg',
    iconSize: [150, 150],
    iconAnchor: [75, 75], // centre de l'icône utilisateur
    popupAnchor: [0, -75]
});

// Ajout d'un style pour forcer le z-index du marqueur utilisateur au-dessus des POI
const userMarkerStyle = document.createElement('style');
userMarkerStyle.innerHTML = `
  /* Sélecteur spécifique pour le user-position.svg */
  .leaflet-marker-icon[src*="user-position.svg"] {
    z-index: 4000 !important;
  }
`;
document.head.appendChild(userMarkerStyle);

// --- Fonction de calcul de distance (Haversine) ---
function getDistance(lat1, lng1, lat2, lng2) {
    function toRad(x) { return x * Math.PI / 180; }
    const R = 6371e3; // rayon de la Terre en mètres
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Masquer le bouton "suivant" si le POI 6 est validé
window.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('poi6_valid') === 'true') {
    const btnContainer = document.querySelector('.suivant-btn-container');
    if (btnContainer) btnContainer.style.display = 'none';
  }
  // Affichage du bouton de réinitialisation si tous les POI sont validés
  const allPoiValid = [
    'poi1_valid', 'poi2_valid', 'poi3a_valid', 'poi3b_valid', 'poi4_valid', 'poi5_valid', 'poi6_valid'
  ].every(key => localStorage.getItem(key) === 'true');
  const resetBtnContainer = document.querySelector('.reset-btn-container');
  if (allPoiValid && resetBtnContainer) {
    resetBtnContainer.style.display = 'flex';
  }
  // Action de réinitialisation
  const resetBtn = document.querySelector('.reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (confirm('Voulez-vous vraiment réinitialiser votre progression ? Cette action est irréversible.')) {
        [
          'poi1_valid', 'poi2_valid', 'poi3a_valid', 'poi3b_valid', 'poi4_valid', 'poi5_valid', 'poi6_valid', 'etape'
        ].forEach(key => localStorage.removeItem(key));
        // Les icônes reprendront leur taille normale au rechargement de la page
        location.reload();
      }
    });
  }
});

// Fonction shakePinAndRedirect
function shakePinAndRedirect(poiId, redirectUrl, soundUrl) {
  // Sélectionne le marker correspondant au pin-poi-X-suivant.svg
  const markerImg = Array.from(document.querySelectorAll('img.leaflet-marker-icon')).find(img => img.src.includes(`pin-poi-${poiId}-suivant.gif`));
  if (markerImg) {
    // Remplace temporairement le SVG par le GIF animé
    const originalSrc = markerImg.src;
    // Gestion du nom du GIF (cas particulier pour le 6)
    let gifName;
    if (poiId === '1') gifName = 'pin-poi-1-suivant-animation.gif';
    else if (poiId === '2') gifName = 'pin-poi-2-suivant-animation.gif';
    else if (poiId === '3a') gifName = 'pin-poi-3a-suivant-animation.gif';
    else if (poiId === '3b') gifName = 'pin-poi-3b-suivant-animation.gif';
    else if (poiId === '4') gifName = 'pin-poi-4-suivant-animation.gif';
    else if (poiId === '5') gifName = 'pin-poi-5-suivant-animation.gif';
    else if (poiId === '6') gifName = 'pin-poi-6-suivant-animation.gif';
    else gifName = `pin-poi-${poiId}-suivant-animation.gif`;
    markerImg.src = `../gif/${gifName}`;
    markerImg.offsetHeight; // force reflow
    if (soundUrl) {
      const audio = new Audio(soundUrl);
      audio.play();
    }
    setTimeout(() => {
      markerImg.src = originalSrc;
      playExitVignetteAndRedirect(redirectUrl);
    }, 3000);
  } else {
    playExitVignetteAndRedirect(redirectUrl);
  }
}

// Animation d'entrée : simple fondu
window.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('vignette-overlay');
  if (overlay) {
    setTimeout(() => {
      overlay.classList.add('hide');
      overlay.addEventListener('transitionend', function() {
        overlay.parentNode.removeChild(overlay);
      });
    }, 200); // petit délai pour éviter un flash
  }
});

// Fonction pour lancer l'animation de sortie (trou circulaire)
function playExitVignetteAndRedirect(url) {
  let overlay = document.getElementById('vignette-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'vignette-overlay';
    document.body.appendChild(overlay);
  }
  overlay.className = 'hole';
  overlay.style.opacity = 1;
  overlay.addEventListener('animationend', function() {
    window.location.href = url;
  }, { once: true });
}

// Supprimer l'overlay après l'animation
window.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('vignette-overlay');
  if (overlay) {
    overlay.addEventListener('animationend', function() {
      overlay.parentNode.removeChild(overlay);
    });
  }
});

// Fonction utilitaire pour calculer la position cible (vue actuelle) selon la progression
function getCurrentMapView() {
    const order = [
        'poi1_valid', 'poi2_valid', 'poi3a_valid', 'poi3b_valid', 'poi4_valid', 'poi5_valid', 'poi6_valid'
    ];
    let nextPoiIndex = order.findIndex(key => localStorage.getItem(key) !== 'true');
    if (nextPoiIndex === -1) nextPoiIndex = pois.length;
    let targetCenter = null;
    let targetZoom = 19;
    if (nextPoiIndex === 0) {
        targetCenter = pois[0].coords;
    } else if (nextPoiIndex > 0 && nextPoiIndex < pois.length) {
        const prev = pois[nextPoiIndex - 1].coords;
        const curr = pois[nextPoiIndex].coords;
        const lat = ((prev[0] + curr[0]) / 2);
        const lng = (prev[1] + curr[1]) / 2;
        targetCenter = [lat, lng];
    } else if (nextPoiIndex === pois.length) {
        // Tous les POI validés : ne recentre pas
        targetCenter = null;
    }
    return { center: targetCenter, zoom: targetZoom };
}

// --- Animation de translation de la carte après l'animation vignette ---
(function() {
    const mapView = getCurrentMapView();
    if (!mapView.center) return;
    // Cherche la position de départ dans le localStorage
    const prevView = localStorage.getItem('previousMapView');
    let startCenter = prevView ? JSON.parse(prevView) : mapView.center;
    map.setView(startCenter, mapView.zoom, { animate: false });
    // Après l'animation vignette (2s), anime la translation
    setTimeout(() => {
        map.panTo(mapView.center, { animate: true, duration: 1 });
    }, 2000);
    // Nettoie la valeur pour ne pas rejouer l'animation
    localStorage.removeItem('previousMapView');
})();

// --- Personnalisation dynamique du texte du bouton suivant ---
(function() {
    const suivantBtnH3 = document.querySelector('.suivant-btn-container h3');
    if (!suivantBtnH3) return;
    const order = [
        'poi1_valid', 'poi2_valid', 'poi3a_valid', 'poi3b_valid', 'poi4_valid', 'poi5_valid', 'poi6_valid'
    ];
    let nextPoiIndex = order.findIndex(key => localStorage.getItem(key) !== 'true');
    let customTexts = [
        "Déplacez-vous vers l'entrée du fort !",
        "Un panorama vous attend au deuxième point d'intérêt !",
        "Allez voir l'étrange sculpture le long du chemin !",
        "Direction le bas du chemin !",
        "Remontez le chemin, et découvrez les secrets de l'architecture du fort !",
        "Un autre fort se cache derrière les arbres !",
        "Continuez votre route et décendez les escaliers pour accéder au fossé !",
    ];
    if (nextPoiIndex === -1 || nextPoiIndex >= customTexts.length) nextPoiIndex = customTexts.length - 1;
    suivantBtnH3.textContent = customTexts[nextPoiIndex];
})();


