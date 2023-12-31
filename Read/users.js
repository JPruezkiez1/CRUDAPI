const express = require('express');
const db = require('../db.js');
const router = express.Router();

router.get('/:id', (req, res) => {
    const userId = req.params.id;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query('SELECT customers.id, customers.first_name AS firstName, customers.last_name AS lastName, customers.sex AS sex, customers.email, customers.username, customers.password, countries.name AS country, DATE_FORMAT(customers.birthdate, "%Y-%m-%d") AS birthDate, customers.image, customers.active AS status FROM customers JOIN countries ON customers.country_id = countries.id WHERE customers.id = ?', [userId], (err, results) => {
            connection.release();

            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.status(200).json(results[0]);
        });
    });
});

router.get('/', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query('SELECT customers.id, customers.first_name AS firstName, customers.last_name AS lastName, customers.sex AS sex, customers.email, customers.username, customers.password, countries.name AS country, DATE_FORMAT(customers.birthdate, "%Y-%m-%d") AS birthDate, customers.image, customers.active AS status FROM customers JOIN countries ON customers.country_id = countries.id', (err, results) => {
            connection.release();

            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(200).json(results);
        });
    });
});

module.exports = router;
