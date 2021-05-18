const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');



//Load Chance For Username
const Chance = require('chance');

// Instantiate Chance so it can be used
const chance = new Chance();

exports.signup = (req,res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg
      });
    }

    User.findOne({ $or:[{email: req.body.email}, { $and: [{contact: req.body.contact}, {contact: {$ne: null} }] }] })
    .exec((err,user) => {
        if(err) return res.status(404).json({ error: err })

        if(user) return res.status(400).json({ error: "User Already Exist" })
    
        const { firstName, lastName, email, password, role, contact } = req.body;
        // Using chance to create a random username
        const username = chance.string({ length: 10, casing: 'upper', alpha: true, numeric: true });
        const _user = new User({
            firstName,
            lastName,
            email,
            password,
            role,
            contact,
            user_name: username
        })
        _user.save((error, data) => {
            if(error) {
                return res.status(400).json({
                    error: "Something went wrong!", err: error
                });
            }
            if(data) {
                return res.status(201).json({ message: "User Created Successfully!", data: data })
            }    
        })
    })
}

exports.signin = (req,res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg
      });
    }
    
    User.findOne({ $or: [{email: req.body.email}, { $and: [{contact: req.body.contact},{ contact: {$ne: null} }] }] })
    .exec((err,user) => {
        if(err) res.status(400).json({ error: "Error Occured! Please Try Again Later!" })

        if(user){
            if(user.authenticate(req.body.password)){
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                const { _id, firstName, lastName, fullName, role, email, contact, user_name } = user;
                res.cookie("token", token, { expires: new Date(Date.now() + 24 * 3600000) }) // Cookie expires after 24 hours 
                return res.status(200).json({ 
                    token: token,
                    user: {
                        _id, firstName, lastName, fullName, role, email, contact, user_name
                    } 
                })
            } else {
                return res.status(400).json({ error: "Incorrect Password!!" })
            }
        } else {
            return res.status(404).json({ error: "No User Found!", err: err })
        }
    })
}

exports.signout = (req,res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout Success!" })
}

// protected routes

exports.isSignedIn = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth',
    algorithms: ['sha1', 'RS256', 'HS256']
});

// custom middlewares
exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;

    if(!checker){
        return res.status(403).json({ error: "Access Denied! Authorization Unsuccess!"});
    }
    next();
}

exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "Access Denied, Not an Admin!"
        });
    }
    next();
}