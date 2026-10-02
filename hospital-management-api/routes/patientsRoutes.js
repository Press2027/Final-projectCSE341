const express = require('express');
const router = express.Router();

const patientsController = require('../controllers/patientsController');

// ============================================================
// PATIENTS
// ============================================================

router.get('/', (req, res) => {
    /* #swagger.tags = ['Patients'] */
    patientsController.getAllPatients(req, res);
});

router.get('/:id', (req, res) => {
    /* #swagger.tags = ['Patients'] */
    patientsController.getPatientById(req, res);
});

router.post('/', (req, res) => {
    /* #swagger.tags = ['Patients'] */
    patientsController.createPatient(req, res);
});

router.put('/:id', (req, res) => {
    /* #swagger.tags = ['Patients'] */
    patientsController.updatePatient(req, res);
});

router.delete('/:id', (req, res) => {
    /* #swagger.tags = ['Patients'] */
    patientsController.deletePatient(req, res);
});

module.exports = router;