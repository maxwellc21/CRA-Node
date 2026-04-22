const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', createProxyMiddleware({ target: process.env.AUTH_SERVICE_URL, changeOrigin: true }));
app.use('/api/products', createProxyMiddleware({ target: process.env.PRODUCT_SERVICE_URL, changeOrigin: true }));
app.use('/api/reviews', createProxyMiddleware({ target: process.env.REVIEW_SERVICE_URL, changeOrigin: true }));
app.use('/api/users', createProxyMiddleware({ target: process.env.USER_SERVICE_URL, changeOrigin: true }));

app.use(express.static(path.join(__dirname, '../../frontend/public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
