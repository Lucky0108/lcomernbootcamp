const express = require('express');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getOrderById, createOrder, getAllOrders, getOrderStatus, updateStatus } = require('../controllers/order');
const { updateStock } = require('../controllers/product');
const router = express.Router();
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");

// Params
router.param("orderId", getOrderById)
router.param("userId", getUserById);

// Actual Routes

// Create
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder);

// Read
router.get('/order/all/:userId', isSignedIn, isAuthenticated, isAdmin, getAllOrders)

// Status Of Order
router.get('/order/status/:userId', isSignedIn, isAuthenticated, isAdmin, getOrderStatus)
router.put('/order/:orderId/status/:userId', isSignedIn, isAuthenticated, isAdmin, updateStatus)

module.exports = router;