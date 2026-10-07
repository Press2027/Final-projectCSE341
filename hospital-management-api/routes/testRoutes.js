
const express = require('express');

const router = express.Router();

/**
 * @route GET /test-status
 * @description Reports the test suite status recorded during deployment.
 */
router.get(
    '/',
    /*
        #swagger.tags = ['Testing']
        #swagger.summary = 'Check automated test status'
        #swagger.description = 'Reports the most recent test status recorded during deployment. This endpoint does not execute Jest.'
        #swagger.responses[200] = {
            description: 'Test status retrieved successfully',
            schema: {
                status: 'See deployment test results',
                message: 'Automated tests are run during deployment'
            }
        }
    */
    (req, res) => {
        res.status(200).json({
            status: 'See deployment test results',
            message: 'This endpoint does not execute Jest. Check the Render deployment logs for the actual test results.'
        });
    }
);

module.exports = router;
