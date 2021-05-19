const Admins = require("../models/admins")
const AdminActivityLog = require("../models/adminActivity")
const Logs = require("../models/logs")
const bcrypt = require("bcryptjs")
const idGenerator = require("../services/id_generator")

async function getAdmin(id) {
    try {
        const admin = await Admins.findOne({ username: id })
        if (admin) return admin
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function createAdmin(data) {
    var adminData = data

    //hash password of the new admin using bcrypt
    const hashedPassword = await bcrypt.hash(adminData.password, 10)

    //assign hashed password to adminData.password
    adminData.password = hashedPassword

    const adminId = await idGenerator.adminId()
    adminData.username = adminId

    try {
        const newAdmin = await Admins.create(adminData)
        if (newAdmin) return newAdmin
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function updateAdmin(adminId, data) {
    try {
        const admin = await getAdmin(adminId)

        if (admin) {
            const updatedAdmin = Admins.updateOne({ adminId: adminId }, data)
            return updatedAdmin
        }
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function getAdminLogs() {
    try {
        var adminLogs = await AdminActivityLog.find({})
            .sort("-dateTime")
            .limit(4)
        if (adminLogs) return adminLogs
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function getAdminUserLogs(dateTime) {
    try {
        var date = new Date(dateTime)
        var tempDate = new Date(date)
        var plusDate = new Date(tempDate.setDate(tempDate.getDate() + 1))

        date = date.toISOString().substring(0, 10)
        plusDate = plusDate.toISOString().substring(0, 10)

        const adminUserLogs = await Logs.find({
            dateTime: {
                $gte: date,
                $lte: plusDate,
            },
        }).populate([
            {
                path: "establishment",
                select: ["establishmentName"],
            },
            {
                path: "user",
                select: ["firstname", "lastname"],
            },
        ])
        if (adminUserLogs) return adminUserLogs
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

module.exports = {
    getAdmin,
    createAdmin,
    updateAdmin,
    getAdminLogs,
    getAdminUserLogs,
}
