const express = require("express");
const { check, body } = require('express-validator');
const { getUserById, getUser, getAllUser, updateUser, userPurchaseList } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const router = express.Router();

// Params
router.param("userId", getUserById);

// Actual Routes
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId", isSignedIn, isAuthenticated, [
    check("firstName","Name should be atleast 3 characters").isLength({ min:3 }),
    check("contact","Contact should be a valid Indian number").if(body('contact').exists()).isMobilePhone(['en-IN']),
    check("password", "Password should be atleast 5 Characters").if(body('password').exists()).isLength({ min:5 }),
], updateUser);

router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;