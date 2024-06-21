import {driver, By, until, setup, teardown} from './config.js';
import assert from 'assert';

describe('OnlinePlayModal Component Tests', function() {
    this.timeout(30000);
    beforeEach(async () => {
        await setup();
     });

    afterEach(async () => {
        await teardown();
     });

    it('should open and close the OnlinePlayModal', async () => {
        const onlinePlayButton = await driver.findElement(By.id('online-play-button'));
        await onlinePlayButton.click();

        const modal = await driver.findElement(By.id('online-play-modal'));
        await driver.wait(until.elementIsVisible(modal), 5000);

        const closeButton = await driver.findElement(By.className('close-online-play'));
        await closeButton.click();

        await driver.wait(until.elementIsNotVisible(modal), 5000);
    });

    it('should input game ID and player color', async () => {
        const onlinePlayButton = await driver.findElement(By.id('online-play-button'));
        await onlinePlayButton.click();

        const gameIdInput = await driver.findElement(By.id('game-id-input'));
        const playerColorInput = await driver.findElement(By.id('player-color-input'));

        await gameIdInput.sendKeys('testGame123');
        await playerColorInput.sendKeys('white');

        assert.strictEqual(await gameIdInput.getAttribute('value'), 'testGame123');
        assert.strictEqual(await playerColorInput.getAttribute('value'), 'white');

        const closeButton = await driver.findElement(By.className('close-online-play'));
        await closeButton.click();
    });

    it('should start a new game', async () => {
        const onlinePlayButton = await driver.findElement(By.id('online-play-button'));
        await onlinePlayButton.click();

        const gameIdInput = await driver.findElement(By.id('game-id-input'));
        const playerColorInput = await driver.findElement(By.id('player-color-input'));
        const startGameButton = await driver.findElement(By.id('start-online-game'));

        await gameIdInput.sendKeys('newGame123');
        await playerColorInput.sendKeys('black');
        await startGameButton.click();

        // Add assertions or checks to verify the game started
        // For example, check if the modal closed
        const modal = await driver.findElement(By.id('online-play-modal'));
        await driver.wait(until.elementIsNotVisible(modal), 5000);
    });

    it('should join an existing game', async () => {
        const onlinePlayButton = await driver.findElement(By.id('online-play-button'));
        await onlinePlayButton.click();

        const gameIdInput = await driver.findElement(By.id('game-id-input'));
        const playerColorInput = await driver.findElement(By.id('player-color-input'));
        const joinGameButton = await driver.findElement(By.id('join-online-game'));

        await gameIdInput.sendKeys('existingGame123');
        await playerColorInput.sendKeys('white');
        await joinGameButton.click();

        // Add assertions or checks to verify the game joined
        // For example, check if the modal closed
        const modal = await driver.findElement(By.id('online-play-modal'));
        await driver.wait(until.elementIsNotVisible(modal), 5000);
    });

    it('should leave the game', async () => {
        const onlinePlayButton = await driver.findElement(By.id('online-play-button'));
        await onlinePlayButton.click();

        const leaveGameButton = await driver.findElement(By.id('leave-online-game'));
        await leaveGameButton.click();

        // Add assertions or checks to verify the game left
        // For example, check if the modal closed
        const modal = await driver.findElement(By.id('online-play-modal'));
        await driver.wait(until.elementIsNotVisible(modal), 5000);
    });
});