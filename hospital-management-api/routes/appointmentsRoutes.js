
const express = require('express');
const router = express.Router();

const appointmentsController = require('../controllers/appointmentsController');
const requireAuth = require('../middleware/requireAuth');

// ============================================================
// APPOINTMENTS
// ============================================================

// GET: Retrieve all appointments (public)
router.get('/', (req, res) => {
    /* #swagger.tags = ['Appointments'] */
    appointmentsController.getAllAppointments(req, res);
});

// GET: Retrieve one appointment (public)
router.get('/:id', (req, res) => {
    /* #swagger.tags = ['Appointments'] */
    appointmentsController.getAppointmentById(req, res);
});

// POST: Create an appointment (login required)
router.post('/', requireAuth, (req, res) => {
    /* #swagger.tags = ['Appointments'] */
    /* #swagger.security = [{ "cookieAuth": [] }] */
    appointmentsController.createAppointment(req, res);
});

// PUT: Update an appointment (login required)
router.put('/:id', requireAuth, (req, res) => {
    /* #swagger.tags = ['Appointments'] */
    /* #swagger.security = [{ "cookieAuth": [] }] */
    appointmentsController.updateAppointment(req, res);
});

// DELETE: Delete an appointment (login required)
router.delete('/:id', requireAuth, (req, res) => {
    /* #swagger.tags = ['Appointments'] */
    /* #swagger.security = [{ "cookieAuth": [] }] */
    appointmentsController.deleteAppointment(req, res);
});

module.exports = router;
