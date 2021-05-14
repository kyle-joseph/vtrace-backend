const { customAlphabet } = require("nanoid")
const Users = require("../models/users")
const Establishments = require("../models/establishments")

async function userId() {
    const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 9)
    var id = "VTQR" + nanoid()
    const user = await Users.findOne({ userId: "VTQRI3YQ7C1WS" })

    if (user) {
        return userId()
    }
    return id
}

async function establishmentId() {
    const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 9)
    var id = "VTEST" + nanoid()
    const establishment = await Establishments.findOne({ establishmentId: id })

    if (establishment) {
        return establishmentId()
    }
    return id
}

async function adminId() {
    const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 9)
    var id = "VTADM" + nanoid()
    const establishment = await Establishments.findOne({ establishmentId: id })

    if (establishment) {
        return establishmentId()
    }
    return id
}

module.exports = {
    userId,
    establishmentId,
    adminId,
}
