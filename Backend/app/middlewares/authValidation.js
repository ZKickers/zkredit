const { check, validationResult } = require('express-validator');

const validateSignup = [
    check('username')
    .isAlphanumeric().withMessage('Username must contain only letters and numbers')
    .notEmpty().withMessage('Username is required'),
    check('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
    check('password')
    .isLength({ min: 7 }).withMessage('Password must be at least 7 characters long')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one special character'),
    check('recaptchaToken')
    .notEmpty().withMessage('ReCAPTCHA Token is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateLogin = [
    check('username')
    .isAlphanumeric().withMessage('Username must contain only letters and numbers')
    .notEmpty().withMessage('Username is required'),
    check('password')
    .notEmpty().withMessage('Password is required'),
    check('recaptchaToken')
    .notEmpty().withMessage('ReCAPTCHA Token is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateSignup,
    validateLogin
};
