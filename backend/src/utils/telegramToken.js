const crypto = require('crypto');
const generateLinkToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 30 * 60 * 1000); 

    return { token, expires };
};

module.exports = {
    generateLinkToken
};