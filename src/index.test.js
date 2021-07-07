const OrbitActivities = require('../src/index.js')
const axios = require('axios')
const url = require('url')

jest.mock('axios')

describe('OrbitActivities constructor', () => {
  it('given all credentials, does not throw', () => {
    const sut = new OrbitActivities('1', '2')
    expect(sut).not.toBeNull()
  })

  it('given missing configuration values, throws', () => {
    delete process.env.ORBIT_WORKSPACE_ID
    delete process.env.ORBIT_API_KEY

    expect(() => {
      new OrbitActivities(null, null)
    }).toThrow()
  })

  it('configuration read from env variables when not directly provided', () => {
    process.env.ORBIT_WORKSPACE_ID = '1'
    process.env.ORBIT_API_KEY = '2'

    const sut = new OrbitActivities(null, null)

    expect(sut.credentials.orbitWorkspaceId).toBe('1')
    expect(sut.credentials.orbitApiKey).toBe('2')
  })

  it('given no user agent, the default is set correctly', () => {
    const sut = new OrbitActivities('1', '2')
    expect(sut.credentials.userAgent).toContain('js-orbit-activities/')
  })

  it('given a user agent, it is set correctly', () => {
    const sut = new OrbitActivities('1', '2', '3')
    expect(sut.credentials.userAgent).toBe('3')
  })
})

