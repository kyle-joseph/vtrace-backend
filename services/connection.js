var mongoose = require("mongoose")

function connect() {
    mongoose
        .connect(process.env.MONGO_SERVER, { useNewUrlParser: true })
        .then(() => {
            console.log("Connected to db...")
        })
        .catch((err) => {
            console.log(err.message)
        })
}

module.exports = {
    connect,
}
