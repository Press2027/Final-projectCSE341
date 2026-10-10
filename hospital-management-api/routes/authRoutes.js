
const express = require('express');
const passport = require('passport');

const {
    getAuthStatus,
    getCurrentUser,
    logout
} = require('../controllers/authController');

const router = express.Router();

// ============================================================
// AUTHORIZATION
// ============================================================

// GitHub Login
router.get(
    '/github',
    (req, res, next) => {
        /* #swagger.tags = ['Authorization'] */
        /* #swagger.summary = 'Login with GitHub' */
        /* #swagger.description = 'Redirects the user to GitHub for OAuth authorization.' */
        passport.authenticate('github', {
            scope: ['user:email']
        })(req, res, next);
    }
);


 // GitHub OAuth Callback
router.get(
    '/github/callback',
    (req, res, next) => {
        passport.authenticate(
            'github',
            {
                failureRedirect: '/auth/login-failed'
            },
            (err, user, info) => {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    return res.redirect('/auth/login-failed');
                }

                req.logIn(user, (loginError) => {
                    if (loginError) {
                        return next(loginError);
                    }

                    // Wait for session to be saved before responding
                    req.session.save((sessionError) => {
                        if (sessionError) {
                            return next(sessionError);
                        }

                        return res.status(200).json({
                            message: 'GitHub authentication successful',
                            user: {
                                id: user._id,
                                githubId: user.githubId,
                                username: user.username,
                                displayName: user.displayName,
                                email: user.email
                            }
                        });
                    });
                });
            }
        )(req, res, next);
    }
);


// Authentication Status
router.get('/status', (req, res) => {
    /* #swagger.tags = ['Authorization'] */
    /* #swagger.summary = 'Check authentication status' */
    getAuthStatus(req, res);
});

// Current User
router.get('/me', (req, res) => {
    /* #swagger.tags = ['Authorization'] */
    /* #swagger.summary = 'Get current authenticated user' */
    getCurrentUser(req, res);
});

// Logout
router.get('/logout', (req, res) => {
    /* #swagger.tags = ['Authorization'] */
    /* #swagger.summary = 'Logout current user' */
    getAuthStatus;
    logout(req, res);
});

// Login Failed
router.get('/login-failed', (req, res) => {
    /* #swagger.tags = ['Authorization'] */
    /* #swagger.summary = 'Authentication failure response' */
    res.status(401).json({
        success: false,
        message: 'GitHub authentication failed'
    });
});

module.exports = router;
