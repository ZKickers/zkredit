const jwt = require('jsonwebtoken');
const { reqlog, successLog, errlog } = require('./logging');
const { ERROR_MSG } = require('./errorHandling');

function verifyToken(req, res, next) {
    const action = "verifyToken"
    const token = req.header('Authorization');

    if (!token) {
        const errorMsg = ERROR_MSG.noToken
        errlog(action,errorMsg)
        return res.status(401).send();
    }

    try {
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded;
        next();
        successLog(req.user.username,action)
    } catch (error) {
        errlog(action,error)
        res.status(403).send(ERROR_MSG.invalidToken);
    }
}

module.exports = verifyToken;
