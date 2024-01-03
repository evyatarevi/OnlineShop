const express = require('express');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const authControllers = require('../controllers/auth-controllers');
const productControllers = require('../controllers/product-controllers');

const router = express.Router();

//paths
const cartFilePath = path.join(__dirname,'../', 'data', 'cart.json');

router.get('/', productControllers.homePage);

//GET auth routes:
router.get('/signup', authControllers.signupPage);

router.get('/login', authControllers.loginPage);

//
router.get('/cart', (req, res) => {
    if(!req.session.user){
        console.log(`The user doesn't given access!`);
        return res.redirect('/login');
    }

    // const cartArray = JSON.parse(fs.readFileSync(cartFilePath));
    const productsArray = Product.fetchAllProducts();

    const cartList = req.session.cart;
    const cartToDisplay = [];
    if(cartList){
        for(let i=0; i<cartList.length; i++){
            for(let j=0; j<productsArray.length; j++){
                if(cartList[i].id === productsArray[j].id){
                    const {id, title, description, price} = productsArray[j];
                    const productToDisplay = {id, title, description, price, amount: cartList[i].amount};
                    cartToDisplay.push(productToDisplay);
                    break;
                }
            }
        }
    }

    res.render('cart', {cartToDisplay: cartToDisplay});
});

router.get('/getProductCartAmount', (req, res) => {
    const cart = JSON.parse(fs.readFileSync(cartFilePath));
    let amountProducts = 0;
    for(let i=0; i<cart.length; i++){
        amountProducts += cart[i].amount;
    };
    res.json({amountProducts: amountProducts});
});



//POST auth routes:
router.post('/signup', authControllers.signup);

router.post('/login', authControllers.login);

router.post('/delete-user/:id', authControllers.deleteUser);

router.post('/logout', authControllers.logout);


//POST products routes:
router.post('/addProductToCart', (req, res) => {
    if(!req.session.user){
        return res.json({notVerified: true, message: `you haven't access, login first.`});
    }

    const productId = req.body.productId;
    let cartList = req.session.cart;

    //if cart exist:
    if(cartList){  
        //check if product exist in the cart:
        let productFound = false;
        for(let i=0; i<cartList.length; i++){
            if(cartList[i].id === productId){
                cartList[i].amount++;
                productFound = true;
                break;
            }
        }
        //if product doesn't exist in the cart:
        if (!productFound){  
            cartList.push({id:productId, amount: 1});
        }
    }

    //if cart doesn't exist:
    if(!cartList){
        cartList = [{id:productId, amount: 1}];
    }
    //add the new cart list to the session:
    req.session.cart = cartList;
    res.json({message: "The product added to the cart."});

    // const productsCartList = JSON.parse(fs.readFileSync(cartFilePath));

    //find if the product exist in the cart:
    // let productFound = false;
    // for(let i=0; i<productsCartList.length; i++){
    //     if(productsCartList[i].id === productId){
    //         productsCartList[i].amount++;
    //         productFound = true;
    //     }
    // }
    // //doesn't exist:
    // if (!productFound){
    //     productsCartList.push({id:productId, amount: 1});
    // }

    //Overrides the previous cart array:
    // try{
    //     fs.writeFileSync(cartFilePath, JSON.stringify(productsCartList));
    //     res.json({message: 'The product added Successfully'});
    // }
    // catch{
    //     res.json({message: 'Sorry, error occur.'});
    // }
});

router.post('/updateCart', (req, res) => {
    const product = req.body;
    product.amount = product.amount*1;
    //check invalid input
    if(product.amount <=0){
        res.json({message: 'Sorry, the product amount is invalid.'});
        return;
    }
    //find the routerropriate id and update his amount
    const cartArray = JSON.parse(fs.readFileSync(cartFilePath));
    for(let i=0; i<cartArray.length; i++){
        if(cartArray[i].id === product.id*1){
            cartArray[i].amount = product.amount;
            break;
        };
    };
    //save the new array
    try {
        fs.writeFileSync(cartFilePath, JSON.stringify(cartArray));
        res.json({message: 'The update in cart database was successful.'})       
    } catch (error) {
        res.json({message: error});
    }
});

router.post('/delete-product', (req, res) => {
    const productId = req.body.id*1;
    const cartArray = JSON.parse(fs.readFileSync(cartFilePath));

    for(let i=0; i<cartArray.length; i++){
        if(cartArray[i].id === productId){
            cartArray.splice(i,1);
            break;
        }
    }

    try {
        fs.writeFileSync(cartFilePath, JSON.stringify(cartArray));
        res.json({message: 'Deleted successfully'});
    } catch (error) {
        res.json({message: error});
    }
});

module.exports = router;