import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
// import { useAuth } from '../../hooks';
import { useAuth } from '../../../../hooks';
import { wait } from '../../../../utils';

const VALIDATIONS = {
    'register-as': {
        required: {
            message: 'Please select an option below',
        },
    },
};


const WizardSelectPlayer = ({ onNext, onBack, formData }) => {
    const user = useAuth();
    const { fields, handleChange, errors, validate, setFieldsDangerously, resetForm } = formData;

    const handleSubmit = async e => {
        e.preventDefault();

        const isValidated = validate(VALIDATIONS, false);
        console.log(isValidated, 'isvalidated');

        if (!isValidated) return;

        let registeringPlayer;
        if (fields['register-as'] === String(0)) {
            registeringPlayer = {};
        } else if (fields['register-as'] === String(user.id)) {
            registeringPlayer = user;
        } else {
            registeringPlayer = user.associated_accounts.find(item => fields['register-as'] === String(item.id));
        }

        // TODO: figure out a way to not overwrite form fields if registeringPlayer is not changed

        setFieldsDangerously({
            'First Name': registeringPlayer.first_name,
            'Last Name': registeringPlayer.last_name,
            'Phone Number': registeringPlayer.phone_number,
            'register-as': fields['register-as'],
        }, true);

        onNext();
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="p-4 pb-0 max-w-lg mx-auto">
                <h2 className="text-xl">Who would you like to register?</h2>
                <p className="text-sm">We noticed previous registrations tied to your account. You can register an existing player, or create a new one</p>
            </div>

            {errors['register-as'] && (
                <p className="pt-6 text-center text-red-500 text-sm pl-1">{errors['register-as']}</p>
            )}

            <ul className="mb-10 max-w-md mx-auto">


                <li className="flex justify-center pt-6 relative">
                    <input className="sr-only peer" type="radio" value={user.id} name="register-as" id={`register-${user.id}`} onChange={handleChange} checked={fields['register-as'] === String(user.id)} />
                    <label className="flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-db-secondary peer-checked:bg-db-secondary-100 peer-checked:ring-2 peer-checked:border-transparent" htmlFor={`register-${user.id}`}>
                        <div>
                            <h4 className="mb-2 text-center">{user.full_name}</h4>
                            <p className="text-center">(myself)</p>
                        </div>
                    </label>
                </li>
                {user.associated_accounts.map(item => (
                    <li key={item.id} className="flex justify-center pt-6 relative">
                        <input className="sr-only peer" type="radio" value={item.id} name="register-as" id={`register-${item.id}`} onChange={handleChange} checked={fields['register-as'] === String(item.id)} />
                        <label className="flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-db-secondary peer-checked:bg-db-secondary-100 peer-checked:ring-2 peer-checked:border-transparent" htmlFor={`register-${item.id}`}>
                            <div>
                                <h4 className="text-center">{item.full_name}</h4>
                            </div>
                        </label>

                    </li>
                ))}
            </ul>

            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center w-4/12 mx-auto min-w-[50%] sm:min-w-0">
                    <div className="w-full border-b border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className=" bg-light-gray px-4 text-sm text-gray-500">OR</span>
                </div>
            </div>

            <div className="flex justify-center pt-6 relative">
                <input className="sr-only peer" type="radio" value="0" name="register-as" id="register-new" onChange={handleChange} checked={fields['register-as'] === String(0)} />
                <label className="flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-db-secondary peer-checked:bg-db-secondary-100 peer-checked:ring-2 peer-checked:border-transparent" htmlFor="register-new">
                    <div>
                        <h4 className="text-center">New Player</h4>
                    </div>
                </label>
            </div>


            <div className="flex justify-between pt-20 px-5">
                <button
                    type="button"
                    // className="text-black group relative flex items-center gap-x-4 p-2 text-sm rounded-md hover:bg-primary-100 hover:text-white "
                    className="flex opacity-0 pointer-events-none justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                    // onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                    onClick={onBack}
                >
                    Back
                </button>
                {/* <button
                        type="button"
                        className="text-black group relative flex items-center gap-x-4 p-2 text-sm rounded-md hover:bg-primary-100 hover:text-white "
                        onClick={() => currentStep < steps.length && setCurrentStep(currentStep + 1)}
                    >
                        next step
                    </button> */}

                <button
                    type="submit"
                    // disabled={currentStep === steps.length}
                    // onClick={() => currentStep < steps.length && setCurrentStep(currentStep + 1)}
                    className="flex justify-center items-center border p-2 transition duration-200 text-sm border-gray-300 rounded bg-primary text-white hover:bg-primary-100 disabled:bg-primary-100 disabled:ring-0 focus:outline-none active:ring active:ring-primary-50"
                >
                    Continue
                </button>
            </div>

        </form>
    );
};

export default WizardSelectPlayer;

WizardSelectPlayer.propTypes = {
    onNext: PropTypes.func,
    onBack: PropTypes.func,
    formData: PropTypes.object,
};
