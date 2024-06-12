import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import ScrabbleBoard from './components/ScrabbleBoard.tsx';
import PlayerRack from './components/PlayerRack.tsx';
import Scoreboard from './components/Scoreboard.tsx';
import {
    calculateScoreFromTempBoard,
    createEmptyBoard,
    createSpecialTiles,
    drawTiles,
    letterValues,
    refillRack,
    validateMove
} from './utils/gameLogic.ts';
import {Box, Button, Container, Grid, TextField, Typography} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.ts'; // Import the theme from a separate file

const App: React.FC = () => {
    const [players, setPlayers] = useState([
        {name: 'Player 1', score: 0, rack: drawTiles(7)},
        {name: 'Player 2', score: 0, rack: drawTiles(7)}
    ]);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [board, setBoard] = useState(createEmptyBoard());
    const [specialTiles, setSpecialTiles] = useState(createSpecialTiles());
    const [selectedTile, setSelectedTile] = useState<{ letter: string, index: number } | null>(null);
    const [selectedBoardTile, setSelectedBoardTile] = useState<{ x: number, y: number } | null>(null);
    const [selectedTempTile, setSelectedTempTile] = useState<{ x: number, y: number } | null>(null);
    const [tempBoard, setTempBoard] = useState(board);
    const [rack, setRack] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
    const [numPlayers, setNumPlayers] = useState(2);
    const [initialRack, setInitialRack] = useState(players.map(player => player.rack));
    const [initialTempBoard, setInitialTempBoard] = useState(createEmptyBoard());
    const [settingsOpen, setSettingsOpen] = useState(true);
    const [passModalOpen, setPassModalOpen] = useState(false);

    console.log('App initialized with players:', players);
    console.log('Current player:', currentPlayer);
    console.log('Initial board state:', board);

    const startNewGame = () => {
        const initialPlayers = playerNames.slice(0, numPlayers).map(name => ({
            name,
            score: 0,
            rack: drawTiles(7)
        }));
        setPlayers(initialPlayers);
        setBoard(createEmptyBoard());
        setRack(drawTiles(7));
        setCurrentPlayer(0);
        setSelectedTile(null);
        setInitialRack(initialPlayers.map(player => player.rack));
        setInitialTempBoard(createEmptyBoard());
        setTempBoard(createEmptyBoard());
        setSpecialTiles(createSpecialTiles());
        setSettingsOpen(false);
        console.log('New game started');
    };

    const handleTileSelect = (letter: string, index: number) => {
        console.log(`Tile selected: ${letter} at index ${index}`);
        setSelectedTile({letter, index});
    };

    const handleBoardClick = (x: number, y: number) => {
        console.log(`Board clicked at position: (${x}, ${y})`);
        if (selectedTile) {
            const newTempBoard = tempBoard.map(row => row.slice());
            newTempBoard[y][x] = {letter: selectedTile.letter, value: letterValues[selectedTile.letter]};
            const newRack = players[currentPlayer].rack.filter((_, i) => i !== selectedTile.index);
            const newPlayers = players.map((player, index) =>
                index === currentPlayer ? {...player, rack: newRack} : player
            );
            setTempBoard(newTempBoard);
            setPlayers(newPlayers);
            setRack(newRack);
            setInitialRack(newPlayers.map(player => player.rack));
            setSelectedTile(null);
            console.log('Temporary board updated:', newTempBoard);
        } else if (selectedBoardTile) {
            const newTempBoard = tempBoard.map(row => row.slice());
            newTempBoard[y][x] = newTempBoard[selectedBoardTile.y][selectedBoardTile.x];
            newTempBoard[selectedBoardTile.y][selectedBoardTile.x] = null;
            setTempBoard(newTempBoard);
            setSelectedBoardTile(null);
            setInitialTempBoard(newTempBoard);
            console.log('Temporary board updated:', newTempBoard);
        } else if (tempBoard[y][x]) {
            setSelectedTempTile({x, y});
        }
    };

    const handleTileMove = (fromX: number, fromY: number, toX: number, toY: number) => {
        const newTempBoard = tempBoard.map(row => row.slice());
        newTempBoard[toY][toX] = newTempBoard[fromY][fromX];
        newTempBoard[fromY][fromX] = null;
        setTempBoard(newTempBoard);
        console.log('Tile moved:', {fromX, fromY, toX, toY});
    };

    const handleBoardTileSelect = (x: number, y: number) => {
        console.log(`Board tile selected at position: (${x}, ${y})`);
        setSelectedBoardTile({x, y});
    };

    const commitMove = () => {
        console.log('Committing move');
        if (!validateMove(board, tempBoard)) {
            alert('Invalid move');
            console.log('Invalid move');
            return;
        }
        const newBoard = board.map((row, rowIndex) => row.map((tile, colIndex) => tempBoard[rowIndex][colIndex] || tile));
        setSelectedTile(null);

        const newPlayers = players.map((player, index) => {
            const newRack = refillRack(player.rack);
            if (index === currentPlayer) {
                const newScore = player.score + calculateScoreFromTempBoard(tempBoard, specialTiles) - player.rack.length + newRack.length;
                return {
                    score: newScore,
                    rack: newRack,
                    name: player.name
                }
            }
            return {
                ...player,
                rack: newRack
            };
        });

        setPlayers(newPlayers.map(player => ({...player, rack: refillRack(player.rack)})));
        setRack(refillRack(newPlayers[currentPlayer].rack));
        setBoard(newBoard);
        setTempBoard(newBoard);
        setInitialRack(newPlayers.map(player => player.rack));
        setCurrentPlayer((currentPlayer + 1) % players.length);
        setPassModalOpen(true);
        console.log('Move committed. Current player:', currentPlayer);
    };

    const resetBoard = () => {
        console.log('Resetting board to pre-move state');
        setTempBoard(createEmptyBoard());
        setSelectedTile(null);
        const newPlayers = players.map((player, index) => {
            if (index === currentPlayer) {
                return {
                    ...player,
                    rack: initialRack[index]
                };
                return player;
            }
        });
        setPlayers(newPlayers);
        setRack(initialRack[currentPlayer]);
        console.log('Board reset');
    };

    // Removed the makeMove function as it is not used in the current implementation

    const handlePlayerNameChange = (index: number, name: string) => {
        const newPlayerNames = [...playerNames];
        newPlayerNames[index] = name;
        setPlayerNames(newPlayerNames);
    };

    const handleNumPlayersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        if (value >= 2 && value <= 4) {
            setNumPlayers(value);
        }
    };

    const handlePassModalClose = () => {
        setPassModalOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Container style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                padding: '0',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Modal
                    open={settingsOpen}
                    onClose={() => setSettingsOpen(false)}
                    aria-labelledby="settings-modal-title"
                    aria-describedby="settings-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '25rem',
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <Typography id="settings-modal-title" variant="h6" component="h2">
                            Game Settings
                        </Typography>
                        <TextField
                            label="Number of Players"
                            type="number"
                            value={numPlayers}
                            onChange={handleNumPlayersChange}
                            inputProps={{min: 2, max: 4}}
                            fullWidth
                            margin="normal"
                        />
                        {Array.from({length: numPlayers}).map((_, index) => (
                            <TextField
                                key={index}
                                label={`Player ${index + 1} Name`}
                                value={playerNames[index] || ''}
                                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        ))}
                        <Button variant="contained" onClick={startNewGame} fullWidth>
                            Start New Game
                        </Button>
                    </Box>
                </Modal>
                <Modal
                    open={passModalOpen}
                    onClose={handlePassModalClose}
                    aria-labelledby="pass-modal-title"
                    aria-describedby="pass-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '20rem',
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <Typography id="pass-modal-title" variant="h6" component="h2">
                            Pass to Next Player
                        </Typography>
                        <Typography id="pass-modal-description" sx={{mt: 2}}>
                            Please pass the device to {players[currentPlayer].name}.
                        </Typography>
                        <Button variant="contained" onClick={handlePassModalClose} fullWidth sx={{mt: 2}}>
                            Continue
                        </Button>
                    </Box>
                </Modal>
                <Grid container spacing={1}
                      style={{flex: 1, flexDirection: 'column', height: '100vmin', overflow: 'hidden'}}>
                    <Grid item xs={12} style={{flex: '0 1 auto', height: '10vmin'}}>
                        <Scoreboard players={players} currentPlayer={currentPlayer}/>
                    </Grid>
                    <Grid item xs={12} style={{
                        flex: '1 1 auto',
                        display: 'flex',
                        height: '70vmin',
                        width: '70vmin',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ScrabbleBoard
                            board={board}
                            tempBoard={tempBoard}
                            specialTiles={specialTiles}
                            onBoardClick={handleBoardClick}
                            onTileMove={handleTileMove}
                            onTileSelect={handleBoardTileSelect}
                            selectedTile={selectedBoardTile}
                            selectedTempTile={selectedTempTile}
                        />
                    </Grid>
                    <Grid item xs={12} style={{
                        flex: '0 1 auto',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        marginTop: '0.5rem'
                    }}>
                        <Button variant="contained" onClick={resetBoard}>
                            Reset Move
                        </Button>
                        <Button variant="contained" onClick={commitMove}
                                disabled={tempBoard.flat().every(tile => tile === null)}>
                            Commit Move
                        </Button>
                    </Grid>
                    <Grid item xs={12} style={{flex: '0 1 auto', marginTop: '0.5rem'}}>
                        <PlayerRack
                            rack={players[currentPlayer].rack}
                            onTileSelect={handleTileSelect}
                            selectedTileIndex={selectedTile?.index || null}
                            currentPlayer={currentPlayer}
                        />
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default App;