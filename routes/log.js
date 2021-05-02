var express = require("express")
var router = express.Router()
const logs = require("../query/logs_query")
const Logs = require("../models/logs")

// get all logs for admin (initial plan)
router.get("/", async function (req, res) {
    var allLogs = await logs.getAllLogs()
    if (allLogs) return res.send({ success: true, allLogs: allLogs })
    res.send({ success: false })
})

// get user logs
router.get("/individual-logs", async function (req, res) {
    var userLogs = await logs.getAllLogs(req.body.userId)
    if (userLogs) return res.send({ success: true, userLogs: userLogs })
    res.send({ success: false })
})

//get establishment logs
router.get("/establishment-logs", async function (req, res) {
    var establishmentLogs = await logs.getEstablishmentLogs(
        req.body.establishmentId
    )
    if (establishmentLogs)
        return res.send({ success: true, establishmentLogs: establishmentLogs })
    res.send({ success: false })
})

//create new log
router.post("/create", async function (req, res) {
    var newLog = await logs.createLog(req.body)
    if (newLog)
        return res.send({
            create_success: true,
            log: newLog,
        })
    res.send({ create_success: false })
})

//get latest logs
router.get("/logs-date", async function (req, res) {
    var date = new Date(req.body.dateTime.toString())
    var tempDate = new Date(date)
    var plusDate = new Date(tempDate.setDate(tempDate.getDate() + 1))

    date = date.toISOString().substring(0, 10)
    plusDate = plusDate.toISOString().substring(0, 10)

    const estLogs = await Logs.find({
        dateTime: {
            $gte: date,
            $lte: plusDate,
        },
    })

    if (estLogs) return res.send({ logs: estLogs })
    res.send({ success: false })
})

module.exports = router
