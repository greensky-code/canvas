const express = require('express');
const router = express.Router()
const { createCanvas, getUserCanvas, updateCanvas, getCanvasById, addUser, getLayersByid, getAllShapes } = require('../controller/canvas');
const { protect } = require("../middleware/auth")

router.use(protect)

router.route("/")
    .post(createCanvas)
    .get(getUserCanvas)
router.route("/:id")
    .put(updateCanvas)
    .get(getCanvasById)
router.post("/add", addUser)
router.get("/layer/:id", getLayersByid)
router.get('/shape/:id', getAllShapes)

module.exports = router;
