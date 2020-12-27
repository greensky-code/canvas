const asyncHandler = require('../middleware/async');
const Person = require('../models/Person');

//person
const addPerson = asyncHandler(async(req,res,next)=>{
    const {user_id, name, email, type, address, birthday, phone} = req.body
    const person = await Person.create({
        user_id,
        name,
        email,
        type,
        address,
        birthday,
        phone
    })
    res.status(200).json({
        success: true,
        data: person
    })
})

const getPerson = asyncHandler(async(req,res,next)=> {
    const persons = await Person.find({"user_id": req.params.user_id})
    res.status(200).json({
        success: true,
        data: persons
    })
})

const updatePerson = asyncHandler(async(req,res,next)=> {
    const fields = {
        name: req.body.name,
        email: req.body.email,
        type: req.body.type,
        phone: req.body.phone,
        birthday: req.body.birthday,
        address: req.body.address
    }
    const person = await Person.findByIdAndUpdate(req.body.person.id, fields, {
        new:true,
        runValidators: true
    })
    
    res.status(200).json({
        success: true,
        data: person
    })
})

const deletePerson = asyncHandler(async(req,res,next)=> {
    const persons = await Person.deleteOne({_id: req.params.person_id});
    res.status(200).json({
        success: true
    })
})



module.exports = { 
    addPerson,
    getPerson,
    updatePerson,
    deletePerson
}