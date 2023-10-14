const express = require('express');
const db = require('../db.js');
const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM orders_with_total', (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const ordersWithProducts = results.map((row) => {
            return {
                id: row.order_id,
                date: row.order_date,
                userId: row.customer_id,
                products: [],
                totalqty: 0,
                totalPrice: 0,
            };
        });

        const fetchProductsForOrders = (order, callback) => {
            db.query('SELECT * FROM order_products_with_price_per_unit WHERE order_id = ?', [order.id], (err, productResults) => {
                if (err) {
                    console.error('Error executing SQL query:', err);
                    return callback(err);
                }
                order.products = productResults.map((productRow) => ({
                    id: productRow.product_id,
                    title: productRow.product_name,
                    price: parseFloat(productRow.price_per_unit),
                    description: productRow.description,
                    category: productRow.category,
                    image: productRow.image,
                    quantity: productRow.quantity,
                }));
                order.totalqty = order.products.reduce((total, product) => total + product.quantity, 0);
                order.totalPrice = order.products.reduce((total, product) => total + product.price * product.quantity, 0);

                return callback(null, order);
            });
        };

        const fetchOrdersWithProducts = (orders, callback) => {
            let count = 0;
            orders.forEach((order) => {
                fetchProductsForOrders(order, (err, updatedOrder) => {
                    if (err) {
                        console.error('Error fetching products for order:', err);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    count++;
                    if (count === orders.length) {
                        return callback(orders);
                    }
                });
            });
        };

        fetchOrdersWithProducts(ordersWithProducts, (orders) => {
            res.status(200).json(orders);
        });
    });
});

router.get('/:id', (req, res) => {
    const orderId = req.params.id;
    db.query('SELECT * FROM orders_with_total WHERE order_id = ?', [orderId], (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const order = {
            id: results[0].order_id,
            date: results[0].order_date,
            userId: results[0].customer_id,
            products: [],
            totalqty: 0,
            totalPrice: 0,
        };
        db.query('SELECT * FROM order_products_with_price_per_unit WHERE order_id = ?', [orderId], (err, productResults) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            order.products = productResults.map((productRow) => ({
                id: productRow.product_id,
                title: productRow.product_name,
                price: parseFloat(productRow.price_per_unit),
                description: productRow.description,
                category: productRow.category,
                image: productRow.image,
                quantity: productRow.quantity,
            }));
            order.totalqty = order.products.reduce((total, product) => total + product.quantity, 0);
            order.totalPrice = order.products.reduce((total, product) => total + product.price * product.quantity, 0);

            res.status(200).json(order);
        });
    });
});

module.exports = router;