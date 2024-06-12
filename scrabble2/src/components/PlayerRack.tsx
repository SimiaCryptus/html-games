import React from 'react';
import Tile from './Tile.tsx';
import {Grid, Paper, Typography} from '@mui/material';
import {letterValues} from "../utils/gameLogic.ts";

interface PlayerRackProps {
    rack: string[];
    onTileSelect: (letter: string, index: number) => void;
    selectedTileIndex: number | null;
    currentPlayer: number;
}

const PlayerRack: React.FC<PlayerRackProps> = ({rack, onTileSelect, selectedTileIndex, currentPlayer}) => {
    console.log('Rendering PlayerRack with tiles:', rack);
    console.log('Selected tile index:', selectedTileIndex);

    return (
        <Paper style={{
            padding: '0.5rem',
            border: currentPlayer === 0 ? '2px solid blue' : '2px solid green',
            backgroundColor: 'lightyellow'
        }}>
            <Typography variant="h6">Your Tiles</Typography>
            <Grid container spacing={1} style={{marginTop: '0.5rem'}}>
                {rack.map((tile, index) => (
                    <Grid item key={index}>
                        <Tile
                            letter={tile}
                            points={letterValues[tile]}
                            onClick={() => onTileSelect(tile, index)}
                            isSelected={selectedTileIndex === index}
                            isTemporary={false}
                        />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default PlayerRack;