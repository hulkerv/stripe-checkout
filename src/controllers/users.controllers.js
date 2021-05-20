const usersCtrl = {};

const passport = require('passport');

const User = require('../models/User');

// Sign Up
usersCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};

usersCtrl.signup = async (req, res) => {
    const errors = [];
    const {
        name,
        email,
        password,
        confirm_password
    } = req.body;
    if (password != confirm_password) {
        errors.push({
            text: 'Password do not match'
        });
    }
    if (password.length < 4) {
        errors.push({
            text: 'Password must have more than 4 characters'
        })
    }
    if (errors.length > 0) {
        res.render('users/signup', {
            name,
            email,
            errors
        })
    } else {
        const emailUser = await User.findOne({
            email
        });
        if (emailUser) {
            errors.push({
                text: 'The email is already exist'
            });
            res.render('users/signup', {
                name,
                password,
                confirm_password,
                errors
            })
        }else{
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You are been register successfully');
            res.redirect('/users/signin');
        }
    }
};

// Sign In
usersCtrl.renderSignInForm = (req,res) => {
    res.render('users/signin')   
};

usersCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/users/signin',
    successRedirect: '/products/new-product',
    failureFlash: true
});

// Log Out
usersCtrl.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out now');
    res.redirect('/users/signin');
};

module.exports = usersCtrl;
