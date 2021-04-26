const express = require('express')
const checkAuth = require('../middleware/check-auth')
const {
    orders_get_all,
    orders_get_order,
    orders_post_order,
    orders_patch_order,
    orders_delete_all,
    orders_delete_order
} = require('../controller/order')
const router = express.Router()

// get orders
router.get("/", checkAuth, orders_get_all)

// detail get order
router.get("/:orderId", checkAuth, orders_get_order)

// register order
router.post('/', checkAuth, orders_post_order)

// update order
router.patch("/:orderId", checkAuth, orders_patch_order)

// delete orders
router.delete("/", checkAuth, orders_delete_all)

// detail delete order
router.delete("/:orderId", checkAuth, orders_delete_order)


module.exports = router