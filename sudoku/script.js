document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sudoku-grid');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');
    const saveBtn = document.getElementById('save-btn');
    let selectedCell;

    // Generate 9x9 grid
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', openModal);
        grid.appendChild(cell);
    }

    // Pre-populate 1/3 of the cells with random numbers
    const cells = document.querySelectorAll('.cell');
    const prepopulateCount = Math.floor(cells.length / 3);
    const usedIndices = new Set();

    while (usedIndices.size < prepopulateCount) {
        const randomIndex = Math.floor(Math.random() * cells.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            const randomNumber = Math.floor(Math.random() * 9) + 1;
            cells[randomIndex].textContent = randomNumber;
        }
    }

    // Check if the number can be legally placed in the cell
    function isValidNumber(cellIndex, number) {
        const row = Math.floor(cellIndex / 9);
        const col = cellIndex % 9;
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;

        // Check row and column
        for (let i = 0; i < 9; i++) {
            if (cells[row * 9 + i].textContent == number || cells[i * 9 + col].textContent == number) {
                return false;
            }
        }

        // Check 3x3 subgrid
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (cells[(startRow + i) * 9 + (startCol + j)].textContent == number) {
                    return false;
                }
            }
        }

        return true;
    }

    // Open modal
    function openModal(event) {
        selectedCell = event.target;
        modal.style.display = 'block';

        // Uncheck all checkboxes
        const checkboxes = document.querySelectorAll('#number-form input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);

        // Check the checkboxes based on the cell's current content
        const cellContent = selectedCell.textContent.split(', ');
        checkboxes.forEach(checkbox => {
            if (cellContent.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });
    }

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Save selected numbers
    saveBtn.addEventListener('click', () => {
        const form = document.getElementById('number-form');
        const selectedNumbers = Array.from(form.elements['number'])
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        
        // Validate selected numbers
        const cellIndex = parseInt(selectedCell.dataset.index);
        for (let number of selectedNumbers) {
            if (!isValidNumber(cellIndex, number)) {
                alert(`Number ${number} cannot be placed here.`);
                return;
            }
        }

        selectedCell.textContent = selectedNumbers.join(', ');
        modal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});