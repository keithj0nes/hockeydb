/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
import axios from 'axios';
import { notification } from 'antd';
import store from '../store';
import { history } from '../../helpers';
// import { ROOT } from '../../client_config';
import { TOGGLE_MODAL } from '../actionTypes';
import { logout } from './auth';


// the request function calls to serverside - if errors occur, they will be caught and handled here as an error modal
// export const request = async (route, method, session, noAuth) => {
export const request = async ({ url, method, session, publicRoute }) => {
    if (!session && method !== 'DELETE') {
        return alert('no session, please include a session object');
    }
    if (!method) {
        return alert('no method, please include a method string');
    }
    if (!url) {
        return alert('no route, please include a route string');
    }

    let access_token;

    if (!publicRoute) {
        access_token = store.getState().user.user.access_token;
    }

    if (!publicRoute && !access_token) {
        return alert('no access token for auth route');
    }

    console.log(session, ' SESSION');

    if(url === '/api/admin/seasons') {

        return null;
    }

    const responseRaw = await axios({
        method,
        // url: `${ROOT}${route}`,
        url,
        data: session,
        headers: {
            Authorization: publicRoute ? null : `Bearer ${access_token || data.access_token}`,
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

    if (!responseRaw) return false;
    const { status, data, message, shouldLogOut, redirect, snack } = responseRaw.data;


    if (snack) {

        // clean this snack section up
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

        const options = {
            message: type.charAt(0).toUpperCase() + type.slice(1),
            description: message,
            onClick: () => {
                console.log('Notification Clicked!');
            },
            placement: 'topRight',
            duration: type === 'error' ? 0 : undefined,
        };

        switch (type) {
        case 'error':
            notification.error(options);
            break;
        case 'alert':
            notification.info(options);
            break;

        case 'success':
            notification.success(options);
            break;
        case 'warning':
            notification.success(options);
            break;
        default:
            notification.open(options);
        }

        // store.dispatch({
        //     type: 'TOGGLE_SNACKBAR',
        //     payload: { isVisible: true, message, type },
        // });
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
