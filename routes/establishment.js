var express = require("express")
var router = express.Router()
const bcrypt = require("bcryptjs")
const establishments = require("../query/establishments_query")
const auth = require("../services/auth")

// get all establishments for admin (initial plan)
router.get("/", auth.validateEstablishmentToken, async function (req, res) {
    var allEstablishments = await establishments.getAllEstablishments()
    if (allEstablishments)
        return res.send({ success: true, allEstablishments: allEstablishments })
    res.send({ success: false })
})

// get establishment by id
router.post(
    "/individual",
    auth.validateEstablishmentToken,
    async function (req, res) {
        var establishment = await establishments.getEstablishment(
            req.body.establishmentId
        )
        if (establishment)
            return res.send({ success: true, establishment: establishment })
        res.send({ success: false })
    }
)

//create new establishment
router.post("/create", async function (req, res) {
    var newEstablishment = await establishments.createEstablishment(req.body)
    if (newEstablishment)
        return res.status(200).send({
            success: true,
            establishment: newEstablishment,
        })
    res.send({ success: false, message: "Failed to create establishment." })
})

//update establishment
router.put(
    "/update",
    auth.validateEstablishmentToken,
    async function (req, res) {
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
    }
)

//update establishment password
router.put(
    "/update-password",
    auth.validateEstablishmentToken,
    async function (req, res) {
        //hash password of the new user using bcrypt
        const hashedPassword = await bcrypt.hash(
            req.body.updateData.password,
            10
        )
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
    }
)

//establishment login
router.post(
    "/login",
    auth.loginValidateEstablishmentToken,
    async function (req, res) {
        var establishment = await auth.establishmentLogin(
            req.body.establishmentId,
            req.body.password
        )
        if (!establishment.success) return res.send(establishment)

        var expire = new Date()

        // res.cookie("vtraceEstToken", establishment.token, {
        //     path: "/",
        //     expires: new Date(expire.setDate(expire.getDate() + 365)),
        // })
        res.send({
            success: establishment.success,
            establishment: establishment.establishment,
            token: establishment.token,
        })
    }
)

//establishment mobile app login
router.post(
    "/mobile-login",
    // auth.loginValidateEstablishmentToken,
    async function (req, res) {
        var estab = await auth.establishmentLogin(
            req.body.establishmentId,
            req.body.password
        )
        if (!estab.success) return res.send(estab)

        res.status(200).send({
            success: estab.success,
            establishmentId: estab.establishment.establishmentId,
            establishmentName: estab.establishment.establishmentName,
            vtestToken: estab.token,
        })
    }
)

//establishment logout
router.get("/logout", async function (req, res) {
    res.clearCookie("vtraceEstToken")
    res.send({ success: true, message: "Establishment has been logged out." })
})

router.post(
    "/password-matched",
    auth.validateEstablishmentToken,
    async function (req, res, next) {
        var establishment = await establishments.getEstablishment(
            req.body.establishmentId
        )
        if (establishment) {
            var password = req.body.password
            const validPassword = await bcrypt.compare(
                password,
                establishment.password
            )
            if (validPassword) return res.send({ success: true })
            return res.send({
                success: false,
                message: "Old Password does not match.",
            })
        }
        res.status(404).send({ success: false })
    }
)
module.exports = router
