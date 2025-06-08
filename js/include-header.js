// Ce script insère le contenu de header.html dans #header-container
fetch('../html/header.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('header-container').innerHTML = html;
    // Charger header.js dynamiquement après l'insertion du header
    const script = document.createElement('script');
    script.src = '../js/header.js';
    document.body.appendChild(script);
  });
