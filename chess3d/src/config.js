export const BASE_PATH = process.env.PUBLIC_URL || '.';
export const DEBUG = true || process.env.NODE_ENV !== 'production';

if (DEBUG) {
    console.log('BASE_PATH:', BASE_PATH);
    console.log('DEBUG:', DEBUG);
}