const jwt = require('jsonwebtoken');

const middleware = (req, res, next) => {
    const token = req.headers.token;
    if(!token) {
        res.status(403).json({message: 'no token, not logged in'});
        return;
    }
    const decoded = jwt.verify(token, 'nix123');
    const userId = decoded.id;

    if(!userId) {
        res.status(403).json({message: 'invalid token, not logged in'});
        return;
    }

    req.userId = userId;
    next();
}

module.exports = middleware;