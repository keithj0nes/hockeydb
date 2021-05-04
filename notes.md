const tierLevels = {
    X:   1,
    XX:  2,
    XXX: 3
}

const SITE_LEVEL = tierLevels.X;


## Current data return implementation

return errors -  
```
{
    status: number,
    error: boolean,
    message: string
}

return res.send({ status: 400, error: true, message: 'Passwords must match' })
```

return success - 
```
{
    status: number,
    data: array/object,
    message: string
}

return res.send({status: 200, data: user, message: 'You have successfully logged in'})

```

## Possible data return implementation

```
function sendFormat({status, code, message, data}) {
    const date = new Date();
    return {
        "site": config.SITE_URL,
        "site_level": SITE_LEVEL,
        "version": config.API_VERSION,
        "datetime": date,
        "timestamp": date.getTime(),
        "status": status,
        "code": code,
        "message": message,
        "data": data
    }
}
```
```
{
    "site": "hockeydb.com",
    "version": "1.2.3",
    "datetime": "2016-10-06T19:58:29Z",
    "timestamp": 1475783909566791977,
    "status": "success",
    "code": 200,
    "message": "OK",
    "data": {
        "routes": [
            {
                "method": "GET",
                "path": "/status",
                "description": "check this service status"
            },
            {
                "method": "GET",
                "path": "/password",
                "description": "returns a random passwords"
            }
        ]
    }
}
```

Examples
If the email field is missing, return a 400 .
If the password field is too short, return a 422 .
If the email field isn’t a valid email, return a 422 .
If the email is already taken, return a 409 .


## Routes in Postman Docs
### To do: Add all routes to Postman Docs

`GET => /api/seasons/`  
`GET => /api/divisions/`

`POST => /api/admin/seasons`  
`PUT => /api/admin/seasons/:id`  
`DELETE => /api/admin/seasons/:id`

`POST => /api/admin/divisions`  


secure route
```
app.get('/topsecretroute', auth.authorizeAccessToken, (req, res, next) => {

    return res.send({
        status: 200,
        data: {
            user: req.user,
            access_token: req.headers.authorization.split(' ')[1]
        },
        message: 'We reached the top secret route'
    })
})
```

Comparison for MassiveJS

    = (equality): {price: 20}, {"price =": 20}
    <> (inequality): {"price <>": 20}, {"price !=": 20}, {"price !": 20}
    < (less than): {"price <": 20}
    > (greater than): {"price >": 20}
    <= (less than or equal): {"price <=": 20}
    >= (greater than or equal): {"price >=": 20}


need to upgrade to massive@next to 6.0 for joins to work
````
const teamsWithDivisions = await db.teams.join({
  divisions: {
    type: 'INNER',
    on: {division_id: 'id'}
  }
}).find({
  state: 'EV',
  'books.author ILIKE': 'calvino, %'
});
````
