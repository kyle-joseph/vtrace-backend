const Users = require("../models/users")

function getUser(id) {
    Users.findOne({ userId: id })
        .then((user) => {
            return user
        })
        .catch((err) => console.log(err.message))
}

function getUserList(filter) {
    Users.find(filter)
        .then((users) => {
            return users
        })
        .catch((err) => console.log(err.message))
}

async function createUser(data) {
    const newUser = await Users.create(data)
    if (newUser) return newUser
    return null
}

module.exports = {
    getUser,
    getUserList,
    createUser,
}
