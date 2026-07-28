const express = require('express');
const { addOrderItems, getMyOrders, getOrders, updateOrderStatus, deleteOrder, getOrderById, updateOrder } = require('../Controller/order.controller.js');
const { protect } = require('../Middleware/auth.middleware.js');
const { admin } = require('../Middleware/admin.middleware.js');
const { orderLimiter } = require("../Middleware/rateLimiter.middleware.js");

const router = express.Router();

router.route('/').post(protect, orderLimiter, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id').get(protect, admin, getOrderById).put(protect, admin, updateOrder).delete(protect, admin, deleteOrder);

module.exports = router;