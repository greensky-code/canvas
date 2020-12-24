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
    addPerson, 
    getPerson, 
    updatePerson, 
    deletePerson,
    addCompany,
    getCompany,
    updateCompany,
    deleteCompany
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
    .post('/addPerson', addPerson)

router
    .get('/getPerson/:user_id', getPerson)

router
    .put('/updatePerson', updatePerson)

router
    .delete('/deletePerson/:person_id', deletePerson)


router
    .post('/addCompany', addCompany)

router
    .get('/getCompany/:user_id', getCompany)

router
    .put('/updateCompany', updateCompany)

router
    .delete('/deleteCompany/:company_id', deleteCompany)

router
    .put('/deactivate', deactivateUser)

module.exports = router;
