const express = require("express")
const app = express()
const path = require("path")
const http = require("http").createServer(app)
const socketIo = require("socket.io").listen(http)
const dotenv = require("dotenv")

dotenv.config({ path: './config/config.env' })
const auth = require("./src/routes/auth");
const canvas = require("./src/routes/canvas");
const person = require("./src/routes/person");
const company = require("./src/routes/company");

const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const xxs = require("xss-clean")
const rateLimit = require("express-rate-limit")
const cors = require("cors");
const hpp = require("hpp")
const errrorHandler = require("./src/middleware/error");
const connectDB = require("./config/db")

connectDB()

const { userJoin, getUser} = require("./src/utils/users")

app.use(
    express.json({
        limit: "50mb",
        extended: true,
    })
)
app.use(
    express.urlencoded({
        extended: true,
        limit: "50mb",
    })
)
app.use(cors())
// app.use(express.json())

app.use(cookieParser())

app.use(fileUpload())
app.use(mongoSanitize())
app.use(helmet())
app.use(xxs())
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 1000
})

app.use(limiter)
app.use(hpp())

app.use("/api/v1/auth", auth)
app.use("/api/v1/canvas", canvas)
app.use("/api/v1/person", person)
app.use("/api/v1/company", company)



app.use(errrorHandler)
const port = process.env.PORT


socketIo.on("connection", socket => {
    const joinCanvas = ({canvasId, userId})=> {
        const user = userJoin(socket.id, userId, canvasId)
        socket.join(user.canvasId)
        socket.broadcast.to(user.canvasId).emit('message', `welcome to ${canvasId}`)
    }

    const receivedMouse = (data) => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit('mouse', data)
    }
    const receivedColor = (data) => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit('color', data)
    }
    const receivedImage = (data) => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit('image', data)
    }
    const receivedErase = (data) => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit('erase', data)
    }
    const receivedEnd = () => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit('ended')
    }
    const receivedTyped = (data) => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit("typed", data)
    }
    const receivedTypePos = (data) => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit("typePos", data)
    }
    const receivedUndo = (data) => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit("undo", data)
    }
    const receivedUndoAll = (data) => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit("undoAll", data)
    }
    const receivedLine = (data) => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit("line", data)
    }
    const receivedLinePoint = (data) => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit("linePoint", data)
    }
    const receivedKonvaUndo = (data) => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit('konvaUndo', data)
    }
    const receivedText = (data) => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit('text',data)
    }
    const receivedTextDrag = (data) => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit('textDrag',data)
    }
    const receivedTexting = (data) => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit('texting',data)
    }
    const receivedSaved = () => {
        const activeUser = getUser(socket.id)
        socket.broadcast.to(activeUser.canvasId).emit('saved')
    }
    socket.on('joinCanvas', joinCanvas)
    
    
    socket.on("typePos", receivedTypePos)
    socket.on("undo", receivedUndo)
    socket.on("undoAll", receivedUndoAll)
    socket.on("typed", receivedTyped)
    socket.on("mouse", receivedMouse)
    socket.on("ended", receivedEnd)
    socket.on("saved", receivedSaved)
    socket.on("color", receivedColor)
    socket.on("image", receivedImage)
    socket.on("erase", receivedErase)
    socket.on("line", receivedLine)
    socket.on("linePoint", receivedLinePoint)
    socket.on("konvaUndo", receivedKonvaUndo)
    socket.on("texting", receivedTexting)
    socket.on("text", receivedText)
    socket.on("textDrag", receivedTextDrag)

})

http.listen(port, () => {
    console.log(`Listening at PORT ${port}`);
})
