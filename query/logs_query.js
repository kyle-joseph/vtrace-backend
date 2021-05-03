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

async function getUserLogs(id, dateTime) {
    try {
        var date = new Date(dateTime)
        var tempDate = new Date(date)
        date = new Date(date.setDate(date.getDate() - 13))
        var plusDate = new Date(tempDate.setDate(tempDate.getDate() + 1))

        date = date.toISOString().substring(0, 10)
        plusDate = plusDate.toISOString().substring(0, 10)

        const userLogs = await Logs.find({
            userId: id,
            dateTime: {
                $gte: date,
                $lte: plusDate,
            },
        })
        if (userLogs) return userLogs
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function getEstablishmentLogs(id, dateTime) {
    try {
        var date = new Date(dateTime)
        var tempDate = new Date(date)
        var plusDate = new Date(tempDate.setDate(tempDate.getDate() + 1))

        date = date.toISOString().substring(0, 10)
        plusDate = plusDate.toISOString().substring(0, 10)

        const establishmentLogs = await Logs.find({
            establishmentId: id,
            dateTime: {
                $gte: date,
                $lte: plusDate,
            },
        })
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
