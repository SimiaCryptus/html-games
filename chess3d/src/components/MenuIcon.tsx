import React, {useCallback, useEffect} from 'react';

interface MenuIconProps {
    onClick: () => void;
}

const MenuIcon: React.FC<MenuIconProps> = ({onClick}) => {
    console.log('MenuIcon: Component function called');

    const handleClick = useCallback(() => {
        console.log('MenuIcon: Button clicked, calling onClick prop');
        onClick();
    }, [onClick]);

    useEffect(() => {
        console.log('MenuIcon: Component mounted');
        return () => {
            console.log('MenuIcon: Component will unmount');
        };
    }, []);

    console.log('MenuIcon: Rendering component', {onClick});

    return (
        <button
            className="menu-icon"
            onClick={handleClick}
            aria-label="Open menu"
            onMouseEnter={() => console.log('MenuIcon: Mouse entered button', {timeStamp: new Date().toISOString()})}
            onMouseLeave={() => console.log('MenuIcon: Mouse left button', {timeStamp: new Date().toISOString()})}
            onFocus={() => console.log('MenuIcon: Button focused')}
            onBlur={() => console.log('MenuIcon: Button blurred')}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            {console.log('MenuIcon: SVG rendered')}
        </button>
    );
};

console.log('MenuIcon: Component defined', {componentName: MenuIcon.name});

console.log('MenuIcon: Exporting component');
export default MenuIcon;
console.log('MenuIcon: Component exported');