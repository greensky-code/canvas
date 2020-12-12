const asyncHandler = require("../middleware/async");

const createSocketIo = (http) => {
    const socketIo = require("socket.io")(http)
    asyncHandler(async (req, res, next) => {
        const canvasId = req.params.id
        socketIo.on("connection", socket => {
            const welcome = `Hello New User ${socket.id}`
            const receivedMouse = (data) => {
                socket.broadcast.emit('mouse', data)
            }
            const receivedColor = (data) => {
                socket.broadcast.emit('color', data)
            }
            const receivedImage = (data) => {
                socket.broadcast.emit('image', data)
            }
            const receivedErase = (data) => {
                socket.broadcast.emit('erase', data)
            }
            const receivedEnd = () => {
                socket.broadcast.emit('ended')
            }
            const receivedTyped = (data) => {
                socket.broadcast.emit("typed", data)
            }
            const receivedTypePos = (data) => {
                socket.broadcast.emit("typePos", data)
            }
            const receivedUndo = (data) => {
                socket.broadcast.emit("undo", data)
            }
            const receivedUndoAll = (data) => {
                socket.broadcast.emit("undoAll", data)
            }
            const receivedLine = (data) => {
                socket.broadcast.emit("line", data)
            }
            const receivedLinePoint = (data) => {
                socket.broadcast.emit("linePoint", data)
            }
            const receivedKonvaUndo = (data) => {
                socket.broadcast.emit('konvaUndo', data)
            }
            const receivedText = (data) => {
                socket.broadcast.emit('text',data)
            }
            const receivedTextDrag = (data) => {
                socket.broadcast.emit('textDrag',data)
            }
            const receivedTexting = (data) => {
                socket.broadcast.emit('texting',data)
            }
            const receivedSaved = () => {
                socket.broadcast.emit('saved')
            }
            socket.emit("new", welcome)
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
    })
}

module.exports = { createSocketIo }