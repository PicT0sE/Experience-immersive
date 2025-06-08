/* Latitude, Longitude, Zoom de BASE sur la map */
const map = L.map('map').setView([43.0941954, 5.8934236], 20.5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// API navigateur pour savoir où je me trouve : navigator.geolocation
// const position = navigator.geolocation.watchPosition(valide, erreur); 
// Erreur possible si le navigateur ne supporte pas la géolocalisation

navigator.geolocation.getCurrentPosition(success, erreur);

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Centrer la carte
    map.setView([latitude, longitude], 17);

    // Ajouter un marker
    const marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup(`<h1>Vous êtes ici</h1>
                      <p>Latitude : ${latitude}</p>
                      <p>Longitude : ${longitude}</p>`).openPopup();
}

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

function success(position) {
    console.log(position.coords.latitude, position.coords.longitude);
    // On récupère les valeurs de latitude et longitude
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    // On centre la map sur la position
    map.setView([latitude, longitude], 17);
    // On crée un marker
    const marker = L.marker([latitude, longitude]).addTo(map);
    // On ajoute une popup
    marker.bindPopup(`<h1>Vous êtes ici</h1>
                    <p>Latitude : ${latitude}</p>
                    <p>Longitude : ${longitude}</p>`);
}

// Afficher l'image Fort-Napoléon-Carte.png comme fond de carte
// Définir les coins sud-ouest et nord-est de l'image (à ajuster selon votre image)
const imageBounds = [[43.092949, 5.891697], [43.095460, 5.895174]]; // [sud-ouest, nord-est]
const imageOverlay = L.imageOverlay('./img/Fort-Napoléon-Carte.jpg', imageBounds, { opacity: 1 }).addTo(map);

// Ajout des 7 POI
const pois = [
    { name: 'POI 1', coords: [43.0940230, 5.8939384] },
    { name: 'POI 2', coords: [43.094578, 5.894156] },
    { name: 'POI 3a', coords: [43.094631, 5.893479] },
    { name: 'POI 3b', coords: [43.094851, 5.893623] },
    { name: 'POI 4', coords: [43.094843, 5.892855] },
    { name: 'POI 5', coords: [43.094441, 5.892704] },
    { name: 'POI 6', coords: [43.093985, 5.892913] },
];

pois.forEach(poi => {
    const marker = L.marker(poi.coords).addTo(map);
    marker.bindPopup(`<h2>${poi.name}</h2><p>Coordonnées : ${poi.coords[0]}, ${poi.coords[1]}</p>`);
});