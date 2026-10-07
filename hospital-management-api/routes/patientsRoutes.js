
const express = require('express');
const router = express.Router();

const patientsController = require('../controllers/patientsController');
const requireAuth = require('../middleware/requireAuth');

// ============================================================
// PATIENTS
// ============================================================

// GET: Retrieve all patients (public)
router.get('/', (req, res) => {
    /* #swagger.tags = ['Patients'] */
    patientsController.getAllPatients(req, res);
});

// GET: Retrieve one patient (public)
router.get('/:id', (req, res) => {
    /* #swagger.tags = ['Patients'] */
    patientsController.getPatientById(req, res);
});

// POST: Create a patient (login required)
router.post('/', requireAuth, (req, res) => {
    /* #swagger.tags = ['Patients'] */
    /* #swagger.security = [{ "cookieAuth": [] }] */
    patientsController.createPatient(req, res);
});

// PUT: Update a patient (login required)
router.put('/:id', requireAuth, (req, res) => {
    /* #swagger.tags = ['Patients'] */
    /* #swagger.security = [{ "cookieAuth": [] }] */
    patientsController.updatePatient(req, res);
});

// DELETE: Delete a patient (login required)
router.delete('/:id', requireAuth, (req, res) => {
    /* #swagger.tags = ['Patients'] */
    /* #swagger.security = [{ "cookieAuth": [] }] */
    patientsController.deletePatient(req, res);
});

module.exports = router;
