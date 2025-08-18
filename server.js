// // server.js
// const express = require('express');
// const puppeteer = require('puppeteer');
// const app = express();

// app.get('/scrape', async (req, res) => {
//     const url = req.query.url;
//     if (!url) return res.status(400).send('Missing URL');

//     try {
//         const browser = await puppeteer.launch({ headless: true });
//         const page = await browser.newPage();
//         await page.goto(url, { waitUntil: 'networkidle2' });

//         // خذي الـ HTML النهائي بعد تنفيذ JS
//         const content = await page.content();

//         await browser.close();
//         res.send(content);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// app.listen(3000, () => console.log('Scraper running on port 3000'));

// server.js
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('Missing URL');

    let browser;
    try {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: puppeteer.executablePath('chrome'),
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          });     

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // هات المحتوى النهائي بعد تنفيذ JS
        const content = await page.content();

        res.send(content);
    } catch (err) {
        console.error('Scrape error:', err.message);
        res.status(500).send('Scraping failed: ' + err.message);
    } finally {
        if (browser) await browser.close();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Scraper running on port ${PORT}`));