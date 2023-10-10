const express = require('express');
const db = require('../db.js');
const router = express.Router();



router.post('/', (req, res) => {
    const { first_name, last_name, country_id, username, password, email, birthdate, sex, image } = req.body;
    const sql = 'INSERT INTO customers (first_name, last_name, country_id, username, password, email, birthdate, sex, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [first_name, last_name, country_id, username, password, email, birthdate, sex, image], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Customer added successfully' });
    });
});

module.exports = router;