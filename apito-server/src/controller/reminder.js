const asyncHandler = require('../middleware/async');
const Reminder = require('../models/Reminder');

//reminder
const addReminder = asyncHandler(async(req,res,next)=>{
    const {user_id, name, category, desc, eventDate} = req.body
    const rmd = await Reminder.create({
        user_id,
        name,
        category,
        eventDate,
        desc
    })
    res.status(200).json({
        success: true,
        data: rmd
    })
})

const getReminder = asyncHandler(async(req,res,next)=> {
    const rmd = await Reminder.find({"user_id": req.params.user_id})
    res.status(200).json({
        success: true,
        data: rmd
    })
})

const updateReminder = asyncHandler(async(req,res,next)=> {
    const fields = {
        name: req.body.name,
        category: req.body.category,
        eventDate: req.body.eventDate,
        desc: req.body.desc
    }
    const rmd = await Reminder.findByIdAndUpdate(req.body.reminder.id, fields, {
        new:true,
        runValidators: true
    })
    
    res.status(200).json({
        success: true,
        data: rmd
    })
})

const deleteReminder = asyncHandler(async(req,res,next)=> {
    const rmd = await Reminder.deleteOne({_id: req.params.reminder_id});
    res.status(200).json({
        success: true
    })
})



module.exports = { 
    addReminder,
    getReminder,
    updateReminder,
    deleteReminder
}