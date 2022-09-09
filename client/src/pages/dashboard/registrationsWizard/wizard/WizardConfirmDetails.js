import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import { Routes, Route, Link, useParams } from 'react-router-dom';
// import { useAuth } from '../../hooks';
import { useAuth } from '../../../../hooks';

import { submitPlayerRegistration } from '../../../../redux/slices/registrations';

// const obj


const WizardConfirmDetails = ({ onNext, onBack, formData, registrationFields }) => {
    const { registration_id } = useParams();
    const dispatch = useDispatch();
    const handleSubmit = e => {
        e.preventDefault();
        console.log('SUBMIT TO BACKEND HERE');

        dispatch(submitPlayerRegistration({ registration_id, fields: formData.fields }));
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">

            <h2 className="text-3xl">Confirm Details</h2>


            <p>Press continue to submit form</p>


            <div className="flex justify-between pt-20 px-5">
                <button
                    type="button"
                    className="flex justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                    onClick={onBack}
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="flex justify-center items-center border p-2 transition duration-200 text-sm border-gray-300 rounded bg-primary text-white hover:bg-primary-100 disabled:bg-primary-100 disabled:ring-0 focus:outline-none active:ring active:ring-primary-50"
                >
                    Continue
                </button>
            </div>
        </form>
    );
};

export default WizardConfirmDetails;
