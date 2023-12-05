const express = require('express');
const db = require('../db.js');
const router = express.Router();


router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query('DELETE FROM customers WHERE id = ?', [userId], (err, results) => {
            connection.release();

            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.status(200).json({ message: 'User deleted successfully' });
        });
    });
});

module.exports = router;