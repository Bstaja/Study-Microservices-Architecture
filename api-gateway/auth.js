const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./config');

function verifyToken(req, res, next)
{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer: '))
    {
        return res.status(401).json({ message: 'Missing/Invalid token' });
    }

    const token = authHeader.split(' ')[1];
    try
    {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    }
    catch(err)
    {
        res.status(401).json({ message: 'Invalid/Expired token' });
    }
}

module.exports = { verifyToken };