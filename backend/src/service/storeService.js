const storeModel = require("../model/storeModel")
const geoService = require("../service/geoService")
const moment = require('moment-timezone');
//assume that a store takes an average of 20 minutes (1200 sec) to prepare a purchase
const preparationTime = 1200;


module.exports = {
    async initdb() {
        return await storeModel.initDb();
    },
    async getClosest(location) {
        const { latitude, longitude } = location;
        //the distance param is in Miles
        const limit = geoService.getGeoHashLimits(latitude, longitude, 5);

        let store = await storeModel.getClosest(limit);
        
        if (store) {
            const distance = await this.getDistance(
                { lat: latitude, lng: longitude },
                { lat: store.latitude, lng: store.longitude }
            )
            //5 mins per km
            const trafficTime = 300 * distance.distance / 1000
            const delay =  Math.random() * (2000 - 1200) + 1200
            const expectedDeliveryTime = distance.duration + preparationTime + trafficTime;
            const timezone = await geoService.getTimeZone(latitude, longitude)
            
            bestDeliveryTime = moment().tz(timezone).add(expectedDeliveryTime, 'seconds')
            //cause 20 min is the avarage
            worstDeliveryTime = moment().tz(timezone).add(expectedDeliveryTime + delay, 'seconds')

            store.nextDeliveryTime = {
                bestDeliveryTime: bestDeliveryTime.format("HH:mm").valueOf(),
                worstDeliveryTime: worstDeliveryTime.format("HH:mm").valueOf()
            }
        } 

        return store;
    },
    async getDistance(userLocation, storeLocation) {
        return await geoService.getDistance(userLocation, storeLocation);
    }
}