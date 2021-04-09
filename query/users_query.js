const Users = require("../models/users")

async function getUser(id) {
    try {
        const user = await Users.findOne({ userId: id })
        if (user) return user
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function createUser(data) {
    try {
        const newUser = await Users.create(data)
        if (newUser) return newUser
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

module.exports = {
    getUser,
    createUser,
}
