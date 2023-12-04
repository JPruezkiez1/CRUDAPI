const express = require('express');
const db = require('../db.js');
const router = express.Router();
require('dotenv').config();
const baseURL = process.env.BASE_URL;;

router.get('/:id', (req, res) => {
    const imageId = req.params.id;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query('SELECT * FROM images_with_customer_username WHERE id = ?', [imageId], (err, results) => {
            connection.release();

            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Image not found' });
            }

            const imageUrl = baseURL + results[0].image;
            const fName = results[0].image;
            return res.status(200).json({ id: results[0].id, name: results[0].name, image: imageUrl, FileName: fName, Owner: username, OwnerID: customerId });
        });
    });
});

router.get('/', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query('SELECT * FROM imagesurls', (err, results) => {
            connection.release();

            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const modifiedResults = results.map(result => {
                return {
                    id: result.id,
                    name: result.name,
                    image: baseURL + result.image,
                    FileName: result.image,
                    Owner: result.username,
                    OwnerId: result.customerId,
                };
            });

            return res.status(200).json(modifiedResults);
        });
    });
});


router.get('/name/:name', (req, res) => {
    const imageName = req.params.name;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query('SELECT * FROM imagesurls WHERE name = ?', [imageName], (err, results) => {
            connection.release();

            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Image not found' });
            }

            const images = results.map(result => {
                const imageUrl = baseURL + result.image;
                const fName = result.image;
                return { id: result.id, name: result.name, image: imageUrl, FileName: fName, Owner: result.username, OwnerId: result.customerId };
            });

            return res.status(200).json(images);
        });
    });
});




module.exports = router;
