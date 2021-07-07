# Orbit Activities Helper Library for Node.js

![Build Status](https://github.com/orbit-love/js-orbit-activities/workflows/CI/badge.svg)
[![npm version](https://badge.fury.io/js/%40orbit-love%2Factivities.svg)](https://badge.fury.io/js/%40orbit-love%2Factivities)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa.svg)](.github/CODE_OF_CONDUCT.md)

> Orbit API helper library for Node.js. <br>This client can create, read, update and delete activities in your Orbit workspace.

<img src=".github/logo.png" alt="Orbit" style="max-width: 300px; margin: 2em 0;">

## Installation

```
npm install @orbit-love/activities
```

## Constructor

```js
const OrbitActivities = require('@orbit-love/activities')
const orbitActivities = new OrbitActivities(orbitWorkspaceId, orbitApiKey)
```

* `orbitWorkspaceId` - The part of your Orbit workspace URL that immediately follows the app.orbit.love. For example, if the URL was https://app.orbit.love/my-workspace, then your Orbit workspace ID is my-workspace.
* `orbitApiKey` - This can be found in you Orbit Account Settings.

### Initializing with environment variables

If you have the environment variables `ORBIT_WORKSPACE_ID` and `ORBIT_API_KEY` set, you can initialize the client like so:

```js
const OrbitActivities = require('@orbit-love/activities')
const orbitActivities = new OrbitActivities()
```

If you have environment variables set and also pass in values, the passed in values will be used.

## Rate Limits & Page Sizes

- [Information about Orbit API Rate Limiting](https://docs.orbit.love/reference#rate-limiting)
- For list methods, you can ask request a number of results per request between 1 and 100.

## Activity Methods

<details>
<summary><code>listWorkspaceActivities(options)</code></summary>

```js
const options = {
    page: 1,
    items: 50,
    company: 'ACME Corp'
}

orbitActivities.listWorkspaceActivities(options).then(data => {
    console.log(data)
}).catch(error => {
    console.error(error)
})
```

`options` is not a required parameter, but can be any query parameter shown in our API reference.

[__List activities for a workspace__ API reference.](https://docs.orbit.love/reference#get_-workspace-id-activities)
</details>

<details>
<summary><code>listMemberActivities(memberId, options)</code></summary>

```js
const memberId = 'janesmith04'

const options = {
    page: 1,
    items: 50
}

orbitActivities.listMemberActivities(memberId, options).then(data => {
    console.log(data)
}).catch(error => {
    console.error(error)
})
```

`options` is not a required parameter, but can be any query parameter shown in our API reference.

[__List activities for a member__ API reference.](https://docs.orbit.love/reference#get_-workspace-id-members-member-id-activities)
</details>

<details>
<summary><code>getLatestActivityTimestamp(activityType)</code></summary>

```js
const activityType = 'issued:opened'

orbitActivities.getLatestActivityTimestamp(activityType).then(data => {
    console.log(data)
}).catch(error => {
    console.error(error)
})
```

Will return the timestamp of the latest activity with the provided type, or null if there are none.
</details>

<details>
<summary><code>getActivity(activityId)</code></summary>

```js
const activityId = '1234536'

orbitActivities.getActivity(activityId).then(data => {
    console.log(data)
}).catch(error => {
    console.error(error)
})
```

[__Get an activity in the workspace__ API reference.](https://docs.orbit.love/reference#get_-workspace-id-activities-id)
</details>

<details>
<summary><code>createActivity(memberId, data)</code> or <code>createActivity(data)</code></summary>

If you know the `memberId` for the member you want to add the activity to:

```js
const memberId = 'janesmith04'

const data = {
    activity_type: 'starfleet:signup',
    title: "New Planet Signed Up for Starfleet",
    description: "Klingon has joined Starfleet via Twitter",
    member: {
        tshirt: 'XL',
        twitter: 'qunnoq'
    }
}

orbitActivities.createActivity(memberId, data).then(data => {
    console.log(data)
}).catch(error => {
    console.error(error)
})
```

`data` should match the body params as shown in the [__Create a post activity for a member__ API reference.](https://docs.orbit.love/reference#post_-workspace-id-members-member-id-activities)

If you know one or more identities of the member (github, email, twitter, etc.) but not their Orbit ID:

```js

const data = {
    activity_type: 'starfleet:signup',
    title: "New Planet Signed Up for Starfleet",
    description: "Klingon has joined Starfleet via Twitter",
    member: {
        tshirt: 'XL',
        twitter: 'qunnoq'
    }
}

orbitActivities.createActivity(data).then(data => {
    console.log(data)
}).catch(error => {
    console.error(error)
})
```

`data` should match the body params as shown in the [__Create an activity for a new or existing member__ API reference.](https://docs.orbit.love/reference#post_-workspace-id-activities)


</details>

<details>
<summary><code>updateActivity(memberId, activityId, data)</code></summary>

```js
const memberId = 'janesmith04'
const activityId = '1234356'
const data: {
    description: 'New description'
}

orbitActivities.updateActivity(memberId, activityId, data).then(data => {
    console.log(data)
}).catch(error => {
    console.error(error)
})
```

`data` should match the body params as shown in the [__Update a custom activity for a member__ API reference.](https://docs.orbit.love/reference#put_-workspace-id-members-member-id-activities-id)
</details>

<details>
<summary><code>deleteActivity(memberId, activityId)</code></summary>

```js
const memberId = 'janesmith04'
const activityId = '1234356'

orbitActivities.deleteActivity(memberId, activityId).then(data => {
    console.log(data)
}).catch(error => {
    console.error(error)
})
```

[__Delete a post activity__ API reference.](https://docs.orbit.love/reference#delete_-workspace-id-members-member-id-activities-id)
</details>


## Note Methods

<details>
<summary><code>listMemberNotes(memberId, options)</code></summary>

```js
const memberId = 'janesmith04'
const options = {
    page: 1
}

orbitActivities.listMemberNotes(memberId, options).then(data => {
    console.log(data)
}).catch(error => {
    console.error(error)
})
```

`options` is not a required parameter, but can be any query parameter shown in our API reference.

[__Get the member's notes__ API reference.](https://docs.orbit.love/reference#get_-workspace-id-members-member-id-notes)
</details>

<details>
<summary><code>createNote(memberId, body)</code></summary>

```js
const memberId = 'janesmith04'
const body = 'Had a really excellent interview with Jane today.'

orbitActivities.createNote(memberId, body).then(data => {
    console.log(data)
}).catch(error => {
    console.error(error)
})
```

[__Create a note__ API reference.](https://docs.orbit.love/reference#post_-workspace-id-members-member-id-notes)
</details>

<details>
<summary><code>updateNote(memberId, noteId, body)</code></summary>

```js
const memberId = 'janesmith04'
const noteId = '12345'
const body = 'Had a really excellent interview with Jane today. Here is some more info.'

orbitActivities.updateNote(memberId, noteId, body).then(data => {
    console.log(data)
}).catch(error => {
    console.error(error)
})
```

[__Update a note__ API reference.](https://docs.orbit.love/reference#put_-workspace-id-members-member-id-notes-id)
</details>

## Contributing

We 💜 contributions from everyone! Check out the [Contributing Guidelines](.github.CONTRIBUTING.md) for more information.

## License

This is available as open source under the terms of the [MIT License](LICENSE).

## Code of Conduct

This project uses the [Contributor Code of Conduct](.github/CODE_OF_CONDUCT.md). We ask everyone to please adhere by its guidelines.
