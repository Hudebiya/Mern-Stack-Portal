import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "cancelled"],
        default: "pending"
    }
}, { timestamps: true })

const appointmentModel = mongoose.model("appointment", appointmentSchema)
export default appointmentModel