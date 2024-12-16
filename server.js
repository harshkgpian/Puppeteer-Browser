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
        const browser = await puppeteer.launch({ headless: false }); // Set headless: false to see the browser
        const page = await browser.newPage();
        await page.goto('https://www.google.com');
        
        // Wait a few seconds before closing (optional)
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        await browser.close();
        res.json({ message: 'Successfully opened Google!' });
    } catch (error) {
        res.status(500).json({ message: 'Error: ' + error.message });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Website available at: http://localhost:${PORT}`);
});
