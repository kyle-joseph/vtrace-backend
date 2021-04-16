const Users = require("../models/users")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
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

        const token = jwt.sign(
            { userId: user.userId },
            process.env.SECRET_TOKEN
        )

        return { success: true, user: user, token: token }
    } catch (err) {
        console.log(err.message)
        return { success: false, message: "An error occured." }
    }
}

function validateUserToken(req, res, next) {
    const { cookies } = req
    if ("vtraceToken" in cookies)
        return res
            .status(202)
            .send({ success: true, message: "Already logged in" })
    next()
}

module.exports = {
    userLogin,
    validateUserToken,
}
