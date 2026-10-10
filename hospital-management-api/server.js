const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const passport = require('passport');

const testRoutes = require('./routes/testRoutes');

const { initDb } = require('./data/database');

const patientsRoutes = require('./routes/patientsRoutes');
const doctorsRoutes = require('./routes/doctorsRoutes');
const appointmentsRoutes = require('./routes/appointmentsRoutes');
const medicalRecordsRoutes = require('./routes/medicalRecordsRoutes');
const authRoutes = require('./routes/authRoutes');

require('./config/passport');

const swaggerDocument = require('./swagger-output.json');

const app = express();

// Required for secure session cookies behind Render's proxy.
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE
// ==========================================

// Parse JSON request bodies
app.use(express.json());

// ==========================================
// SESSION CONFIGURATION
// ==========================================

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: 'sessions'
        }),

        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'
                ? 'none'
                : 'lax'
        }
    })
);

// ==========================================
// PASSPORT
// ==========================================

app.use(passport.initialize());
app.use(passport.session());

// ==========================================
// SWAGGER DOCUMENTATION
// ==========================================

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            withCredentials: true
        }
    })
);

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.use('/auth', authRoutes);

// ==========================================
// API ROUTES
// ==========================================

app.use('/patients', patientsRoutes);
app.use('/doctors', doctorsRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/medical-records', medicalRecordsRoutes);
app.use('/test-status', testRoutes);

// ==========================================
// HOME ROUTE
// ==========================================

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hospital Management API is running',
        status: 'success',
        database: 'MongoDB',
        authentication: 'GitHub OAuth'
    });
});

// ==========================================
// INVALID JSON ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {
    if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        error.body
    ) {
        return res.status(400).json({
            message: 'Invalid JSON format'
        });
    }

    next(error);
});

// ==========================================
// 404 ROUTE NOT FOUND
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.originalUrl
    });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {
    console.error('Server error:', error);

    const statusCode = error.status || 500;

    if (statusCode === 400) {
        return res.status(400).json({
            message: error.message || 'Bad request'
        });
    }

    if (statusCode === 404) {
        return res.status(404).json({
            message: error.message || 'Resource not found'
        });
    }

    return res.status(500).json({
        message: 'Internal server error'
    });
});

// ==========================================
// START SERVER
// ==========================================

async function startServer() {
    try {
        console.log('======================================');
        console.log('Starting Hospital Management API');
        console.log('======================================');

        // Connect to MongoDB before starting server
        await initDb();

        console.log('MongoDB connection established.');

        // Start server
        app.listen(PORT, '0.0.0.0', () => {
            console.log('======================================');
            console.log('Hospital Management API');
            console.log('======================================');
            console.log(`Server running on port ${PORT}`);
            console.log(`API: http://localhost:${PORT}`);
            console.log(
                `Swagger: http://localhost:${PORT}/api-docs`
            );
            console.log('Authentication: GitHub OAuth');
            console.log('MongoDB: Connected');
            console.log('======================================');
        });

    } catch (error) {
        console.error('======================================');
        console.error('SERVER STARTUP FAILED');
        console.error('======================================');
        console.error(error.message);

        process.exit(1);
    }
}

startServer();