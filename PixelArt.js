document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('canvas'); // Sélectionne l'élément canvas
  const resetButton = document.querySelector('.reset-button'); // Sélectionne le bouton de réinitialisation
  const downloadButton = document.getElementById('download-button'); // Sélectionne le bouton de téléchargement
  const colorHistory = document.getElementById('color-list'); // Sélectionne la liste d'historique des couleurs

  const defaultColor = "#fff"; // Couleur par défaut utilisée pour initialiser le color picker et les pixels
  let colorpicker = defaultColor; // Variable pour stocker la couleur sélectionnée

  var colorPicker = new iro.ColorPicker("#picker", { // Crée un nouveau sélecteur de couleur
    width: 120, // Définit la largeur du sélecteur de couleur
    color: defaultColor // Définit la couleur initiale du sélecteur de couleur
  });

  colorPicker.on('color:change', function(color) { // Événement déclenché lorsqu'une nouvelle couleur est sélectionnée dans le sélecteur
    colorpicker = color.hexString; // Met à jour la couleur sélectionnée
  });

  const pixelSize = 20; // Taille en pixels de chaque pixel
  const gridWidth = 50; // Largeur de la grille en nombre de pixels
  const gridHeight = 25; // Hauteur de la grille en nombre de pixels

  let isSelectingArea = false; // Variable pour indiquer si le mode de sélection de zone est activé
  let startX, startY, endX, endY; // Coordonnées du début et de la fin de la sélection

  // Gestionnaire d'événements pour le bouton de sélection de zone
  const selectAreaButton = document.getElementById('select-area-button');
  selectAreaButton.addEventListener('click', function() {
    isSelectingArea = true; // Activer le mode de sélection de zone
    canvas.style.cursor = 'crosshair'; // Modifier le curseur pour indiquer le mode de sélection de zone
  });

  // Gestionnaire d'événements pour suivre les mouvements de la souris pendant le mode de sélection de zone
  canvas.addEventListener('mousedown', function(event) {
    if (isSelectingArea) {
      startX = event.offsetX;
      startY = event.offsetY;
      endX = startX;
      endY = startY;
      drawSelectionArea();
      canvas.addEventListener('mousemove', mouseMoveHandler);
    }
  });

  function mouseMoveHandler(event) {
    endX = event.offsetX;
    endY = event.offsetY;
    drawSelectionArea();
  }

  canvas.addEventListener('mouseup', function(event) {
    if (isSelectingArea) {
      canvas.removeEventListener('mousemove', mouseMoveHandler);
      // Enregistrez les coordonnées de début et de fin pour une utilisation ultérieure
      // Vous pouvez maintenant déterminer quels pixels sont inclus dans la sélection en utilisant startX, startY, endX et endY
      isSelectingArea = false; // Désactiver le mode de sélection de zone
      canvas.style.cursor = 'auto'; // Rétablir le curseur par défaut
    }
  });

  // Fonction pour dessiner la zone de sélection sur le canvas
  function drawSelectionArea() {
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redessiner tous les pixels
    // NOTE: Vous devrez probablement implémenter une fonction pour cela
    // Dessiner le rectangle de sélection
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.rect(startX, startY, endX - startX, endY - startY);
    ctx.stroke();
  }

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
      addToColorHistory(defaultColor); // Ajoute la couleur par défaut à l'historique
    }
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
});