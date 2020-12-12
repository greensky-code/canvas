const { use } = require("../routes/auth");

const users = [];

const userJoin = (socketId, userId, canvasId) => {
    const user = { socketId, userId, canvasId}
    users.push(user)
    return user
}

const getUser = (socketId) => {
    return users.find(user=> user.socketId === socketId)
}

module.exports = { userJoin, getUser} 