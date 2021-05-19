const axios = require('axios')
const qs = require('querystring')

const call = (client, method, endpoint, query, data) => {
    return new Promise((resolve, reject) => {
        const { credentials } = client

        axios({
            method,
            url: `https://app.orbit.love/api/v1/${credentials.orbitWorkspaceId}${endpoint}?${qs.encode(query)}`,
            data,
            headers: {
                Authorization: `Bearer ${credentials.orbitApiKey}`,
                'User-Agent': credentials.userAgent
            }
        }).then(resp => {
            resolve(resp.data)
        }).catch(error => {
            reject(error)
        })
    })
}

module.exports = {
    call
}
