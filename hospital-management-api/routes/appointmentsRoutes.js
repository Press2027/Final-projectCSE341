const express = require('express');
const router = express.Router();

const appointmentsController = require('../controllers/appointmentsController');

// ============================================================
// APPOINTMENTS
// ============================================================

router.get('/', (req, res) => {
    /* #swagger.tags = ['Appointments'] */
    appointmentsController.getAllAppointments(req, res);
});

router.get('/:id', (req, res) => {
    /* #swagger.tags = ['Appointments'] */
    appointmentsController.getAppointmentById(req, res);
});

router.post('/', (req, res) => {
    /* #swagger.tags = ['Appointments'] */
    appointmentsController.createAppointment(req, res);
});

router.put('/:id', (req, res) => {
    /* #swagger.tags = ['Appointments'] */
    appointmentsController.updateAppointment(req, res);
});

router.delete('/:id', (req, res) => {
    /* #swagger.tags = ['Appointments'] */
    appointmentsController.deleteAppointment(req, res);
});

module.exports = router;