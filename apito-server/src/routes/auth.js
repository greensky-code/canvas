const express = require('express');
const {register, login, loggedInUser, forgotPassword, resetPassword, updateDetails, updatePassword, logout, addPerson, getPerson, updatePerson} = require('../controller/auth');
const { protect } = require('../middleware/auth');
const router = express.Router() 

router
    .post('/register', register)
router
    .post('/login',login)
router
    .get('/logout',logout)
router
    .post('/forgotpassword',forgotPassword)
router
    .put('/resetpassword/:resettoken', resetPassword)
router
    .put('/update', updateDetails)

router
    .put('/password', updatePassword)
router
    .get('/user', protect, loggedInUser)

router
    .post('/addPerson', addPerson)

router
    .get('/getPerson/:user_id', getPerson)

router
    .put('/updatePerson', updatePerson)


module.exports = router;
