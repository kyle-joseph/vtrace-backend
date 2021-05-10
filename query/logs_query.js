const Logs = require("../models/logs")
const Users = require("../models/users")
const Establishments = require("../models/establishments")

async function createLog(log) {
    try {
        var user = await Users.findOne({ userId: log.userId })
        var establishment = await Establishments.findOne({
            establishmentId: log.establishmentId,
        })

        if (user && establishment) {
            log.user = user._id
            log.establishment = establishment._id
            var newLog = await Logs.create(log)
            if (newLog) return newLog
        }

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
            .sort("-dateTime")
            .populate({
                path: "user",
                select: [
                    "firstname",
                    "lastname",
                    "gender",
                    "contactNumber",
                    "street",
                    "barangay",
                    "cityMun",
                    "province",
                ],
            })
        if (establishmentLogs) {
            var estLogs = splitUserDateTime(establishmentLogs)
            return estLogs
        }
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

function splitUserDateTime(logs) {
    var newLogs = []
    logs.forEach((element) => {
        var address = ""
        var dateTime = new Date(element.dateTime)
        var date =
            dateTime.getUTCFullYear() +
            "-" +
            (dateTime.getUTCMonth() + 1) +
            "-" +
            dateTime.getUTCDate()
        var time = dateTime.getUTCHours() + ":" + dateTime.getUTCMinutes()
        if (element.user.street != "") {
            address =
                element.user.street +
                ", " +
                element.user.barangay +
                ", " +
                element.user.cityMun +
                ", " +
                element.user.province
        } else {
            address =
                element.user.barangay +
                ", " +
                element.user.cityMun +
                ", " +
                element.user.province
        }
        newLogs.push({
            userId: element.userId,
            firstname: element.user.firstname,
            lastname: element.user.lastname,
            gender: element.user.gender,
            contactNumber: element.user.contactNumber,
            address: address,
            date: date,
            time: time,
        })
    })
    return newLogs
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
