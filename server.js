// server.js
const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('Missing URL');

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // خذي الـ HTML النهائي بعد تنفيذ JS
        const content = await page.content();

        await browser.close();
        res.send(content);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => console.log('Scraper running on port 3000'));
