const express = require('express');
const {
    register, 
    login, 
    loggedInUser, 
    forgotPassword, 
    resetPassword, 
    updateDetails, 
    updatePassword, 
    logout,
    deactivateUser,
    toogleUserStatus,
    userList,
    getProjects
} = require('../controller/auth');
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
    .put('/deactivate', deactivateUser)
router
    .put('/toogleUserStatus', toogleUserStatus)    
router
    .get('/userList', userList)

router
    .get('/projectList', getProjects)
module.exports = router;
