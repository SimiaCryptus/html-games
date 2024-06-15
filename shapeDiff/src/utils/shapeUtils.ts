// Utility functions for shape generation

export const generateSpecificShape = (index: number): number[][] => {
    switch (index) {
        case 0:
            return [
                [0, 0, 0],
                [1, 0, 0],
                [0, 1, 0],
                [1, 1, 0],
                [0, 2, 0],
            ];
        case 1:
            return [
                [0, 0, 0],
                [1, 0, 0],
                [2, 0, 0],
                [1, 1, 0],
                [1, 2, 0],
            ];
        case 2:
            return [
                [0, 0, 0],
                [1, 0, 0],
                [2, 0, 0],
                [2, 1, 0],
                [2, 2, 0],
            ];
        case 3:
            return [
                [0, 0, 0],
                [0, 1, 0],
                [0, 2, 0],
                [1, 2, 0],
                [2, 2, 0],
            ];
        case 4:
            return [
                [0, 0, 0],
                [0, 1, 0],
                [0, 2, 0],
                [0, 3, 0],
                [0, 4, 0],
            ];
        default:
            return generateConnectedRandomShape();
    }
};

export const generateConnectedRandomShape = (): number[][] => {
    const shape = [[0, 0, 0]];
    const directions = [
        [1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0],
        [0, 0, 1],
        [0, 0, -1],
    ];
    while (shape.length < 5) {
        const lastCube = shape[Math.floor(Math.random() * shape.length)];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const newCube = [
            lastCube[0] + direction[0],
            lastCube[1] + direction[1],
            lastCube[2] + direction[2],
        ];
        // Ensure the new cube is adjacent and not overlapping
        if (!shape.some(cube => cube[0] === newCube[0] && cube[1] === newCube[1] && cube[2] === newCube[2])) {
            shape.push(newCube);
        }
    }
    return shape;
};