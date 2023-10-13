const express = require('express');
const db = require('../db.js');
const router = express.Router();

const baseURL = 'http://34.75.37.247/images/';

router.get('/:id', (req, res) => {
    const imageId = req.params.id;
    db.query('SELECT * FROM imagesurls WHERE id = ?', [imageId], (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const imageUrl = baseURL + results[0].image;
        return res.status(200).json({ id: results[0].id, image: imageUrl });
    });
});

router.get('/', (req, res) => {
    db.query('SELECT * FROM imagesurls', (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const modifiedResults = results.map(result => {
            return {
                id: result.id,
                image: baseURL + result.image
            };
        });

        return res.status(200).json(modifiedResults);
    });
});

module.exports = router;
