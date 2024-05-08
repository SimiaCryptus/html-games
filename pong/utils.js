/**
 * Generates a random number between min and max.
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @return {number} A random number between min and max.
 */
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Calculates the reflection angle of the ball when it hits a paddle.
 * @param {number} ballPosY - The y-position of the ball.
 * @param {number} paddlePosY - The y-position of the paddle.
 * @param {number} paddleHeight - The height of the paddle.
 * @return {number} The new angle of the ball in radians.
 */
function calculateReflectionAngle(ballPosY, paddlePosY, paddleHeight) {
    // Normalize the hit position to be between -1 and 1
    let normalizedHitPos = (ballPosY - (paddlePosY + paddleHeight / 2)) / (paddleHeight / 2);

    // Calculate the reflection angle (in radians)
    let maxBounceAngle = Math.PI / 3; // 60 degrees in radians
    return normalizedHitPos * maxBounceAngle;
}

/**
 * Converts an angle in radians to a velocity object with x and y components.
 * @param {number} angle - The angle in radians.
 * @param {number} speed - The speed of the ball.
 * @return {object} An object with 'x' and 'y' properties representing the velocity components.
 */
function angleToVelocity(angle, speed) {
    return {
        x: speed * Math.cos(angle),
        y: speed * Math.sin(angle)
    };
}

// Exporting utility functions to be used in other parts of the game
export { randomBetween, calculateReflectionAngle, angleToVelocity };