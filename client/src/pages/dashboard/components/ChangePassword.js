/* eslint-disable react/no-array-index-key */
import React from 'react';
import zxcvbn from 'zxcvbn';
import classNames from 'classnames';
import { format, parseISO } from 'date-fns';
import { useForm, useAuth } from '../../../hooks';

const FORM_FIELDS = {
    current_password: '',
    new_password: '',
    confirm_new_password: '',
    start_date: '',
};

const VALIDATIONS = {
    current_password: {
        required: true,
    },
    new_password: {
        required: true,
    },
    confirm_new_password: {
        required: true,
        // TODO:
        // backend should check if email is changed
        // if it's changed, send email confirmation to new email
        // do not update email until emailed confirmation is clicked
    },
};

// const STENGTH_SCORE = {
//     1:
// }

const ChangePassword = () => {
    const { fields, handleChange, errors, validate } = useForm(FORM_FIELDS);
    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(fields);

        const isValidated = validate(VALIDATIONS);
        console.log(isValidated, 'is validated');
        if (!isValidated) return;

        const { score } = zxcvbn(fields.new_password);

        if (score < 4) {
            alert('Please choose a stronger password');
            return;
        }

        alert('Not Set Up');
    };

    console.log(auth, 'atuth')
    // console.log(zxcvbn(fields.new_password), 'new passwrod')

    return (
        <div>

            <form className="lg:max-w-xl" onSubmit={handleSubmit}>


                <div className="py-3 w-full">
                    <label htmlFor="current_password" className="text-sm flex justify-between">
                        <span>Current Password</span>
                        {auth.password_last_updated_at && (
                            <span>Last updated: {format(parseISO(auth.password_last_updated_at), 'LLLL dd, yyyy')} </span>
                        )}
                    </label>
                    <input
                        type="text"
                        id="current_password"
                        name="current_password"
                        className="w-full border py-2 text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                        value={fields.current_password}
                        onChange={handleChange}
                    />

                    {errors.current_password && (
                        <p className="mt-1 text-red-500 text-xs pl-1">{errors.current_password}</p>
                    )}
                </div>


                <div className="py-3 w-full">
                    <label htmlFor="new_password" className="text-sm">New Password</label>
                    <input
                        type="text"
                        id="new_password"
                        name="new_password"
                        className="w-full border py-2 text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                        value={fields.new_password}
                        onChange={handleChange}
                    />

                    {/* <div className="flex gap-2 w-full mt-2">
                        {Array(5).fill().map((item, ind) => {
                            const { score } = zxcvbn(fields.new_password);

                            return (
                                <div className={classNames('bg-gray-300 h-2 rounded w-full', {
                                    'bg-green-500': (score > ind) || (score === ind && fields.new_password.length > 16),
                                })}
                                />
                            );
                        })}
                    </div> */}

                    {errors.new_password && (
                        <p className="mt-1 text-red-500 text-xs pl-1">{errors.new_password}</p>
                    )}
                </div>

                <div className="flex gap-2 w-full">
                    {Array(5).fill().map((_, ind) => {
                        const { score } = zxcvbn(fields.new_password);
                        // console.log({ score, ind });

                        // let myClass = 'bg-gray-300';
                        // if (score > ind) { myClass = 'bg-red-500'; }
                        // if (score >= 3 && score > ind) { myClass = 'bg-yellow-500'; }
                        // if (score >= ind && fields.new_password.length > 16) { myClass = 'bg-green-500'; }

                        return (
                            <div
                                key={ind}
                                className={classNames('bg-gray-300 h-2 rounded w-full', {
                                    'bg-red-500': score > ind && score < 3,
                                    'bg-yellow-500': score >= 3 && score > ind && fields.new_password.length <= 16,
                                    'bg-green-500': score === 4 && fields.new_password.length > 16,
                                })}
                                // className={`h-2 rounded w-full ${myClass}`}
                            />
                        );
                    })}
                </div>

                <div className="py-3">
                    <label htmlFor="confirm_new_password" className="text-sm">Confirm New Password</label>
                    <input
                        type="text"
                        id="confirm_new_password"
                        name="confirm_new_password"
                        className="w-full border py-2 text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                        value={fields.confirm_new_password}
                        onChange={handleChange}
                    />

                    {errors.confirm_new_password && (
                        <p className="mt-1 text-red-500 text-xs pl-1">{errors.confirm_new_password}</p>
                    )}
                </div>


                <button
                    type="submit"
                    className="mt-10 flex justify-center items-center border p-2 transition duration-200 text-sm border-gray-300 rounded bg-primary text-white hover:bg-primary-100 disabled:bg-primary-100 disabled:ring-0 focus:outline-none active:ring active:ring-primary-50"
                >
                    Submit
                </button>

            </form>

        </div>
    );
};

export default ChangePassword;


// Profile Tab
// <p>first name</p>
// <p>last name</p>
// <p>email</p>
// <p>gender?</p>


// <button>save button</button>
