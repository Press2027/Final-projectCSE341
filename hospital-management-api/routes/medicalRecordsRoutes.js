const express = require('express');
const router = express.Router();

const medicalRecordsController = require('../controllers/medicalRecordsController');

// ============================================================
// MEDICAL RECORDS
// ============================================================

router.get('/', (req, res) => {
    /* #swagger.tags = ['Medical Records'] */
    medicalRecordsController.getAllMedicalRecords(req, res);
});

router.get('/:id', (req, res) => {
    /* #swagger.tags = ['Medical Records'] */
    medicalRecordsController.getMedicalRecordById(req, res);
});

router.post('/', (req, res) => {
    /* #swagger.tags = ['Medical Records'] */
    medicalRecordsController.createMedicalRecord(req, res);
});

router.put('/:id', (req, res) => {
    /* #swagger.tags = ['Medical Records'] */
    medicalRecordsController.updateMedicalRecord(req, res);
});

router.delete('/:id', (req, res) => {
    /* #swagger.tags = ['Medical Records'] */
    medicalRecordsController.deleteMedicalRecord(req, res);
});

module.exports = router;