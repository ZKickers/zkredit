const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const validateTriggerThreshold = [
    check('txId')
        .notEmpty().withMessage('Transaction ID is required')
        .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid transaction ID format'),
    check('threshold')
        .notEmpty().withMessage('Threshold is required')
        .isInt({ min: 0, max: 850 }).withMessage('Threshold must be a number between 0 and 850'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateTriggerThreshold
};
