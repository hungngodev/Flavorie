import dotenv from 'dotenv';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
dotenv.config();

puppeteer.use(StealthPlugin());

export const groceryGenerating = async (groceryList: string[]) => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        defaultViewport: null,
        headless: false,
        args: [],
        userDataDir: "/Users/hung/Library/Application Support/Google/Chrome/Profile 2",
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
    const page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );
    // Navigate the page to a URL
    // await page.goto("https://www.walmart.com/lists/favorites", {
    //     waitUntil: 'networkidle2',
    // });
    // const list = ['milk', 'sugar']
    // for (let i = 1; i < 3; i++) {
    //     const inputSelector = "#maincontent > main > div > div > div.pr4-l > div.dn.db-l.mv3-l > section > section > div > div > div > div > input"
    //     await page.waitForSelector(inputSelector);
    //     await page.type(inputSelector, list[i - 1], {
    //         delay: Math.floor(Math.random() * 100) + 50
    //     });
    //     await page.keyboard.press('Enter');
    //     await new Promise(resolve => setTimeout(resolve, 450));
    //     const findItems = `#maincontent > main > div > div > section.order-3.relative.pr4-l > ul > li:nth-child(1) > div.flex.flex-wrap.mh0-l.mh3 > div.w-100.mt1.mt2-l.flex.items-center > div.pl3.pl4-l.flex.flex-auto.items-center.w-80 > div > section > div > button`
    //     await page.waitForSelector(findItems);
    //     await page.click(findItems);
    //     await new Promise(resolve => setTimeout(resolve, 369));
    //     const selectFirstItem = `        #maincontent > main > div > div > section.order-3.relative.pr4-l > ul > li:nth-child(1) > div.w-100.b--black.bb.b--light-gray.pb3 > div.ml3 > section > section > div > ul > li:nth-child(1) > div > div.relative.h3.h4-l > div > section > button`
    //     await new Promise(resolve => setTimeout(resolve, 200));
    //     await page.waitForSelector(selectFirstItem);
    //     await page.click(selectFirstItem);
    //     await new Promise(resolve => setTimeout(resolve, 3000));
    // }
    await page.goto("https://www.instacart.com/store/big-y/your-lists");
    const context = await browser.defaultBrowserContext()
    const instaCreateNew = '#store-wrapper > div > div > div.e-1lekzkb button';
    await page.waitForSelector(instaCreateNew);
    await page.click(instaCreateNew);
    await new Promise(resolve => setTimeout(resolve, 500));
    // const storeSelector = '#id-20 > div.e-1hudhoo > div.e-1dg87ul > div > button > div';
    // await page.waitForSelector(storeSelector);
    // await page.click(storeSelector);
    // await new Promise(resolve => setTimeout(resolve, 500));
    // for (let i = 1; i < 10; i++) {
    //     const bigYSelector = `#id-21 > div.e-1hudhoo > div:nth-child(${i})`;
    //     await page.waitForSelector(bigYSelector);
    //     const spanSelector = `#id-21 > div.e-1hudhoo > div:nth-child(${i}) > a > span.e-7lsoan > span:nth-child(1) > span`;
    //     await page.waitForSelector(spanSelector);
    //     const span = await page.$(spanSelector);
    //     const text = await page.evaluate(span => span?.textContent, span);
    //     if (text.toString().includes('Big Y')) {
    //         await page.click(bigYSelector);
    //         break;
    //     }
    // }

    const titleSelector = '#title';
    await page.waitForSelector(titleSelector);
    await page.type(titleSelector, groceryListNames[Math.floor(Math.random() * groceryListNames.length)], {
        delay: Math.floor(Math.random() * 100) + 50
    });

    const nextButtonSelector = `div.e-1hudhoo > div > div > div.e-3qvlhb > button`;
    await page.waitForSelector(nextButtonSelector);
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.click(nextButtonSelector);
    for (let i = 1; i < groceryList.length; i++) {
        const searchBarButton = `div.e-1hudhoo > div.e-1awx5o3 > div.e-124dr7b > button`;
        await page.waitForSelector(searchBarButton);
        await page.click(searchBarButton);

        const inputSelector = `div.e-1hudhoo #search-bar-input`;
        await page.waitForSelector(inputSelector);
        await page.type(inputSelector, groceryList[i - 1], {
            delay: Math.floor(Math.random() * 100) + 50
        });
        await page.keyboard.press('Enter');
        await new Promise(resolve => setTimeout(resolve, 500));

        const selectFirstItem = `div.e-1hudhoo > div > div:nth-child(3) > ul > li:nth-child(1) > div > div > a`;
        await page.waitForSelector(selectFirstItem);
        await page.click(selectFirstItem);
        await new Promise(resolve => setTimeout(resolve, 500));

        const addSelector = `div.e-879jf2 > button`;
        await page.waitForSelector(addSelector);
        await new Promise(resolve => setTimeout(resolve, 500));
        await page.click(addSelector);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    const finalizeSelector = `div.e-1hudhoo > div.e-3qvlhb > button`;
    await page.waitForSelector(finalizeSelector);
    await page.click(finalizeSelector);
    await new Promise(resolve => setTimeout(resolve, 500));
    const shareLink = `#store-wrapper > div.e-epq820 > div:nth-child(1) > div > div > div > div.e-13e1zgq > div > button:nth-child(2)`;
    await page.waitForSelector(shareLink);
    await page.click(shareLink);
    await new Promise(resolve => setTimeout(resolve, 500));
    const currentURl = await page.url();
    await context.overridePermissions(currentURl, ['clipboard-read'])
    const copiedText = await page.evaluate(`(async () => await navigator.clipboard.readText())()`)
    console.log(copiedText);
    await browser.close();
    return copiedText;
};

