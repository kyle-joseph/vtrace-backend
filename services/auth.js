const Users = require("../models/users")
const bcrypt = require("bcryptjs")

//Individual User Login
async function userLogin(id, password) {
    try {
        const user = await Users.findOne({ userId: id })

        //check if user exists
        if (!user)
            return { success: false, message: "Invalid username or password." }

        //validate and compare entered password and the hashed password
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword)
            return { success: false, message: "Invalid username or password." }

        return { success: true, user: user }
    } catch (err) {
        console.log(err.message)
        return { success: false, message: "An error occured." }
    }
}

module.exports = {
    userLogin,
}
