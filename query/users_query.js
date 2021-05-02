const Users = require("../models/users")
const bcrypt = require("bcryptjs")
const idGenerator = require("../services/id_generator")

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
    var userData = data

    //hash password of the new user using bcrypt
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    //assign hashed password to userData.password
    userData.password = hashedPassword

    const userId = await idGenerator.userId()
    userData.userId = userId

    try {
        const newUser = await Users.create(userData)
        if (newUser) return newUser
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function updateUser(userId, data) {
    try {
        const user = await getUser(userId)

        if (user) {
            const updatedUser = Users.updateOne({ userId: userId }, data)
            return updatedUser
        }
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

module.exports = {
    getUser,
    createUser,
    updateUser,
}
