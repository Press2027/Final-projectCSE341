const { MongoClient } = require('mongodb');

let client;
let db;

// Initialize MongoDB connection
async function initDb() {
    try {
        // Check MongoDB URI
        if (!process.env.MONGODB_URI) {
            const error = new Error(
                'MONGODB_URI is not defined. Check your environment variables.'
            );

            error.status = 500;
            throw error;
        }

        // Create MongoDB client
        client = new MongoClient(process.env.MONGODB_URI);

        // Connect to MongoDB
        await client.connect();

        // Select database
        db = client.db('hospital_management');

        // Confirm connection
        await db.command({ ping: 1 });

        console.log('MongoDB connected successfully');
        console.log('Database:', db.databaseName);

        return db;

    } catch (error) {
        console.error('MongoDB connection error:', error);

        // Database connection errors are server errors
        error.status = 500;

        throw error;
    }
}

// Get database connection
function getDb() {
    try {
        if (!db) {
            const error = new Error(
                'Database has not been initialized.'
            );

            error.status = 500;
            throw error;
        }

        return db;

    } catch (error) {
        console.error('Database access error:', error);

        if (!error.status) {
            error.status = 500;
        }

        throw error;
    }
}

// Close MongoDB connection
async function closeDb() {
    try {
        if (!client) {
            return;
        }

        await client.close();

        client = null;
        db = null;

        console.log('MongoDB connection closed');

    } catch (error) {
        console.error('MongoDB close error:', error);

        error.status = 500;

        throw error;
    }
}

module.exports = {
    initDb,
    getDb,
    closeDb
};