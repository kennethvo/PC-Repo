const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8082;

app.use(cors({
    origin: '*',
    methods: ['GET', 'HEAD'],
    allowedHeaders: ['*']
}));

app.use(express.static(path.join(__dirname, 'dist/products')));

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});