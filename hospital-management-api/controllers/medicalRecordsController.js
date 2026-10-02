const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

const collectionName = 'medicalRecords';

const requiredFields = [
    'patientId',
    'doctorId',
    'diagnosis',
    'symptoms',
    'treatment',
    'medications',
    'notes',
    'recordDate'
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

// GET /medical-records
async function getAllMedicalRecords(req, res) {
    try {
        const db = getDb();

        const records = await db
            .collection(collectionName)
            .find({})
            .toArray();

        res.status(200).json(records);
    } catch (error) {
        console.error('Error getting medical records:', error);

        res.status(500).json({
            message: 'An error occurred while retrieving medical records'
        });
    }
}

// GET /medical-records/:id
async function getMedicalRecordById(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid medical record ID'
            });
        }

        const db = getDb();

        const record = await db
            .collection(collectionName)
            .findOne({
                _id: new ObjectId(id)
            });

        if (!record) {
            return res.status(404).json({
                message: 'Medical record not found'
            });
        }

        res.status(200).json(record);
    } catch (error) {
        console.error('Error getting medical record:', error);

        res.status(500).json({
            message: 'An error occurred while retrieving the medical record'
        });
    }
}

// POST /medical-records
async function createMedicalRecord(req, res) {
    try {
        const {
            patientId,
            doctorId,
            diagnosis,
            symptoms,
            treatment,
            medications,
            notes,
            recordDate
        } = req.body;

        const missingFields = requiredFields.filter(
            (field) =>
                req.body[field] === undefined ||
                req.body[field] === null ||
                String(req.body[field]).trim() === ''
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Required medical record fields are missing',
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

        const newMedicalRecord = {
            patientId: new ObjectId(patientId),
            doctorId: new ObjectId(doctorId),
            diagnosis: diagnosis.trim(),
            symptoms: symptoms.trim(),
            treatment: treatment.trim(),
            medications: medications.trim(),
            notes: notes.trim(),
            recordDate: recordDate.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db
            .collection(collectionName)
            .insertOne(newMedicalRecord);

        res.status(201).json({
            message: 'Medical record created successfully',
            medicalRecordId: result.insertedId,
            medicalRecord: newMedicalRecord
        });
    } catch (error) {
        console.error('Error creating medical record:', error);

        res.status(500).json({
            message: 'An error occurred while creating the medical record'
        });
    }
}

// PUT /medical-records/:id
async function updateMedicalRecord(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid medical record ID'
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
                message: 'Required medical record fields are missing',
                missingFields
            });
        }

        const {
            patientId,
            doctorId,
            diagnosis,
            symptoms,
            treatment,
            medications,
            notes,
            recordDate
        } = req.body;

        const db = getDb();

        const existingRecord = await db
            .collection(collectionName)
            .findOne({
                _id: new ObjectId(id)
            });

        if (!existingRecord) {
            return res.status(404).json({
                message: 'Medical record not found'
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

        const updatedMedicalRecord = {
            patientId: new ObjectId(patientId),
            doctorId: new ObjectId(doctorId),
            diagnosis: diagnosis.trim(),
            symptoms: symptoms.trim(),
            treatment: treatment.trim(),
            medications: medications.trim(),
            notes: notes.trim(),
            recordDate: recordDate.trim(),
            updatedAt: new Date()
        };

        await db
            .collection(collectionName)
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedMedicalRecord }
            );

        res.status(200).json({
            message: 'Medical record updated successfully'
        });
    } catch (error) {
        console.error('Error updating medical record:', error);

        res.status(500).json({
            message: 'An error occurred while updating the medical record'
        });
    }
}

// DELETE /medical-records/:id
async function deleteMedicalRecord(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid medical record ID'
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
                message: 'Medical record not found'
            });
        }

        res.status(200).json({
            message: 'Medical record deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting medical record:', error);

        res.status(500).json({
            message: 'An error occurred while deleting the medical record'
        });
    }
}

module.exports = {
    getAllMedicalRecords,
    getMedicalRecordById,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord
};