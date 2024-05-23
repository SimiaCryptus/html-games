
    // Removed erroneous text
function generateMaze(rows, cols) {
    console.log(`Generating maze with ${rows} rows and ${cols} columns.`);
    // Create a grid filled with walls
    const grid = Array.from({ length: rows }, () => Array(cols).fill(1));

    // Helper function to mark the cell and its neighbor as path
    function carve(x, y) {
        if (x < 0 || y < 0 || x >= rows || y >= cols) {
            return; // Boundary check to ensure indices are within bounds
        }
        grid[x][y] = 0;
        console.log(`Carving path at (${x}, ${y}).`);
        const directions = [
            [1, 0], [-1, 0], [0, 1], [0, -1]
        ];
        shuffle(directions); // Randomize directions

        directions.forEach(([dx, dy]) => {
            const nx = x + dx * 2, ny = y + dy * 2;
            if (nx > 0 && nx < rows - 1 && ny > 0 && ny < cols - 1 && grid[nx][ny] === 1) {
                grid[x + dx][y + dy] = 0;
                carve(nx, ny);
            }
        });
    }

    // Start carving from a random odd-indexed cell
    carve(1, 1);
     console.log(`Maze generation complete. Final grid state:`);
    console.table(grid);
    console.log(`Maze generation complete.`);
    
    // Find the farthest open cell from the start position (1, 1)
    const end = findFarthestOpenCell(grid, 1, 1);
    console.log(`End position determined at (${end.x}, ${end.y}).`);
    return { grid, end };
}

function shuffle(array) {
    console.log(`Shuffling array.`);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    console.log(`Array shuffled.`);
}

export function findFarthestOpenCell(grid, startX, startY) {
    let maxDistance = -1;
    let farthestCell = { x: startX, y: startY };

    for (let y = 1; y < grid.length - 1; y++) {
        for (let x = 1; x < grid[y].length - 1; x++) {
            if (grid[y][x] === 0) {
                const distance = Math.abs(x - startX) + Math.abs(y - startY);
                if (distance > maxDistance) {
                    maxDistance = distance;
                    farthestCell = { x: x, y: y };
                }
            }
        }
    }

    return farthestCell;
}

export { generateMaze };