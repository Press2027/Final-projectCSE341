const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { ObjectId } = require('mongodb');

const { getDb } = require('../data/database');

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const db = getDb();
                const users = db.collection('users');

                const existingUser = await users.findOne({
                    githubId: profile.id
                });

                const userData = {
                    githubId: profile.id,
                    username: profile.username,
                    displayName: profile.displayName || profile.username,
                    email:
                        profile.emails && profile.emails.length > 0
                            ? profile.emails[0].value
                            : null,
                    profileUrl: profile.profileUrl,
                    avatarUrl: profile.photos && profile.photos.length > 0
                        ? profile.photos[0].value
                        : null,
                    updatedAt: new Date()
                };

                if (existingUser) {
                    await users.updateOne(
                        { githubId: profile.id },
                        {
                            $set: userData
                        }
                    );

                    const updatedUser = await users.findOne({
                        githubId: profile.id
                    });

                    return done(null, updatedUser);
                }

                userData.createdAt = new Date();

                const result = await users.insertOne(userData);

                const newUser = await users.findOne({
                    _id: result.insertedId
                });

                return done(null, newUser);

            } catch (error) {
                console.error('GitHub authentication error:', error);
                return done(error, null);
            }
        }
    )
);

// Store user ID in session
passport.serializeUser((user, done) => {
    done(null, user._id.toString());
});

// Retrieve user from MongoDB session
passport.deserializeUser(async (id, done) => {
    try {
        const db = getDb();

        const user = await db.collection('users').findOne({
            _id: new require('mongodb').ObjectId(id)
        });

        if (!user) {
            return done(null, false);
        }

        done(null, user);

    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;