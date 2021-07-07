const pkg = require('../package.json')
const axios = require('axios')
const qs = require('querystring')

class OrbitActivities {
  constructor(orbitWorkspaceId, orbitApiKey, userAgent) {
    this.credentials = this.setCredentials(
      orbitWorkspaceId,
      orbitApiKey,
      userAgent
    )
  }

  setCredentials(orbitWorkspaceId, orbitApiKey, userAgent) {
    if (
      !(orbitWorkspaceId || process.env.ORBIT_WORKSPACE_ID) ||
      !(orbitApiKey || process.env.ORBIT_API_KEY)
    ) {
      throw new Error(
        'You must provide and Orbit Workspace ID and Orbit API Key'
      )
    }
    return {
      orbitWorkspaceId: orbitWorkspaceId || process.env.ORBIT_WORKSPACE_ID,
      orbitApiKey: orbitApiKey || process.env.ORBIT_API_KEY,
      userAgent: userAgent || `js-orbit-activities/${pkg.version}`
    }
  }

  async listWorkspaceActivities(query = {}) {
    try {
      const response = await this.api(
        this.credentials,
        'GET',
        '/activities',
        query
      )

      const nextPage = getNextPageFromURL(response?.links?.next)
      return {
        data: response.data,
        included: response.included,
        items: response.data.length,
        nextPage
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async listMemberActivities(memberId, query = {}) {
    try {
      if (!memberId) throw new Error('You must provide a memberId')
      if (typeof memberId !== 'string')
        throw new Error('memberId must be a string')

      const response = await this.api(
        this.credentials,
        'GET',
        `/members/${memberId}/activities`,
        query
      )
      const nextPage = getNextPageFromURL(response?.links?.next)

      return {
        data: response.data,
        included: response.included,
        items: response.data.length,
        nextPage
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async getActivity(activityId) {
    try {
      if (!activityId) throw new Error('You must provide an activityId')
      const response = await this.api(
        this.credentials,
        'GET',
        `/activities/${activityId}`
      )
      return response
    } catch (error) {
      throw new Error(error)
    }
  }

  async getLatestActivityTimestamp(type) {
    try {
      if (!type) throw new Error('You must provide a type')
      if (typeof type !== 'string') throw new Error('type must be a string')
      const response = await this.listWorkspaceActivities({
        activity_type: type,
        direction: 'DESC',
        items: 1
      })

      if(response.data.length == 0) return null
      else return response.data[0].attributes.created_at

    } catch (error) {
      throw new Error(error)
    }
  }

  async createActivity(memberId, data) {
    if (memberId && data) {
      return this.createActivityByMemberId(memberId, data)
    } else {
      data = memberId
      return this.createActivityForUnknownMember(data)
    }
  }

  async createActivityByMemberId(memberId, data) {
    try {
      if (!memberId || !data)
        throw new Error('You must provide a memberId and data')
      if (typeof memberId !== 'string')
        throw new Error('memberId must be a string')
      if (typeof data !== 'object') throw new Error('data must be an object')
      const response = await this.api(
        this.credentials,
        'POST',
        `/members/${memberId}/activities`,
        null,
        data
      )
      return response
    } catch (error) {
      throw new Error(error)
    }
  }

  async createActivityForUnknownMember(data) {
    try {
      if (!data) throw new Error('You must provide data')
      if (typeof data !== 'object') throw new Error('data must be an object')
      const response = await this.api(
        this.credentials,
        'POST',
        '/activities',
        null,
        data
      )
      return response
    } catch (error) {
      throw new Error(error)
    }
  }

  async updateActivity(memberId, activityId, data) {
    try {
      if (!memberId)
        throw new Error('You must provide a memberId as the first parameter')
      if (!activityId)
        throw new Error(
          'You must provide an activityId as the second parameter'
        )
      if (!data)
        throw new Error('You must provide a data object as the third parameter')
      await this.api(
        this.credentials,
        'PUT',
        `/members/${memberId}/activities/${activityId}`,
        null,
        data
      )
      return `activity ${activityId} on member ${memberId} updated`
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteActivity(memberId, activityId) {
    try {
      if (!memberId)
        throw new Error('You must provide a memberId as the first parameter')
      if (!activityId)
        throw new Error(
          'You must provide an activityId as the second parameter'
        )
      await this.api(
        this.credentials,
        'DELETE',
        `/members/${memberId}/activities/${activityId}`
      )
      return `activity ${activityId} on member ${memberId} deleted`
    } catch (error) {
      throw new Error(error)
    }
  }

  async listMemberNotes(memberId, query = {}) {
    try {
      if (!memberId) throw new Error('You must provide a memberId')
      if (typeof memberId !== 'string')
        throw new Error('memberId must be a string')

      const response = await this.api(
        this.credentials,
        'GET',
        `/members/${memberId}/notes`,
        query
      )
      const nextPage = getNextPageFromURL(response?.links?.next)

      return {
        data: response.data,
        included: response.included,
        items: response.data.length,
        nextPage
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async createNote(memberId, body) {
    try {
      if (!memberId || !body)
        throw new Error('You must provide a memberId and body')
      if (typeof memberId !== 'string' || typeof body !== 'string')
        throw new Error('parameters must be strings')
      const response = await this.api(
        this.credentials,
        'POST',
        `/members/${memberId}/notes`,
        null,
        { body }
      )
      return response
    } catch (error) {
      throw new Error(error)
    }
  }

  async updateNote(memberId, noteId, body) {
    try {
      if (!memberId)
        throw new Error('You must provide a memberId as the first parameter')
      if (!noteId)
        throw new Error('You must provide a noteId as the second parameter')
      if (!body)
        throw new Error('You must provide a body as the third parameter')
      await this.api(
        this.credentials,
        'PUT',
        `/members/${memberId}/notes/${noteId}`,
        null,
        { body }
      )
      if (typeof body !== 'string') throw new Error('body must be a string')
      return `note ${noteId} on member ${memberId} updated`
    } catch (error) {
      throw new Error(error)
    }
  }

  async api(credentials, method, endpoint, query = {}, data = {}) {
    try {
      if (!credentials || !method || !endpoint)
        throw new Error('You must pass a client, method, and endpoint')

      const url = `https://app.orbit.love/api/v1/${
        credentials.orbitWorkspaceId
      }${endpoint}?${qs.encode(query)}`

      const response = await axios({
        method,
        url,
        data,
        headers: {
          Authorization: `Bearer ${credentials.orbitApiKey}`,
          'User-Agent': credentials.userAgent
        }
      })

      return response?.data
    } catch (err) {
      throw new Error(err)
    }
  }
}

function getNextPageFromURL(url) {
    if(!url) return null
    const search = url.split('?')[1]
    const page = +qs.decode(search).page
    return page
}

module.exports = OrbitActivities
