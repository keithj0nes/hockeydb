/* eslint-disable no-alert */
/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
import axios from 'axios';
import { notification } from 'antd';
import store from '../store';
import { history } from '../../helpers';
import { TOGGLE_MODAL } from '../actionTypes';
import { logout } from './auth';


// the request function calls to serverside - if errors occur, they will be caught and handled here as an error modal
export const request = async ({ url, method, session, publicRoute }) => {
    if (!session && method !== 'DELETE') return alert('no session, please include a session object');
    if (!method) return alert('no method, please include a method string');
    if (!url) return alert('no route, please include a route string');

    let access_token;
    if (!publicRoute) {
        access_token = store.getState().user.user.access_token;
    }

    if (!publicRoute && !access_token) return alert('no access token for auth route');

    const responseRaw = await axios({
        method,
        url,
        data: session,
        headers: {
            Authorization: publicRoute ? null : `Bearer ${access_token}`,
        },
    }).catch(err => {
        console.log(err.response, 'error in responseRaw');

        const { status, message, notification_type } = err.response.data;

        switch (notification_type) {
        case 'snack': {
            const options = {
                message: 'Error',
                description: message,
                onClick: () => {
                    console.log('Notification Clicked!');
                },
                placement: 'topRight',
                duration: 0,
            };
            notification.error(options);
            break;
        }
        default:
            store.dispatch({
                type: TOGGLE_MODAL,
                modalProps: {
                    isVisible: true,
                    title: `Error - Status ${status || 500}`,
                    isClosableOnBackgroundClick: true,
                    // message: `Cannot connect to the server \n Confirm server is running \n Error code: ${status}`,
                    message: message || 'Cannot connect to the server \n Confirm server is running',
                },
                modalType: 'alert',
            });
            break;
        }


        return false;
    });

    if (!responseRaw) return false;
    const { status, data, message, shouldLogOut, redirect, snack, notification_type } = responseRaw.data;

    if (snack) {
        console.error(`There should be no more snack: true keys \n Please use notification_type: "snack" in your backend response \n ${method} => ${url}`);
    }

    // notificationType = 'snack' | 'modal' | 'none';
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

    switch (notification_type) {
    case 'snack': {
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
        break;
    }

    case 'modal': {
        store.dispatch({
            type: TOGGLE_MODAL,
            modalProps: {
                isVisible: true,
                title: type.charAt(0).toUpperCase() + type.slice(1),
                message,
                confirmAction: shouldLogOut ? () => store.dispatch(logout()) : null,
            },
            modalType: 'alert',
        });
        break;
    }
    case 'none':
    default:
        break;
    }

    if (status !== 200) {
        console.log(`status error: ${status} - ${message}`);
        const state = store.getState();
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

        if (notification_type !== 'snack') {
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
        return false;
    }

    if (status === 200) {
        if (redirect) {
            console.log(`Redirecting to the ${redirect} page`);
            if (redirect === 'current') {
                const currentPath = history.location.pathname;
                history.push('/');
                history.push(currentPath);
                return { data, message };
            }

            store.dispatch({
                type: TOGGLE_MODAL,
                modalProps: { isVisible: false },
            });
            history.push(redirect);
            return { data, message };
        }

        return { data, message };
    }
    return true;
};

// /* eslint-disable import/no-cycle */
// /* eslint-disable no-console */
// import axios from 'axios';
// import { notification } from 'antd';
// import store from '../store';
// import { history } from '../../helpers';
// import { TOGGLE_MODAL } from '../actionTypes';
// import { logout } from './auth';


// // the request function calls to serverside - if errors occur, they will be caught and handled here as an error modal
// // export const request = async (route, method, session, noAuth) => {
// export const request = async ({ url, method, session, publicRoute }) => {
//     if (!session && method !== 'DELETE') return alert('no session, please include a session object');
//     if (!method) return alert('no method, please include a method string');
//     if (!url) return alert('no route, please include a route string');

//     let access_token;
//     if (!publicRoute) {
//         access_token = store.getState().user.user.access_token;
//     }

//     if (!publicRoute && !access_token) return alert('no access token for auth route');

//     const responseRaw = await axios({
//         method,
//         url,
//         data: session,
//         headers: {
//             Authorization: publicRoute ? null : `Bearer ${access_token}`,
//         },
//     }).catch(err => {
//         console.log(err, 'error in responseRaw');

//         store.dispatch({
//             type: TOGGLE_MODAL,
//             modalProps: {
//                 isVisible: true,
//                 title: 'Error',
//                 isClosableOnBackgroundClick: true,
//                 message: 'Cannot connect to the server \n Confirm server is running \n Error code: 500',
//             },
//             modalType: 'alert',
//         });

//         return false;
//     });

//     if (!responseRaw) return false;
//     const { status, data, message, shouldLogOut, redirect, snack } = responseRaw.data;
//     console.log(responseRaw.data.notification_type)

//     if (snack) {
//         // clean this snack section up
//         const statusFirst = String(status).charAt(0);
//         let type;
//         switch (statusFirst) {
//         case '2':
//             type = 'success';
//             break;
//         case '4':
//             type = 'error';
//             break;
//         default:
//             type = 'alert';
//             break;
//         }

//         const options = {
//             message: type.charAt(0).toUpperCase() + type.slice(1),
//             description: message,
//             onClick: () => {
//                 console.log('Notification Clicked!');
//             },
//             placement: 'topRight',
//             duration: type === 'error' ? 0 : undefined,
//         };

//         switch (type) {
//         case 'error':
//             notification.error(options);
//             break;
//         case 'alert':
//             notification.info(options);
//             break;

//         case 'success':
//             notification.success(options);
//             break;
//         case 'warning':
//             notification.success(options);
//             break;
//         default:
//             notification.open(options);
//         }
//     }

//     if (status !== 200) {
//         console.log(`status error: ${status} - ${message}`);
//         const state = store.getState();
//         // if a modal is already visible and there's an error, show that error in the current modal
//         if (state.misc.modalVisible && !redirect) {
//             store.dispatch({
//                 type: TOGGLE_MODAL,
//                 modalProps: {
//                     ...state.misc.modalProps,
//                     isVisible: true,
//                     // title: 'Error',
//                     // isClosableOnBackgroundClick: true,
//                     errors: message,
//                     // errors: `${message}\nError code: ${status}`
//                     confirmAction: shouldLogOut ? () => store.dispatch(logout()) : null,
//                 },
//                 modalType: state.misc.modalType,
//             });

//             return false;
//         }

//         if (redirect) {
//             console.log(`Redirecting to the ${redirect} page`);
//             if (redirect === 'current') {
//                 const currentPath = history.location.pathname;
//                 history.push('/');
//                 history.push(currentPath);
//                 return false;
//             }

//             store.dispatch({
//                 type: TOGGLE_MODAL,
//                 modalProps: { isVisible: false },
//             });
//             history.push(redirect);
//             return false;
//         }

//         if (!Object.prototype.hasOwnProperty.call(responseRaw.data, 'snack')) {
//             store.dispatch({
//                 type: TOGGLE_MODAL,
//                 modalProps: {
//                     isVisible: true,
//                     title: 'Error',
//                     message: `${message}\n\nError code: ${status}`,
//                     confirmAction: shouldLogOut ? () => store.dispatch(logout()) : null,
//                 },
//                 modalType: 'alert',
//             });
//         }
//         return false;
//     }

//     if (status === 200) {
//         if (redirect) {
//             console.log(`Redirecting to the ${redirect} page`);
//             if (redirect === 'current') {
//                 const currentPath = history.location.pathname;
//                 history.push('/');
//                 history.push(currentPath);
//                 return { data, message };
//             }

//             store.dispatch({
//                 type: TOGGLE_MODAL,
//                 modalProps: { isVisible: false },
//             });
//             history.push(redirect);
//             return { data, message };
//         }

//         return { data, message };
//     }
//     return true;
// };
