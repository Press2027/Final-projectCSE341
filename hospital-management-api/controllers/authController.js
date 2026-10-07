// ==========================================
// AUTHENTICATION CONTROLLER
// ==========================================

// GitHub authentication status
function getAuthStatus(req, res) {
    if (req.isAuthenticated()) {
        return res.status(200).json({
            authenticated: true,
            user: {
                id: req.user._id,
                githubId: req.user.githubId,
                username: req.user.username,
                displayName: req.user.displayName,
                email: req.user.email,
                profileUrl: req.user.profileUrl,
                avatarUrl: req.user.avatarUrl
            }
        });
    }

    return res.status(200).json({
        authenticated: false,
        message: 'User is not authenticated'
    });
}

// GitHub logout
function logout(req, res, next) {
    req.logout((error) => {
        if (error) {
            return next(error);
        }

        req.session.destroy((sessionError) => {
            if (sessionError) {
                return next(sessionError);
            }

            res.clearCookie('connect.sid');

            return res.status(200).json({
                message: 'Successfully logged out'
            });
        });
    });
}

// Current authenticated user
function getCurrentUser(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: 'Login required'
        });
    }

    return res.status(200).json({
        message: 'Authenticated user',
        user: {
            id: req.user._id,
            githubId: req.user.githubId,
            username: req.user.username,
            displayName: req.user.displayName,
            email: req.user.email,
            profileUrl: req.user.profileUrl,
            avatarUrl: req.user.avatarUrl
        }
    });
}

module.exports = {
    getAuthStatus,
    getCurrentUser,
    logout
};