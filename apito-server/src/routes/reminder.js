const express = require('express');
const router = express.Router()

const {
    addReminder, 
    getReminder, 
    updateReminder, 
    deleteReminder
} = require('../controller/reminder')

router
    .post('/addReminder', addReminder)

router
    .get('/getReminder/:user_id', getReminder)

router
    .put('/updateReminder', updateReminder)

router
    .delete('/deleteReminder/:reminder_id', deleteReminder)
    
module.exports = router;