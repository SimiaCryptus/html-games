// Array of image sources for the comic panels
const panels = [
    'images/panel1.jpg',
    'images/panel2.jpg',
    'images/panel3.jpg',
    'images/panel4.jpg'
];

// Current panel index
let currentPanel = 0;

// Function to set the image source for the current panel
function setPanelImage() {
    const panelImages = document.querySelectorAll('.comic-panel');
    panelImages.forEach((img, index) => {
        img.style.display = index === currentPanel ? 'block' : 'none';
    });
    panelImage.src = panels[currentPanel];
}

// Function to preload images to improve user experience
function preloadImages() {
    for (let i = 0; i < panels.length; i++) {
        const img = new Image();
        img.src = panels[i];
    }
}

// Function to handle "Next" button click
function nextPanel() {
    if (currentPanel < panels.length - 1) {
        currentPanel++;
        setPanelImage();
    }
}

// Function to handle "Previous" button click
function prevPanel() {
    if (currentPanel > 0) {
        currentPanel--;
        setPanelImage();
    }
}

// Event listeners for navigation buttons
document.getElementById('next-button').addEventListener('click', nextPanel);
document.getElementById('prev-button').addEventListener('click', prevPanel);

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();  // Preload images on initial load
    setPanelImage();  // Set the first panel image
});