const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiry } =  require('./config');

function generateToken(user)
{
    return jwt.sign({
        sub:user.id,
        username: user.username,
        role: user.role,
    }, jwtSecret, {expiresIn: jwtExpiry});
}

function verifyToken(req, res, next)
{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
    {
        return res.status(401).json({ message: 'Invalid/Missing Token!'});
    }

    const token = authHeader.split(' ')[1];

    try
    {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    }
    catch (err)
    {
        res.status(401).json({ message: 'Invalid/Expired Token'});
    }
}

module.exports = { generateToken, verifyToken};