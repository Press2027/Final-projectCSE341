require('dotenv').config();

const { initDb, getDb } = require('./database');

async function createCollections() {
    try {
        await initDb();

        const db = getDb();

        const collections = [
            'patients',
            'doctors',
            'appointments',
            'medicalRecords'
        ];

        const existingCollections = await db
            .listCollections()
            .toArray();

        const existingNames = existingCollections.map(
            (collection) => collection.name
        );

        for (const collectionName of collections) {
            if (!existingNames.includes(collectionName)) {
                await db.createCollection(collectionName);
                console.log(`Created collection: ${collectionName}`);
            } else {
                console.log(`Collection already exists: ${collectionName}`);
            }
        }

        console.log('Database collections are ready.');
        process.exit(0);
    } catch (error) {
        console.error('Failed to create collections:', error);
        process.exit(1);
    }
}

createCollections();