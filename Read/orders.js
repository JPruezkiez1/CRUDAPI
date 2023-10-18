const express = require('express');
const db = require('../db.js');
const router = express.Router();

router.get('/', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query('SELECT * FROM orders_with_total', (err, results) => {
            connection.release();

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
                    totalqty: row.total_items,
                    totalPrice: row.total_value,
                };
            });

            const fetchProductsForOrders = (order, callback) => {
                db.getConnection((err, connection) => {
                    if (err) {
                        console.error('Error getting database connection:', err);
                        return callback(err);
                    }

                    connection.query('SELECT * FROM order_products_with_price_per_unit WHERE order_id = ?', [order.id], (err, productResults) => {
                        connection.release();

                        if (err) {
                            console.error('Error executing SQL query:', err);
                            return callback(err);
                        }
                        order.products = productResults.map((productRow) => ({
                            id: productRow.product_id,
                            title: productRow.product_name,
                            price: productRow.price_per_unit,
                            description: productRow.description,
                            image: productRow.image,
                            quantity: productRow.quantity,
                        }));

                        return callback(null, order);
                    });
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
});

router.get('/:id', (req, res) => {
    const orderId = req.params.id;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query('SELECT * FROM orders_with_total WHERE order_id = ?', [orderId], (err, results) => {
            connection.release();

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
                totalqty: results[0].total_items,
                totalPrice: results[0].total_value,
            };

            db.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting database connection:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                connection.query('SELECT * FROM order_products_with_price_per_unit WHERE order_id = ?', [orderId], (err, productResults) => {
                    connection.release();

                    if (err) {
                        console.error('Error executing SQL query:', err);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    order.products = productResults.map((productRow) => ({
                        id: productRow.product_id,
                        title: productRow.product_name,
                        price: productRow.price_per_unit,
                        description: productRow.description,
                        image: productRow.image,
                        quantity: productRow.quantity,
                    }));

                    res.status(200).json(order);
                });
            });
        });
    });
});

module.exports = router;
