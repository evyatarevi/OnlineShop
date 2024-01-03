const Product = require('../models/Product');


const homePage = (req, res) => {
    const productsArray = Product.fetchAllProducts();
    res.render('shop', {productsArray: productsArray});
}



module.exports = {
    homePage: homePage
}