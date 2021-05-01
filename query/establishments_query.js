const Establishments = require("../models/establishments")

async function createEstablishment(data) {
    try {
        var newEstablishment = await Establishments.create(data)
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
                { establishment: establishment },
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
