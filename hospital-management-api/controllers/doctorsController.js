const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

const collectionName = 'doctors';

const requiredFields = [
    'firstName',
    'lastName',
    'specialization',
    'phone',
    'email',
    'department',
    'licenseNumber'
];

// GET /doctors
async function getAllDoctors(req, res) {
    try {
        const db = getDb();

        const doctors = await db
            .collection(collectionName)
            .find({})
            .toArray();

        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error getting doctors:', error);

        res.status(500).json({
            message: 'An error occurred while retrieving doctors'
        });
    }
}

// GET /doctors/:id
async function getDoctorById(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid doctor ID'
            });
        }

        const db = getDb();

        const doctor = await db
            .collection(collectionName)
            .findOne({
                _id: new ObjectId(id)
            });

        if (!doctor) {
            return res.status(404).json({
                message: 'Doctor not found'
            });
        }

        res.status(200).json(doctor);
    } catch (error) {
        console.error('Error getting doctor:', error);

        res.status(500).json({
            message: 'An error occurred while retrieving the doctor'
        });
    }
}

// POST /doctors
async function createDoctor(req, res) {
    try {
        const {
            firstName,
            lastName,
            specialization,
            phone,
            email,
            department,
            licenseNumber
        } = req.body;

        const missingFields = requiredFields.filter(
            (field) =>
                req.body[field] === undefined ||
                req.body[field] === null ||
                String(req.body[field]).trim() === ''
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Required doctor fields are missing',
                missingFields
            });
        }

        if (!email.includes('@')) {
            return res.status(400).json({
                message: 'Please provide a valid email address'
            });
        }

        const db = getDb();

        const newDoctor = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            specialization: specialization.trim(),
            phone: phone.trim(),
            email: email.trim().toLowerCase(),
            department: department.trim(),
            licenseNumber: licenseNumber.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db
            .collection(collectionName)
            .insertOne(newDoctor);

        res.status(201).json({
            message: 'Doctor created successfully',
            doctorId: result.insertedId,
            doctor: newDoctor
        });
    } catch (error) {
        console.error('Error creating doctor:', error);

        res.status(500).json({
            message: 'An error occurred while creating the doctor'
        });
    }
}

// PUT /doctors/:id
async function updateDoctor(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid doctor ID'
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
                message: 'Required doctor fields are missing',
                missingFields
            });
        }

        const {
            firstName,
            lastName,
            specialization,
            phone,
            email,
            department,
            licenseNumber
        } = req.body;

        if (!email.includes('@')) {
            return res.status(400).json({
                message: 'Please provide a valid email address'
            });
        }

        const db = getDb();

        const existingDoctor = await db
            .collection(collectionName)
            .findOne({
                _id: new ObjectId(id)
            });

        if (!existingDoctor) {
            return res.status(404).json({
                message: 'Doctor not found'
            });
        }

        const updatedDoctor = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            specialization: specialization.trim(),
            phone: phone.trim(),
            email: email.trim().toLowerCase(),
            department: department.trim(),
            licenseNumber: licenseNumber.trim(),
            updatedAt: new Date()
        };

        await db
            .collection(collectionName)
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedDoctor }
            );

        res.status(200).json({
            message: 'Doctor updated successfully'
        });
    } catch (error) {
        console.error('Error updating doctor:', error);

        res.status(500).json({
            message: 'An error occurred while updating the doctor'
        });
    }
}

// DELETE /doctors/:id
async function deleteDoctor(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid doctor ID'
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
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            message: 'Doctor deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting doctor:', error);

        res.status(500).json({
            message: 'An error occurred while deleting the doctor'
        });
    }
}

module.exports = {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
};