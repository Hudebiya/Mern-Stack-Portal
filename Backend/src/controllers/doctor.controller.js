import userModel from "../models/users.model.js";

export async function getDoctors(req, res) {
    try {
        const { search } = req.query;
        const filter = { role: "doctor", isActive: { $ne: false } };
        if (search) {
            const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(safe, "i");
            filter.$or = [{ username: regex }, { specialization: regex }];
        }
        const doctors = await userModel
            .find(filter)
            .select("username email specialization experience");
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getDoctorById(req, res) {
    try {
        const doctor = await userModel
            .findOne({ _id: req.params.id, role: "doctor" })
            .select("username email specialization experience");
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        res.json(doctor);
    } catch (err) {
        res.status(400).json({ message: "Invalid doctor id" });
    }
}