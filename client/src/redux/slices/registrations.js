import { createSlice } from '@reduxjs/toolkit';
import request from '../request';
import { wait, history } from '../../utils';
import { setUser } from './auth';

const initialState = {
    formFields: [],
    isFetching: false,

    openRegistrations: [],
    myRegistrations: [],
    model: {},
};

export const registrationsSlice = createSlice({
    name: 'registrations',
    initialState,
    reducers: {
        posting: state => {
            state.isPosting = true;
        },
        clearPosting: state => {
            state.isPosting = false;
        },
        getInit: state => {
            state.isFetching = true;
        },
        setFormFields: (state, { payload }) => {
            state.isFetching = false;
            // state.formFields = payload;
            state.model = payload;
        },
        setFormFieldsAdmin: (state, { payload }) => {
            state.isFetching = false;
            state.formFields = payload;
            // state.model = payload;
        },
        setOpenRegistrations: (state, { payload }) => {
            state.isFetching = false;
            state.openRegistrations = payload.open_registrations;
            state.myRegistrations = payload.my_registrations;
        },
        setUpdatePlayerRegistration: (state, { payload }) => {
            // console.log('SETTING NEW MODEL AFTER UPDATE')
            // console.log({ ...state.model, registered_players: [...state.model.registered_players, payload] })
            state.isFetching = false;
            state.model = { ...state.model, registered_players: [...state.model.registered_players, payload] }
        },
    },
});

// Action creators are generated for each case reducer function
export const { clearPosting, posting, getInit, setFormFields, setFormFieldsAdmin, setOpenRegistrations, setUpdatePlayerRegistration } = registrationsSlice.actions;

export const getRegistrationByRegIdAdmin = ({ season_id, registration_id }) => async (dispatch, store) => {
    dispatch(getInit());

    // await wait(2000);

    const data = await request({ url: `/api/admin/seasons/${season_id}/registrations/${registration_id}`, method: 'GET', store });
    // console.log(data, 'dataaa');
    dispatch(setFormFieldsAdmin(data.data));
};

export const updateRegistrationFieldsByRegId = ({ season_id, registration_id, fields, removedIds }) => async (dispatch, store) => {
    const data = await request({ url: `/api/admin/seasons/${season_id}/registrations/${registration_id}`, method: 'PUT', body: { season_id, registration_id, fields, removedIds }, store });
    console.log(data, 'updateRegistrationFieldsByRegId');
    dispatch(setFormFieldsAdmin(data.data.fields));
    return data.data.deleted;
};


export const getRegistration = ({ registration_id }) => async (dispatch, store) => {
    dispatch(getInit());

    // await wait(2000);

    const data = await request({ url: `/api/register/${registration_id}`, method: 'GET', store });
    console.log(data, 'dataaa in getRegistration');
    dispatch(setFormFields(data.data));
};

export const submitPlayerRegistration = ({ registration_id, fields, step }) => async (dispatch, store) => {
    console.log(fields, 'dataaaa');


    const data = await request({ url: `/api/register/${registration_id}`, method: 'POST', body: { fields, step }, store });
    console.log(data, 'dataaa in getRegistration');

    dispatch(setUser({ ...data.data.user, access_token: data.data.access_token }));

    if (data.data.submitted) {
        console.log('send to confirmation page')
        history.push(`/dashboard/registrations/${data.data.submission.id}`)
    }
};

// updatePlayerRegistration

export const updatePlayerRegistration = ({ registration_id, fields, step }) => async (dispatch, store) => {
    console.log({ registration_id, fields, step }, 'dataaaa');


    const data = await request({ url: `/api/register/${registration_id}`, method: 'PUT', body: { fields, step }, store });
    console.log(data, 'dataaa in updatePlayerRegistration');

    if (data.status === 200) {
        dispatch(setUpdatePlayerRegistration(data.data));
        return true;
    }

    // dispatch(setUser({ ...data.data.user, access_token: data.data.access_token }));

    // update redux user here
};


export const getOpenRegistrations = () => async (dispatch, store) => {
    dispatch(getInit());
    await wait(2000);
    const data = await request({ url: '/api/registrations', method: 'GET', store });
    console.log(data, 'dataaa in getOpenRegistrations');

    dispatch(setOpenRegistrations(data.data));
};


export default registrationsSlice.reducer;
