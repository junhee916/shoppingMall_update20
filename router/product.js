const express = require('express')
const productModel = require('../model/product')
const multer = require('multer')
const router = express.Router()

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './uploads')
    },
    filename : function(req, file, cb){
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    // reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }
    else{
        cb(null, false)
    }
}

const upload = multer({
    storage : storage,
    limit : {
        filesize : 1024 * 1024 * 5
    },
    fileFilter : fileFilter
})

// get products
router.get("/", (req, res) => {

    productModel
        .find()
        .then(products => {
            console.log(products)
            res.json({
                msg : "get products",
                count : products.length,
                productInfo : products.map(product => {
                    return{
                        id : product._id,
                        name : product.name,
                        price : product.price,
                        data : product.createdAt
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// detail get product
router.get("/:productId", (req, res) => {

    const id = req.params.productId

    productModel
        .findById(id)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    msg : "no product id"
                })
            }
            res.json({
                msg : "get prodcut",
                productInfo : {
                    id : product._id,
                    name : product.name,
                    price : product.price,
                    data : product.createdAt
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// register product
router.post("/", upload.single('productImage'), (req, res) =>{

    const {name, price} = req.body

    const newProduct = new productModel(
        {
            name,
            price,
            productImage : req.file.path
        }
    )

    newProduct
        .save()
        .then(product => {
            res.json({
                msg : "register product",
                productInfo : {
                    id : product._id,
                    name : product.name,
                    price : product.price,
                    productImage : product.productImage,
                    data : product.createdAt
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// update product
router.patch("/:productId", (req, res) => {

    const id = req.params.productId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    productModel
        .findByIdAndUpdate(id, {$set : updateOps})
        .then((product) => {
            if(!product){
                return res.status(404).json({
                    msg : "no product id"
                })
            }
            res.json({
                msg : "update product by " + id
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// delete products
router.delete("/", (req, res) => {

    productModel
        .remove()
        .then(() => {
            res.json({
                msg : "delete products"
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// detail product
router.delete("/:productId", (req, res) => {

    const id = req.params.productId

    productModel
        .findByIdAndRemove(id)
        .then((product) => {
            if(!product){
                return res.status(404).json({
                    msg : "no product id"
                })
            }
            res.json({
                msg : "delete product by " + id
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

module.exports = router