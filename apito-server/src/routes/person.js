const express = require('express');
const router = express.Router()

const {
    addPerson, 
    getPerson, 
    updatePerson, 
    deletePerson
} = require('../controller/person')

router
    .post('/addPerson', addPerson)

router
    .get('/getPerson/:user_id', getPerson)

router
    .put('/updatePerson', updatePerson)

router
    .delete('/deletePerson/:person_id', deletePerson)
    
module.exports = router;