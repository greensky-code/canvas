const Company = require('../models/Company');
const asyncHandler = require('../middleware/async');


//company


const addCompany = asyncHandler(async(req,res,next)=>{
    const {user_id, name, email, address} = req.body
    const company = await Company.create({
        user_id,
        name,
        email,
        address
    })
    res.status(200).json({
        success: true,
        data: company
    })
})

const getCompany = asyncHandler(async(req,res,next)=> {
    const company = await Company.find({"user_id": req.params.user_id})
    res.status(200).json({
        success: true,
        data: company
    })
})

const updateCompany = asyncHandler(async(req,res,next)=> {
    const fields = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address
    }
    const company = await Company.findByIdAndUpdate(req.body.company.id, fields, {
        new:true,
        runValidators: true
    })
    
    res.status(200).json({
        success: true,
        data: company
    })
})

const deleteCompany = asyncHandler(async(req,res,next)=> {
    const company = await Company.deleteOne({_id: req.params.company_id});
    res.status(200).json({
        success: true
    })
})

module.exports = {
    addCompany,
    getCompany,
    updateCompany,
    deleteCompany
}