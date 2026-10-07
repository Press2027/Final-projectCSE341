
const express = require('express');
const request = require('supertest');
const { ObjectId } = require('mongodb');

// Mock the database so these unit tests do not require MongoDB.
jest.mock('../data/database', () => ({
    getDb: jest.fn()
}));

const { getDb } = require('../data/database');

const patientsRoutes = require('../routes/patientsRoutes');
const doctorsRoutes = require('../routes/doctorsRoutes');
const appointmentsRoutes = require('../routes/appointmentsRoutes');
const medicalRecordsRoutes = require('../routes/medicalRecordsRoutes');

const app = express();
app.use(express.json());

app.use('/patients', patientsRoutes);
app.use('/doctors', doctorsRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/medical-records', medicalRecordsRoutes);

const TEST_ID = '507f1f77bcf86cd799439011';

const testCollections = [
    {
        name: 'Patients',
        route: '/patients',
        collection: 'patients',
        record: {
            _id: new ObjectId(TEST_ID),
            firstName: 'John',
            lastName: 'Doe',
            age: 35,
            gender: 'Male',
            phone: '+254700000000',
            email: 'john@example.com',
            address: 'Juba, South Sudan',
            emergencyContact: '+254711111111',
            diagnosis: 'Malaria'
        }
    },
    {
        name: 'Doctors',
        route: '/doctors',
        collection: 'doctors',
        record: {
            _id: new ObjectId(TEST_ID),
            firstName: 'Jane',
            lastName: 'Smith',
            specialization: 'Cardiology',
            phone: '+254722222222',
            email: 'jane@example.com',
            department: 'Cardiology',
            licenseNumber: 'MED-12345'
        }
    },
    {
        name: 'Appointments',
        route: '/appointments',
        collection: 'appointments',
        record: {
            _id: new ObjectId(TEST_ID),
            patientId: new ObjectId(TEST_ID),
            doctorId: new ObjectId(TEST_ID),
            appointmentDate: '2026-10-10',
            appointmentTime: '10:30',
            reason: 'Routine consultation',
            status: 'Scheduled',
            notes: 'Routine check-up'
        }
    },
    {
        name: 'Medical Records',
        route: '/medical-records',
        collection: 'medicalRecords',
        record: {
            _id: new ObjectId(TEST_ID),
            patientId: new ObjectId(TEST_ID),
            doctorId: new ObjectId(TEST_ID),
            diagnosis: 'Malaria',
            symptoms: 'Fever and headache',
            treatment: 'Prescribed treatment',
            medications: 'Example medication',
            notes: 'Follow-up recommended',
            recordDate: '2026-10-06'
        }
    }
];

let mockDb;

beforeEach(() => {
    jest.clearAllMocks();

    mockDb = {
        collection: jest.fn((collectionName) => {
            const item = testCollections.find(
                (entry) => entry.collection === collectionName
            );

            if (!item) {
                throw new Error(`Unexpected collection: ${collectionName}`);
            }

            return {
                find: jest.fn(() => ({
                    toArray: jest.fn().mockResolvedValue([item.record])
                })),

                findOne: jest.fn().mockResolvedValue(item.record)
            };
        })
    };

    getDb.mockReturnValue(mockDb);
});

describe.each(testCollections)(
    '$name GET endpoints',
    ({ route, collection, record }) => {
        test('GET all records returns 200 and an array', async () => {
            const response = await request(app)
                .get(`${route}/`)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(1);
            expect(response.body[0]._id).toBe(TEST_ID);
            expect(mockDb.collection).toHaveBeenCalledWith(collection);
        });

        test('GET one record by ID returns 200', async () => {
            const response = await request(app)
                .get(`${route}/${TEST_ID}`)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body._id).toBe(TEST_ID);
            expect(mockDb.collection).toHaveBeenCalledWith(collection);
        });

        test('GET with an invalid ID returns 400', async () => {
            const response = await request(app)
                .get(`${route}/invalid-id`)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body.message).toBeTruthy();
        });
    }
);