describe('OrbitActivities api', () => {
  let sut
  beforeEach(() => {
    sut = new OrbitActivities('1', '2')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('missing all required parameters, throws', async () => {
    await expect(sut.api()).rejects.toThrow(
      'You must pass a client, method, and endpoint'
    )
  })

  it('missing some required parameters, throws', async () => {
    await expect(sut.api('1', '2')).rejects.toThrow(
      'You must pass a client, method, and endpoint'
    )
  })

  it('calls axios correctly based on params', async () => {
    const toReturn = { data: [{ key: 'value' }] }
    axios.mockResolvedValueOnce(toReturn)

    await sut.api(
      sut.credentials,
      '3',
      '/4',
      { queryKey: 'queryValue' },
      { dataKey: 'dataValue' }
    )

    const firstCall = axios.mock.calls[0][0]

    expect(axios).toHaveBeenCalledTimes(1)
    expect(firstCall.headers.Authorization).toBe('Bearer 2')
    expect(firstCall.method).toBe('3')
    expect(firstCall.data.dataKey).toBe('dataValue')
    expect(url.parse(firstCall.url, true).query.queryKey).toBe('queryValue')
  })
})

describe('OrbitActivities listWorkspaceActivities', () => {
  let sut
  beforeEach(() => {
    sut = new OrbitActivities('1', '2')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns data in correct format', async () => {
    const toReturn = setActivitiesResponse({ nextPage: 3 })
    axios.mockResolvedValueOnce(toReturn)

    const response = await sut.listWorkspaceActivities()

    expect(response.data.length).toBe(2)
    expect(response.data.included).not.toBeNull()
    expect(response.items).toBe(2)
    expect(response.nextPage).toBe(3)
  })

  it('given nextPageUrl, provides nextPage integer, ', async () => {
    const toReturn = setActivitiesResponse({ nextPage: 3 })
    axios.mockResolvedValueOnce(toReturn)

    const response = await sut.listWorkspaceActivities()

    expect(response.nextPage).toBe(3)
  })

  it('given no nextPageUrl, sets nextPage to null, ', async () => {
    const toReturn = setActivitiesResponse({ nextPage: null })
    axios.mockResolvedValueOnce(toReturn)

    const response = await sut.listWorkspaceActivities()

    expect(response.nextPage).toBeNull()
  })

  it('when there is an error, return error', async () => {
    const errorMessage = 'Network Error'
    axios.mockImplementationOnce(() => {
      return Promise.reject(new Error(errorMessage))
    })

    await expect(sut.listWorkspaceActivities()).rejects.toThrow(errorMessage)
  })
})

describe('OrbitActivities listMemberActivities', () => {
  let sut
  beforeEach(() => {
    sut = new OrbitActivities('1', '2')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('if memberId is not provided, throws', async () => {
    await expect(sut.listMemberActivities()).rejects.toThrow(
      'You must provide a memberId'
    )
  })

  it('if memberId is not a string, throws', async () => {
    const errorText = 'memberId must be a string'
    await expect(sut.listMemberActivities(123)).rejects.toThrow(errorText)
    await expect(sut.listMemberActivities(true)).rejects.toThrow(errorText)
    await expect(sut.listMemberActivities({})).rejects.toThrow(errorText)
  })

  it('returns data in correct format', async () => {
    const toReturn = setActivitiesResponse({ nextPage: 3 })
    axios.mockResolvedValueOnce(toReturn)

    const response = await sut.listMemberActivities('123')

    expect(response.data.length).toBe(2)
    expect(response.data.included).not.toBeNull()
    expect(response.items).toBe(2)
    expect(response.nextPage).toBe(3)
  })

  it('given nextPageUrl, provides nextPage integer', async () => {
    const toReturn = setActivitiesResponse({ nextPage: 4 })
    axios.mockResolvedValueOnce(toReturn)

    const response = await sut.listMemberActivities('123')

    expect(response.nextPage).toBe(4)
  })

  it('given no nextPageUrl, sets nextPage to null', async () => {
    const toReturn = setActivitiesResponse({ nextPage: null })
    axios.mockResolvedValueOnce(toReturn)

    const response = await sut.listMemberActivities('123')

    expect(response.nextPage).toBeNull()
  })

  it('when there is an error, return error', async () => {
    const errorMessage = 'Network Error'
    axios.mockImplementationOnce(() => {
      return Promise.reject(new Error(errorMessage))
    })

    await expect(sut.listMemberActivities('123')).rejects.toThrow(errorMessage)
  })
})

describe('OrbitActivities getActivity', () => {
  let sut
  beforeEach(() => {
    sut = new OrbitActivities('1', '2')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('if activityId is missing, throws', async () => {
    await expect(sut.getActivity()).rejects.toThrow(
      'You must provide an activityId'
    )
  })

  it('returns data in correct format', async () => {
    const toReturn = { data: { data: { id: 'id-val' }, included: [] } }
    axios.mockResolvedValueOnce(toReturn)

    const response = await sut.getActivity('123')

    expect(response.data.id).toBe('id-val')
    expect(response.included).not.toBeNull()
  })

  it('when there is an error, return error', async () => {
    const errorMessage = 'Network Error'
    axios.mockImplementationOnce(() => {
      return Promise.reject(new Error(errorMessage))
    })

    await expect(sut.getActivity('123')).rejects.toThrow(errorMessage)
  })
})

describe('OrbitActivities createActivity', () => {
  let sut
  beforeEach(() => {
    sut = new OrbitActivities('1', '2')
  })

  it('given one argument which is an object, call createActivityForUnknownMember', () => {
    const spy = jest.spyOn(sut, 'createActivityForUnknownMember')
    sut.createActivity({})
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('given a memberId and an object, call createActivityByMemberId', () => {
    const spy = jest.spyOn(sut, 'createActivityByMemberId')
    sut.createActivity('123', {})
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

describe('OrbitActivities createActivityByMemberId', () => {
  let sut
  beforeEach(() => {
    sut = new OrbitActivities('1', '2')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('if memberId or data is not provided, throws', async () => {
    await expect(sut.createActivityByMemberId()).rejects.toThrow(
      'You must provide a memberId and data'
    )
    await expect(sut.createActivityByMemberId(null, {})).rejects.toThrow(
      'You must provide a memberId and data'
    )
    await expect(sut.createActivityByMemberId('123', null)).rejects.toThrow(
      'You must provide a memberId and data'
    )
  })

  it('if parameters are the wrong type, throws', async () => {
    const stringError = 'memberId must be a string'
    const objectError = 'data must be an object'
    await expect(sut.createActivityByMemberId(123, {})).rejects.toThrow(
      stringError
    )
    await expect(sut.createActivityByMemberId(true, {})).rejects.toThrow(
      stringError
    )
    await expect(sut.createActivityByMemberId({}, {})).rejects.toThrow(
      stringError
    )
    await expect(sut.createActivityByMemberId('string', 123)).rejects.toThrow(
      objectError
    )
    await expect(sut.createActivityByMemberId('string', true)).rejects.toThrow(
      objectError
    )
    await expect(
      sut.createActivityByMemberId('string', 'string')
    ).rejects.toThrow(objectError)
  })

  it('returns data in the correct format', async () => {
    const toReturn = setActivitiesResponse()
    axios.mockResolvedValueOnce(toReturn)
    const response = await sut.createActivityByMemberId('123', {})
    expect(response).toMatchObject(toReturn.data)
  })

  it('when there is an error, return error', async () => {
    const errorMessage = 'Network Error'
    axios.mockImplementationOnce(() => {
      return Promise.reject(new Error(errorMessage))
    })

    await expect(sut.createActivityByMemberId('123', {})).rejects.toThrow(
      errorMessage
    )
  })
})

describe('OrbitActivities createActivityForUnknownMember', () => {
  let sut
  beforeEach(() => {
    sut = new OrbitActivities('1', '2')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('if data is not provided, throws', async () => {
    await expect(sut.createActivityForUnknownMember()).rejects.toThrow(
      'You must provide data'
    )
  })

  it('if data is not an object', async () => {
    const errorText = 'data must be an object'
    await expect(sut.createActivityForUnknownMember(123)).rejects.toThrow(
      errorText
    )
    await expect(sut.createActivityForUnknownMember(true)).rejects.toThrow(
      errorText
    )
    await expect(sut.createActivityForUnknownMember('string')).rejects.toThrow(
      errorText
    )
  })

  it('returns data in the correct format', async () => {
    const toReturn = setActivitiesResponse()
    axios.mockResolvedValueOnce(toReturn)
    const response = await sut.createActivityForUnknownMember({})
    expect(response).toMatchObject(toReturn.data)
  })

  it('when there is an error, return error', async () => {
    const errorMessage = 'Network Error'
    axios.mockImplementationOnce(() => {
      return Promise.reject(new Error(errorMessage))
    })

    await expect(sut.createActivityForUnknownMember({})).rejects.toThrow(
      errorMessage
    )
  })
})

describe('orbitActivities updateActivity', () => {
  let sut
  beforeEach(() => {
    sut = new OrbitActivities('1', '2')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('if parameters are missing, throws', async () => {
    await expect(sut.updateActivity()).rejects.toThrow(
      'You must provide a memberId as the first parameter'
    )
    await expect(sut.updateActivity('1')).rejects.toThrow(
      'You must provide an activityId as the second parameter'
    )
    await expect(sut.updateActivity('1', '2')).rejects.toThrow(
      'You must provide a data object as the third parameter'
    )
  })

  it('calls axios correctly', async () => {
    axios.mockResolvedValueOnce({})

    await sut.updateActivity('123', '456', { dataKey: 'dataValue' })

    const firstCall = axios.mock.calls[0][0]
    const path = url
      .parse(firstCall.url, true)
      .path.split('v1')[1]
      .split('?')[0]
    const memberId = path.split('/')[3]
    const activityId = path.split('/')[5]

    expect(memberId).toBe('123')
    expect(activityId).toBe('456')
  })

  it('returns success message correctly', async () => {
    axios.mockResolvedValueOnce({})

    const response = await sut.updateActivity('123', '456', {
      dataKey: 'dataValue'
    })

    expect(response).toBe('activity 456 on member 123 updated')
  })

  it('when there is an error, return error', async () => {
    const errorMessage = 'Network Error'
    axios.mockImplementationOnce(() => {
      return Promise.reject(new Error(errorMessage))
    })

    await expect(sut.updateActivity('1', '2', {})).rejects.toThrow(errorMessage)
  })
})

describe('orbitActivities deleteActivity', () => {
  let sut
  beforeEach(() => {
    sut = new OrbitActivities('1', '2')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('if parameters are missing, throws', async () => {
    await expect(sut.deleteActivity()).rejects.toThrow(
      'You must provide a memberId as the first parameter'
    )
    await expect(sut.deleteActivity('1')).rejects.toThrow(
      'You must provide an activityId as the second parameter'
    )
  })

  it('calls axios correctly', async () => {
    axios.mockResolvedValueOnce({})

    await sut.deleteActivity('123', '456')

    const firstCall = axios.mock.calls[0][0]
    const path = url
      .parse(firstCall.url, true)
      .path.split('v1')[1]
      .split('?')[0]
    const memberId = path.split('/')[3]
    const activityId = path.split('/')[5]

    expect(memberId).toBe('123')
    expect(activityId).toBe('456')
  })

  it('returns success message correctly', async () => {
    axios.mockResolvedValueOnce({})

    const response = await sut.deleteActivity('123', '456')

    expect(response).toBe('activity 456 on member 123 deleted')
  })

  it('when there is an error, return error', async () => {
    const errorMessage = 'Network Error'
    axios.mockImplementationOnce(() => {
      return Promise.reject(new Error(errorMessage))
    })

    await expect(sut.deleteActivity('1', '2')).rejects.toThrow(errorMessage)
  })
})

describe('OrbitActivities createNote', () => {
  let sut
  beforeEach(() => {
    sut = new OrbitActivities('1', '2')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('if memberId or body is not provided, throws', async () => {
    await expect(sut.createNote()).rejects.toThrow(
      'You must provide a memberId and body'
    )
    await expect(sut.createNote('1')).rejects.toThrow(
      'You must provide a memberId and body'
    )
  })

  it('if parameters are the wrong type, throws', async () => {
    const stringError = 'parameters must be strings'
    await expect(sut.createNote(123, 'string')).rejects.toThrow(stringError)
    await expect(sut.createNote('string', {})).rejects.toThrow(stringError)
  })

  it('returns data in the correct format', async () => {
    axios.mockResolvedValueOnce({ data: {} })
    const response = await sut.createNote('123', '456')
    expect(response).toMatchObject({})
  })

  it('when there is an error, return error', async () => {
    const errorMessage = 'Network Error'
    axios.mockImplementationOnce(() => {
      return Promise.reject(new Error(errorMessage))
    })

    await expect(sut.createNote('123', '456')).rejects.toThrow(errorMessage)
  })
})

describe('OrbitActivities listMemberNotes', () => {
  let sut
  beforeEach(() => {
    sut = new OrbitActivities('1', '2')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('if memberId is not provided, throws', async () => {
    await expect(sut.listMemberNotes()).rejects.toThrow(
      'You must provide a memberId'
    )
  })

  it('if memberId is not a string, throws', async () => {
    const errorText = 'memberId must be a string'
    await expect(sut.listMemberNotes(123)).rejects.toThrow(errorText)
    await expect(sut.listMemberNotes(true)).rejects.toThrow(errorText)
    await expect(sut.listMemberNotes({})).rejects.toThrow(errorText)
  })

  it('returns data in correct format', async () => {
    const toReturn = setActivitiesResponse({ nextPage: 3 })
    axios.mockResolvedValueOnce(toReturn)

    const response = await sut.listMemberNotes('123')

    expect(response.data.length).toBe(2)
    expect(response.data.included).not.toBeNull()
    expect(response.items).toBe(2)
    expect(response.nextPage).toBe(3)
  })

  it('given nextPageUrl, provides nextPage integer', async () => {
    const toReturn = setActivitiesResponse({ nextPage: 4 })
    axios.mockResolvedValueOnce(toReturn)

    const response = await sut.listMemberNotes('123')

    expect(response.nextPage).toBe(4)
  })

  it('given no nextPageUrl, sets nextPage to null', async () => {
    const toReturn = setActivitiesResponse({ nextPage: null })
    axios.mockResolvedValueOnce(toReturn)

    const response = await sut.listMemberNotes('123')

    expect(response.nextPage).toBeNull()
  })

  it('when there is an error, return error', async () => {
    const errorMessage = 'Network Error'
    axios.mockImplementationOnce(() => {
      return Promise.reject(new Error(errorMessage))
    })

    await expect(sut.listMemberNotes('123')).rejects.toThrow(errorMessage)
  })
})

describe('orbitActivities updateNote', () => {
  let sut
  beforeEach(() => {
    sut = new OrbitActivities('1', '2')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('if parameters are missing, throws', async () => {
    await expect(sut.updateNote()).rejects.toThrow(
      'You must provide a memberId as the first parameter'
    )
    await expect(sut.updateNote('1')).rejects.toThrow(
      'You must provide a noteId as the second parameter'
    )
    await expect(sut.updateNote('1', '2')).rejects.toThrow(
      'You must provide a body as the third parameter'
    )
  })

  it('if body is not a string, throws', async () => {
    await expect(sut.updateNote('123', '456', 1)).rejects.toThrow(
      'body must be a string'
    )
  })

  it('calls axios correctly', async () => {
    axios.mockResolvedValueOnce({})

    await sut.updateNote('123', '456', 'new value')

    const firstCall = axios.mock.calls[0][0]
    console.log(firstCall)
    const path = url
      .parse(firstCall.url, true)
      .path.split('v1')[1]
      .split('?')[0]
    const memberId = path.split('/')[3]
    const activityId = path.split('/')[5]

    expect(memberId).toBe('123')
    expect(activityId).toBe('456')
    expect(firstCall.data.body).toBe('new value')
  })

  it('returns success message correctly', async () => {
    axios.mockResolvedValueOnce({})

    const response = await sut.updateNote('123', '456', '567')

    expect(response).toBe('note 456 on member 123 updated')
  })

  it('when there is an error, return error', async () => {
    const errorMessage = 'Network Error'
    axios.mockImplementationOnce(() => {
      return Promise.reject(new Error(errorMessage))
    })

    await expect(sut.updateNote('1', '2', '3')).rejects.toThrow(errorMessage)
  })
})

function setActivitiesResponse(params) {
  const next = params?.nextPage
    ? `https://app.orbit.love/api/v1/workspaceid/activities?filters=true&items=25&page=${params.nextPage}&sort=occurred_at`
    : null
  return {
    data: {
      data: [{}, {}],
      included: [],
      links: {
        next
      }
    }
  }
}
