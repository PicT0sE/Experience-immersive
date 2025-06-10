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
    L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
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
        name: 'POI 1',
        coords: [43.094023, 5.8939384],
        icons: {
            neutre: '../svg/pin-poi-1.svg',
            suivant: '../svg/pin-poi-1-suivant.svg',
            valide: '../svg/pin-poi-1-valide.svg'
        }
    },
    {
        name: 'POI 2',
        coords: [43.094578, 5.894156],
        icons: {
            neutre: '../svg/pin-poi-2.svg',
            suivant: '../svg/pin-poi-2-suivant.svg',
            valide: '../svg/pin-poi-2-valide.svg'
        }
    },
    {
        name: 'POI 3a',
        coords: [43.094631, 5.893479],
        icons: {
            neutre: '../svg/pin-poi-3a.svg',
            suivant: '../svg/pin-poi-3a-suivant.svg',
            valide: '../svg/pin-poi-3a-valide.svg'
        }
    },
    {
        name: 'POI 3b',
        coords: [43.094851, 5.893623],
        icons: {
            neutre: '../svg/pin-poi-3b.svg',
            suivant: '../svg/pin-poi-3b-suivant.svg',
            valide: '../svg/pin-poi-3b-valide.svg'
        }
    },
    {
        name: 'POI 4',
        coords: [43.094843, 5.892855],
        icons: {
            neutre: '../svg/pin-poi-4.svg',
            suivant: '../svg/pin-poi-4-suivant.svg',
            valide: '../svg/pin-poi-4-valide.svg'
        }
    },
    {
        name: 'POI 5',
        coords: [43.094441, 5.892704],
        icons: {
            neutre: '../svg/pin-poi-5.svg',
            suivant: '../svg/pin-poi-5-suivant.svg',
            valide: '../svg/pin-poi-5-valide.svg'
        }
    },
    {
        name: 'POI 6',
        coords: [43.093985, 5.892913],
        icons: {
            neutre: '../svg/pin-poi-6.svg',
            suivant: '../svg/pin-poi-6-suivant.svg',
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
        const lat = ((prev[0] + curr[0]) / 2) - 0.0002;
        const lng = (prev[1] + curr[1]) / 2;
        map.setView([lat, lng], 19);
        map.panBy([0, -window.innerHeight * 0.18]);
    } else if (nextPoiIndex === pois.length) {
        // Tous les POI sont validés : laisse la carte là où elle est (ne recentre pas)
        // Pas d'appel à setView/panBy
    }
})();

// --- Affichage dynamique des pins ---
pois.forEach((poi, i) => {
    let iconType = 'neutre';
    // Vérifie la validation de chaque POI dans l'ordre du parcours
    if (i === 0 && localStorage.getItem('poi1_valid') === 'true') {
        iconType = 'valide';
    } else if (i === 1 && localStorage.getItem('poi2_valid') === 'true') {
        iconType = 'valide';
    } else if (i === 2 && localStorage.getItem('poi3a_valid') === 'true') {
        iconType = 'valide';
    } else if (i === 3 && localStorage.getItem('poi3b_valid') === 'true') {
        iconType = 'valide';
    } else if (i === 4 && localStorage.getItem('poi4_valid') === 'true') {
        iconType = 'valide';
    } else if (i === 5 && localStorage.getItem('poi5_valid') === 'true') {
        iconType = 'valide';
    } else if (i === 6 && localStorage.getItem('poi6_valid') === 'true') {
        iconType = 'valide';
    } else {
        // Le premier POI non validé devient le "suivant", les autres restent neutres
        const order = [
            'poi1_valid',
            'poi2_valid',
            'poi3a_valid',
            'poi3b_valid',
            'poi4_valid',
            'poi5_valid',
            'poi6_valid'
        ];
        let foundNext = false;
        for (let j = 0; j < order.length; j++) {
            if (localStorage.getItem(order[j]) !== 'true') {
                if (i === j) iconType = 'suivant';
                foundNext = true;
                break;
            }
        }
    }
    // Correction de l'ancrage pour centrer l'icône sur la position exacte
    const icon = L.icon({
        iconUrl: poi.icons[iconType],
        iconSize: [175, 175],
        iconAnchor: [87.5, 87.5], // Centre de l'icône
        popupAnchor: [0, -87.5]
    });
    // Ajoute le marqueur SANS popup
    L.marker(poi.coords, { icon }).addTo(map);
});

// --- Fonction pour centrer sur la vue finale ---
function centerOnFinalView() {
    map.setView([43.094526056316866, 5.8933725276797215], 18);
}

// --- Détection de proximité et redirection automatique ---
navigator.geolocation.getCurrentPosition(function(position) {
    // Si le POI 6 est validé, on centre la carte sur la vue finale et on ne fait plus rien d'autre
    if (localStorage.getItem('poi6_valid') === 'true') {
        centerOnFinalView();
        return;
    }
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    window.lastUserLat = userLat;
    window.lastUserLng = userLng;
    // Affiche la position de l'utilisateur
    const userIcon = L.icon({
        iconUrl: '../svg/user-position.svg',
        iconSize: [150, 150],
        iconAnchor: [75, 75], // Centre de l'icône utilisateur
        popupAnchor: [0, -75]
    });
    L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
    // Suppression du bindPopup pour ne plus afficher de popup sur la position utilisateur
    // Vérifie la proximité avec le POI de l'étape
    const poi = pois[etape - 1];
    const dist = getDistance(userLat, userLng, poi.coords[0], poi.coords[1]);
    // Empêche la redirection si le POI a déjà été validé
    if (dist < 3) {
        if (etape === 1 && localStorage.getItem('poi1_valid') !== 'true') {
            window.location.href = `question-poi${etape}.html`;
        } else if (etape === 2 && localStorage.getItem('poi2_valid') !== 'true') {
            window.location.href = `question-poi${etape}.html`;
        } else if (etape === 3 && localStorage.getItem('poi3a_valid') !== 'true') {
            window.location.href = `question-poi${etape}.html`;
        } else if (etape === 4 && localStorage.getItem('poi3b_valid') !== 'true') {
            window.location.href = `question-poi${etape}.html`;
        } else if (etape === 5 && localStorage.getItem('poi4_valid') !== 'true') {
            window.location.href = `question-poi${etape}.html`;
        } else if (etape === 6 && localStorage.getItem('poi5_valid') !== 'true') {
            window.location.href = `question-poi${etape}.html`;
        } else if (etape === 7 && localStorage.getItem('poi6_valid') !== 'true') {
            window.location.href = `question-poi${etape}.html`;
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
    // Redirige vers la question du prochain POI non validé si l'utilisateur est à proximité
    if (nextDist < 3 && nextPoiIndex < pois.length - 1) {
        const questionPages = [
            'question-poi1.html',
            'question-poi2.html',
            'question-poi3a.html',
            'question-poi3b.html',
            'question-poi4.html',
            'question-poi5.html',
            'question-poi6.html'
        ];
        window.location.href = questionPages[nextPoiIndex];
    } else if (nextDist < 3 && nextPoiIndex === pois.length - 1 && localStorage.getItem('poi6_valid') !== 'true') {
        // Si on est sur le dernier POI et qu'il n'est pas validé, on autorise la redirection
        window.location.href = 'question-poi6.html';
    } else if (nextDist < 3 && nextPoiIndex === pois.length - 1 && localStorage.getItem('poi6_valid') === 'true') {
        // Si le POI 6 est validé, on centre la carte sur la vue finale demandée
        map.setView([43.094526056316866, 5.8933725276797215], 18);
    }
}, erreur);

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
});

