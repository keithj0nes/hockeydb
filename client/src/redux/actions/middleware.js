/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
import axios from 'axios';
import store from '../store';
import { history } from '../../helpers';
// import { ROOT } from '../../client_config';
import { TOGGLE_MODAL } from '../actionTypes';
import { logout } from './auth';


// the request function calls to serverside - if errors occur, they will be caught and handled here as an error modal
export const request = async (route, method, session, noAuth) => {
    if (!session) {
        return alert('no session, please include a session object');
    }
    if (!method) {
        return alert('no method, please include a method string');
    }
    if (!route) {
        return alert('no route, please include a route string');
    }

    if (!noAuth && !session.access_token) {
        return alert('no access token for auth route');
    }

    const responseRaw = await axios({
        method,
        // url: `${ROOT}${route}`,
        url: `${route}`,
        data: session.data,
        headers: {
            Authorization: noAuth ? null : `Bearer ${session.access_token}`,
        },
    }).catch(err => {
        console.log(err, 'error in responseRaw');

        store.dispatch({
            type: TOGGLE_MODAL,
            modalProps: {
                isVisible: true,
                title: 'Error',
                isClosableOnBackgroundClick: true,
                message: 'Cannot connect to the server \n Confirm server is running \n Error code: 500',
            },
            modalType: 'alert',
        });

        return false;
    });

    // console.log(responseRaw, 'resproaw')

    // console.log(responseRaw.data, 'RAW RESPONSE in MIDDLEWARE')
    if (!responseRaw) return false;
    const { status, data, message, shouldLogOut, redirect, snack } = responseRaw.data;
    // const status = 243;
    // const message = 'fake message lol';

    // console.log(responseRaw.data, 'AYEEOOOO 🤬🤬🤬')


    if (snack) {
        const statusFirst = String(status).charAt(0);
        let type;
        switch (statusFirst) {
        case '2':
            type = 'success';
            break;
        case '4':
            type = 'error';
            break;
        default:
            type = 'alert';
            break;
        }

        store.dispatch({
            type: 'TOGGLE_SNACKBAR',
            payload: { isVisible: true, message, type },
        });
    }

    if (status !== 200) {
        console.log(`status error: ${status} - ${message}`);
        // NOT BEING USED YET
        // store.dispatch({type: 'REQUEST_METHOD_FAILURE', payload: {status, message}})  //NOT BEING USED YET
        // NOT BEING USED YET

        const state = store.getState();
        // console.log(state, 'state!')


        // if a modal is already visible and there's an error, show that error in the current modal
        if (state.misc.modalVisible && !redirect) {
            store.dispatch({
                type: TOGGLE_MODAL,
                modalProps: {
                    ...state.misc.modalProps,
                    isVisible: true,
                    // title: 'Error',
                    // isClosableOnBackgroundClick: true,
                    errors: message,
                    // errors: `${message}\nError code: ${status}`
                    confirmAction: shouldLogOut ? () => store.dispatch(logout()) : null,
                },
                modalType: state.misc.modalType,
            });

            return false;
        }
        // store.dispatch({type: TOGGLE_MODAL, payload: {status, message}})


        if (redirect) {
            console.log(`Redirecting to the ${redirect} page`);
            if (redirect === 'current') {
                const currentPath = history.location.pathname;
                history.push('/');
                history.push(currentPath);
                return false;
            }

            store.dispatch({
                type: TOGGLE_MODAL,
                modalProps: { isVisible: false },
            });
            history.push(redirect);
            return false;
        }

        if (!snack) {
            store.dispatch({
                type: TOGGLE_MODAL,
                modalProps: {
                    isVisible: true,
                    title: 'Error',
                    message: `${message}\n\nError code: ${status}`,
                    confirmAction: shouldLogOut ? () => store.dispatch(logout()) : null,
                },
                modalType: 'alert',
            });
        }


        // alert(`status error: ${status} - ${message}`)
        return false;
    }


    if (status === 200) {
        return { data, message };
    }
    return true;
};
