const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid token.' });
        }
        
        req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Access denied. Admin rights required.' });
            }
            next();
        });
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed.' });
    }
};

const staffAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (!['admin', 'staff'].includes(req.user.role)) {
                return res.status(403).json({ error: 'Access denied. Staff rights required.' });
            }
            next();
        });
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed.' });
    }
};

const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            
            if (user) {
                req.user = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                };
            }
        }
        
        next();
    } catch (error) {
        next();
    }
};

module.exports = {
    auth,
    adminAuth,
    staffAuth,
    optionalAuth
};
