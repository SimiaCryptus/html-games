import {driver, setup, teardown, until} from './config.js';
import assert from 'assert';

import {By} from "selenium-webdriver";

describe('ChessPiece Component Tests', function() {
    this.timeout(30000);
    before(async () => {
        await setup();
    });

    after(async () => {
        await teardown();
    });

    it('should render a white pawn correctly', async () => {
        const piece = await driver.findElement(By.css('.chess-piece img[alt="P"]'));
        const src = await piece.getAttribute('src');
        assert(src.includes('img/Chess_pl60.png'), 'White pawn image not rendered correctly');
    });

    it('should render a black knight correctly', async () => {
        const piece = await driver.findElement(By.css('.chess-piece img[alt="n"]'));
        const src = await piece.getAttribute('src');
        assert(src.includes('img/Chess_nd60.png'), 'Black knight image not rendered correctly');
    });

    // Add more tests for other pieces as needed
});