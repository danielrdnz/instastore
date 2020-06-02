const winston = require('winston')
getDateFormat = () => {
    return new Date(Date.now()).toUTCString()
}
class LoggerService {
    constructor(route) {
        this.log_data = null
        this.route = route
        const logger = winston.createLogger({
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: `./logs/${route}.log`
                })
            ],
            format: winston.format.printf((info) => {
                let messageLog = `${getDateFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${info.message} | `
                messageLog = info.data ? messageLog + `data:${JSON.stringify(info.data)} | ` : messageLog
                messageLog = this.log_data ? messageLog + `log_data:${JSON.stringify(this.log_data)} | ` : messageLog
                return messageLog
            })
        });
        this.logger = logger
    }
    setLogData(log_data) {
        this.log_data = log_data
    }
    async info(...message) {
        this.logger.log('info', message[0], {data : message[1]});
    }
    async debug(...message) {
        this.logger.log('debug', message[0], {data : message[1]});
    }
    async error(...message) {
        this.logger.log('error', message[0], {data : message[1]});
    }
}
module.exports = LoggerService