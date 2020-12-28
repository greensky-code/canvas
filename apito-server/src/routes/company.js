const express = require('express');
const router = express.Router()

const {
    addCompany,
    getCompany,
    getCompanies,
    updateCompany,
    deleteCompany
} = require('../controller/company')

router
    .post('/addCompany', addCompany)

router
    .get('/getCompany/:user_id', getCompany)

router
    .get('/getCompanies', getCompanies)

router
    .put('/updateCompany', updateCompany)

router
    .delete('/deleteCompany/:company_id', deleteCompany)

module.exports = router;