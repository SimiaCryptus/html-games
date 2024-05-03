// mazeData.js
const mazeData = {
    levels: [
        {
            level: 1,
            grid: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
                [1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ],
            start: { x: 1, y: 1 },
            end: { x: 8, y: 8 }
        },
        {
            level: 2,
            grid: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
                [1, 0, 1, 0, 1, 0, 0, 0, 1, 1],
                [1, 0, 0, 0, 1, 1, 1, 0, 0, 1],
                [1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ],
            start: { x: 1, y: 1 },
            end: { x: 8, y: 8 }
        }
    ]
};

export default mazeData;