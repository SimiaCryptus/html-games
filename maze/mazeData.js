
function generateMaze(rows, cols) {
    // Create a grid filled with walls
    const grid = Array.from({ length: rows }, () => Array(cols).fill(1));

    // Helper function to mark the cell and its neighbor as path
    function carve(x, y) {
        grid[x][y] = 0;
        const directions = [
            [1, 0], [-1, 0], [0, 1], [0, -1]
        ];
        shuffle(directions); // Randomize directions

        directions.forEach(([dx, dy]) => {
            const nx = x + 2 * dx, ny = y + 2 * dy;
            if (nx > 0 && nx < rows && ny > 0 && ny < cols && grid[nx][ny] === 1) {
                grid[x + dx][y + dy] = 0;
                carve(nx, ny);
            }
        });
    }

    // Start carving from a random odd-indexed cell
    carve(1, 1);
    return grid;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


const mazeData = {
    levels: [
        {
            level: 1,
            grid: generateMaze(10, 10),
            start: { x: 1, y: 1 },
            end: { x: 8, y: 8 }
        },
        {
            level: 2,
            grid: generateMaze(10, 10),
            start: { x: 1, y: 1 },
            end: { x: 8, y: 8 }
        }
    ]
};

export default mazeData;