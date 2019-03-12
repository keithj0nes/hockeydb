import axios from 'axios';
const root = 'http://localhost:8010';

// the request function calls to serverside - if errors occur, they will be caught and handled here
export const request = async (route, method, session, dispatch, noAuth) => {
    if(!session){
        return alert('no session, please include a session object')
    }

    if(!route){
        return alert('no route, please include a route string')
    }

    // if(noAuth){
        //this will be used to determine if route should have authorizion bearer token in header
    // }

    const responseRaw = await axios({
        method,
        url: `${root}${route}`,
        data: session
    }).catch(err => console.log(err, 'error in responseRaw'))

    console.log(responseRaw, 'RAW RESPONSE!')
    const { status, data, message } = responseRaw.data;

    if(status !== 200){
        //NOT BEING USED YET
        // dispatch({type: 'REQUEST_METHOD_FAILURE', payload: {status, message}})  //NOT BEING USED YET
        //NOT BEING USED YET

        console.log(`status error: ${status} - ${message}`)
        return alert(`status error: ${status} - ${message}`)
    }


    if(status === 200){
        return data;
    }

}