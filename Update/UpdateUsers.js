const express = require('express');
const db = require('../db.js');
const router = express.Router();


router.patch('/:id', (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, country_id, username, password, email, birthday, sex, image, active } = req.body;

    let query = 'UPDATE customers SET ';
    let values = [];

    if (first_name) {
        query += 'first_name = ?, ';
        values.push(first_name);
    }
    if (last_name) {
        query += 'last_name = ?, ';
        values.push(last_name);
    }
    if (country_id) {
        query += 'country_id = ?, ';
        values.push(country_id);
    }
    if (username) {
        query += 'username = ?, ';
        values.push(username);
    }
    if (password) {
        query += 'password = ?, ';
        values.push(password);
    }
    if (email) {
        query += 'email = ?, ';
        values.push(email);
    }
    if (birthday) {
        query += 'birthday = ?, ';
        values.push(birthday);
    }
    if (sex) {
        query += 'sex = ?, ';
        values.push(sex);
    }
    if (image) {
        query += 'image = ?, ';
        values.push(image);
    }
    if (active) {
        query += 'active = ?, ';
        values.push(active);
    }
    query = query.slice(0, -2);

    query += ' WHERE id = ?';
    values.push(userId);

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query(query, values, (err, results) => {
            connection.release();

            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.status(200).json({ message: 'User updated successfully' });
        });
    });
});


module.exports = router;