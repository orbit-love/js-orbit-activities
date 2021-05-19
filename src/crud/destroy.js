const api = require('../api')

const activity = (client, memberId, activityId) => {
    return new Promise((resolve, reject) => {
        api.call(client, 'DELETE', `/members/${memberId}/activities/${activityId}`)
            .then(_ => {
                resolve('Activity deleted')
            }).catch(error => {
                reject(error.response.data)
            })
    })
}

module.exports = {
    activity
}
