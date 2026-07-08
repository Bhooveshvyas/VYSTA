const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../Controller/product.controller.js');
const { protect } = require('../Middleware/auth.middleware.js');
const { admin } = require('../Middleware/admin.middleware.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct);
router.route('/:id').get(getProductById).put(protect, admin, upload.single('image'), updateProduct).delete(protect, admin, deleteProduct);



module.exports = router;
