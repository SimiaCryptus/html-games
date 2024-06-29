import ChessPiece from "../components/ChessPiece.tsx";

const pieceToAscii: { [key: string]: { [key: string]: string } } = {
    white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙',
    },
    black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟',
    },
};

// Convert board state to ASCII art
export function convertToAscii(positions: ChessPiece[]): string {
    console.log('Converting board state to ASCII art');
    console.log('Input positions:', positions);

    const board: string[][] = Array(8).fill(null).map(() => Array(8).fill('.'));

    positions.forEach((piece) => {
        const [x, , z] = piece.position;
        board[7 - z][x] = pieceToAscii[piece.color][piece.type];
        console.log(`Placed ${piece.color} ${piece.type} at position [${x}, ${z}]`);
    });

    const asciiArt = board.map((row) => row.join(' ')).join('\n');
    const borderLine = '  ' + '-'.repeat(15);
    const columnLabels = '  a b c d e f g h';

    const result = `${borderLine}\n${asciiArt
        .split('\n')
        .map((line, index) => `${8 - index} ${line} ${8 - index}`)
        .join('\n')}\n${borderLine}\n${columnLabels}`;
    
    console.log('Generated ASCII art:');
    console.log(result);
    
    return result;
}

// Convert ASCII art to board state
export function convertFromAscii(asciiArt: string): ChessPiece[] {
    console.log('Converting ASCII art to board state');
    console.log('Input ASCII art:');
    console.log(asciiArt);

    const lines = asciiArt.trim().split('\n');
    const positions: ChessPiece[] = [];

    const asciiToPiece: { [key: string]: { type: string; color: string } } = {};
    Object.entries(pieceToAscii).forEach(([color, pieces]) => {
        Object.entries(pieces).forEach(([type, ascii]) => {
            asciiToPiece[ascii] = {type, color};
        });
    });

    lines.slice(1, -2).forEach((line, rowIndex) => {
        const row = line.trim().split(' ').slice(1, -1);
        row.forEach((char, colIndex) => {
            if (char !== '.') {
                const {type, color} = asciiToPiece[char];
                const piece = {
                    type,
                    color,
                    position: [colIndex, 0.5, 7 - rowIndex],
                };
                positions.push(piece);
                console.log(`Found ${color} ${type} at position [${colIndex}, ${7 - rowIndex}]`);
            }
        });
    });

    console.log('Converted positions:', positions);
    return positions;
}

// Validate ASCII art format
export function validateAsciiArt(asciiArt: string): boolean {
    console.log('Validating ASCII art format');
    console.log('Input ASCII art:');
    console.log(asciiArt);

    const lines = asciiArt.trim().split('\n');
    if (lines.length !== 10) {
        console.error('Invalid number of lines in ASCII art');
        return false;
    }

    const borderLine = '  ' + '-'.repeat(15);
    if (lines[0] !== borderLine || lines[9] !== borderLine) {
        console.error('Invalid border lines in ASCII art');
        return false;
    }

    const validChars = new Set(['.', ...Object.values(pieceToAscii.white), ...Object.values(pieceToAscii.black)]);

    for (let i = 1; i <= 8; i++) {
        const parts = lines[i].trim().split(' ');
        if (parts.length !== 10) {
            console.error(`Invalid number of parts in line ${i}`);
            return false;
        }
        if (parts[0] !== `${9 - i}` || parts[9] !== `${9 - i}`) {
            console.error(`Invalid row numbers in line ${i}`);
            return false;
        }
        for (let j = 1; j <= 8; j++) {
            if (!validChars.has(parts[j])) {
                console.error(`Invalid character '${parts[j]}' at position [${j - 1}, ${i - 1}]`);
                return false;
            }
        }
    }

    console.log('ASCII art format is valid');
    return true;
}

// Helper function to log the current board state
export function logBoardState(positions: ChessPiece[]): void {
    console.log('Current board state:');
    const asciiArt = convertToAscii(positions);
    console.log(asciiArt);
}