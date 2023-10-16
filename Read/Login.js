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
                return res.status().json({ error: 'Invalid credentials' });
            }
            const loggedInUsername = results[0].username;
            return res.status(200).json({ message: `logged in as ${loggedInUsername}` });
        }
    );
});

module.exports = router;