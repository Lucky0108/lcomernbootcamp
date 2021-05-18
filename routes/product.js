const express = require('express');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getCategoryById } = require('../controllers/category');
const { getProductById, createProduct, getProduct, image, removeProduct, updateProduct, getAllProducts, getAllUniqueCategories } = require('../controllers/product');
const { getUserById } = require('../controllers/user');
const router = express.Router();

// Params
router.param("productId", getProductById);
router.param("categoryId", getCategoryById);
router.param("userId", getUserById);

// Actual Routes

// Create Route
router.post('/product/create/:userId', isSignedIn, isAuthenticated, isAdmin, createProduct);

// Read Route
router.get('/product/:productId', getProduct);
router.get("/product/image/:productId", image);

// Update Route
router.put('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, updateProduct);

// Delete Route
router.delete('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, removeProduct);

// Listing Route
router.get('/products', getAllProducts);
router.get('/products/categories', getAllUniqueCategories)

module.exports = router;