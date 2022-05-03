/* eslint-disable no-alert */
import axios from 'axios';

// this will handle axios requests
const request = async ({ url, method, session, publicRoute }) => {
    if (!session && method !== 'DELETE') return alert('no session, please include a session object');
    if (!method) return alert('no method, please include a method string');
    if (!url) return alert('no route, please include a route string');

    let access_token;
    // Publi
    if (!publicRoute) {
        console.log('get acces token here!');
        // access_token = store.getState().user.user.access_token;
    }

    if (!publicRoute && !access_token) return alert('no access token for auth route');

    const response = await axios({
        method,
        url,
        data: session,
        headers: {
            Authorization: publicRoute ? null : `Bearer ${access_token}`,
        },
    }).catch(err => {
        console.log(err.response, 'error in response');
    });

    console.log(response, 'RESPONSE FROM BACKEND');

    return response.data;
};

export default request;
