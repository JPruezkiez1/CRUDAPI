const express = require('express');
const db = require('../db.js');
const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM latest_product_prices', (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const parsedResults = results.map((row) => ({
            ...row,
            price: parseFloat(row.price),
        }));

        return res.status(200).json(parsedResults);
    });
});

router.get('/:id', (req, res) => {
    const productID = req.params.id;
    db.query('SELECT * FROM latest_product_prices WHERE id = ?', [productID], (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const parsedResult = {
            ...results[0],
            price: parseFloat(results[0].price),
        };

        return res.status(200).json(parsedResult);
    });
});

module.exports = router;
