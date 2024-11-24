const { handlerLogs } = require("../config.json")

module.exports = function (message) {
    if (!handlerLogs) return
    console.log(message)
}
