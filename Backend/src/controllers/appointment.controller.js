import appointmentModel from "../models/Appointment.model.js";
import userModel from "../models/users.model.js";

// Patient: book appointment
export async function createAppointment(req, res) {
    try {
        const { doctor, appointmentDate, appointmentTime, reason } = req.body;

        if (!doctor || !appointmentDate || !appointmentTime || !reason) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const doctorUser = await userModel.findOne({ _id: doctor, role: "doctor" });
        if (!doctorUser || doctorUser.isActive === false) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const date = new Date(appointmentDate);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ message: "Invalid date" });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);
        if (dateOnly < today) {
            return res.status(400).json({ message: "Cannot book appointment in the past" });
        }

        const existing = await appointmentModel.findOne({
            patient: req.user.id,
            doctor,
            appointmentDate: date,
            appointmentTime,
            status: { $in: ["pending", "approved"] }
        });
        if (existing) {
            return res.status(409).json({
                message: "You already have an appointment with this doctor at this date and time"
            });
        }

        const appointment = await appointmentModel.create({
            patient: req.user.id,
            doctor,
            appointmentDate: date,
            appointmentTime,
            reason
        });
        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Patient: own appointments
export async function getMyAppointments(req, res) {
    try {
        const appointments = await appointmentModel
            .find({ patient: req.user.id })
            .populate("doctor", "username specialization experience")
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Doctor: appointments assigned to this doctor
export async function getDoctorAppointments(req, res) {
    try {
        const filter = { doctor: req.user.id };
        if (req.query.status) filter.status = req.query.status;
        const appointments = await appointmentModel
            .find(filter)
            .populate("patient", "username email")
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Doctor: approve / reject
export async function updateAppointmentStatus(req, res) {
    try {
        const { status } = req.body;
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Status must be approved or rejected" });
        }

        const appointment = await appointmentModel.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ message: "This appointment is not assigned to you" });
        }
        if (appointment.status !== "pending") {
            return res.status(400).json({ message: "Only pending appointments can be updated" });
        }

        if (status === "approved") {
            const clash = await appointmentModel.findOne({
                _id: { $ne: appointment._id },
                doctor: appointment.doctor,
                appointmentDate: appointment.appointmentDate,
                appointmentTime: appointment.appointmentTime,
                status: "approved"
            });
            if (clash) {
                return res.status(409).json({ message: "You already have an approved appointment at this time" });
            }
        }

        appointment.status = status;
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Patient: cancel own pending appointment
export async function cancelAppointment(req, res) {
    try {
        const appointment = await appointmentModel.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        if (appointment.patient.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not your appointment" });
        }
        if (appointment.status !== "pending") {
            return res.status(400).json({ message: "Only pending appointments can be cancelled" });
        }

        appointment.status = "cancelled";
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}