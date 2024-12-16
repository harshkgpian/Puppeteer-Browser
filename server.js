const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle automation requests
app.post('/automate', async (req, res) => {
    try {
        // Modified puppeteer launch configuration for deployment
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu'
            ]
        });
        const page = await browser.newPage();
        await page.goto('https://www.google.com');
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        await browser.close();
        res.json({ message: 'Successfully opened Google!' });
    } catch (error) {
        console.error('Automation error:', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
});

// Use environment port or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
