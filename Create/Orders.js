const express = require('express');
const db = require('../db.js');
const router = express.Router();


router.post('/', (req, res) => {
    const { id, customer_id, products, date } = req.body;
    db.query('INSERT INTO orders (id, customer_id, date) VALUES (?, ?, ?)', [id, customer_id, date], (err, result) => {
        if (err) {
            console.error('Error creating order:', err);
            res.status(501).json({ error: 'check orderID' });
            return;
        }
        const productValues = products.map(product => [id, product.product_id, product.quantity]);
        db.query('INSERT INTO order_products (order_id, product_id, quantity) VALUES ?', [productValues], (err, result) => {
            if (err) {
                console.error('Error creating order products:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            res.status(201).json({ message: 'Order created successfully' });
        });
    });
});

module.exports = router;