const api = require('../api')
const qs = require('querystring')

const workspaceActivities = (client, query) => {
    return new Promise((resolve, reject) => {
        api.call(client, 'GET', '/activities', query)
            .then(response => {
                const nextPageUrl = response.links.next
                const nextPage = nextPageUrl ? +qs.decode(nextPageUrl.split('?')[1]).page : null
                resolve({
                    data: response.data,
                    included: response.included,
                    items: response.data.length,
                    nextPage
                })
            }).catch(error => {
                reject(error.response.data)
            })
    })
}

const memberActivities = (client, memberId, query) => {
    return new Promise((resolve, reject) => {
        api.call(client, 'GET', `/members/${memberId}/activities`, query)
            .then(response => {
                const nextPageUrl = response.links.next
                const nextPage = nextPageUrl ? +qs.decode(nextPageUrl.split('?')[1]).page : null
                resolve({
                    data: response.data,
                    included: response.included,
                    items: response.data.length,
                    nextPage
                })
            }).catch(error => {
                reject(error.response.data)
            })
    })
}

const activity = (client, id) => {
    return new Promise((resolve, reject) => {
        api.call(client, 'GET', `/activities/${id}`)
            .then(response => {
                resolve(response)
            }).catch(error => {
                reject(error.response.data)
            })
    })
}

module.exports = {
    workspaceActivities,
    memberActivities,
    activity
}
