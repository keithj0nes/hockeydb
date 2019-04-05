import axios from 'axios';
import store from '../store';
import { ROOT } from '../../client_config';
import { TOGGLE_MODAL } from '../actionTypes';



// the request function calls to serverside - if errors occur, they will be caught and handled here
export const request = async (route, method, session, noAuth) => {
    if(!session){
        return alert('no session, please include a session object')
    }
    if(!method){
        return alert('no method, please include a method string')
    }
    if(!route){
        return alert('no route, please include a route string')
    }

    const responseRaw = await axios({
        method,
        url: `${ROOT}${route}`,
        data: session.data,
        headers: {
            Authorization: noAuth ? null : `Bearer ${session.access_token}`
        }
    }).catch(err => console.log(err, 'error in responseRaw'))

    console.log(responseRaw.data, 'RAW RESPONSE in MIDDLEWARE')
    const { status, data, message } = responseRaw.data;

    if(status !== 200){
        //NOT BEING USED YET
        // store.dispatch({type: 'REQUEST_METHOD_FAILURE', payload: {status, message}})  //NOT BEING USED YET
        //NOT BEING USED YET

        store.dispatch({type: TOGGLE_MODAL, payload: {status, message}})

        console.log(`status error: ${status} - ${message}`)
        // alert(`status error: ${status} - ${message}`)
        return false;
    }


    if(status === 200){
        return data;
    }

}