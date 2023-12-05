const express = require('express');
const cors = require('cors');
const port = 8080;
const app = express();
const usersRoute = require('./Read/users');
const ordersRoute = require('./Read/orders');
const productsRoute = require('./Read/products.js');
const addusersRoute = require('./Create/users');
const addordersRoute = require('./Create/Orders');
const deleteorderRoute = require('./Delete/delete-order');
const imagesRoute = require('./Read/images.js');
const login = require('./Read/Login.js');
const userdelete = require('./Delete/DeleteUsers.js')
const updateusers = require('./Update/UpdateUsers.js')
const cloads = require('./Create/CLoads.js');
app.use(cors());
app.use(express.json());

app.use('/users', usersRoute);
app.use('/orders', ordersRoute);
app.use('/products', productsRoute);
app.use('/add-customer', addusersRoute);
app.use('/add-order', addordersRoute);
app.use('/orderdelete', deleteorderRoute);
app.use('/checkimage', imagesRoute);
app.use('/login', login);
app.use('/userdelete', userdelete);
app.use('/updateuser', updateusers);
app.use('/createload', cloads);
process.on('SIGINT', () => {
    console.log('Server is shutting down.');
    process.exit(0);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
