const bcryptjs = require('bcryptjs');
const User = require('../models/User');

//GET auth function:

const signupPage = (req,res) => {
    res.render('signup');
}

const loginPage =  (req, res) => {
    const message = req.query.message || '';
    const email = req.query.email || '';
    res.render('login', {message: message, email: email});
}

//POST auth function:
const signup = async (req, res) => {
    
    const {'confirm-email': confirmEmail, ...userInput} = req.body;
    userInput.password = bcryptjs.hashSync(userInput.password);
    const values = Object.values(userInput); //array of the object's values,
    const newUser = new User(...values);
    newUser.saveUser();  //i don't use 'await' because i use in sync function in User class.
    
    const message = 'Your signup was successful, Please login';
    res.redirect(`/login?message=${message}&email=${userInput.email}`);
}

const login = (req, res) => {
    const userInput = req.body;
    const usersList = User.fetchAllUsers();
    const user = usersList.find(element => (userInput.email === element.email && bcryptjs.compareSync(userInput.password, element.password)));
    if(!user){
        const message = 'Login failed, Please check your email or password.';
        return res.redirect(`/login?message=${message}`);
    }
    req.session.user = {name: user['full-name'], isAdmin: ''};
    req.session.save(()=>{
        res.redirect('/cart');
    });
}

const deleteUser = (req, res) => {
    const user = new User(null, null, null, null, null, req.params.id);
    user.deleteUser();
    res.redirect('/');
}

const logout = (req, res) => {
    req.session.user = null;
    req.session.save(()=>{
        res.redirect('/');
    })
}

module.exports = {
    signup: signup,
    login: login,
    deleteUser: deleteUser,
    logout: logout,
    signupPage: signupPage,
    loginPage: loginPage
}