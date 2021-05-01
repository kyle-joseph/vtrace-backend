const Users = require("../models/users")
const Establishments = require("../models/establishments")
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
async function userExists(id) {
    try {
        const user = await Users.findOne({ userId: id })
        if (user) return user
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function establishmentExists(id) {
    const establishment = await Establishments.findOne({ establishmentId: id })
}

function loginValidateUserToken(req, res, next) {
    try {
        const { cookies } = req
        if ("vtraceToken" in cookies) {
            const verified = jwt.verify(
                req.cookies["vtraceToken"],
                process.env.SECRET_TOKEN
            )
            var exists = userExists(verified.userId)

            if (exists)
                return res.send({ success: true, userId: verified.userId })

            res.send({ success: false, message: "User does not exists." })
        }
        next()
    } catch (err) {
        console.log(err.message)
        res.send({ success: false, message: "Invalid token." })
    }
}

function validateUserToken(req, res, next) {
    try {
        const { cookies } = req
        if ("vtraceToken" in cookies) {
            const verified = jwt.verify(
                req.cookies["vtraceToken"],
                process.env.SECRET_TOKEN
            )
            var exists = userExists(verified.userId)

            if (exists) {
                next()
            }

            return res.send({ success: false, message: "Access denied." })
        }
        res.send({ success: false, message: "Access denied." })
    } catch (err) {
        console.log(err.message)
        res.send({ success: false, message: "Invalid token." })
    }
}

module.exports = {
    userLogin,
    loginValidateUserToken,
    validateUserToken,
}
