const auth = (req, res, next) => {
    res.locals.isAuth = req.session.user;
    next();
}

module.exports = {
    auth: auth
}