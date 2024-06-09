import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();

puppeteer.use(StealthPlugin());

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [],
        userDataDir: "/Users/hung/Library/Application Support/Google/Chrome/Profile 2",
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('https://www.walmart.com/account/login', {
        waitUntil: 'networkidle2',
    });
    await page.setExtraHTTPHeaders({
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'upgrade-insecure-requests': '1',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9,en;q=0.8'
    });
    await page.waitForSelector('input[name="Email Address"]');
    await page.type('input[name="Email Address"]', process.env.WALMART_EMAIL ?? '',
        {
            delay: 500,
        }
    );
    await page.waitForSelector('#login-continue-button');
    await page.click('#login-continue-button');
    console.log('CLick continue');
    // // Type into search box
    // await page.type('.devsite-search-field', 'automate beyond recorder');

    // // Wait and click on first result
    // const searchResultSelector = '.devsite-result-item-link';
    // await page.waitForSelector(searchResultSelector);
    // await page.click(searchResultSelector);

    // // Locate the full title with a unique string
    // const textSelector = await page.waitForSelector(
    //     'text/Customize and automate'
    // );
    // const fullTitle = await textSelector?.evaluate(el => el.textContent);

    // // Print the full title
    // console.log('The title of this blog post is "%s".', fullTitle);


})();

