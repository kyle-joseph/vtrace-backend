var express = require("express")
var router = express.Router()
const users = require("../query/users_query")
const auth = require("../services/auth")

// get individual user by userId
router.get("/individual", async function (req, res, next) {
    var user = await users.getUser(req.body.userId)
    if (user) return res.send({ success: true, user: user })
    res.status(404).send({ success: false })
})

//create new user
router.post("/create", async function (req, res) {
    var newUser = await users.createUser(req.body)
    if (newUser)
        return res.status(201).send({
            create_success: true,
            user: newUser,
        })
    res.send({ create_success: false })
})

//user login
router.post("/login", auth.validateUserToken, async function (req, res) {
    var user = await auth.userLogin(req.body.userId, req.body.password)
    if (!user.success) return res.status(406).send(user)

    res.cookie("vtraceToken", user.token)
    res.send({ success: user.success, user: user.user })
})

module.exports = router
