const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRouter = require('./routes/usersRouter.js');
const productsRouter = require('./routes/productsRouter.js');
const cartRouter = require('./routes/cartRouter.js');
const authMiddleware = require('./middlewares/authMiddleware.js');
require('dotenv').config();

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/cart', authMiddleware, cartRouter);

app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message });
});

mongoose.connect(process.env.DB_HOST);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

