const {Router} = require('express');
const router = Router();

const {renderSignUpForm, 
       signup, 
       renderSignInForm, 
       signin, 
       logout} = require('../controllers/users.controllers')

const {isAuthenticated} = require('../helpers/auth')

// Sign Up
router.get('/users/signup', renderSignUpForm);
router.post('/users/signup', signup);

// Sign In
router.get('/users/signin', renderSignInForm );
router.post('/users/signin', signin);

// Log Out
router.get('/users/logout', logout);

module.exports = router;