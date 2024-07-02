const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const validateTransactionUpdate = [
    check('txId')
        .notEmpty().withMessage('Transaction ID is required')
        .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid transaction ID format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateTransactionUpdate
};
