import ChessPiece from "../components/ChessPiece.tsx";

const PIECE_MAPPINGS = {
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

const ASCII_TO_PIECE = Object.entries(PIECE_MAPPINGS).reduce((acc, [color, pieces]) => {
    Object.entries(pieces).forEach(([type, ascii]) => {
        acc[ascii] = {type, color};
    });
    return acc;
}, {} as { [key: string]: { type: string; color: string } });

const VALID_CHARS = new Set(['.', ...Object.values(PIECE_MAPPINGS.white), ...Object.values(PIECE_MAPPINGS.black)]);

const BORDER_LINE = '  ' + '-'.repeat(15);
const COLUMN_LABELS = '  a b c d e f g h';

function getPieceAscii(color: string, type: string): string {
    return PIECE_MAPPINGS[color][type];
}

function getPieceFromAscii(ascii: string): { type: string; color: string } | null {
    return ASCII_TO_PIECE[ascii] || null;
}

// Convert board state to ASCII art
export function convertToAscii(positions: ChessPiece[]): string {
    console.log('Converting board state to ASCII art');
    console.log('Input positions:', positions);

    const board: string[][] = Array(8).fill(null).map(() => Array(8).fill('.'));

    positions.forEach((piece) => {
        const [x, y] = piece.position;
        board[7 - y][x] = getPieceAscii(piece.color, piece.type);
        console.log(`Placed ${piece.color} ${piece.type} at position [${x}, ${y}]`);
    });

    const asciiArt = board.map((row) => row.join(' ')).join('\n');

    const result = `${BORDER_LINE}\n${asciiArt
        .split('\n')
        .map((line, index) => `${8 - index} ${line} ${8 - index}`)
        .join('\n')}\n${BORDER_LINE}\n${COLUMN_LABELS}`;

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

    lines.slice(1, -2).forEach((line, rowIndex) => {
        const row = line.trim().split(' ').slice(1, -1);
        row.forEach((char, colIndex) => {
            if (char !== '.') {
                const piece = getPieceFromAscii(char);
                if (!piece) return;
                const {type, color} = piece;
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

    if (lines[0] !== BORDER_LINE || lines[9] !== BORDER_LINE) {
        console.error('Invalid border lines in ASCII art');
        return false;
    }

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
            if (!VALID_CHARS.has(parts[j])) {
                console.error(`Invalid character '${parts[j]}' at position [${j - 1}, ${i - 1}]`);
                return false;
            }
        }
    }

    console.log('ASCII art format is valid');
    return true;
}
