import React from 'react';
import {Paper, Typography} from '@mui/material';

interface TileProps {
    letter: string;
    points?: number;
    isTemporary?: boolean;
    isSelected?: boolean;
    onClick?: () => void;
    specialType?: string;
}

const Tile: React.FC<TileProps> = ({
                                       letter,
                                       points = 0,
                                       isTemporary = false,
                                       isSelected = false,
                                       onClick,
                                       specialType
                                   }) => {
    const getBackgroundColor = () => {
        if (isTemporary) return 'lightgray';
        if (isSelected) return 'yellow';
        if (specialType === 'TW') return 'red';
        if (specialType === 'DW') return 'lightpink';
        if (specialType === 'TL') return 'blue';
        if (specialType === 'DL') return 'lightblue';
        return 'white';
    };

    return (
        <Paper
            style={{
                width: 'calc(60vmin / 15)',
                height: 'calc(60vmin / 15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                backgroundColor: getBackgroundColor(),
                color: isTemporary ? 'orange' : 'black',
                cursor: 'pointer',
                border: isSelected ? '2px solid black' : 'none'
            }}
            onClick={onClick}
        >
            <Typography variant="h6" component="div">
                {letter}
            </Typography>
            {letter && !isTemporary && (
                <Typography
                    variant="caption"
                    component="div"
                    style={{
                        position: 'absolute',
                        bottom: '0.04rem',
                        right: '0.04rem',
                        fontSize: '0.55rem'
                    }}
                >
                    {points}
                </Typography>
            )}
        </Paper>
    );
};

export default Tile;