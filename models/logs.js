const mongoose = require("mongoose")

const LogsSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        establishmentId: {
            type: String,
            required: true,
        },
        dateTime: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Logs", LogsSchema)
