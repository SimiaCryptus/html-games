import Tile from "../components/Tile.tsx";

const letterDistribution: { [key: string]: number } = {
    A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2, I: 9, J: 1, K: 1, L: 4, M: 2,
    N: 6, O: 8, P: 2, Q: 1, R: 6, S: 4, T: 6, U: 4, V: 2, W: 2, X: 1, Y: 2, Z: 1,
    _: 2 // Blank tiles
};

export const letterValues: { [key: string]: number } = {
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
    N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
    _: 0 // Blank tiles
};

let tileBag: string[] = [];
Object.keys(letterDistribution).forEach(letter => {
    for (let i = 0; i < letterDistribution[letter]; i++) {
        tileBag.push(letter);
    }
});

let tileBagCopy = [...tileBag];
export const drawTiles = (num: number): string[] => {
    const drawnTiles: string[] = [];
    for (let i = 0; i < num; i++) {
        const randomIndex = Math.floor(Math.random() * tileBag.length);
        if (tileBag.length > 0) drawnTiles.push(tileBag.splice(randomIndex, 1)[0]);
    }
    tileBagCopy = [...tileBag];
    return drawnTiles;
};

export const refillRack = (rack: string[]): string[] => {
    const tilesNeeded = 7 - rack.length;
    const newTiles = drawTiles(tilesNeeded);
    return [...rack, ...newTiles];
};
type Board = (Tile | null)[][];

const dictionary: Set<string> = new Set();

export const calculateScoreFromTempBoard = (tempBoard: Board, specialTiles: { [key: string]: string }): number => {
    let totalScore = 0;
    for (let y = 0; y < 15; y++) {
        for (let x = 0; x < 15; x++) {
            const tile = tempBoard[y][x];
            if (tile) {
                totalScore += calculateScore(tile.letter, specialTiles, x, y, 'horizontal');
                totalScore += calculateScore(tile.letter, specialTiles, x, y, 'vertical');
            }
        }
    }
    return totalScore;
};
const loadDictionary = async () => {
    const response = await fetch('/Collins_Scrabble_Words_2019.txt');
    const fileContent = await response.text();
    const words = fileContent.split('\n').map(word => word.trim());
    words.forEach(word => {
        if (word) {
            dictionary.add(word.toUpperCase());
        }
    });
    console.log(`Dictionary loaded with ${dictionary.size} words.`);
};

loadDictionary().catch(error => {
    console.error('Failed to load dictionary:', error);
});

export const createEmptyBoard = (): Board => {
    console.log('Creating an empty board...');
    const board = Array(15).fill(null).map(() => Array(15).fill(null));
    console.log('Empty board created:', board);
    return board;
};

export const createSpecialTiles = (): { [key: string]: string } => {
    return {
        '0,0': 'TW', '0,7': 'TW', '0,14': 'TW',
        '7,0': 'TW', '7,14': 'TW',
        '14,0': 'TW', '14,7': 'TW', '14,14': 'TW',
        '1,1': 'DW', '2,2': 'DW', '3,3': 'DW', '4,4': 'DW', '7,7': 'DW',
        '10,10': 'DW', '11,11': 'DW', '12,12': 'DW', '13,13': 'DW',
        '1,13': 'DW', '2,12': 'DW', '3,11': 'DW', '4,10': 'DW',
        '10,4': 'DW', '11,3': 'DW', '12,2': 'DW', '13,1': 'DW',
        '1,5': 'TL', '1,9': 'TL', '5,1': 'TL', '5,5': 'TL', '5,9': 'TL', '5,13': 'TL',
        '9,1': 'TL', '9,5': 'TL', '9,9': 'TL', '9,13': 'TL', '13,5': 'TL', '13,9': 'TL',
        '0,3': 'DL', '0,11': 'DL', '2,6': 'DL', '2,8': 'DL', '3,0': 'DL', '3,7': 'DL', '3,14': 'DL',
        '6,2': 'DL', '6,6': 'DL', '6,8': 'DL', '6,12': 'DL', '7,3': 'DL', '7,11': 'DL',
        '8,2': 'DL', '8,6': 'DL', '8,8': 'DL', '8,12': 'DL', '11,0': 'DL', '11,7': 'DL', '11,14': 'DL',
        '12,6': 'DL', '12,8': 'DL', '14,3': 'DL', '14,11': 'DL'
    };
};

export const validateWord = (word: string): boolean => {
    console.log(`Validating word: ${word}`);
    const isValid = dictionary.has(word.toUpperCase());
    console.log(`Word validation result for "${word}": ${isValid}`);
    return isValid;
};

export const calculateScore = (word: string, specialTiles: {
    [key: string]: string
}, startX: number, startY: number, direction: 'horizontal' | 'vertical'): number => {
    console.log(`Calculating score for word: ${word}`);
    let score = 0;
    let wordMultiplier = 1;

    word.toUpperCase().split('').forEach((letter, index) => {
        const letterScore = letterValues[letter] || 0;
        let letterMultiplier = 1;

        const x = direction === 'horizontal' ? startX + index : startX;
        const y = direction === 'vertical' ? startY + index : startY;
        const specialTile = specialTiles[`${y},${x}`];

        if (specialTile) {
            if (specialTile === 'DL') {
                letterMultiplier = 2;
            } else if (specialTile === 'TL') {
                letterMultiplier = 3;
            } else if (specialTile === 'DW') {
                wordMultiplier *= 2;
            } else if (specialTile === 'TW') {
                wordMultiplier *= 3;
            }
        }

        score += letterScore * letterMultiplier;
    });

    score *= wordMultiplier;

    console.log(`Score for word "${word}": ${score}`);
    return score;
};
export const validateMove = (board: Board, tempBoard: Board): boolean => {
    console.log('Validating move with temporary board:', tempBoard);

    const words = new Set<string>();

    const generatePossibleWords = (word: string): string[] => {
        if (!word.includes('_')) return [word];
        const possibleWords: string[] = [];
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (const letter of letters) {
            possibleWords.push(...generatePossibleWords(word.replace('_', letter)));
        }
        return possibleWords;
    };

    // Check horizontal words
    for (let y = 0; y < 15; y++) {
        let word = '';
        for (let x = 0; x < 15; x++) {
            const tile = tempBoard[y][x] || board[y][x];
            if (tile) {
                word += tile.letter;
            } else if (word.length > 1) {
                words.add(word);
                word = '';
            } else {
                word = '';
            }
        }
        if (word.length > 1) words.add(word);
    }

    // Check vertical words
    for (let x = 0; x < 15; x++) {
        let word = '';
        for (let y = 0; y < 15; y++) {
            const tile = tempBoard[y][x] || board[y][x];
            if (tile) {
                word += tile.letter;
            } else if (word.length > 1) {
                words.add(word);
                word = '';
            } else {
                word = '';
            }
        }
        if (word.length > 1) words.add(word);
    }

    console.log('Words to validate:', Array.from(words));

    for (const word of words) {
        const possibleWords = generatePossibleWords(word);
        const isValid = possibleWords.some(possibleWord => validateWord(possibleWord));
        if (!isValid) {
            console.log(`Invalid word found: ${word}`);
            return false;
        }
    }

    console.log('All words are valid');
    return true;
};