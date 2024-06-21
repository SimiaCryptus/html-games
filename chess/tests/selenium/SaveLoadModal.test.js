import {driver, By, until, setup, teardown} from './config.js';
import assert from 'assert';

describe('SaveLoadModal Component', function() {
    this.timeout(30000);
    beforeEach(async () => {
        await setup();
    });

    afterEach(async () => {
        await teardown();
    });

    it('should open and close the SaveLoadModal', async () => {
        const saveLoadButton = await driver.findElement(By.id('save-load-button'));
        await saveLoadButton.click();

        const modal = await driver.wait(until.elementLocated(By.id('modal')), 5000);
        assert.ok(await modal.isDisplayed(), 'SaveLoadModal should be displayed');

        const closeButton = await driver.findElement(By.className('close'));
        await closeButton.click();

        await driver.wait(until.stalenessOf(modal), 5000);
        assert.ok(!(await modal.isDisplayed()), 'SaveLoadModal should be closed');
    });

    it('should import layout', async () => {
        const saveLoadButton = await driver.findElement(By.id('save-load-button'));
        await saveLoadButton.click();

        const textarea = await driver.findElement(By.id('board-layout'));
        await textarea.sendKeys('sample layout text');

        const importButton = await driver.findElement(By.id('import-layout'));
        await importButton.click();

        // Add assertions to verify the layout was imported correctly
        // This will depend on how the imported layout is reflected in the application

        const closeButton = await driver.findElement(By.className('close'));
        await closeButton.click();
    });

    it('should export layout', async () => {
        const saveLoadButton = await driver.findElement(By.id('save-load-button'));
        await saveLoadButton.click();

        const exportButton = await driver.findElement(By.id('export-layout'));
        await exportButton.click();

        const textarea = await driver.findElement(By.id('board-layout'));
        const layoutText = await textarea.getAttribute('value');

        assert.strictEqual(layoutText, 'expected layout text', 'Exported layout should match expected text');

        const closeButton = await driver.findElement(By.className('close'));
        await closeButton.click();
    });
});