const express = require('express');
const path = require('path');
const fs = require('fs');
const { json } = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const filePathUsers = path.join(__dirname, 'data', 'users.json');
const filePathProducts = path.join(__dirname,'data', 'products.json');
const cartFilePath = path.join(__dirname, 'data', 'cart.json');

//routs:

//GET
app.get('/', (req, res) => {
    const productsArray = JSON.parse(fs.readFileSync(filePathProducts));
    res.render('shop', {productsArray: productsArray});
});

app.get('/signup', (req,res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login', {message: '', email:''});
});

app.get('/cart', (req, res) => {
    const cartArray = JSON.parse(fs.readFileSync(cartFilePath));
    const productsArray = JSON.parse(fs.readFileSync(filePathProducts));

    for(let i=0; i<cartArray.length; i++){
        for(let j=0; j<productsArray.length; j++){
            if(cartArray[i].id === productsArray[j].id){
                cartArray[i].title = productsArray[j].title;
                cartArray[i].description = productsArray[j].description;
                cartArray[i].price = productsArray[j].price;
                continue;
            }
        }
    }

    res.render('cart', {cartArray: cartArray});
});

app.get('/getProductCartAmount', (req, res) => {
    const cart = JSON.parse(fs.readFileSync(cartFilePath));
    let amountProducts = 0;
    for(let i=0; i<cart.length; i++){
        amountProducts += cart[i].amount;
    };
    res.json({amountProducts: amountProducts});
});



//POST
app.post('/signup', async (req, res) => {
    const {'confirm-email': confirmEmail, ...userInput} = req.body;
    const usersArray = JSON.parse(fs.readFileSync(filePathUsers));
    usersArray.push(userInput);
    fs.writeFile(filePath, JSON.stringify(usersArray), (err)=>{
        if(err){
            console.log('Error occur');
        }
        else{
            console.log('Data stored successfully!');
        }
    });

    res.render('login', {message: 'Your signup was successful, Please login:', email: userInput.email});
});

app.post('/login', (req, res) => {
    const userInput = req.body;
    const usersArray = JSON.parse(fs.readFileSync(filePathUsers));
    const userTest = usersArray.find(element => (
        element.email === userInput.email && element.password === userInput.password));
    console.log(userTest ? `Hi ${userTest['full-name']}` : 
        'Sorry, the email or the password incorrect. Try again:');

});

app.post('/addProductToCart', (req, res) => {
    const product = req.body;
    const productsCartList = JSON.parse(fs.readFileSync(cartFilePath));

    //find if the product exist in the cart:
    let productFound = false;
    for(let i=0; i<productsCartList.length; i++){
        if(productsCartList[i].id === product.productId*1){
            productsCartList[i].amount++;
            productFound = true;
        }
    }
    //doesn't exist:
    if (!productFound){
        productsCartList.push({id:product.productId*1, amount: 1});
    }

    //Overrides the previous cart array:
    try{
        fs.writeFileSync(cartFilePath, JSON.stringify(productsCartList));
        res.json({message: 'The product added Successfully'});
    }
    catch{
        res.json({message: 'Sorry, error occur.'});
    }
});

app.post('/updateCart', (req, res) => {
    const product = req.body;
    product.amount = product.amount*1;
    //check invalid input
    if(product.amount <=0){
        res.json({message: 'Sorry, the product amount is invalid.'});
        return;
    }
    //find the appropriate id and update his amount
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
        res.json({message: 'The update was successful.'})       
    } catch (error) {
        res.json({message: error});
    }
});


app.listen(3000, () => {
    console.log('Server is running...');
});


