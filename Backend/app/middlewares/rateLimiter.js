const rateLimit = require('express-rate-limit');

const ipGeneralLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again later.'
});

const ipProofLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 3,
    message: 'Too many proof requests'
});

const generalAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 100,
    keyGenerator: (req, res) => req.user.accountId,
    message: 'Too many requests from this account, please try again later.'
});

const proofAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 3,
    keyGenerator: (req, res) => req.user.accountId,
    message: 'Too many requests from this account, please try again later.'
});

module.exports = {
    ipGeneralLimiter,
    ipProofLimiter,
    generalAccountLimiter,
    proofAccountLimiter
};
