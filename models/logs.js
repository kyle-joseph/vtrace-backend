const mongoose = require("mongoose")

const LogsSchema = new mongoose.Schema(
    {
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
        establishment: {type: mongoose.Schema.Types.ObjectId, ref: 'Establishments'},
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
