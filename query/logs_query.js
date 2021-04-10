const Logs = require("../models/logs")

async function createLog(log) {
    try {
        var newLog = await Logs.create(log)
        if (newLog) return newLog
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function getUserLogs(id) {
    try {
        const userLogs = await Logs.find({ userId: id })
        if (userLogs) return userLogs
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function getEstablishmentLogs(id) {
    try {
        const establishmentLogs = await Logs.find({ establishmentId: id })
        if (establishmentLogs) return establishmentLogs
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function getAllLogs() {
    try {
        const logs = await Logs.find({})
        if (logs) return logs
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

module.exports = {
    createLog,
    getUserLogs,
    getEstablishmentLogs,
    getAllLogs,
}
