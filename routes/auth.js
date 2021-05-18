const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const { signup, signin, signout, isSignedIn, isAuthenticated } = require('../controllers/auth');

router.post("/signup",[
    check("firstName","Name should be atleast 3 characters").isLength({ min:3 }),
    check("email", "Valid Email is required").isEmail(),
    check("contact","Contact should be a valid Indian number").if(body('contact').exists()).isMobilePhone(['en-IN']),
    check("password", "Password should be atleast 5 Characters").isLength({ min:5 }),
], signup);

router.post("/signin",[
    check("email","Valid Email is required").if(body('email').exists()).isEmail(),
    check("contact","Contact should be a valid Indian number").if(body('contact').exists()).isMobilePhone(['en-IN']),
    check("password","Password field is required").isLength({ min: 1 })
], signin)

router.get('/signout', signout)

router.get('/testroute', isSignedIn, isAuthenticated, (req,res) => {
    res.status(200).json({ res: req.auth})
})

module.exports = router;