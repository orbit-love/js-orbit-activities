const read = require('./crud/read')

class OrbitActivities {
	constructor(orbitWorkspaceId, orbitApiKey) {
        this.credentials = this.setCredentials(orbitWorkspaceId, orbitApiKey)
	}

    setCredentials(orbitWorkspaceId, orbitApiKey) {
        if(!(orbitWorkspaceId || process.env.ORBIT_WORKSPACE_ID)) throw new Error('You must provide an Orbit Workspace ID when initializing Orbit or by setting an ORBIT_WORKSPACE_ID environment variable')
        if(!(orbitApiKey || process.env.ORBIT_API_KEY)) throw new Error('You must provide an Orbit API Key when initializing Orbit or by setting an ORBIT_API_KEY environment variable')
        return {
            orbitWorkspaceId: orbitWorkspaceId || process.env.ORBIT_WORKSPACE_ID,
            orbitApiKey: orbitApiKey || process.env.ORBIT_API_KEY,
        }
    }

    listWorkspaceActivities(query = {}) {
        return read.workspaceActivities(this, query)
    }

    listMemberActivities(memberId, query = {}) {
        if(!memberId) throw new Error('You must provide a memberId as the first parameter')
        if(typeof memberId !== 'string') throw new Error('memberId must be a string')
        return read.memberActivities(this, memberId, query)
    }

    getActivity(id) {
        if(!id) throw new Error('You must provide an activity id')
        return read.activity(this, id)
    }

    createActivity() {
        return new Promise(async (resolve, reject) => {
            try {
                resolve()
            } catch(error) {
                reject(error)
            }
        })
    }

    createContent() {

    }

    updateActivity() {

    }

    deleteActivity() {

    }
}

module.exports = OrbitActivities
