const express = require('express');
const router = express.Router();

const doctorsController = require('../controllers/doctorsController');

// ============================================================
// DOCTORS
// ============================================================

router.get('/', (req, res) => {
    /* #swagger.tags = ['Doctors'] */
    doctorsController.getAllDoctors(req, res);
});

router.get('/:id', (req, res) => {
    /* #swagger.tags = ['Doctors'] */
    doctorsController.getDoctorById(req, res);
});

router.post('/', (req, res) => {
    /* #swagger.tags = ['Doctors'] */
    doctorsController.createDoctor(req, res);
});

router.put('/:id', (req, res) => {
    /* #swagger.tags = ['Doctors'] */
    doctorsController.updateDoctor(req, res);
});

router.delete('/:id', (req, res) => {
    /* #swagger.tags = ['Doctors'] */
    doctorsController.deleteDoctor(req, res);
});

module.exports = router;