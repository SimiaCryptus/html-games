import React from 'react';
import {Grid, Paper, Typography} from '@mui/material';

interface Player {
    name: string;
    score: number;
}

interface ScoreboardProps {
    players: Player[];
    currentPlayer: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({players, currentPlayer}) => {
    console.log('Rendering Scoreboard with players:', players);
    return (
        <Paper style={{padding: '0.5rem', border: '2px solid black'}}>
            <Typography variant="h6">Scoreboard</Typography>
            <Grid container spacing={2}>
                {players.map((player, index) => (
                    <Grid item xs={6} key={index}>
                        <Typography variant="body1" style={{
                            fontWeight: currentPlayer === index ? 'bold' : 'normal',
                            backgroundColor: currentPlayer === index ? 'yellow' : 'transparent'
                        }}>
                            {player.name}: {player.score}
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default Scoreboard;