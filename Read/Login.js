const express = require('express');
const db = require('../db.js');
const router = express.Router();

router.post('/', (req, res) => {
    const { username, password } = req.body;

    db.query(
        'SELECT * FROM customers WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            return res.status(200).json({ message: 'Login successful' });
        }
    );
});

module.exports = router;