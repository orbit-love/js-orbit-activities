const api = require('../api')

const activity = (client, data) => {
    return new Promise((resolve, reject) => {
        api.call(client, 'POST', '/activities', null, data)
            .then(response => {
                resolve(response)
            }).catch(error => {
                reject(error.response.data)
            })
    })
}

const activityByMember = (client, memberId, data) => {
    return new Promise((resolve, reject) => {
        api.call(client, 'POST', `/members/${memberId}/activities`, null, data)
            .then(response => {
                resolve(response)
            }).catch(error => {
                reject(error.response.data)
            })
    })
}

module.exports = {
    activity,
    activityByMember
}
