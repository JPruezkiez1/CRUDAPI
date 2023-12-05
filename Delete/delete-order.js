const express = require('express');
const db = require('../db.js');
const router = express.Router();


router.delete('/:id', (req, res) => {
    const orderId = req.params.id;
    db.query('DELETE FROM orders WHERE id = ?', [orderId], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.status(201).json({ message: 'Order deleted sucessfully', orderId });
    });
});

module.exports = router;