import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer } from 'antd';
import classNames from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '../../../../hooks';
import { Dropdown } from '../../../../components/dashboard';
import { createRegistration } from '../../../../redux/slices/seasons';
import { Loader } from '../../../../components';

const seasonTypes = [
    { name: 'None', value: '' },
    { name: 'Open Season Template', value: 'ost' },
];

const FORM_FIELDS = {
    name: '',
    duplicate_from: '',
};

const VALIDATIONS = {
    name: {
        required: true,
    },
};

const inlineErrors = {};

const DrawerCreateRegistration = ({ onClose, visible }) => {
    const { fields, handleChange, errors, validate, resetForm, setErrors } = useForm(FORM_FIELDS);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();


    const { isPosting } = useSelector((state) => state.seasons);


    useEffect(() => { visible && resetComponent(); }, [visible]);

    const resetComponent = () => {
        resetForm();
        // dispatch(clearErrors());
        // setShowCopyFrom(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValidated = validate(VALIDATIONS);

        console.log(fields, 'FIELDS');
        console.log(isValidated, 'is validated');



        if (!isValidated) return;

        // submit to redux here
        const error = await dispatch(createRegistration({ ...fields, season_id: params.id }));

        console.log(error, 'sucess')
        // if success, redirect to new regstration page

        if (error) {
            // navigate('./registrations/5354');
            setErrors(error);
            return;
        }
        console.log('REDIRECT HERE');
    };

    console.log(errors,' errrororrrss')

    return (
        <Drawer
            maskClosable // true by default -> set to false if has been edited to avoid accidentally closing
            width="360px"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            className="floating"
        >
            <div className="p-3 h-full">
                <div className="bg-light-gray w-full h-full rounded-md relative">
                    {isPosting && <Loader />}

                    <h2 className="text-center text-2xl pt-10 pb-2">Create Registration</h2>

                    <form className="px-6" onSubmit={handleSubmit}>

                        <div className="py-3">
                            <label htmlFor="name" className="text-sm">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="w-full border py-2 text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                                value={fields.name}
                                onChange={handleChange}
                            />

                            {(inlineErrors.name || errors.name) && (
                                <p className="mt-1 text-red-500 text-xs pl-1">{errors.name || inlineErrors.name}</p>
                            )}
                        </div>


                        <div className="py-3">
                            <label htmlFor="type" className="text-sm">Template</label>
                            <Dropdown
                                options={seasonTypes}
                                name="duplicate_from"
                                onChange={handleChange}
                                value={fields.duplicate_from}
                            />

                            {errors.duplicate_from && (
                                <p className="mt-2 text-red-500 text-xs pl-1">{errors.duplicate_from}</p>
                            )}
                        </div>

                        <div className="pt-12 flex justify-end gap-x-2">
                            <button
                                type="button"
                                className="flex justify-center items-center  p-2 text-sm  rounded focus:outline-none active:ring active:ring-gray-200"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                                // onClick={() => setIsCreateVisible(true)}
                            >
                                Create
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </Drawer>
    );
};

export default DrawerCreateRegistration;

DrawerCreateRegistration.propTypes = {
    onClose: PropTypes.func,
    visible: PropTypes.bool,
};
