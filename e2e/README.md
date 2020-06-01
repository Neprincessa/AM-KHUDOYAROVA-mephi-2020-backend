# RealWorld API Spec

## Running API tests locally

To locally run the provided Postman collection against your backend, execute:

```
APIURL=http://localhost:3000/api ./run-api-tests.sh
```

For more details, see [`run-api-tests.sh`](run-api-tests.sh).

## Considerations for your backend with [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)

If the backend is about to run on a different host/port than the frontend, make sure to handle `OPTIONS` too and return correct `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers` (e.g. `Content-Type`).

### Authentication Header:

`Authorization: Token jwt.token.here`

## JSON Objects returned by API:

Make sure the right content type like `Content-Type: application/json; charset=utf-8` is correctly returned.

### Users (for authentication)

```JSON
{
  "user": {
    "email": "jake@jake.jake",
    "token": "jwt.token.here",
    "username": "jake",
    "name": "jame",
    "surname": "nunu"
  }
}
```

### Profile

```JSON
{
  "profile": {
    "username": "jake",
    "name": "jame",
    "surname": "nunu",
    "following": false
  }
}
```

### Single Present

```JSON
{
  "present":
  {
    "id":6,
    "createdAt":"2020-05-08T16:58:42.130Z","updatedAt":"2020-05-08T16:58:42.130Z","slug":"dragon-25lx26",
    "name":"dragon",
    "cost":12,
    "address":"msk",
    "state":false,
    "user":{
      "id":6,
      "createdAt":"2020-05-08T16:58:36.863Z","updatedAt":"2020-05-08T16:58:39.322Z",
      "email":"u1588967915@mail.com",
      "username":"u1588967915",
      "name":"jim",
      "surname":"jimmy"
    }
  }
}
```

### Multiple Presents

```JSON
{
  "presents":[{
    "id":6,
    "createdAt":"2020-05-08T16:58:42.130Z","updatedAt":"2020-05-08T16:58:42.130Z","slug":"dragon-25lx26",
    "name":"dragon",
    "cost":12,
    "address":"msk",
    "state":false,
    "user":{
      "id":6,
      "createdAt":"2020-05-08T16:58:36.863Z","updatedAt":"2020-05-08T16:58:39.322Z",
      "email":"u1588967915@mail.com",
      "username":"u1588967915",
      "name":"jim",
      "surname":"jimmy"
    }
  },
  {
    "id":7,
    "createdAt":"2020-05-08T16:58:45.130Z","updatedAt":"2020-05-08T16:58:45.130Z","slug":"dragon3-25lx26",
    "name":"dragon3",
    "cost":12,
    "address":"msk",
    "state":false,
    "user":{
      "id":6,
      "createdAt":"2020-05-08T16:58:36.863Z","updatedAt":"2020-05-08T16:58:39.322Z",
      "email":"u1588967915@mail.com",
      "username":"u1588967915",
      "name":"jim",
      "surname":"jimmy"
    }
  }],
  "presentsCount": 2
}
```

### Friends

```JSON
{
  "profiles": [
    {
      "id": 1,
      "createdAt": "2020-06-01T16:28:37.526Z",
      "updatedAt": "2020-06-01T16:28:37.526Z",
      "email": "khuij@f.com",
      "username": "jgdhgfh",
      "name": "nastya",
      "surname": "yaaka",
      "following": false
    },
    {
      "id": 3,
      "createdAt": "2020-06-01T17:22:37.526Z",
      "updatedAt": "2020-06-01T17:22:37.526Z",
      "email": "kvfsf@f.com",
      "username": "fvdr",
      "name": "nastya",
      "surname": "yaaka",
      "following": false
    }
  ],
  "profilesCount": 2
}
```

### Errors and Status Codes

If a request fails any validations, expect a 422 and errors in the following format:

```JSON
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```

#### Other status codes:

401 for Unauthorized requests, when a request requires authentication but it isn't provided

403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action

404 for Not found requests, when a resource can't be found to fulfill the request

## Endpoints:

### Authentication:

`POST /api/users/login`

Example request body:

```JSON
{
  "user":{
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
```

No authentication required, returns a [User](#users-for-authentication)

Required fields: `email`, `password`

### Registration:

`POST /api/users`

Example request body:

```JSON
{
  "user":{
    "username": "Jacob",
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
```

No authentication required, returns a [User](#users-for-authentication)

Required fields: `email`, `username`, `password`

### Get Current User

`GET /api/user`

Authentication required, returns a [User](#users-for-authentication) that's the current user

### Update User

`PUT /api/user`

Example request body:

```JSON
{
  "user":{
    "email": "jake@jake.jake",
    "name": "Kim",
    "surname": "Mindelson"
  }
}
```

Authentication required, returns the [User](#users-for-authentication)

Accepted fields: `email`, `username`, `surname`, `name`

### Get Profile

`GET /api/profiles/:username`

Authentication optional, returns a [Profile](#profile)

### Follow user

`POST /api/profiles/:username/follow`

Authentication required, returns a [Profile](#profile)

No additional parameters required

### Unfollow user

`DELETE /api/profiles/:username/follow`

Authentication required, returns a [Profile](#profile)

No additional parameters required

### List friends

`GET /api/profiles/:username/friends`

Authentication is optional, returns list of [Profiles](#profile)

If user has auth token in the future he will see who is his friend.

No additional parameters required

### List Presents

`GET /api/present`

Returns most recent present globally by default, provide `username` query parameter to filter results

Query Parameters:

Filter by username:

`?username=jake`

Authentication optional, will return [multiple presents](#multiple-presents), ordered by most recent first

### Get Present

`GET /api/present/:slug`

No authentication required, will return [single present](#single-present)

### Create Present

`POST /api/present`

Example request body:

```JSON
{
  "present": {
    "name": "dragon",
    "cost": "5",
    "address": "msk",
    "state": "false"
  }
}
```

Authentication required, will return an [Present](#single-present)

Required fields: `name`, `address`, `cost`, `state`

### Update Present

`PUT /api/present/:slug`

Example request body:

```JSON
{
  "present": {
    "name": "dragon"
  }
}
```

Authentication required, returns the updated [Present](#single-present)

Optional fields: `name`, `address`, `cost`, `state`

The `slug` also gets updated when the `name` is changed

### Delete Present

`DELETE /api/present/:slug`

Authentication required
