var express = require("express")
var router = express.Router()
const users = require("../query/users_query")

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource")
})

router.post("/create", async function (req, res) {
    try {
        var newUser = await users.createUser(req.body)
        if (newUser)
            return res.send({
                create_success: true,
                user: newUser,
            })
        res.send({ create_success: false })
    } catch (err) {
        console.log(err.message)
        res.send({ create_success: false })
    }
})

module.exports = router
