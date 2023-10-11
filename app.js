const express = require('express');
const cors = require('cors');
const db = require('./db');
const port = 8080;
const app = express();
const usersRoute = require('./Read/users');
const ordersRoute = require('./Read/orders');
const productsRoute = require('./Read/products.js');
const addusersRoute = require('./Create/users');
const addordersRoute = require('./Create/Orders')
const deleteorderRoute = require('./Create/delete-order')

app.use(cors());
/// test this branch//
app.get('/test-db', (req, res) => {
    db.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            res.status(500).json({ error: 'Database Connection Failed' });
        } else {
            console.log('Connected to MySQL database');
            res.status(200).json({ message: 'Database Connection Successful' });
            db.end();
        }
    });
});
app.use(express.json());
app.use('/users', usersRoute);
app.use('/orders', ordersRoute);
app.use('/products', productsRoute);
app.use('/add-customer', addusersRoute);
app.use('/add-order', addordersRoute);
app.use('/delete', deleteorderRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});