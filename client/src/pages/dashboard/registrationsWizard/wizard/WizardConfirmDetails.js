import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import { Routes, Link, useOutletContext, useParams, useLocation } from 'react-router-dom';
// import { useAuth } from '../../hooks';
import { useAuth } from '../../../../hooks';

import { submitPlayerRegistration } from '../../../../redux/slices/registrations';


const WizardConfirmDetails = ({ onNex2t, onBa2ck, formD2ata, mo2del, step }) => {
    const { registration_id } = useParams();
    const { onNext, onBack, formData, model } = useOutletContext();
    const dispatch = useDispatch();
    const location = useLocation();

    const handleSubmit = e => {
        e.preventDefault();

        // dispatch(submitPlayerRegistration({ registration_id, fields: formData.fields, step }));
        onNext();
    };

    console.log({ formData, model });

    // useEffect(() => {
    //     if (!Object) {
    //         navigate(`${location?.pathname}/${steps[0].slug}`, { replace: true });
    //     }
    //     dispatch(getRegistration({ registration_id }));
    // }, []);

    const { 'register-as': n, 'submission-key': n2, ...rest } = formData.fields;

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-2xl m-auto">

            <h2 className="text-3xl">Review Details</h2>


            <p>Please review your information below</p>


            <div className="bg-white p-4 mt-4">
                <div className="flex justify-between pb-4 mb-4 border-b border-gray-300">
                    <h4 className="text-xl">Player Information</h4>

                    <Link
                        // to="/who?from=review"
                        to={`${location.pathname}/../info?from=review`}
                        // className="border whitespace-nowrap border-green-500 rounded inline-flex justify-center gap-x-2 items-center p-2"
                        // className="text-gray-300 group relative flex items-center gap-x-4 p-2 text-sm rounded-md hover:bg-primary-100 hover:text-white "
                        className="flex items-center text-indigo-700 hover:text-indigo-400 duration-200"
                    >
                        Edit
                    </Link>

                    {/* <button
                        type="button"
                        className="absolut top-3 right-3 flex items-center text-indigo-700 hover:text-indigo-400 duration-200"
                    >
                        Edit
                    </button> */}
                </div>
                <ul>
                    {Object.keys(rest).map(item => {
                        // console.log(item, 'tiemem');
                        const a = ""
                        return (
                            <li key={item} className="flex">
                                <p className="w-1/2 md:w-4/12 pr-4 border-r border-gray-300">{item}</p>

                                <p className="pl-4">{rest[item]}</p>
                            </li>

                        );
                    })}
                </ul>
            </div>

            <div className="bg-white p-4 mt-4">
                <div className="flex justify-between pb-4 mb-4 border-b border-gray-300">
                    <h4 className="text-xl">Player Information</h4>
                    <Link
                        to={`${location.pathname}/../who?from=review`}
                        className="flex items-center text-indigo-700 hover:text-indigo-400 duration-200"
                    >
                        Edit (goes to Who step for testing)
                    </Link>
                </div>
                <ul>
                    {Object.keys(rest).map(item => {
                        const a = ""
                        return (
                            <li key={item} className="flex">
                                <p className="w-1/2 md:w-4/12 pr-4 border-r border-gray-300">{item}</p>

                                <p className="pl-4">{rest[item]}</p>
                            </li>

                        );
                    })}
                </ul>
            </div>


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
                    Submit Registration
                </button>
            </div>
        </form>
    );
};

export default WizardConfirmDetails;

WizardConfirmDetails.propTypes = {
    onNext: PropTypes.func,
    onBack: PropTypes.func,
    formData: PropTypes.object,
    model: PropTypes.object,
    step: PropTypes.number,
};
