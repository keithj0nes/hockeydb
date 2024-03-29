/* eslint-disable no-alert */
import axios from 'axios';
import { toast } from '../utils';

// this will handle axios requests
const request = async ({ url, method, body = {}, isPublic, store = () => true }) => {
    if (!body && method !== 'DELETE') return alert('no body, please include a body object');
    if (!method) return alert('no method, please include a method string');
    if (!url) return alert('no route, please include a route string');

    let access_token;
    if (!isPublic) {
        access_token = store().auth?.access_token;
    }

    if (!isPublic && !access_token) return alert('no access token for auth route');

    const response = await axios({
        method,
        url,
        data: body,
        headers: {
            Authorization: isPublic ? null : `Bearer ${access_token}`,
        },
    }).catch(err => {
        console.log(err.response, 'error in response');
    });

    // console.log(response, 'RESPONSE FROM BACKEND');

    const { status, data, message, notification = {}, shouldLogOut, redirect, snack, notification_type, notification_duration } = response.data;

    console.log({ status, data, message, notification });


    if (notification_type) {
        // console.warn(`There should be no more snack: true keys \n Please use notification_type: "snack" in your backend response \n ${method} => ${url}`);
        console.warn("Avoid using 'notification_type' - instead use \n { \n \xa0 notification: { \n \xa0 \xa0 type: 'toast', \n \xa0 \xa0 duration: 2, \n \xa0 \xa0 status: 'success' \n \xa0 } \n } ");
    }

    if (notification.type === 'toast') {
        toast(notification, message);
    }

    return response.data;
};

export default request;
