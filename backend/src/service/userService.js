const firebaseService = require("./firebaseService")
const geoService = require("./geoService")

module.exports = {
    //check if the user is logged
    async verifyUserToken(idToken) {
        return await firebaseService.auth(idToken);
    },
    async getLocation(address) {
        return await geoService.getLocation(address);;
    }

}