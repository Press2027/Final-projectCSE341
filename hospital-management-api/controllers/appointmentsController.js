const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

const collectionName = 'appointments';

const requiredFields = [
    'patientId',
    'doctorId',
    'appointmentDate',
    'appointmentTime',
    'reason',
    'status',
    'notes'
];

async function validateReferences(db, patientId, doctorId) {
    if (!ObjectId.isValid(patientId)) {
        return {
            valid: false,
            status: 400,
            message: 'Invalid patient ID'
        };
    }

    if (!ObjectId.isValid(doctorId)) {
        return {
            valid: false,
            status: 400,
            message: 'Invalid doctor ID'
        };
    }

    const patient = await db
        .collection('patients')
        .findOne({
            _id: new ObjectId(patientId)
        });

    if (!patient) {
        return {
            valid: false,
            status: 404,
            message: 'Patient not found'
        };
    }

    const doctor = await db
        .collection('doctors')
        .findOne({
            _id: new ObjectId(doctorId)
        });

    if (!doctor) {
        return {
            valid: false,
            status: 404,
            message: 'Doctor not found'
        };
    }

    return {
        valid: true
    };
}

// GET /appointments
async function getAllAppointments(req, res) {
    try {
        const db = getDb();

        const appointments = await db
            .collection(collectionName)
            .find({})
            .toArray();

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error getting appointments:', error);

        res.status(500).json({
            message: 'An error occurred while retrieving appointments'
        });
    }
}

// GET /appointments/:id
async function getAppointmentById(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid appointment ID'
            });
        }

        const db = getDb();

        const appointment = await db
            .collection(collectionName)
            .findOne({
                _id: new ObjectId(id)
            });

        if (!appointment) {
            return res.status(404).json({
                message: 'Appointment not found'
            });
        }

        res.status(200).json(appointment);
    } catch (error) {
        console.error('Error getting appointment:', error);

        res.status(500).json({
            message: 'An error occurred while retrieving the appointment'
        });
    }
}

// POST /appointments
async function createAppointment(req, res) {
    try {
        const {
            patientId,
            doctorId,
            appointmentDate,
            appointmentTime,
            reason,
            status,
            notes
        } = req.body;

        const missingFields = requiredFields.filter(
            (field) =>
                req.body[field] === undefined ||
                req.body[field] === null ||
                String(req.body[field]).trim() === ''
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Required appointment fields are missing',
                missingFields
            });
        }

        const db = getDb();

        const references = await validateReferences(
            db,
            patientId,
            doctorId
        );

        if (!references.valid) {
            return res.status(references.status).json({
                message: references.message
            });
        }

        const newAppointment = {
            patientId: new ObjectId(patientId),
            doctorId: new ObjectId(doctorId),
            appointmentDate: appointmentDate.trim(),
            appointmentTime: appointmentTime.trim(),
            reason: reason.trim(),
            status: status.trim(),
            notes: notes.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db
            .collection(collectionName)
            .insertOne(newAppointment);

        res.status(201).json({
            message: 'Appointment created successfully',
            appointmentId: result.insertedId,
            appointment: newAppointment
        });
    } catch (error) {
        console.error('Error creating appointment:', error);

        res.status(500).json({
            message: 'An error occurred while creating the appointment'
        });
    }
}

// PUT /appointments/:id
async function updateAppointment(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid appointment ID'
            });
        }

        const missingFields = requiredFields.filter(
            (field) =>
                req.body[field] === undefined ||
                req.body[field] === null ||
                String(req.body[field]).trim() === ''
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Required appointment fields are missing',
                missingFields
            });
        }

        const {
            patientId,
            doctorId,
            appointmentDate,
            appointmentTime,
            reason,
            status,
            notes
        } = req.body;

        const db = getDb();

        const existingAppointment = await db
            .collection(collectionName)
            .findOne({
                _id: new ObjectId(id)
            });

        if (!existingAppointment) {
            return res.status(404).json({
                message: 'Appointment not found'
            });
        }

        const references = await validateReferences(
            db,
            patientId,
            doctorId
        );

        if (!references.valid) {
            return res.status(references.status).json({
                message: references.message
            });
        }

        const updatedAppointment = {
            patientId: new ObjectId(patientId),
            doctorId: new ObjectId(doctorId),
            appointmentDate: appointmentDate.trim(),
            appointmentTime: appointmentTime.trim(),
            reason: reason.trim(),
            status: status.trim(),
            notes: notes.trim(),
            updatedAt: new Date()
        };

        await db
            .collection(collectionName)
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedAppointment }
            );

        res.status(200).json({
            message: 'Appointment updated successfully'
        });
    } catch (error) {
        console.error('Error updating appointment:', error);

        res.status(500).json({
            message: 'An error occurred while updating the appointment'
        });
    }
}

// DELETE /appointments/:id
async function deleteAppointment(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid appointment ID'
            });
        }

        const db = getDb();

        const result = await db
            .collection(collectionName)
            .deleteOne({
                _id: new ObjectId(id)
            });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting appointment:', error);

        res.status(500).json({
            message: 'An error occurred while deleting the appointment'
        });
    }
}

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
};