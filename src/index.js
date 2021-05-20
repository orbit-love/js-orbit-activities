const pkg = require('../package.json')
const create = require('./crud/create')
const read = require('./crud/read')
const update = require('./crud/update')
const destroy = require('./crud/destroy')

class OrbitActivities {
	constructor(orbitWorkspaceId, orbitApiKey, userAgent) {
        this.credentials = this.setCredentials(orbitWorkspaceId, orbitApiKey, userAgent)
	}

    setCredentials(orbitWorkspaceId, orbitApiKey, userAgent) {
        if(!(orbitWorkspaceId || process.env.ORBIT_WORKSPACE_ID)) throw new Error('You must provide an Orbit Workspace ID when initializing Orbit or by setting an ORBIT_WORKSPACE_ID environment variable')
        if(!(orbitApiKey || process.env.ORBIT_API_KEY)) throw new Error('You must provide an Orbit API Key when initializing Orbit or by setting an ORBIT_API_KEY environment variable')
        return {
            orbitWorkspaceId: orbitWorkspaceId || process.env.ORBIT_WORKSPACE_ID,
            orbitApiKey: orbitApiKey || process.env.ORBIT_API_KEY,
            userAgent: userAgent || `js-orbit-activities/${pkg.version}`
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

    getActivity(activityId) {
        if(!activityId) throw new Error('You must provide an activity id')
        return read.activity(this, activityId)
    }

    createActivity(memberId, data) {
        if(typeof memberId === 'object') data = memberId
        if(!data) throw new Error('You must provide a payload when creating activities')
        if(typeof memberId === 'string') {
            return create.activityByMember(this, memberId, data)
        } else {
            return create.activity(this, data)
        }
    }

    updateActivity(memberId, activityId, data) {
        if(!memberId) throw new Error('You must provide a memberId as the first parameter')
        if(!activityId) throw new Error('You must provide an activityId as the second parameter')
        if(!data) throw new Error('You must provide a data object as the third parameter')
        return update.activity(this, memberId, activityId, data)
    }

    deleteActivity(memberId, activityId) {
        if(!memberId) throw new Error('You must provide a memberId as the first parameter')
        if(!activityId) throw new Error('You must provide an activityId as the second parameter')
        return destroy.activity(this, memberId, activityId)
    }
}

module.exports = OrbitActivities
