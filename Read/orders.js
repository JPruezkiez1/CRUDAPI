const express = require('express');
const db = require('../db.js');
const router = express.Router();

router.get('/', (req, res) => {
    const ordersQuery = 'SELECT ot.order_id as id, ot.order_date as date, ot.customer_id as userId, ' +
        'oppu.product_id as id, oppu.product_name as title, oppu.price_per_unit as price, ' +
        'oppu.description, oppu.category, oppu.image, oppu.quantity ' +
        'FROM orders_with_total ot ' +
        'JOIN order_products_with_price_per_unit oppu ' +
        'ON ot.order_id = oppu.order_id';

    db.query(ordersQuery, (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const ordersMap = new Map();
        results.forEach((row) => {
            const orderId = row.id;
            if (!ordersMap.has(orderId)) {
                ordersMap.set(orderId, {
                    id: orderId,
                    date: row.date,
                    userId: row.userId,
                    products: [],
                    totalqty: 0,
                    totalPrice: 0,
                });
            }
            const order = ordersMap.get(orderId);
            order.products.push({
                id: row.id,
                title: row.title,
                price: parseFloat(row.price),
                description: row.description,
                category: row.category,
                image: row.image,
                quantity: row.quantity,
            });
            order.totalqty += row.quantity;
            order.totalPrice += parseFloat(row.price) * row.quantity;
        });

        const orders = Array.from(ordersMap.values());
        res.status(200).json(orders);
    });
});

router.get('/:id', (req, res) => {
    const orderId = req.params.id;
    const ordersQuery = 'SELECT ot.order_id as id, ot.order_date as date, ot.customer_id as userId, ' +
        'oppu.product_id as id, oppu.product_name as title, oppu.price_per_unit as price, ' +
        'oppu.description, oppu.category, oppu.image, oppu.quantity ' +
        'FROM orders_with_total ot ' +
        'JOIN order_products_with_price_per_unit oppu ' +
        'ON ot.order_id = oppu.order_id ' +
        'WHERE ot.order_id = ?';

    db.query(ordersQuery, [orderId], (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = {
            id: results[0].id,
            date: results[0].date,
            userId: results[0].userId,
            products: [],
            totalqty: 0,
            totalPrice: 0,
        };
        results.forEach((row) => {
            order.products.push({
                id: row.id,
                title: row.title,
                price: parseFloat(row.price),
                description: row.description,
                category: row.category,
                image: row.image,
                quantity: row.quantity,
            });
            order.totalqty += row.quantity;
            order.totalPrice += parseFloat(row.price) * row.quantity;
        });

        res.status(200).json(order);
    });
});

module.exports = router;
