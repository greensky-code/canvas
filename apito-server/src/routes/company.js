const express = require('express');
const router = express.Router()

const {
    addCompany,
    getCompany,
    updateCompany,
    deleteCompany
} = require('../controller/company')

router
    .post('/addCompany', addCompany)

router
    .get('/getCompany/:user_id', getCompany)

router
    .put('/updateCompany', updateCompany)

router
    .delete('/deleteCompany/:company_id', deleteCompany)

module.exports = router;