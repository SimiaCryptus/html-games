import {driver, setup, teardown} from './config.js';
import assert from 'assert';
import {By} from "selenium-webdriver";

describe('ChessBoard Component Tests', function () {
    this.timeout(30000);

    before(async () => {
        await setup();
    });

    after(async () => {
        await teardown();
    });

    it('should render the chessboard', async () => {
        const chessboard = await driver.findElement(By.className('chessboard'));
        assert(chessboard, 'Chessboard should be rendered');
    });

    it('should highlight selected piece and possible moves', async () => {
        const square = await driver.findElement(By.css('.row:nth-child(2) .square:nth-child(1)'));
        await square.click();

        const selectedSquare = await driver.findElement(By.css('.square.selected'));
        assert(selectedSquare, 'Selected piece should be highlighted');

        const highlightedSquares = await driver.findElements(By.css('.square.highlight'));
        assert(highlightedSquares.length > 0, 'Possible moves should be highlighted');
    });

    it('should move a piece and switch turns', async () => {
        const initialStatus = await driver.findElement(By.className('status')).getText();
        await driver.findElement(By.css('.row:nth-child(2) .square:nth-child(1)')).click();

        await driver.findElement(By.css('.row:nth-child(4) .square:nth-child(1)')); // Adjust the selector as needed
        await driver.findElement(By.css('.row:nth-child(2) .square:nth-child(1)')).click();

        await driver.findElement(By.css('.row:nth-child(4) .square:nth-child(1)')); // Adjust the selector as needed
        await driver.findElement(By.css('.square:nth-child(1)')).click();

        await driver.findElement(By.css('.row:nth-child(4) .square:nth-child(1)')).click();

        const newStatus = await driver.findElement(By.className('status')).getText();
        

        await driver.findElement(By.css('.row:nth-child(4) .square:nth-child(1)')); // Adjust the selector as needed
        assert.notEqual(initialStatus, newStatus, 'Turn should switch after a valid move');
    });

    it('should not allow invalid moves', async () => {
        const square = await driver.findElement(By.css('.row:nth-child(2) .square:nth-child(1)'));

        const invalidTargetSquare = await driver.findElement(By.css('.row:nth-child(8) .square:nth-child(8)')); // Adjust the selector as needed
        await invalidTargetSquare.click();


        const selectedSquare = await driver.findElement(By.css('.square.selected'));
        assert(selectedSquare, 'Selected piece should remain highlighted after invalid move');
    });

    it('should update game state after each move', async () => {
        const initialGameState = await driver.executeScript('return window.__CHESS_GAME_STATE__');
        await driver.findElement(By.css('.row:nth-child(2) .square:nth-child(1)')).click();

        await driver.findElement(By.css('.row:nth-child(4) .square:nth-child(1)')); // Adjust the selector as needed
        await driver.findElement(By.css('.square:nth-child(1)')).click();

        await driver.findElement(By.css('.row:nth-child(4) .square:nth-child(1)')).click();

        const newGameState = await driver.executeScript('return window.__CHESS_GAME_STATE__');
        assert.notDeepStrictEqual(initialGameState, newGameState, 'Game state should update after each move');
    });
});