const User = require("../models/user");
const { Order } = require("../models/order");
const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');

exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec((err,user) => {
        if(err || !user ) return res.status(400).json({ error: "No User Found!" })
        req.profile = user;
        next();
    })
};

exports.getUser = (req,res) => {
    req.profile.hash_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
}

exports.getAllUser = (req,res) => {
    User.find({}).exec((err,users) => {
        if(err || !users ) return res.status(400).json({error: "Database is Empty!", err})
        if(users) return res.status(200).json({ users: users })
    })

}

exports.updateUser = (req,res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: errors.array()[0].msg
      });
    }

    if(req.body.password) {
        req.body.hash_password = bcrypt.hashSync(req.body.password, 10);
    }
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true, useFindAndModify: false},
        (err, user) => {
            if(err) return res.status(400).json({ error: "Update not success!" });
            user.hash_password = undefined;
            res.json(user)
        }
        )
}

exports.userPurchaseList = (req,res) => {
    Order.find({ user: req.profile._id })
    .populate("user", "_id fullName")
    .exec((err, order) => {
        if(err) return res.status(400).json({ error: "No order in this account!"})
        return res.json(order)
    })
}

exports.pushOrderInPurchaseList = (req,res, next) => {

    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    });

    //Store this is DB
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $push: { purchases: purchases } },
        { new: true, useFindAndModify: false },
        (err, purchaseList) => {
            if(err) return res.status(400).json({ error: "Unable to save Purchase List!" });
        next();
        }    
    );
};