// Ce script insère le contenu de header.html dans #header-container
let headerPath = window.location.pathname.includes('/html/') ? 'header.html' : 'html/header.html';
fetch(headerPath)
  .then(response => response.text())
  .then(html => {
    document.getElementById('header-container').innerHTML = html;
    // Charger header.js dynamiquement après l'insertion du header
    const script = document.createElement('script');
    script.src = window.location.pathname.includes('/html/') ? '../js/header.js' : 'js/header.js';
    document.body.appendChild(script);
  });
