const express = require('express')
const orderModel = require('../model/order')
const router = express.Router()

// get orders
router.get("/", (req, res) => {

    orderModel
        .find()
        .populate('product', ['name', 'price'])
        .then(orders => {

            res.json({
                msg : "get orders",
                count : orders.length,
                orderInfo : orders.map(order => {
                    return{
                        id : order._id,
                        product : order.product,
                        quantity : order.quantity,
                        data : order.createdAt
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

// detail get order
router.get("/:orderId", (req, res) => {

    const id = req.params.orderId

    orderModel
        .findById(id)
        .populate('product', ['name', 'price'])
        .then(order => {
            if(!order){
                return res.status(404).json({
                    msg : "no order id"
                })
            }
            res.json({
                msg : "get order",
                orderInfo : {
                    id : order._id,
                    product : order.product,
                    quantity : order.quantity,
                    data : order.createdAt
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// register order
router.post('/', (req, res) => {

    const newOrder = new orderModel(
        {
            product : req.body.productId,
            quantity : req.body.qty
        }
    )

    newOrder
        .save()
        .then(order => {
            res.json({
                msg : "register order",
                orderInfo : {
                    id : order._id,
                    product : order.product,
                    quantity : order.quantity,
                    data : order.createdAt
                }
            })
        })
        .catch(err => {
            res.status(404).json({
                msg : err.message
            })
        })
})

// update order
router.patch("/:orderId", (req, res) => {

    const id = req.params.orderId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    orderModel
        .findByIdAndUpdate(id, {$set : updateOps})
        .then((order) => {
            if(!order){
                return res.status(404).json({
                    msg : "no order id"
                })
            }
            res.json({
                msg : "update order by " + id
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// delete orders
router.delete("/", (req, res) => {

    orderModel
        .remove()
        .then(() => {
            res.json({
                msg : "delete orders"
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// detail delete order
router.delete("/:orderId", (req, res) => {

    const id = req.params.orderId

    orderModel
        .findByIdAndRemove(id)
        .then((order) => {
            if(!order){
                return res.status(404).json({
                    msg : "no order id"
                })
            }
            res.json({
                msg : "delete order by " + id
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})


module.exports = router