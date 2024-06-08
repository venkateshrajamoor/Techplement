const express = require('express');
const app = express();
const connectToMongo = require('./db');
const cors = require('cors');

connectToMongo();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PUT, DELETE',
    credentials: true
}));

app.use(express.json());

const port = 5500;

app.use('/api/quote', require('./Routes/quote'));

app.use(function(error, req, res, next) {
    console.error(error.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log("Server started on port: ", port);
});
