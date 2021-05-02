const Establishments = require("../models/establishments")
const bcrypt = require("bcryptjs")
const idGenerator = require("../services/id_generator")

async function createEstablishment(data) {
    var establishmentData = data

    //hash password of the new establishment using bcrypt
    const hashedPassword = await bcrypt.hash(establishmentData.password, 10)

    //assign hashed password to establishmentData.password
    establishmentData.password = hashedPassword

    const establishmentId = await idGenerator.establishmentId()
    establishmentData.establishmentId = establishmentId

    try {
        const newEstablishment = await Establishments.create(establishmentData)
        if (newEstablishment) return newEstablishment
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function getEstablishment(id) {
    try {
        const establishment = await Establishments.findOne({
            establishmentId: id,
        })
        if (establishment) return establishment
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function getAllEstablishments() {
    try {
        const establishments = await Establishments.find({})
        if (establishments) return establishments
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function updateEstablishment(establishmentId, data) {
    try {
        const establishment = await getEstablishment(establishmentId)

        if (establishment) {
            const updatedEstablishment = Establishments.updateOne(
                { establishmentId: establishmentId },
                data
            )
            return updatedEstablishment
        }
        return null
    } catch (err) {
        console.log(err.message)
        return null
    }
}

module.exports = {
    createEstablishment,
    getEstablishment,
    getAllEstablishments,
    updateEstablishment,
}
