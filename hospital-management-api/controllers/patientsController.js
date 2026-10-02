const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

const collectionName = 'patients';

const requiredFields = [
    'firstName',
    'lastName',
    'age',
    'gender',
    'phone',
    'email',
    'address',
    'emergencyContact',
    'diagnosis'
];

// GET /patients
async function getAllPatients(req, res) {
    try {
        const db = getDb();

        const patients = await db
            .collection(collectionName)
            .find({})
            .toArray();

        res.status(200).json(patients);
    } catch (error) {
        console.error('Error getting patients:', error);

        res.status(500).json({
            message: 'An error occurred while retrieving patients'
        });
    }
}

// GET /patients/:id
async function getPatientById(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid patient ID'
            });
        }

        const db = getDb();

        const patient = await db
            .collection(collectionName)
            .findOne({
                _id: new ObjectId(id)
            });

        if (!patient) {
            return res.status(404).json({
                message: 'Patient not found'
            });
        }

        res.status(200).json(patient);
    } catch (error) {
        console.error('Error getting patient:', error);

        res.status(500).json({
            message: 'An error occurred while retrieving the patient'
        });
    }
}

// POST /patients
async function createPatient(req, res) {
    try {
        const {
            firstName,
            lastName,
            age,
            gender,
            phone,
            email,
            address,
            emergencyContact,
            diagnosis
        } = req.body;

        const missingFields = requiredFields.filter(
            (field) =>
                req.body[field] === undefined ||
                req.body[field] === null ||
                String(req.body[field]).trim() === ''
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Required patient fields are missing',
                missingFields
            });
        }

        const numericAge = Number(age);

        if (!Number.isInteger(numericAge) || numericAge < 0 || numericAge > 150) {
            return res.status(400).json({
                message: 'Age must be a valid whole number between 0 and 150'
            });
        }

        if (!email.includes('@')) {
            return res.status(400).json({
                message: 'Please provide a valid email address'
            });
        }

        const db = getDb();

        const newPatient = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            age: numericAge,
            gender: gender.trim(),
            phone: phone.trim(),
            email: email.trim().toLowerCase(),
            address: address.trim(),
            emergencyContact: emergencyContact.trim(),
            diagnosis: diagnosis.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db
            .collection(collectionName)
            .insertOne(newPatient);

        res.status(201).json({
            message: 'Patient created successfully',
            patientId: result.insertedId,
            patient: newPatient
        });
    } catch (error) {
        console.error('Error creating patient:', error);

        res.status(500).json({
            message: 'An error occurred while creating the patient'
        });
    }
}

// PUT /patients/:id
async function updatePatient(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid patient ID'
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
                message: 'Required patient fields are missing',
                missingFields
            });
        }

        const {
            firstName,
            lastName,
            age,
            gender,
            phone,
            email,
            address,
            emergencyContact,
            diagnosis
        } = req.body;

        const numericAge = Number(age);

        if (!Number.isInteger(numericAge) || numericAge < 0 || numericAge > 150) {
            return res.status(400).json({
                message: 'Age must be a valid whole number between 0 and 150'
            });
        }

        if (!email.includes('@')) {
            return res.status(400).json({
                message: 'Please provide a valid email address'
            });
        }

        const db = getDb();

        const existingPatient = await db
            .collection(collectionName)
            .findOne({
                _id: new ObjectId(id)
            });

        if (!existingPatient) {
            return res.status(404).json({
                message: 'Patient not found'
            });
        }

        const updatedPatient = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            age: numericAge,
            gender: gender.trim(),
            phone: phone.trim(),
            email: email.trim().toLowerCase(),
            address: address.trim(),
            emergencyContact: emergencyContact.trim(),
            diagnosis: diagnosis.trim(),
            updatedAt: new Date()
        };

        await db
            .collection(collectionName)
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedPatient }
            );

        res.status(200).json({
            message: 'Patient updated successfully'
        });
    } catch (error) {
        console.error('Error updating patient:', error);

        res.status(500).json({
            message: 'An error occurred while updating the patient'
        });
    }
}

// DELETE /patients/:id
async function deletePatient(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid patient ID'
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
                message: 'Patient not found'
            });
        }

        res.status(200).json({
            message: 'Patient deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting patient:', error);

        res.status(500).json({
            message: 'An error occurred while deleting the patient'
        });
    }
}

module.exports = {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
};