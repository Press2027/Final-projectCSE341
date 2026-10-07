
const express = require('express');
const router = express.Router();

const doctorsController = require('../controllers/doctorsController');
const requireAuth = require('../middleware/requireAuth');

// ============================================================
// DOCTORS
// ============================================================

// GET: Retrieve all doctors (public)
router.get('/', (req, res) => {
    /* #swagger.tags = ['Doctors'] */
    doctorsController.getAllDoctors(req, res);
});

// GET: Retrieve one doctor (public)
router.get('/:id', (req, res) => {
    /* #swagger.tags = ['Doctors'] */
    doctorsController.getDoctorById(req, res);
});

// POST: Create a doctor (login required)
router.post('/', requireAuth, (req, res) => {
    /* #swagger.tags = ['Doctors'] */
    /* #swagger.security = [{ "cookieAuth": [] }] */
    doctorsController.createDoctor(req, res);
});

// PUT: Update a doctor (login required)
router.put('/:id', requireAuth, (req, res) => {
    /* #swagger.tags = ['Doctors'] */
    /* #swagger.security = [{ "cookieAuth": [] }] */
    doctorsController.updateDoctor(req, res);
});

// DELETE: Delete a doctor (login required)
router.delete('/:id', requireAuth, (req, res) => {
    /* #swagger.tags = ['Doctors'] */
    /* #swagger.security = [{ "cookieAuth": [] }] */
    doctorsController.deleteDoctor(req, res);
});

module.exports = router;
