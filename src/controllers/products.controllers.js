const productsCtrl = {};

const Product = require('../models/Product');

// New Product
productsCtrl.renderProductForm = async (req,res) => {
    res.render('products/new-product');  
};

productsCtrl.createNewProduct =  async (req,res) => {
    const product = new Product();
    product.name = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;
    product.img_filename = req.file.filename;
    product.img_path = '/img/uploads/' + req.file.filename;
    product.img_originalname =req.file.originalname;
    product.mimetype = req.file.mimetype;
    product.img_size = req.file.size;
    await product.save();
    req.flash('success_msg', 'Product saved successfully');
    res.redirect('/products/new-product');
};

// Get all products
productsCtrl.renderProducts = async (req,res) => {
    const products = await Product.find();
    res.render('index', {products});
};

productsCtrl.renderProductsList = async (req,res) => {
      
};

// Product view

productsCtrl.viewProduct = async (req,res) => {
    const product = await Product.findById(req.params.id);
    res.render('products/product', {product});
};

// Edit products
productsCtrl.renderEditForm = (req,res) => {
    res.render('products/edit-product');  
};

productsCtrl.updateProduct = (req,res) => {
    res.send('Product updated');
};

// Delete Product
productsCtrl.deleteProduct = async (req,res) => {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Product Deleted Successfully');
    res.redirect('/');
};

module.exports = productsCtrl;