/**
 * @jest-environment node
 */

const A = require('../src/index.js')

beforeAll(() => {
    jest.spyOn(A.prototype, 'listMemberActivities').mockImplementation((memberId) => {
        if(!memberId) throw new Error('You must provide a memberId as the first parameter')
        if(typeof memberId !== 'string') throw new Error('memberId must be a string')
        return Promise.resolve({ data: [], included: [], items: 25, nextPage: null })
    })
    jest.spyOn(A.prototype, 'getActivity').mockImplementation((id) => {
        if(!id) throw new Error('You must provide an activity id')
        return Promise.resolve({})
    })
    jest.spyOn(A.prototype, 'createActivity').mockImplementation((id, data) => {
        if(typeof id === 'object') data = id
        if(!data) throw new Error('You must provide a payload when creating activities')
        if(typeof id === 'string') {
            return Promise.resolve('activityByMember')
        } else {
            return Promise.resolve('activity')
        }
    })
    jest.spyOn(A.prototype, 'updateActivity').mockImplementation((memberId, activityId, data) => {
        if(!memberId) throw new Error('You must provide a memberId as the first parameter')
        if(!activityId) throw new Error('You must provide an activityId as the second parameter')
        if(!data) throw new Error('You must provide a data object as the third parameter')
        return Promise.resolve('Activity updated')
    })
    jest.spyOn(A.prototype, 'deleteActivity').mockImplementation((memberId, activityId) => {
        if(!memberId) throw new Error('You must provide a memberId as the first parameter')
        if(!activityId) throw new Error('You must provide an activityId as the second parameter')
        return Promise.resolve('Activity deleted')
    })
})

describe('client', () => {
    it('initializes with credentials passed', () => {
        envVars(false)
        const a = new A('1', '2')
        expect(a.credentials.orbitWorkspaceId).toBe('1')
        expect(a.credentials.orbitApiKey).toBe('2')
        expect(a.credentials.userAgent.includes('js-orbit-activities')).toBe(true)
    })
    it('initializes with all arguments', () => {
        envVars(false)
        const a = new A('1', '2', '3')
        expect(a.credentials.orbitWorkspaceId).toBe('1')
        expect(a.credentials.orbitApiKey).toBe('2')
        expect(a.credentials.userAgent).toBe('3')
    })
    it('throws with incomplete set of credentials', () => {
        expect(() => { envVars(false); process.env.ORBIT_WORKSPACE_ID = "1"; new A(); }).toThrow()
        expect(() => { envVars(false); process.env.ORBIT_API_KEY = "2"; new A(); } ).toThrow()
    })
})

describe('checking required arguments', () => {
    it('listMemberActivities requires a memberId string', () => {
        envVars(true)
        const a = new A()
        expect(() => { a.listMemberActivities() }).toThrow()
        expect(() => { a.listMemberActivities(123) }).toThrow()
        expect(() => { a.listMemberActivities('123') }).not.toThrow()
    })
    it('getActivity requires an id', () => {
        const a = new A()
        expect(() => { a.getActivity() }).toThrow()
        expect(() => { a.getActivity('123') }).not.toThrow()
    })
    it('createActivity requires a string id and object data', () => {
        const a = new A()
        expect(() => { a.createActivity() }).toThrow()
        expect(() => { a.createActivity('123') }).toThrow()
        expect(() => { a.createActivity({}) }).not.toThrow()
        expect(() => { a.createActivity('123', {}) }).not.toThrow()
    })
    it('updateActivity requires a memberId, activityId, and data', () => {
        const a = new A()
        expect(() => { a.updateActivity() }).toThrow()
        expect(() => { a.updateActivity('1') }).toThrow()
        expect(() => { a.updateActivity('1', '2') }).toThrow()
        expect(() => { a.updateActivity('1', '2', {}) }).not.toThrow()
    })
    it('deleteActivity requires a memberId and activityId', () => {
        const a = new A()
        expect(() => { a.deleteActivity() }).toThrow()
        expect(() => { a.deleteActivity('1') }).toThrow()
        expect(() => { a.deleteActivity('1', '2') }).not.toThrow()
    })
})

function envVars(toHaveVars) {
    if(toHaveVars) {
        process.env.ORBIT_WORKSPACE_ID = 'var1'
        process.env.ORBIT_API_KEY = 'var2'
    } else {
        delete process.env.ORBIT_WORKSPACE_ID
        delete process.env.ORBIT_API_KEY
    }
}
