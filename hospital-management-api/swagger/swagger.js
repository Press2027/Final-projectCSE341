const swaggerAutogen = require('swagger-autogen')();

const doc = {
    openapi: '3.0.0',

    info: {
        title: 'Hospital Management API',
        version: '1.0.0',
        description:
            'A RESTful API for managing patients, doctors, appointments, medical records, and user authentication. Developed as part of the CSE 341 Final Project.',
        contact: {
            name: 'Hospital Management API Development Team'
        },
        license: {
            name: 'ISC'
        }
    },

    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local Development Server'
        },
        {
            url: 'https://hospital-management-api-jp2e.onrender.com',
            description: 'Production Server'
        }
    ],

    tags: [
        // ============================================================
        // PATIENTS
        // ============================================================
        {
            name: 'Patients',
            description:
                'Patient management endpoints for creating, retrieving, updating, and deleting patient records.'
        },

        // ============================================================
        // DOCTORS
        // ============================================================
        {
            name: 'Doctors',
            description:
                'Doctor management endpoints for managing doctors and their professional information.'
        },

        // ============================================================
        // APPOINTMENTS
        // ============================================================
        {
            name: 'Appointments',
            description:
                'Appointment management endpoints for scheduling and managing patient appointments.'
        },

        // ============================================================
        // MEDICAL RECORDS
        // ============================================================
        {
            name: 'Medical Records',
            description:
                'Medical record endpoints for managing diagnoses, symptoms, treatments, medications, and patient medical history.'
        },

        // ============================================================
        // AUTHENTICATION
        // ============================================================
        {
            name: 'Authentication',
            description:
                'Authentication and user account management endpoints.'
        }
    ],

    securityDefinitions: {
        googleOAuth: {
            type: 'oauth2',
            authorizationUrl: '/auth/google',
            flow: 'implicit',
            scopes: {
                profile: 'Access the user profile',
                email: 'Access the user email address'
            }
        }
    },

    definitions: {

        // ============================================================
        // PATIENT COLLECTION
        // ============================================================
        Patient: {
            type: 'object',
            required: [
                'firstName',
                'lastName',
                'age',
                'gender',
                'phone',
                'email'
            ],
            properties: {
                firstName: {
                    type: 'string',
                    description: 'Patient first name',
                    example: 'John'
                },
                lastName: {
                    type: 'string',
                    description: 'Patient last name',
                    example: 'Doe'
                },
                age: {
                    type: 'integer',
                    minimum: 0,
                    description: 'Patient age',
                    example: 35
                },
                gender: {
                    type: 'string',
                    description: 'Patient gender',
                    example: 'Male'
                },
                phone: {
                    type: 'string',
                    description: 'Patient phone number',
                    example: '+254700000000'
                },
                email: {
                    type: 'string',
                    format: 'email',
                    description: 'Patient email address',
                    example: 'john.doe@example.com'
                },
                address: {
                    type: 'string',
                    description: 'Patient residential address',
                    example: 'Nairobi, Kenya'
                },
                emergencyContact: {
                    type: 'string',
                    description: 'Emergency contact phone number',
                    example: '+254711111111'
                },
                diagnosis: {
                    type: 'string',
                    description: 'Current or primary diagnosis',
                    example: 'Malaria'
                }
            }
        },

        // ============================================================
        // DOCTOR COLLECTION
        // ============================================================
        Doctor: {
            type: 'object',
            required: [
                'firstName',
                'lastName',
                'specialization',
                'phone',
                'email'
            ],
            properties: {
                firstName: {
                    type: 'string',
                    description: 'Doctor first name',
                    example: 'Jane'
                },
                lastName: {
                    type: 'string',
                    description: 'Doctor last name',
                    example: 'Smith'
                },
                specialization: {
                    type: 'string',
                    description: 'Medical specialization',
                    example: 'Cardiology'
                },
                phone: {
                    type: 'string',
                    description: 'Doctor phone number',
                    example: '+254722222222'
                },
                email: {
                    type: 'string',
                    format: 'email',
                    description: 'Doctor email address',
                    example: 'jane.smith@example.com'
                },
                department: {
                    type: 'string',
                    description: 'Hospital department',
                    example: 'Cardiology'
                },
                licenseNumber: {
                    type: 'string',
                    description: 'Medical license number',
                    example: 'MED-12345'
                }
            }
        },

        // ============================================================
        // APPOINTMENT COLLECTION
        // ============================================================
        Appointment: {
            type: 'object',
            required: [
                'patientId',
                'doctorId',
                'appointmentDate',
                'appointmentTime',
                'reason'
            ],
            properties: {
                patientId: {
                    type: 'string',
                    description: 'MongoDB ID of the patient',
                    example: '507f1f77bcf86cd799439011'
                },
                doctorId: {
                    type: 'string',
                    description: 'MongoDB ID of the doctor',
                    example: '507f191e810c19729de860ea'
                },
                appointmentDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Date of the appointment',
                    example: '2026-10-05'
                },
                appointmentTime: {
                    type: 'string',
                    description: 'Time of the appointment',
                    example: '10:30'
                },
                reason: {
                    type: 'string',
                    description: 'Reason for the appointment',
                    example: 'Routine medical consultation'
                },
                status: {
                    type: 'string',
                    enum: [
                        'Scheduled',
                        'Completed',
                        'Cancelled',
                        'Rescheduled'
                    ],
                    description: 'Current appointment status',
                    example: 'Scheduled'
                },
                notes: {
                    type: 'string',
                    description: 'Additional appointment notes',
                    example:
                        'Patient should arrive 15 minutes early'
                }
            }
        },

        // ============================================================
        // MEDICAL RECORD COLLECTION
        // ============================================================
        MedicalRecord: {
            type: 'object',
            required: [
                'patientId',
                'doctorId',
                'diagnosis',
                'treatment'
            ],
            properties: {
                patientId: {
                    type: 'string',
                    description: 'MongoDB ID of the patient',
                    example: '507f1f77bcf86cd799439011'
                },
                doctorId: {
                    type: 'string',
                    description: 'MongoDB ID of the doctor',
                    example: '507f191e810c19729de860ea'
                },
                diagnosis: {
                    type: 'string',
                    description: 'Medical diagnosis',
                    example: 'Malaria'
                },
                symptoms: {
                    type: 'string',
                    description: 'Patient symptoms',
                    example:
                        'Fever, headache, and body weakness'
                },
                treatment: {
                    type: 'string',
                    description: 'Recommended treatment',
                    example:
                        'Antimalarial treatment and fluids'
                },
                medications: {
                    type: 'string',
                    description: 'Prescribed medications',
                    example:
                        'Artemether-Lumefantrine'
                },
                notes: {
                    type: 'string',
                    description: 'Additional medical notes',
                    example:
                        'Patient advised to return for follow-up'
                },
                recordDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Date the medical record was created',
                    example: '2026-09-30'
                }
            }
        },

        // ============================================================
        // USER / AUTHENTICATION COLLECTION
        // ============================================================
        User: {
            type: 'object',
            properties: {
                googleId: {
                    type: 'string',
                    description: 'Google account identifier',
                    example: '123456789'
                },
                displayName: {
                    type: 'string',
                    description: 'User display name',
                    example: 'John Doe'
                },
                email: {
                    type: 'string',
                    format: 'email',
                    description: 'User email address',
                    example: 'john.doe@gmail.com'
                },
                photo: {
                    type: 'string',
                    format: 'uri',
                    description: 'User profile photo URL',
                    example:
                        'https://example.com/photo.jpg'
                }
            }
        },

        // ============================================================
        // ERROR RESPONSE
        // ============================================================
        Error: {
            type: 'object',
            properties: {
                success: {
                    type: 'boolean',
                    example: false
                },
                message: {
                    type: 'string',
                    example:
                        'An error occurred while processing the request.'
                }
            }
        }
    },

    responses: {

        // ============================================================
        // ERROR RESPONSES
        // ============================================================
        BadRequest: {
            description:
                'The request contains invalid or missing data.'
        },

        Unauthorized: {
            description:
                'Authentication is required or the provided credentials are invalid.'
        },

        Forbidden: {
            description:
                'The authenticated user does not have permission to perform this operation.'
        },

        NotFound: {
            description:
                'The requested resource was not found.'
        },

        ServerError: {
            description:
                'An unexpected server error occurred.'
        }
    }
};

const outputFile = './swagger-output.json';

const endpointsFiles = [
    './server.js',
    './routes/patientsRoutes.js',
    './routes/doctorsRoutes.js',
    './routes/appointmentsRoutes.js',
    './routes/medicalRecordsRoutes.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);