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
router.post("/create", auth.validateAdminToken, async function (req, res) {
    var newAdmin = await admins.createAdmin(req.body)
    if (newAdmin)
        return res.status(200).send({
            success: true,
            admin: newAdmin,
        })
    res.send({ success: false, message: "Failed to create new admin." })
})

router.post("/update", auth.validateAdminToken, async function (req, res) {
    var editAdmin = await admins.updateAdmin(
        req.body.editUsername,
        req.body.password
    )
    if (editAdmin)
        return res.status(200).send({
            success: true,
            admin: editAdmin,
        })
    res.send({ success: false, message: "Failed to update admin password." })
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

router.post(
    "/admin-user-logs",
    auth.validateAdminToken,
    async function (req, res) {
        var adminUserLogs = await admins.getAdminUserLogs(
            req.body.dateTime,
            req.body.match
        )
        if (adminUserLogs && adminUserLogs.length !== 0)
            return res.send({ success: true, adminUserLogs: adminUserLogs })
        res.send({ success: false, message: "No logs in this date." })
    }
)

router.post(
    "/admin-establishments",
    auth.validateAdminToken,
    async function (req, res) {
        var adminEstablishments = await admins.getAdminEstablishments(
            req.body.match
        )
        if (adminEstablishments && adminEstablishments.length !== 0)
            return res.send({
                success: true,
                adminEstablishments: adminEstablishments,
            })
        res.send({ success: false, message: "Establishment does not exists." })
    }
)

router.post(
    "/admin-scan-count",
    auth.validateAdminToken,
    async function (req, res) {
        var count = await admins.getScanCount(req.body.dateTime)
        if (count)
            return res.send({
                success: true,
                count: count,
            })
        res.send({ success: false, message: "No logs as of now." })
    }
)

router.get("/admin-list", auth.validateAdminToken, async function (req, res) {
    var adminList = await admins.getAllAdmin()
    if (adminList)
        return res.send({
            success: true,
            adminList: adminList,
        })
    res.send({ success: false, message: "No there are no admins registered." })
})
module.exports = router
