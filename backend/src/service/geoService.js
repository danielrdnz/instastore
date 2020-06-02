const dotenv = require('dotenv');
const geohash = require("ngeohash");
dotenv.config();
const { Client, Status } = require("@googlemaps/google-maps-services-js");
const axios = require('axios').default;
const googleKey = process.env.GOOGLE_MAPS_API_KEY;


const axiosInstance = axios.create();
const client = new Client({ axiosInstance });

module.exports = {
    async getDistance(origins, destinations) {
        const params = {
            origins: [origins],
            destinations: [destinations],
            key: googleKey
        };
        try {
            const result = await client.distancematrix({ params: params })

            return {
                duration: result.data.rows[0].elements[0].duration.value,
                distance: result.data.rows[0].elements[0].distance.value
            }

        } catch (error) {

        }

    },

    async getLocation(address) {
        const addressEncode = encodeURIComponent(address.address)
        const geoCodeBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?'
        const geoCodeURL = `${geoCodeBaseUrl}address=${addressEncode}&key=${googleKey}`
        try {
            const location = await axios.get(geoCodeURL)

            if (location.data.status === Status.OK) {
                const { lat, lng } = location.data.results[0].geometry.location
                return { lat, lng, status: Status.OK }
            } else {
                return location.data
            }

        } catch (error) {
            throw error
        }

    },
    //implemented to get the time zone and calculate the correct delivery time
    async getTimeZone(latitude, longitude){
        const geoCodeBaseUrl = 'https://maps.googleapis.com/maps/api/timezone/json?'
        const geoTimeZoneURL = `${geoCodeBaseUrl}location=${latitude},${longitude}&timestamp=1458000000&key=${googleKey}`
        try {
            const timeZone = await axios.get(geoTimeZoneURL)
            if (timeZone.data.status === Status.OK) {
                return timeZone.data.timeZoneId
            } else {
                return timeZone
            }

        } catch (error) {
            throw error
        }
    },

    getGeoHash(latitude, longitude) {
        return geohash.encode(latitude, longitude);
    },
    getGeoHashLimits(latitude, longitude, distance) {
        
        //An estimate of degrees per mile, there are approximately 69 miles at 1 latitude, so 1/69
        const latitudeMile = 0.0144927536231884;
        //An estimate of degrees per mile  
        const longitudeMile = 0.0181818181818182;

        //using the latitudeMile and longitudeMile  variable it is calculated the limits in latitude and longitude are calculated
        const lowerLat = latitude - latitudeMile * distance;
        const lowerLon = longitude - longitudeMile * distance;

        const upperLat = latitude + latitudeMile * distance;
        const upperLon = longitude + longitudeMile * distance;

        const lower = this.getGeoHash(lowerLat, lowerLon);
        const upper = this.getGeoHash(upperLat, upperLon);

        return {
            lower,
            upper
        };
    }
}

