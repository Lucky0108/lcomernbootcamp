const express = require('express');
const router = express.Router();
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { getToken, processPayments } = require('../controllers/paymentb');
const { getUserById } = require('../controllers/user');

router.param("userId", getUserById);
router.get('/payment/gettoken/:userId', isSignedIn, isAuthenticated, getToken);
router.post('/payment/braintree/:userId', isSignedIn, isAuthenticated, processPayments)

module.exports = router;