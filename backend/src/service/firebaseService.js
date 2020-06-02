const admin = require('firebase-admin');

module.exports = {
    //check if the user is logged
    async auth(idToken) {
        return await admin.auth().verifyIdToken(idToken)
    }
}