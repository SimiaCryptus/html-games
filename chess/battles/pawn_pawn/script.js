// Selecting elements from the DOM
const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');
const comicPanel = document.getElementById('comic-panel').querySelector('img');

// Current panel index
let currentPanelIndex = 0;

// Array of comic panel image sources
const comicPanels = [
    'images/panel1.jpg',
    'images/panel2.jpg',
    'images/panel3.jpg',
    'images/panel4.jpg'
];

// Function to update the comic panel
function updateComicPanel(index) {
    comicPanel.src = comicPanels[index];
}

// Event listeners for navigation buttons
nextButton.addEventListener('click', () => {
    if (currentPanelIndex < comicPanels.length - 1) {
        currentPanelIndex++;
        updateComicPanel(currentPanelIndex);
    }
});

prevButton.addEventListener('click', () => {
    if (currentPanelIndex > 0) {
        currentPanelIndex--;
        updateComicPanel(currentPanelIndex);
    }
});

// Initialize the comic panel on page load
document.addEventListener('DOMContentLoaded', () => {
    updateComicPanel(currentPanelIndex); // Start with the first panel
});