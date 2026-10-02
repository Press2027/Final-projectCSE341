const express = require('express');
const router = express.Router();

// ============================================================
// AUTHENTICATION
// ============================================================

router.get('/google', (req, res) => {
    /* #swagger.tags = ['Authentication'] */

    // Google OAuth logic
});

router.get('/google/callback', (req, res) => {
    /* #swagger.tags = ['Authentication'] */

    // Google OAuth callback
});

router.get('/logout', (req, res) => {
    /* #swagger.tags = ['Authentication'] */

    // Logout logic
});

module.exports = router;