const groceryListNames: string[] = [
    "My Big Y Shopping List",
    "Grocery Run Notes",
    "Essentials for the Week",
    "My Pantry Refill List",
    "Shopping Reminders",
    "Grocery Must-Haves",
    "My Market Checklist",
    "Weekly Grocery Planner",
    "My Shopping Agenda",
    "Food & Supplies List",
    "My Grocery Rundown",
    "Household Needs",
    "My Market Memo",
    "My Grocery Cart",
    "Big Y Essentials",
    "My Weekly Haul",
    "Shopping To-Do List",
    "My Grocery Checklist",
    "Big Y Picks",
    "My Shopping Itinerary",
    "Shopping Necessities",
    "My Grocery Notes",
    "My Market Must-Haves",
    "Big Y Buys",
    "Shopping Inventory",
    "My Food and More List",
    "Shopping Prep List",
    "Grocery Grab List",
    "My Shopping Summary",
    "Big Y Planner",
    "Weekly Shopping Essentials",
    "My Fresh Finds",
    "My Grocery Gatherings",
    "Market Day Notes",
    "My Shopping Strategy",
    "My Food Plan",
    "My Shopping Details",
    "Grocery Day Reminders",
    "My Big Y Basket",
    "Weekly Needs List",
    "My Shopping Prep",
    "Market Day Checklist",
    "My Weekly Replenish List",
    "My Shopping Blueprint",
    "Grocery Day To-Do",
    "My Big Y Collection",
    "Shopping Essentials List",
    "My Food Diary",
    "Market Trip List",
    "My Shopping Essentials",
    "Grocery Gathering Notes",
    "My Weekly Stock-Up",
    "My Food and Supplies List",
    "Big Y Reminders",
    "Shopping Essentials Planner",
    "My Weekly Grocery Rundown",
    "Grocery Day Checklist",
    "My Market Essentials",
    "My Big Y Necessities",
    "Shopping Inventory List",
    "My Food Essentials",
    "Market Day Planner",
    "My Big Y Agenda",
    "Weekly Market List",
    "My Grocery Essentials",
    "My Market Notes",
    "Big Y To-Do List",
    "Shopping Needs List",
    "My Grocery Strategy",
    "My Food Inventory",
    "Market Essentials Checklist",
    "My Shopping Summary",
    "My Big Y Buys",
    "Weekly Shopping Plan",
    "My Grocery Day Notes",
    "Shopping Essentials Rundown",
    "My Market Trip",
    "Big Y Grocery Plan",
    "My Weekly Haul List",
    "My Food & Supply Planner",
    "Market Run Essentials",
    "My Shopping Schedule",
    "Big Y Inventory",
    "My Weekly List",
    "Shopping Necessities Planner",
    "My Big Y Stock-Up",
    "Grocery Essentials List",
    "My Market Day Plan",
    "My Shopping Blueprint",
    "My Big Y Needs",
    "Shopping Day Notes",
    "My Weekly Inventory",
    "Market Essentials List",
    "Daily Shopping List",
    "My Grocery Haul",
    "Weekly Replenish Notes",
    "Grocery Day Plan",
    "My Weekly Market Haul",
    "Big Y To-Buy List",
    "Weekly Supply List",
    "My Fresh Market List",
    "Essentials Checklist",
    "Market Must-Haves",
    "Big Y Shopping Notes",
    "My Market Buys",
    "Shopping Strategy",
    "Grocery Prep",
    "My Weekly Food Plan",
    "My Grocery Inventory",
    "Market Buys List",
    "Weekly Essentials",
    "My Big Y Essentials",
    "Shopping Agenda",
    "My Weekly Market Needs",
    "Grocery Essentials Planner",
    "Big Y Essentials List",
    "Weekly Grocery List",
    "My Big Y Planner",
    "My Shopping Essentials List",
    "Grocery Day Essentials",
    "Weekly Market Notes",
    "My Shopping Needs",
    "Grocery Shopping Plan",
    "My Market Replenish List",
    "Weekly Food List",
    "My Shopping Plan",
    "Market Essentials Planner",
    "Grocery Haul Notes",
    "My Big Y Stock-Up List",
    "Weekly Market Essentials",
    "My Grocery Must-Haves",
    "Market Day Essentials",
    "My Big Y List",
    "Weekly Shopping Notes",
    "Grocery Plan List",
    "My Shopping Needs List",
    "Market Essentials Inventory",
    "My Grocery Essentials Plan",
    "Weekly Shopping Schedule",
    "My Market Day Essentials",
    "Big Y Shopping Checklist",
    "Weekly Replenish Plan",
    "My Market Day List",
    "Grocery Day Plan",
    "My Weekly Essentials",
    "Shopping Day Essentials",
    "My Market Needs",
    "Big Y Day Plan",
    "Weekly Food Essentials",
    "My Shopping Day List",
    "Market Replenish Plan",
    "Grocery Essentials Notes",
    "My Weekly Shopping Essentials",
    "Big Y Essentials Planner",
    "Weekly Market Schedule",
    "My Grocery Schedule",
    "Market Needs List",
    "My Big Y Essentials List",
    "Shopping Day Plan",
    "Weekly Grocery Essentials",
    "My Market Day Planner",
    "Big Y Day Essentials",
    "My Weekly Shopping List",
    "Market Essentials Notes",
    "Weekly Grocery Notes",
    "My Big Y Shopping Plan",
    "Grocery Replenish List",
    "My Weekly Essentials List",
    "Market Day Checklist",
    "My Shopping Essentials Plan",
    "Big Y Replenish Plan",
    "Weekly Grocery Planner",
    "My Market Shopping List",
    "Market Day Plan",
    "My Grocery Plan",
    "Big Y Shopping Essentials",
    "Weekly Essentials List",
    "My Market Day Plan",
    "Grocery Day Essentials List",
    "My Weekly Market Plan",
    "Big Y Essentials Notes",
    "Weekly Shopping Schedule",
    "My Market Day Planner",
    "Market Essentials Checklist",
    "My Weekly Grocery Plan",
    "Big Y Essentials List",
    "My Shopping Day Plan",
    "Weekly Market Essentials",
    "Grocery Essentials Planner",
    "My Market Day Plan",
    "Weekly Shopping Essentials",
    "My Big Y Checklist",
    "Grocery Day Plan",
    "My Weekly Market Checklist",
    "Market Day Essentials",
    "My Big Y Shopping Day",
    "Weekly Essentials Planner",
    "My Market Day Plan",
    "Big Y Essentials List",
    "Weekly Grocery Plan",
    "My Shopping Day Plan",
    "Market Essentials Notes",
    "My Weekly Essentials Plan",
    "Big Y Shopping Planner",
    "Grocery Day Essentials",
    "My Weekly Market Essentials",
    "Market Day Plan",
    "My Big Y Shopping Checklist",
    "Weekly Essentials List",
    "My Grocery Essentials Planner",
    "Market Day Notes",
    "My Weekly Shopping Plan",
    "Big Y Essentials Checklist",
    "Weekly Grocery Schedule",
    "My Market Day Plan",
    "Grocery Essentials Plan",
    "My Weekly Essentials Checklist"
]
