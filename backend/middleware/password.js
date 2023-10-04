const bcrypt = require('bcrypt');

async function checkPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

module.exports = { checkPassword };
