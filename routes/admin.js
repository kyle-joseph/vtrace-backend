var express = require("express")
var router = express.Router()
const bcrypt = require("bcryptjs")
const admins = require("../query/admin_query")
const auth = require("../services/admin_auth")

// get individual user by userId
router.post(
    "/individual",
    auth.validateAdminToken,
    async function (req, res, next) {
        var admin = await admins.getAdmin(req.body.username)
        if (admin) {
            return res.send({ success: true, admin: admin })
        }
        res.send({ success: false })
    }
)

//create new user
router.post("/create", async function (req, res) {
    var newAdmin = await admins.createAdmin(req.body)
    if (newAdmin)
        return res.status(200).send({
            success: true,
            admin: newAdmin,
        })
    res.send({ success: false, message: "Failed to create admin." })
})

//user login
router.post("/login", auth.loginValidateAdminToken, async function (req, res) {
    var admin = await auth.adminLogin(req.body.username, req.body.password)
    if (!admin.success) return res.send(admin)

    res.cookie("vtraceAdminToken", admin.token)
    res.send({ success: admin.success, admin: admin.admin })
})

//user logout
router.get("/logout", async function (req, res) {
    res.clearCookie("vtraceAdminToken")
    res.send({ success: true, message: "Admin has been logged out." })
})

router.get("/admin-logs", auth.validateAdminToken, async function (req, res) {
    var adminLogs = await admins.getAdminLogs()
    if (adminLogs) return res.send({ success: true, adminLogs: adminLogs })
    res.send({ success: false, message: "No recent logins." })
})
module.exports = router
