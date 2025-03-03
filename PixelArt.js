document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('canvas'); // Sélectionne l'élément canvas
  const resetButton = document.querySelector('.reset-button'); // Sélectionne le bouton de réinitialisation
  const downloadButton = document.getElementById('download-button'); // Sélectionne le bouton de téléchargement
  const colorHistory = document.getElementById('color-list'); // Sélectionne la liste d'historique des couleurs

  const defaultColor = "#ffffff"; // Couleur par défaut blanche
  let colorpicker = "#000000"; // Variable pour stocker la couleur sélectionnée, noir par défaut
  let isSelecting = false; // Variable pour suivre si l'utilisateur est en train de dessiner

  var colorPicker = new iro.ColorPicker("#picker", { // Crée un nouveau sélecteur de couleur
    width: 120, // Définit la largeur du sélecteur de couleur
    color: "#FFFFFF" // Définit la couleur initiale du sélecteur de couleur
  });

  colorPicker.on('color:change', function(color) { // Événement déclenché lorsqu'une nouvelle couleur est sélectionnée dans le sélecteur
    colorpicker = color.hexString; // Met à jour la couleur sélectionnée
  });

  // Déterminer la taille des pixels en fonction de la largeur de l'écran
  let pixelSize = 16; // Taille par défaut réduite
  if (window.innerWidth <= 480) {
    pixelSize = 8;
  } else if (window.innerWidth <= 768) {
    pixelSize = 12;
  }

  const gridWidth = 40; // Largeur de la grille réduite
  const gridHeight = 25; // Hauteur de la grille

  // Crée une grille de pixels dans le canvas
  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth; j++) {
      const pixel = document.createElement('div'); // Crée un élément div pour représenter un pixel
      pixel.classList.add('pixel'); // Ajoute la classe 'pixel' à chaque pixel
      pixel.style.width = `${pixelSize}px`; // Définit la largeur du pixel
      pixel.style.height = `${pixelSize}px`; // Définit la hauteur du pixel
      pixel.style.backgroundColor = defaultColor; // Définit la couleur de fond initiale de chaque pixel
      canvas.appendChild(pixel); // Ajoute le pixel au canvas

      pixel.addEventListener('mousedown', function(event) {
        isSelecting = true;
        pixel.style.backgroundColor = colorpicker;
        if (colorpicker !== defaultColor) {
          addToColorHistory(colorpicker);
        }
      });
      
      pixel.addEventListener('mouseenter', function(event) {
        if (isSelecting) {
          pixel.style.backgroundColor = colorpicker;
        }
      });
      
      pixel.addEventListener('mouseup', function(event) {
        isSelecting = false;
      });
    }
  }

  // Gère le clic sur le canvas pour changer la couleur des pixels
  canvas.addEventListener('click', function(event) {
    if (event.target.classList.contains('pixel')) { // Vérifie si l'élément cliqué est un pixel
      event.target.style.backgroundColor = colorpicker; // Change la couleur du pixel en couleur sélectionnée
      if (colorpicker !== defaultColor) { // Vérifie si la couleur sélectionnée n'est pas la couleur par défaut
        addToColorHistory(colorpicker); // Ajoute la couleur sélectionnée à l'historique
      }
    }
  });

  // Gère le clic droit sur le canvas pour réinitialiser la couleur des pixels
  canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault(); // Empêche le menu contextuel par défaut de s'afficher
    if (event.target.classList.contains('pixel')) { // Vérifie si l'élément cliqué est un pixel
      event.target.style.backgroundColor = defaultColor; // Réinitialise la couleur du pixel à la couleur par défaut
    }
  });

  // Arrête le dessin lorsque la souris quitte le canvas
  canvas.addEventListener('mouseleave', function() {
    isSelecting = false;
  });

  // Gère le clic sur le bouton de réinitialisation
  resetButton.addEventListener('click', function() {
    const confirmed = confirm('Etes-vous sûr de vouloir réinitialiser ?'); // Affiche une boîte de dialogue de confirmation
    if (confirmed) {
      resetCanvas(); // Réinitialise le canvas
      resetColorHistory(); // Réinitialise l'historique des couleurs
    }
  });

  // Gère le clic sur le bouton de téléchargement
  downloadButton.addEventListener('click', function() {
    downloadPixelArt(); // Déclenche le téléchargement de l'image représentant le pixel art
  });

  // Ajoute une couleur à l'historique des couleurs
  function addToColorHistory(color) {
    if (color !== defaultColor) { // Vérifie si la couleur n'est pas la couleur par défaut
      const existingColorItem = Array.from(colorHistory.children).find(item => {
        return item.dataset.color === color; // Vérifie si la couleur existe déjà dans l'historique
      });
    
      if (!existingColorItem) { // Si la couleur n'existe pas dans l'historique
        if (colorHistory.children.length >= 18) {
          colorHistory.removeChild(colorHistory.children[0]); // Supprime le premier élément de l'historique s'il dépasse la limite
        }

        const listItem = document.createElement('li'); // Crée un élément li pour représenter la couleur dans l'historique
        listItem.style.backgroundColor = color; // Définit la couleur de fond de l'élément li
        listItem.dataset.color = color; // Stocke la couleur dans l'attribut dataset
        listItem.addEventListener('click', function() {
          colorPicker.color.set(color); // Définit la couleur sélectionnée dans le sélecteur de couleur
          colorpicker = color; // Met à jour la couleur sélectionnée
        });
        colorHistory.appendChild(listItem); // Ajoute l'élément li à l'historique des couleurs
      } else {
        // Déplace la couleur déjà existante à la fin de la liste
        colorHistory.appendChild(existingColorItem);
      }
    }
  }

  // Télécharge l'image représentant le pixel art
  function downloadPixelArt() {
    const element = document.getElementById('canvas'); // Sélectionne l'élément canvas
    html2canvas(element).then(canvas => { // Convertit le canvas en une image
      const imgData = canvas.toDataURL('image/png'); // Récupère les données de l'image au format PNG
      const link = document.createElement('a'); // Crée un élément <a> pour le téléchargement
      link.download = 'pixel-art.png'; // Définit le nom du fichier à télécharger
      link.href = imgData; // Définit les données de l'image comme URL de téléchargement
      link.click(); // Déclenche le téléchargement
    });
  }

  // Réinitialise le canvas en remettant tous les pixels à la couleur par défaut
  function resetCanvas() {
    const pixels = document.querySelectorAll('.pixel'); 
    pixels.forEach(pixel => {
      pixel.style.backgroundColor = defaultColor; // Réinitialise la couleur de chaque pixel à la couleur par défaut
    });
  }
  
  // Réinitialise l'historique des couleurs
  function resetColorHistory() {
    while (colorHistory.firstChild) {
      colorHistory.removeChild(colorHistory.firstChild);
    }
  }

  // Gestion du redimensionnement de la fenêtre
  window.addEventListener('resize', function() {
    // Mettre à jour la taille des pixels si nécessaire
    let newPixelSize = 16;
    if (window.innerWidth <= 480) {
      newPixelSize = 8;
    } else if (window.innerWidth <= 768) {
      newPixelSize = 12;
    }
    
    // Si la taille des pixels a changé, mettre à jour la grille
    if (newPixelSize !== pixelSize) {
      pixelSize = newPixelSize;
      updatePixelSize();
    }
  });

  // Fonction pour mettre à jour la taille des pixels
  function updatePixelSize() {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach(pixel => {
      pixel.style.width = `${pixelSize}px`;
      pixel.style.height = `${pixelSize}px`;
    });
  }
});