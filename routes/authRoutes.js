// ROUTES FOR AUTHENTICATION

const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
// const loginLimiter = require('../middleware/loginLimiter')  //to limit login attempts
 
router.route('/')
    .post(authController.handleLogin)

// router.route('/')
//     .post(loginLimiter, authController.login)

router.route('/register')
    .post(authController.handleRegister)

router.route('/logout')
    .get(authController.handleLogout)

module.exports = router