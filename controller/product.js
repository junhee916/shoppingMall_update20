const productModel = require('../model/product')

exports.products_get_all = (req, res) => {

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
};

exports.products_get_product = (req, res) => {

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
};

exports.products_post_product = (req, res) =>{

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
};

exports.products_patch_product = (req, res) => {

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
};

exports.products_delete_all = (req, res) => {

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
};

exports.products_delete_product = (req, res) => {

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
};