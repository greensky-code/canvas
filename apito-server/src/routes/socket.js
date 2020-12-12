const express = require('express');
const router = express.Router()
const { protect } = require("../middleware/auth")
const { createSocketIo } = require("../controller/socket")

const openRoute = (http) =>{
    router.use(protect)
    
    router.route("/:id")
        .post(createSocketIo(http))

}

module.exports = openRoute;