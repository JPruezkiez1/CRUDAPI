const express = require('express');
const db = require('../db.js');
const router = express.Router();
require('dotenv').config();
const baseURL = process.env.BASE_URL;;

router.get('/:id', (req, res) => {
    const fileId = req.params.id;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query('SELECT * FROM Files_with_customer_username WHERE id = ?', [fileId], (err, results) => {
            connection.release();

            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'File not found' });
            }

            const fileUrl = baseURL + results[0].file;
            return res.status(200).json({ id: results[0].id, upload: results[0].upload, File_link: fileUrl, File: results[0].file, Owner: results[0].username, OwnerID: results[0].customerId });
        });
    });
});

router.get('/', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query('SELECT * FROM Files_with_customer_username', (err, results) => {
            connection.release();

            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const modifiedResults = results.map(result => {
                return {
                    id: result.id,
                    upload: result.upload,
                    File_Link: baseURL + result.file,
                    file: result.file,
                    Owner: result.username,
                    OwnerId: result.customerId,
                };
            });

            return res.status(200).json(modifiedResults);
        });
    });
});


router.get('/uploadname/:uploadname', (req, res) => {
    const uploadname = req.params.uploadname;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query('SELECT * FROM Files_with_customer_username WHERE upload = ?', [uploadname], (err, results) => {
            connection.release();

            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Files not found' });
            }

            const files = results.map(result => {
                const fileUrl = baseURL + result.file;
                return { id: result.id, upload: result.upload, File_link: fileUrl, File: result.file, Owner: result.username, OwnerId: result.customerId };
            });

            return res.status(200).json(files);
        });
    });
});

module.exports = router;
