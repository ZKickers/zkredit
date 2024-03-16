function compareData(requestData, userData) {
    return (
        requestData.fullname == userData.fullname &&
        requestData.address == userData.address &&
        requestData.birthdate == userData.birthdate &&
        requestData.ssn == userData.ssn
    );
}

module.exports = {compareData}