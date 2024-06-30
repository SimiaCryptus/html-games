import React from 'react';

interface ThemeColors {
    stroke: string;
    background: string;
    hover: string;
}

type ThemeOption = 'light' | 'dark' | 'custom';

interface MenuIconProps {
    onClick: () => void;
    theme?: ThemeOption;
    customColors?: ThemeColors;
}

const MenuIcon: React.FC<MenuIconProps> = React.memo(({onClick, theme = 'light', customColors}) => {
    const handleClick = () => {
        onClick();
    };

    const getThemeColors = (): ThemeColors => {
        switch (theme) {
            case 'light':
                return {stroke: '#000000', background: '#FFFFFF', hover: '#F0F0F0'};
            case 'dark':
                return {stroke: '#FFFFFF', background: '#333333', hover: '#444444'};
            case 'custom':
                return customColors || {stroke: '#000000', background: '#FFFFFF', hover: '#F0F0F0'};
            default:
                return {stroke: '#000000', background: '#FFFFFF', hover: '#F0F0F0'};
        }
    };

    const colors = getThemeColors();

    const buttonStyle: React.CSSProperties = {
        backgroundColor: colors.background,
        border: 'none',
        borderRadius: '4px',
        padding: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    return (
        <button
            className="menu-icon"
            onClick={handleClick}
            aria-label="Open menu"
            style={buttonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.background)}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.stroke}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </button>
    );
});

export default MenuIcon;