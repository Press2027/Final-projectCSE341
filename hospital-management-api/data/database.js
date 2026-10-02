const { MongoClient } = require('mongodb');

let client;
let db;

async function initDb() {
    if (!process.env.MONGODB_URI) {
        throw new Error(
            'MONGODB_URI is not defined. Check your .env file.'
        );
    }

    try {
        client = new MongoClient(process.env.MONGODB_URI);

        await client.connect();

        db = client.db('hospital_management');

        // Confirm database connection
        await db.command({ ping: 1 });

        console.log('MongoDB connected successfully');
        console.log('Database:', db.databaseName);

        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);

        throw error;
    }
}

function getDb() {
    if (!db) {
        throw new Error(
            'Database has not been initialized. Call initDb() first.'
        );
    }

    return db;
}

async function closeDb() {
    if (client) {
        await client.close();
        client = null;
        db = null;

        console.log('MongoDB connection closed');
    }
}

module.exports = {
    initDb,
    getDb,
    closeDb
};