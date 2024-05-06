// utils.js

/**
 * Generates a random integer between min and max (inclusive).
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @return {number} A random integer between min and max.
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Checks if two rectangles intersect (collision detection for axis-aligned bounding boxes).
 * @param {object} rect1 - An object with properties x, y, width, and height representing the first rectangle.
 * @param {object} rect2 - An object with properties x, y, width, and height representing the second rectangle.
 * @return {boolean} True if the rectangles intersect, false otherwise.
 */
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

/**
 * Calculates the distance between two points.
 * @param {number} x1 - The x-coordinate of the first point.
 * @param {number} y1 - The y-coordinate of the first point.
 * @param {number} x2 - The x-coordinate of the second point.
 * @param {number} y2 - The y-coordinate of the second point.
 * @return {number} The distance between the two points.
 */
function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Clamps a number between a minimum and maximum value.
 * @param {number} num - The number to clamp.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @return {number} The clamped value.
 */
function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}

// Export the utility functions if using modules
// export { getRandomInt, checkCollision, calculateDistance, clamp };
