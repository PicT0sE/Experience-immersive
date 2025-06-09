// js/lock-videos.js
// Fonction pour griser et bloquer la vidéo si le POI n'est pas validé
function lockVideoIfNotValidated(poiNumber) {
  const key = String(poiNumber);
  const isValid = localStorage.getItem(`poi${key}_valid`) === 'true';
  const videoSection = document.querySelector(`.videos[data-poi="${key}"]`);
  if (videoSection) {
    const video = videoSection.querySelector('video');
    if (video) {
      if (!isValid) {
        video.style.filter = 'grayscale(1) brightness(0.5)';
        video.style.pointerEvents = 'none';
        video.controls = false;
        // Overlay visuel
        let overlay = video.parentElement.querySelector('.video-lock-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'video-lock-overlay';
          overlay.innerHTML = '<span>Débloquez cette vidéo en répondant au POI !</span>';
          Object.assign(overlay.style, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2em',
            borderRadius: '15px',
            zIndex: 2
          });
          video.parentElement.style.position = 'relative';
          video.parentElement.appendChild(overlay);
        }
      } else {
        // Si validé, toujours accessible
        video.style.filter = '';
        video.style.pointerEvents = '';
        video.controls = true;
        const overlay = video.parentElement.querySelector('.video-lock-overlay');
        if (overlay) overlay.remove();
      }
    }
  }
}

// Déverrouille la vidéo si le POI est validé après coup
function unlockVideoIfValidated(poiNumber) {
  const key = String(poiNumber);
  const videoSection = document.querySelector(`.videos[data-poi="${key}"]`);
  if (videoSection) {
    const video = videoSection.querySelector('video');
    if (video) {
      // Retire le filtre et l'overlay si la clé localStorage est présente
      if (localStorage.getItem(`poi${key}_valid`) === 'true') {
        video.style.filter = '';
        video.style.pointerEvents = '';
        video.controls = true;
        const overlay = video.parentElement.querySelector('.video-lock-overlay');
        if (overlay) overlay.remove();
      }
    }
  }
}

// Surveille les changements de validation pour chaque POI vidéo
function setupVideoUnlockListeners() {
  ['1','3a','3b','4','6'].forEach(function(poi) {
    window.addEventListener('storage', function(e) {
      if (e.key === `poi${poi}_valid` && e.newValue === 'true') {
        unlockVideoIfValidated(poi);
      }
    });
    // Déverrouille si déjà validé au chargement
    unlockVideoIfValidated(poi);
  });
}

// Fonction pour griser et bloquer la photo 360 si le POI n'est pas validé
function lockPhotoIfNotValidated(poiNumber) {
  const key = String(poiNumber);
  const isValid = localStorage.getItem(`poi${key}_valid`) === 'true';
  const photoSection = document.querySelector(`.photo360[data-poi="${key}"]`);
  if (photoSection) {
    const iframe = photoSection.querySelector('iframe');
    if (iframe) {
      if (!isValid) {
        iframe.style.filter = 'grayscale(1) brightness(0.5)';
        iframe.style.pointerEvents = 'none';
        // Overlay visuel
        let overlay = iframe.parentElement.querySelector('.photo-lock-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'photo-lock-overlay';
          overlay.innerHTML = '<span>Débloquez cette photo 360° en répondant au POI !</span>';
          Object.assign(overlay.style, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2em',
            borderRadius: '15px',
            zIndex: 2,
            pointerEvents: 'auto'
          });
          iframe.parentElement.style.position = 'relative';
          iframe.parentElement.appendChild(overlay);
        }
      } else {
        // Si validé, toujours accessible
        iframe.style.filter = '';
        iframe.style.pointerEvents = '';
        const overlay = iframe.parentElement.querySelector('.photo-lock-overlay');
        if (overlay) overlay.remove();
      }
    }
  }
}

// Déverrouille la photo 360 si le POI est validé après coup
function unlockPhotoIfValidated(poiNumber) {
  const key = String(poiNumber);
  const photoSection = document.querySelector(`.photo360[data-poi="${key}"]`);
  if (photoSection) {
    const iframe = photoSection.querySelector('iframe');
    if (iframe) {
      // Retire le filtre et l'overlay si la clé localStorage est présente
      if (localStorage.getItem(`poi${key}_valid`) === 'true') {
        iframe.style.filter = '';
        iframe.style.pointerEvents = '';
        const overlay = iframe.parentElement.querySelector('.photo-lock-overlay');
        if (overlay) overlay.remove();
      }
    }
  }
}

// Surveille les changements de validation pour chaque POI photo 360
function setupPhotoUnlockListeners() {
  ['2','5'].forEach(function(poi) {
    window.addEventListener('storage', function(e) {
      if (e.key === `poi${poi}_valid` && e.newValue === 'true') {
        unlockPhotoIfValidated(poi);
      }
    });
    // Déverrouille si déjà validé au chargement
    unlockPhotoIfValidated(poi);
  });
}

// Appel pour chaque POI vidéo et photo 360 (adapte selon l'ordre réel)
window.addEventListener('DOMContentLoaded', function() {
  lockVideoIfNotValidated('1');
  lockVideoIfNotValidated('3a');
  lockVideoIfNotValidated('3b');
  lockVideoIfNotValidated('4');
  lockVideoIfNotValidated('6');
  lockPhotoIfNotValidated('2');
  lockPhotoIfNotValidated('5');
  setupVideoUnlockListeners();
  setupPhotoUnlockListeners();
});
