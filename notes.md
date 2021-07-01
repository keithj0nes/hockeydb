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

Server response notification_type = 'snack' | 'modal' | 'none';


---
## Example response custom error codes
- These error responses can be implimented
````
# 10XX : Main App Errors
    '1000': 'App Server Error, please contact the admin' # Global Error
    '1001': 'Missing Headers'
    '1002': 'Missing Parameters'
    '1003': 'Invalid offset or limit'
    '1004': 'Invalid Locale'
    '1005': 'Invalid Timezone'
    '1006': 'You exceeded the limit of requests per minute, Please try again after sometime.'

# 11XX : Http Errors
    '1101': 'Unauthorized'
    '1102': 'Not authorized to access'
    '1103': 'Unprocessable Entity'
    '1104': 'Authentication Failed'
    '1105': 'Not Found'
    '1106': 'Route Not Found'

# 12XX : Auth Erorrs
    '1201': 'Your session is expired, please login again' # Token expired
    '1202': 'Your sessions is invalid' # JWT verification error
    '1203': 'Your sessions is invalid' # Error encountered while decoding JWT token
    '1204': 'Your sessions token is invalid' # Invalid token
    '1205': 'You are Unauthorized, Please login' # You are Unauthorized, Please login
    '1206': 'Authentication Error, User Not found' # Authentication Error, User Not found

# 13XX Session Errors
    '1301': 'Invalid Credentials'
    '1302': 'Invalid Login Type'
    '1303': 'Invalid Social Type'
    '1304': 'Login Error'
    '1305': 'You Account is disabled by the admin.'
    '1306': 'Invalid mobile number.'
    '1307': 'Wrong confirmation code! Try again.'
    '1308': 'Invalid email or password'
    '1309': 'Your account already exist in the app, please try to login.'
    '1310': 'Your request is invalid or your request time is over, please try again.'
    '1311': 'You are not authorized to access this app'
    '1312': 'An issue in the Active Directory Service, please contat the Administrator'
    '1313': 'your email still not confirmed, please confirm your email'
    '1314': 'Email link has been expired'
    '1315': 'Your account is not activated Please verify your email to activate the account'
    '1316': 'You cannot delete user until his requests been completed or cancelled'
    '1317': 'This number has already registered'
    '1318': 'Please before you login with google account first sign up'
    '1319': 'Your old mobile number is wrong'
    '1320': 'confirmation code is expired! Try again'
    '1321': 'You cannot delete provider until he completed or cancelled his requests'
    '1322': 'Your account was blocked by Admin. Please contact admin at support@laancare.com'

data_found:             'Data found'
  no_data_found:          'No data found'
  not_found:              'Not found'
  x_not_found:            '%{name} not found!'
  update_successfully:    'Updated successfully'
  x_update_successfully:  '%{name} updated successfully'
  created_successfully:   'Created successfully'
  x_created_successfully: '%{name} created successfully'
  deleted_successfully:   'Deleted successfully'
  x_deleted_successfully: '%{name} deleted successfully'
  request_submitted:      'Order %{code} Code has been Submitted successfully'
  orders_not_found:       'No orders yet'
  ````