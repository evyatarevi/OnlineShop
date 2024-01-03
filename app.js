const express = require('express');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const authMiddleware = require('./middlewares/auth-middleware');
const routes = require('./routes/routes.js');



const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(session({
    store: new FileStore({
        path: path.join(__dirname, 'sessions')
    }),
    secret: 'signatureOfSessionID',
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     secure: true, // Use 'true' if your application is served over HTTPS
    //     httpOnly: true,
    //   }
}));

app.use(authMiddleware.auth);
app.use(routes);

//error function...


app.listen(3000, () => {
    console.log('Server is running...');
});


