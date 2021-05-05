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

//Establishment Login
async function establishmentLogin(id, password) {
    try {
        const establishment = await Establishments.findOne({
            establishmentId: id,
        })

        //check if establishment exists
        if (!establishment)
            return { success: false, message: "Invalid username or password." }

        //validate and compare entered password and the hashed password
        const validPassword = await bcrypt.compare(
            password,
            establishment.password
        )

        if (!validPassword)
            return { success: false, message: "Invalid username or password." }

        const token = jwt.sign(
            { establishmentId: establishment.establishmentId },
            process.env.SECRET_TOKEN
        )

        return { success: true, establishment: establishment, token: token }
    } catch (err) {
        console.log(err.message)
        return { success: false, message: "An error occured." }
    }
}

//check if user exists
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

//check if establishment exists
async function establishmentExists(id) {
    try {
        const establishment = await Establishments.findOne({
            establishmentId: id,
        })
        if (establishment) return establishment
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

//middleware for jwt individual login validation
//only for login
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

//middleware for jwt establishment login validation
//only for login
function loginValidateEstablishmentToken(req, res, next) {
    try {
        const { cookies } = req
        if ("vtraceEstToken" in cookies) {
            const verified = jwt.verify(
                req.cookies["vtraceEstToken"],
                process.env.SECRET_TOKEN
            )
            var exists = establishmentExists(verified.establishmentId)

            if (exists)
                return res.send({
                    success: true,
                    establishmentId: verified.establishmentId,
                })

            res.send({
                success: false,
                message: "Establishment does not exists.",
            })
        }
        next()
    } catch (err) {
        console.log(err.message)
        res.send({ success: false, message: "Invalid token." })
    }
}

//middleware that validate establishment token when accessing individual restricted routes
function validateEstablishmentToken(req, res, next) {
    try {
        const { cookies } = req
        if ("vtraceEstToken" in cookies) {
            const verified = jwt.verify(
                req.cookies["vtraceEstToken"],
                process.env.SECRET_TOKEN
            )
            var exists = establishmentExists(verified.establishmentId)

            if (exists) {
                req.body.establishmentId = verified.establishmentId
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

function validateEstablishmentTokenMobile(req, res, next) {
    try {
        const verified = jwt.verify(
            req.body.vtestToken,
            process.env.SECRET_TOKEN
        )
        var exists = establishmentExists(verified.establishmentId)

        if (exists) {
            req.body.establishmentId = verified.establishmentId
            return next()
        }

        res.send({ success: false, message: "Access denied." })
    } catch (err) {
        console.log(err.message)
        res.send({ success: false, message: "Invalid token." })
    }
}

//middleware that validate user token when accessing establishment restricted routes
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
                req.body.userId = verified.userId
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
    userLogin,
    loginValidateUserToken,
    validateUserToken,
    establishmentLogin,
    loginValidateEstablishmentToken,
    validateEstablishmentToken,
    validateEstablishmentTokenMobile,
}
