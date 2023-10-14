const express = require('express');
const cors = require('cors');
const port = 8080;
const app = express();
const usersRoute = require('./Read/users');
const ordersRoute = require('./Read/orders');
const productsRoute = require('./Read/products.js');
const addusersRoute = require('./Create/users');
const addordersRoute = require('./Create/Orders');
const deleteorderRoute = require('./Create/delete-order');
const imagesRoute = require('./Read/images.js');
const login = require('./Read/Login.js');
const db = require('./db');
app.use(cors());
app.use(express.json());
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    console.log('Connected to the database.');
});
app.use('/users', usersRoute);
app.use('/orders', ordersRoute);
app.use('/products', productsRoute);
app.use('/add-customer', addusersRoute);
app.use('/add-order', addordersRoute);
app.use('/delete', deleteorderRoute);
app.use('/checkimage', imagesRoute);
app.use('/login', login);

process.on('SIGINT', () => {
    db.end((err) => {
        if (err) {
            return console.error('Error closing the database connection:', err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
