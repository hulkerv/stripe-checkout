const {Router} = require('express');
const router = Router();

const {renderProductForm, 
       createNewProduct, 
       renderProducts, 
       renderEditForm, 
       updateProduct, 
       deleteProduct, 
       viewProduct} = require('../controllers/products.controllers');

const {isAuthenticated} = require('../helpers/auth')

// New Product
router.get('/products/new-product', isAuthenticated, renderProductForm );
router.post('/products/new-product', createNewProduct );

// Get all products
router.get('/', renderProducts );

// Product view
router.get('/products/product/:id', viewProduct);

// Edit products
router.get('/products/edit-product/:id', isAuthenticated, renderEditForm );
router.put('/products/edit-product', updateProduct);

// Delete Product
router.delete('/products/delete-product/:id', isAuthenticated, deleteProduct);

module.exports = router;