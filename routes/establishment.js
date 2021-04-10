var express = require("express")
var router = express.Router()
const establishments = require("../query/establishments_query")

// get all establishments for admin (initial plan)
router.get("/", async function (req, res) {
    var allEstablishments = await establishments.getAllEstablishments()
    if (allEstablishments)
        return res.send({ success: true, allEstablishments: allEstablishments })
    res.send({ success: false })
})

// get establishment by id
router.get("/individual", async function (req, res) {
    var establishment = await establishments.getEstablishment(
        req.body.establishmentId
    )
    if (establishment)
        return res.send({ success: true, establishment: establishment })
    res.send({ success: false })
})

//create new establishment
router.post("/create", async function (req, res) {
    var newEstablishment = await establishments.createEstablishment(req.body)
    if (newEstablishment)
        return res.send({
            create_success: true,
            newEstablishment: newEstablishment,
        })
    res.send({ create_success: false })
})

module.exports = router
