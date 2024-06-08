// quote.js (Backend)
const express = require("express");
const Quote = require('../Models/quoteModel');
const router = express.Router();

// Route to get the quote of the day
router.get('/quoteOfTheDay', async (req, res) => {
    try {
        const quoteOfTheDay = await Quote.findOne({ date: { $lte: new Date().setHours(0, 0, 0, 0) } }).limit(1);
        res.status(200).json({ quoteOfTheDay });
    } catch (error) {
        console.error('Error fetching quote of the day:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get the list of authors
router.get('/authors', async (req, res) => {
    try {
        const authors = await Quote.distinct('author');
        res.status(200).json(authors);
    } catch (error) {
        console.error('Error fetching authors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get quotes by author name
router.get('/getQuoteFromAuthor', async (req, res) => {
    try {
        const { authorName } = req.query;
        const quotes = await Quote.find({ author: { $regex: authorName, $options: 'i' } });
        if (quotes && quotes.length === 0) {
            return res.status(400).json({ message: 'No authors found', quotes });
        }
        res.status(200).json(quotes);
    } catch (error) {
        console.error('Error retrieving quotes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get a random quote
router.get('/randomQuote', async (req, res) => {
    try {
        const count = await Quote.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomQuote = await Quote.findOne().skip(randomIndex);
        res.status(200).json(randomQuote);
    } catch (error) {
        console.error('Error fetching random quote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to upload quotes
router.post('/uploadQuotes', async (req, res) => {
    try {
        const quotesData = req.body;
        const savedQuotes = await Promise.all(quotesData.map(async (quoteData) => {
            const { author, content } = quoteData;
            const quote = new Quote({ author: author, quoteText: content, date: new Date() });
            await quote.save();
            return quote;
        }));

        res.status(200).json({ message: 'Quotes uploaded successfully', quotes: savedQuotes });
    } catch (error) {
        console.error('Error uploading quotes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to search quotes by author name or quote text
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const quotes = await Quote.find({
            $or: [
                { author: { $regex: query, $options: 'i' } }, // Search by author name
                { quoteText: { $regex: query, $options: 'i' } } // Search by quote text
            ]
        });
        
        res.status(200).json(quotes);
    } catch (error) {
        console.error('Error searching quotes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
