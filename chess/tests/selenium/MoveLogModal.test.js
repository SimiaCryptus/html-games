import { driver, setup, teardown, By, until } from './config.js';

describe('MoveLogModal Component', function() {
    this.timeout(30000);

    beforeEach(async () => {
        await setup();
     });

    afterEach(async () => {
        await teardown();
     });

    it('should open and close the MoveLogModal', async () => {
        const moveLogButton = await driver.findElement(By.id('move-log-button'));
        await moveLogButton.click();

        const modal = await driver.wait(until.elementLocated(By.id('move-log-modal')), 5000);
        assert.strictEqual(await modal.isDisplayed(), true);

        const closeButton = await driver.findElement(By.className('close-move-log'));
        await closeButton.click();

        await driver.wait(until.stalenessOf(modal), 5000);
        assert.strictEqual(await modal.isDisplayed(), false);
    });

    it('should display move log correctly', async () => {
        const moveLogButton = await driver.findElement(By.id('move-log-button'));
        await moveLogButton.click();

        const modal = await driver.wait(until.elementLocated(By.id('move-log-modal')), 5000);
        assert.strictEqual(await modal.isDisplayed(), true);

        const moveLog = await driver.findElement(By.id('move-log'));
        const moves = await moveLog.findElements(By.tagName('div'));
        assert(moves.length > 0);

        await driver.findElement(By.className('close-move-log')).click();
        await driver.wait(until.stalenessOf(modal), 5000);
    });
});