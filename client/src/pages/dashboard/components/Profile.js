import React from 'react';

import { useForm } from '../../../hooks';

const FORM_FIELDS = {
    first_name: '',
    last_name: '',
    email: '',
    start_date: '',
};

const VALIDATIONS = {
    first_name: {
        required: true,
    },
    last_name: {
        required: true,
    },
    email: {
        required: true,
        // TODO:
        // backend should check if email is changed
        // if it's changed, send email confirmation to new email
        // do not update email until emailed confirmation is clicked
    },
};

const Profile = () => {
    const { fields, handleChange, errors, validate } = useForm(FORM_FIELDS);


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(fields);

        const isValidated = validate(VALIDATIONS);
        console.log(isValidated, 'is validated');
        if (!isValidated) return;

        console.log('successssssssss handlesubmit');
    };

    return (
        <div>

            <form className="bg-pink-200 lg:max-w-xl" onSubmit={handleSubmit}>

                <div className="sm:flex gap-6">


                    <div className="py-3 w-full">
                        <label htmlFor="first_name" className="text-sm">First Name</label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            className="w-full border py-2 text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                            value={fields.first_name}
                            onChange={handleChange}
                        />

                        {errors.first_name && (
                            <p className="mt-1 text-red-500 text-xs pl-1">{errors.first_name}</p>
                        )}
                    </div>


                    <div className="py-3 w-full">
                        <label htmlFor="last_name" className="text-sm">Last Name</label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            className="w-full border py-2 text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                            value={fields.last_name}
                            onChange={handleChange}
                        />

                        {errors.last_name && (
                            <p className="mt-1 text-red-500 text-xs pl-1">{errors.last_name}</p>
                        )}
                    </div>

                </div>


                <div className="py-3">
                    <label htmlFor="email" className="text-sm">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        className="w-full border py-2 text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                        value={fields.email}
                        onChange={handleChange}
                    />

                    {errors.email && (
                        <p className="mt-1 text-red-500 text-xs pl-1">{errors.email}</p>
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

export default Profile;


// Profile Tab
// <p>first name</p>
// <p>last name</p>
// <p>email</p>
// <p>gender?</p>


// <button>save button</button>
