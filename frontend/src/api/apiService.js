
const config = require("../config/constants.json")

export default {

    async getClosest(location) {
        const store = await fetch(`${config.endpoint}/api/stores/getClosest`, {
            method: "POST",
            body: JSON.stringify(location),
            dataType: "JSON",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            }
        })
        return await store.json()

    },

    async getLocation(address) {
        const location = await fetch(`${config.endpoint}/api/users/getLocation`, {
            method: "POST",
            body: JSON.stringify({
                "address": address
            }),
            dataType: "JSON",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            }
        })
        return await location.json()
    }
}