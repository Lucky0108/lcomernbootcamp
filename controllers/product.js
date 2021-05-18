const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,product)  => {
        if(err || !product) return res.status(404).json({ error: "No Product Found!" })
        req.product = product;
        next();
    })
}

exports.createProduct = (req,res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err,fields, file) => {
        if(err) return res.status(400).json({ error: "Something went wrong!", error: err })

        const { name, description, price, category, stock } = fields

        if( !name || !description || !price || !category || !stock) {
            return res.status(400).json({ error: "Please Fill All Required Fields!" })
        }
        let _product = new Product(fields)

        // Handle File here
        if(file.image) {
            if(file.image.size > 3000000) {
                return res.status(400).json({ error: "File size too big! (Should be less than 3 Mb)" })
            }
            _product.image.data = fs.readFileSync(file.image.path);
            _product.image.contentType = file.image.type;
        }

        //Save To The Database
        _product.save((err, product) => {
            if(err) return res.status(400).json({ error: "Failed To Save Product!", err: err })
            res.json({ product: product })
        })
    })
}

exports.getProduct = (req,res) => {
    req.product.image = undefined;
    return res.json({ product: req.product })
}

// Load Image IN Background Middleware
exports.image = (req,res,next) => {
    if(req.product.image.data){
        res.set("Content-Type", req.product.image.contentType)
        return res.send(req.product.image.data)
    }
    next();
}

exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err,fields, file) => {
        if(err) return res.status(400).json({ error: "Something went wrong!", err: err })

        // Updation Logic
        let _product = req.product;
        _product = _.extend(_product, fields)

        // Handle File here
        if(file.image) {
            if(file.image.size > 3000000) {
                return res.status(400).json({ error: "File size too big! (Should be less than 3 Mb)" })
            }
            _product.image.data = fs.readFileSync(file.image.path);
            _product.image.contentType = file.image.type;
        }

        //Save To The Database
        _product.save((err, product) => {
            if(err) return res.status(400).json({ error: "Failed To Update Product!", err: err })
            res.json({ product: product })
        })
    })
}

exports.removeProduct = (req,res) => {
    const product = req.product;

    product.remove((err, deletedProduct) => {
        if(err) return res.status(400).json({ error: `Failed To Delete ${deletedProduct.name} Product` });
        res.json({ message: `${deletedProduct.name} Deleted Successfully!` });
    })
}

// Listing Products
exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8 ;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id" ;
    
    Product.find()
    .select("-image")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err,products) => {
        if(err) return res.status(400).json({ error: "No Product Found!" })
        res.json({ products: products })
    })
}

exports.updateStock = (req,res, next) => {

    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: {stock: -prod.count, sold: +prod.count} }
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err,products) => {
        if(err) return res.status(400).json({ error: "Bulk Operation Failed!" })
        next();
    })

}

exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category", {}, (err,category) => {
        if(err) return res.status(400).json({ error: "No Category Found!" })
        res.json({ cate: category })
    })
}