const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');

const { initDb } = require('./data/database');

const patientsRoutes = require('./routes/patientsRoutes');
const doctorsRoutes = require('./routes/doctorsRoutes');
const appointmentsRoutes = require('./routes/appointmentsRoutes');
const medicalRecordsRoutes = require('./routes/medicalRecordsRoutes');

const swaggerDocument = require('./swagger-output.json');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.use('/patients', patientsRoutes);
app.use('/doctors', doctorsRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/medical-records', medicalRecordsRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Hospital Management API is running'
    });
});

async function startServer() {
    try {
        await initDb();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(
                `Swagger docs: http://localhost:${PORT}/api-docs`
            );
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();