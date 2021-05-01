var express = require("express")
var router = express.Router()
const bcrypt = require("bcryptjs")
const establishments = require("../query/establishments_query")
const auth = require("../services/auth")

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

//update establishment
router.put("/update", async function (req, res) {
    var updatedEstablishment = await establishments.updateEstablishment(
        req.body.establishmentId,
        req.body.updateData
    )
    if (updatedEstablishment)
        return res.send({
            success: true,
            updatedEstablishment: updatedEstablishment,
        })
    return res.send({ success: false, message: "Establishment not found" })
})

//update establishment password
router.put("/update-password", async function (req, res) {
    //hash password of the new user using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.updateData.password, 10)
    req.body.updateData.password = hashedPassword

    var updatedEstablishment = await establishments.updateEstablishment(
        req.body.establishmentId,
        req.body.updateData
    )
    if (updatedEstablishment)
        return res.send({
            success: true,
            updatedEstablishment: updatedEstablishment,
        })
    return res.send({ success: false, message: "Establishment not found" })
})

//establishment login
router.post(
    "/login",
    auth.loginValidateEstablishmentToken,
    async function (req, res) {
        var establishment = await auth.establishmentLogin(
            req.body.establishmentId,
            req.body.password
        )
        if (!establishment.success) return res.status(406).send(establishment)

        res.cookie("vtraceEstToken", establishment.token)
        res.send({
            success: establishment.success,
            establishment: establishment.establishment,
        })
    }
)

//establishment logout
router.post("/logout", async function (req, res) {
    res.clearCookie("vtraceEstToken")
    res.send({ success: true, message: "Establishment has been logged out." })
})

module.exports = router
