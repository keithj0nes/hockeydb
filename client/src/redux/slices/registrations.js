import { createSlice } from '@reduxjs/toolkit';
import request from '../request';
// import { wait, history } from '../../utils';


const initialState = {
    formFields: [],
    isFetching: false,
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
            state.formFields = payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { clearPosting, posting, getInit, setFormFields } = registrationsSlice.actions;

export const getRegistrationByRegIdAdmin = ({ season_id, registration_id }) => async (dispatch, store) => {
    dispatch(getInit());

    // await wait(2000);

    const data = await request({ url: `/api/admin/seasons/${season_id}/registrations/${registration_id}`, method: 'GET', store });
    // console.log(data, 'dataaa');
    dispatch(setFormFields(data.data));
};

export const updateRegistrationFieldsByRegId = ({ season_id, registration_id, fields, removedIds }) => async (dispatch, store) => {
    const data = await request({ url: `/api/admin/seasons/${season_id}/registrations/${registration_id}`, method: 'PUT', body: { season_id, registration_id, fields, removedIds }, store });
    console.log(data, 'updateRegistrationFieldsByRegId');
    dispatch(setFormFields(data.data.fields));
    return data.data.deleted;
};


export const getRegistration = ({ registration_id }) => async (dispatch, store) => {
    dispatch(getInit());

    // await wait(2000);

    const data = await request({ url: `/api/register/${registration_id}`, method: 'GET', store });
    console.log(data, 'dataaa in getRegistration');
    dispatch(setFormFields(data.data));
};

export const submitPlayerRegistration = ({ registration_id, fields }) => async (dispatch, store) => {
    console.log(fields, 'dataaaa');


    const data = await request({ url: `/api/register/${registration_id}`, method: 'POST', body: { fields }, store });
    console.log(data, 'dataaa in getRegistration');
};


export default registrationsSlice.reducer;
