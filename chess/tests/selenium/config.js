import { Builder, until } from 'selenium-webdriver';
import 'chromedriver';
import 'ts-node/register';
import {By} from "selenium-webdriver";

export let driver;

async function setup() {
    driver = new Builder().forBrowser('chrome').build();
    await driver.manage().setTimeouts({ implicit: 5000 });
    await driver.get('http://localhost:3000'); // Adjust the URL to your local server
}

async function teardown() {
    await driver.quit();
}

export {
    setup,
    teardown,
    until,
    By
};