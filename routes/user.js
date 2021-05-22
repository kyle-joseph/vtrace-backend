var express = require("express")
var router = express.Router()
const bcrypt = require("bcryptjs")
const users = require("../query/users_query")
const auth = require("../services/auth")

// get individual user by userId
router.post(
    "/individual",
    auth.validateUserToken,
    async function (req, res, next) {
        var user = await users.getUser(req.body.userId)
        if (user) {
            return res.send({ success: true, user: user })
        }
        res.send({ success: false })
    }
)

router.post(
    "/password-matched",
    auth.validateUserToken,
    async function (req, res, next) {
        var user = await users.getUser(req.body.userId)
        if (user) {
            var password = req.body.password
            const validPassword = await bcrypt.compare(password, user.password)
            if (validPassword) return res.send({ success: true })
            return res.send({
                success: false,
                message: "Old Password does not match.",
            })
        }
        res.status(404).send({ success: false })
    }
)

// get individual user by userId
router.post(
    "/mobile-individual",
    auth.validateEstablishmentTokenMobile,
    async function (req, res, next) {
        var user = await users.getUser(req.body.userId)
        if (user) return res.send({ success: true })
        res.send({ success: false, message: "Invalid QR Code" })
    }
)

//create new user
router.post("/create", async function (req, res) {
    var newUser = await users.createUser(req.body)
    if (newUser)
        return res.status(200).send({
            success: true,
            user: newUser,
        })
    res.send({ success: false, message: "Failed to create user." })
})

//user login
router.post("/login", auth.loginValidateUserToken, async function (req, res) {
    var user = await auth.userLogin(req.body.userId, req.body.password)
    if (!user.success) return res.send(user)

    var expire = new Date()

    res.cookie("vtraceToken", user.token, {
        path: "/",
        domain: "https://kyle-joseph.github.io",
        secure: false,
        httpOnly: false,
        sameSite: false,
        expires: new Date(expire.setDate(expire.getDate() + 365)),
    })
    res.send({ success: user.success, user: user.user })
})

//user logout
router.get("/logout", async function (req, res) {
    res.clearCookie("vtraceToken")
    res.send({ success: true, message: "User has been logged out." })
})

//update user
router.put("/update", auth.validateUserToken, async function (req, res) {
    var updatedUser = await users.updateUser(
        req.body.userId,
        req.body.updateData
    )
    if (updatedUser)
        return res.send({ success: true, updatedUser: updatedUser })
    return res.send({ success: false, message: "Failed to update user." })
})

//update user password
router.put(
    "/update-password",
    auth.validateUserToken,
    async function (req, res) {
        //hash password of the new user using bcrypt
        const hashedPassword = await bcrypt.hash(
            req.body.updateData.password,
            10
        )
        req.body.updateData.password = hashedPassword

        var updatedUser = await users.updateUser(
            req.body.userId,
            req.body.updateData
        )

        if (updatedUser)
            return res.send({ success: true, updatedUser: updatedUser })
        return res.send({ success: false, message: "Failed to update user." })
    }
)

module.exports = router
