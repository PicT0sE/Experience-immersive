/* Latitude, Longitude, Zoom de BASE sur la map */
// Initialisation de la carte Leaflet centrée sur une position de base
const map = L.map('map').setView([43.094422,5.893956], 20.5);

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
    maxZoom: 19,
}).addTo(map);

// Utilise l'API de géolocalisation du navigateur pour centrer la carte sur la position de l'utilisateur
navigator.geolocation.getCurrentPosition(success, erreur);

// Fonction appelée si la géolocalisation réussit
function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Centre la carte sur la position de l'utilisateur
    map.setView([latitude, longitude], 17);
    map.panBy([0, -window.innerHeight * 0.18]); // Décale la vue vers le haut

    // Ajoute un marqueur à la position de l'utilisateur
    const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
    marker.bindPopup(`<h1>Vous êtes ici</h1>
                      <p>Latitude : ${latitude}</p>
                      <p>Longitude : ${longitude}</p>`).openPopup();
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
const imageBounds = [[43.092949, 5.891697], [43.095460, 5.895174]]; // [sud-ouest, nord-est]
const imageOverlay = L.imageOverlay('../img/Fort-Napoléon-Carte.jpg', imageBounds, { opacity: 1 }).addTo(map);

// --- Gestion de l'étape du parcours ---
let etape = parseInt(localStorage.getItem('etape') || '1'); // 1 par défaut

// --- Définition des POI avec leurs icônes dynamiques ---
const pois = [
    {
        name: 'POI 1',
        coords: [43.0940230, 5.8939384],
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

// --- Centrage dynamique de la carte selon l'étape ---
if (etape === 1) {
    map.setView(pois[0].coords, 19);
    map.panBy([0, -window.innerHeight * 0.18]);
} else if (etape > 1 && etape <= pois.length) {
    // Centre entre le POI précédent et le POI courant
    let prev = pois[etape - 2].coords;
    let curr = pois[etape - 1].coords;
    let lat = (prev[0] + curr[0]) / 2;
    let lng = (prev[1] + curr[1]) / 2;
    map.setView([lat, lng], 19);
    map.panBy([0, -window.innerHeight * 0.18]);
}

// --- Affichage dynamique des pins ---
pois.forEach((poi, i) => {
    let iconType = 'neutre';
    if (i + 1 < etape) iconType = 'valide';
    else if (i + 1 === etape) iconType = 'suivant';
    const icon = L.icon({
        iconUrl: poi.icons[iconType],
        iconSize: [65, 65], // taille modifiée
        iconAnchor: [32, 65],
        popupAnchor: [0, -65]
    });
    const marker = L.marker(poi.coords, { icon }).addTo(map);
    marker.bindPopup(`<h2>${poi.name}</h2><p>Coordonnées : ${poi.coords[0]}, ${poi.coords[1]}</p>`);
});

// --- Détection de proximité et redirection automatique ---
navigator.geolocation.getCurrentPosition(function(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    // Affiche la position de l'utilisateur
    const userIcon = L.icon({
        iconUrl: '../svg/Position.svg',
        iconSize: [65, 65], // taille modifiée
        iconAnchor: [32, 65],
        popupAnchor: [0, -65]
    });
    L.marker([userLat, userLng], { icon: userIcon }).addTo(map)
        .bindPopup(`<h1>Vous êtes ici</h1><p>Latitude : ${userLat}</p><p>Longitude : ${userLng}</p>`).openPopup();
    // Vérifie la proximité avec le POI de l'étape
    const poi = pois[etape - 1];
    const dist = getDistance(userLat, userLng, poi.coords[0], poi.coords[1]);
    if (dist < 3) {
        window.location.href = `question-poi${etape}.html`;
    }
}, erreur);

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