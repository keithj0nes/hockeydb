import axios from 'axios';
import store from '../store';
import { ROOT } from '../../client_config';
import { TOGGLE_MODAL } from '../actionTypes';

import { logout } from '../actions/auth';


// the request function calls to serverside - if errors occur, they will be caught and handled here as an error modal
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
    }).catch(err => {
        console.log(err, 'error in responseRaw')
    
        store.dispatch({
            type: TOGGLE_MODAL,
            modalProps: {
                isVisible: true,
                title: 'Error',
                isClosableOnBackgroundClick: true,
                message: `Cannot connect to the server \n Confirm server is running \n Error code: 500`
            },
            modalType: 'alert'
        })

        return false;
    })

    // console.log(responseRaw, 'resproaw')

    // console.log(responseRaw.data, 'RAW RESPONSE in MIDDLEWARE')
    if(!responseRaw) return false;
    const { status, data, message, shouldLogOut } = responseRaw.data;

    // const status = 243;
    // const message = 'fake message lol';
    
    if(status !== 200){
        console.log(`status error: ${status} - ${message}`)
        //NOT BEING USED YET
        // store.dispatch({type: 'REQUEST_METHOD_FAILURE', payload: {status, message}})  //NOT BEING USED YET
        //NOT BEING USED YET

        const state = store.getState();
        // console.log(state, 'state!')


        //if a modal is already visible and there's an error, show that error in the current modal
        if(state.misc.modalVisible){
            store.dispatch({
                type: TOGGLE_MODAL,
                modalProps: {
                    ...state.misc.modalProps,
                    isVisible: true,
                    // title: 'Error',
                    // isClosableOnBackgroundClick: true,
                    errors: message,
                    // errors: `${message}\nError code: ${status}`
                    confirmAction: shouldLogOut ? () => store.dispatch(logout()) : null
                },
                modalType: state.misc.modalType
            })

            return false;
        }
        // store.dispatch({type: TOGGLE_MODAL, payload: {status, message}})
        store.dispatch({
            type: TOGGLE_MODAL,
            modalProps: {
                isVisible: true,
                title: 'Error',
                message: `${message}\n\nError code: ${status}`,
                confirmAction: shouldLogOut ? () => store.dispatch(logout()) : null
            },
            modalType: 'alert'
        })


        // alert(`status error: ${status} - ${message}`)
        return false;
    }


    if(status === 200){
        return {data, message};
    }

}