var express = require("express")
var router = express.Router()
const logs = require("../query/logs_query")
const auth = require("../services/auth")
// get all logs for admin (initial plan)
router.get("/", async function (req, res) {
    var allLogs = await logs.getAllLogs()
    if (allLogs) return res.send({ success: true, allLogs: allLogs })
    res.send({ success: false })
})

// get user logs
router.get(
    "/individual-logs",
    auth.validateUserToken,
    async function (req, res) {
        var userLogs = await logs.getUserLogs(
            req.body.userId,
            req.body.dateTime
        )
        if (userLogs) {
            if (userLogs.length == 0)
                return res.send({
                    success: false,
                    message: "No individual logs found.",
                })
            return res.send({ success: true, userLogs: userLogs })
        }
        res.send({ success: false })
    }
)

//get establishment logs
router.post(
    "/establishment-logs",
    auth.validateEstablishmentToken,
    async function (req, res) {
        var establishmentLogs = await logs.getEstablishmentLogs(
            req.body.establishmentId,
            req.body.dateTime
        )
        if (establishmentLogs) {
            if (establishmentLogs.length == 0)
                return res.send({
                    success: false,
                    message: "No establishment logs found.",
                })
            return res.send({
                success: true,
                establishmentLogs: establishmentLogs,
            })
        }
        res.send({ success: false })
    }
)

//get establishment logs mobile
router.post(
    "/mobile-establishment-logs",
    auth.validateEstablishmentTokenMobile,
    async function (req, res) {
        var establishmentLogs = await logs.getEstablishmentLogs(
            req.body.establishmentId,
            req.body.dateTime
        )
        if (establishmentLogs) {
            if (establishmentLogs.length == 0)
                return res.send({
                    success: false,
                    message: "No establishment logs found.",
                })
            return res.send({
                success: true,
                establishmentLogs: establishmentLogs,
            })
        }
        res.send({ success: false })
    }
)

//create new log
router.post(
    "/create",
    auth.validateEstablishmentTokenMobile,
    async function (req, res) {
        var newLog = await logs.createLog(req.body)
        if (newLog)
            return res.send({
                success: true,
                log: newLog,
            })
        res.send({ success: false })
    }
)

module.exports = router
