const express = require('express');
const db = require('../db.js');
const router = express.Router();

router.post('/', (req, res) => {
    const { username, password } = req.body;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query(
            'SELECT * FROM customers WHERE username = ? AND password = ?',
            [username, password],
            (err, results) => {
                connection.release();

                if (err) {
                    console.error('Error executing SQL query:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                if (results.length === 0) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                const customer = results[0];
                const loggedInUser = {
                    username: customer.username,
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    status: customer.active,
                    image: customer.image
                };

                return res.status(200).json({ loggedInUser });
            }
        );
    });
});

module.exports = router;
