
const express = require('express');
const router = express.Router();

const medicalRecordsController = require('../controllers/medicalRecordsController');
const requireAuth = require('../middleware/requireAuth');

// ============================================================
// MEDICAL RECORDS
// ============================================================

// GET: Retrieve all medical records (public)
router.get('/', (req, res) => {
    /* #swagger.tags = ['Medical Records'] */
    medicalRecordsController.getAllMedicalRecords(req, res);
});

// GET: Retrieve one medical record (public)
router.get('/:id', (req, res) => {
    /* #swagger.tags = ['Medical Records'] */
    medicalRecordsController.getMedicalRecordById(req, res);
});

// POST: Create a medical record (login required)
router.post('/', requireAuth, (req, res) => {
    /* #swagger.tags = ['Medical Records'] */
    /* #swagger.security = [{ "cookieAuth": [] }] */
    medicalRecordsController.createMedicalRecord(req, res);
});

// PUT: Update a medical record (login required)
router.put('/:id', requireAuth, (req, res) => {
    /* #swagger.tags = ['Medical Records'] */
    /* #swagger.security = [{ "cookieAuth": [] }] */
    medicalRecordsController.updateMedicalRecord(req, res);
});

// DELETE: Delete a medical record (login required)
router.delete('/:id', requireAuth, (req, res) => {
    /* #swagger.tags = ['Medical Records'] */
    /* #swagger.security = [{ "cookieAuth": [] }] */
    medicalRecordsController.deleteMedicalRecord(req, res);
});

module.exports = router;
