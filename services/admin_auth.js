const Admins = require("../models/admins")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//Individual Admin Login
async function adminLogin(id, password) {
    try {
        const admin = await Admins.findOne({ username: id })

        //check if user exists
        if (!admin)
            return { success: false, message: "Invalid username or password." }

        //validate and compare entered password and the hashed password
        const validPassword = await bcrypt.compare(password, admin.password)
        if (!validPassword)
            return { success: false, message: "Invalid username or password." }

        const token = jwt.sign(
            { username: admin.username },
            process.env.SECRET_TOKEN
        )

        return { success: true, admin: admin, token: token }
    } catch (err) {
        console.log(err.message)
        return { success: false, message: "An error occured." }
    }
}

//check if admin exists
async function adminExists(id) {
    try {
        const admin = await Admins.findOne({ username: id })
        if (admin) return admin
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

//middleware for jwt individual login validation
//only for login
function loginValidateAdminToken(req, res, next) {
    try {
        const { cookies } = req
        if ("vtraceAdminToken" in cookies) {
            const verified = jwt.verify(
                req.cookies["vtraceAdminToken"],
                process.env.SECRET_TOKEN
            )
            var exists = adminExists(verified.username)

            if (exists)
                return res.send({ success: true, username: verified.username })

            res.send({ success: false, message: "Admin does not exists." })
        }
        next()
    } catch (err) {
        console.log(err.message)
        res.send({ success: false, message: "Invalid token." })
    }
}

//middleware that validate user token when accessing establishment restricted routes
function validateAdminToken(req, res, next) {
    try {
        const { cookies } = req
        if ("vtraceAdminToken" in cookies) {
            const verified = jwt.verify(
                req.cookies["vtraceAdminToken"],
                process.env.SECRET_TOKEN
            )
            var exists = adminExists(verified.username)

            if (exists) {
                req.body.username = verified.username
                return next()
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
    adminLogin,
    loginValidateAdminToken,
    validateAdminToken,
}
