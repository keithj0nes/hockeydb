import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer } from 'antd';
import classNames from 'classnames';
import { Dropdown } from '../../../components/dashboard';
import { Toggle, Loader } from '../../../components';
import { createSeason, clearErrors } from '../../../redux/slices/seasons';
import { useForm } from '../../../hooks';

// TODO: USE seasonTypes IN REDUX INSTEAD OF THIS

// TODO: allow user to create a location in this drawer

const seasonTypes = [
    { name: 'View All', value: '' },
    { name: 'Regular', value: 'Regular' },
    { name: 'Playoffs', value: 'Playoffs' },
    { name: 'Tournament', value: 'Tournament' },
];

const FORM_FIELDS = {
    name: '',
    type: '',
    copy_from: '',
    start_date: '',
};

const VALIDATIONS = {
    name: {
        required: true,
    },
    // type: {
    //     required: true,
    //     pattern: {
    //         value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
    //         // message: `Year must be between ${validFromYear} and ${validToYear}`,
    //         message: 'Please enter a valid phone number'
    //     },
    // },
    // start_date: {
    //     required: true,
    // },
};

const DrawerCreateSeason = ({ onClose, visible, edit }) => {
    const [showCopyFrom, setShowCopyFrom] = useState(false);
    const { fields, handleChange, errors, validate, resetForm } = useForm({ ...FORM_FIELDS, ...edit });

    const dispatch = useDispatch();
    const b = useSelector((state) => state.seasons);
    // console.log(b, 'bbbb')

    const { inlineErrors, isPosting } = b;

    useEffect(() => { visible && resetComponent(); }, [visible]);

    const resetComponent = () => {
        resetForm();
        dispatch(clearErrors());
        setShowCopyFrom(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValidated = validate(VALIDATIONS);

        // console.log(fields, 'FIELDS');
        // console.log(isValidated, 'is validated');

        if (!isValidated) return;

        let success = false;

        if (!!edit) {
            // TODO: Need to finish edit with redux and node
            success = true;
        } else {
            success = await dispatch(createSeason(fields));
        }

        // const success = await dispatch(createSeason(fields));

        if (success) {
            onClose();
        }
    };


    // TODO: add newly created season to the redux state on createSeason


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

                    <h2 className="text-center text-2xl pt-10 pb-2">{!!edit ? 'Edit' : 'Create'} Season</h2>

                    <form className="px-6" onSubmit={handleSubmit}>

                        <div className="py-3">
                            <label htmlFor="name" className="text-sm">Season Name</label>
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
                            <label htmlFor="type" className="text-sm">Season Type</label>
                            <Dropdown
                                options={[...seasonTypes].slice(1)}
                                name="type"
                                onChange={handleChange}
                                value={fields.type}
                            />

                            {errors.type && (
                                <p className="mt-2 text-red-500 text-xs pl-1">{errors.type}</p>
                            )}
                        </div>

                        <div className="py-3">
                            <label htmlFor="start_date" className="text-sm">Expected Start Date</label>
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                className="w-full border py-2 text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                                value={fields.start_date}
                                onChange={handleChange}
                            />

                            {(inlineErrors.start_date || errors.start_date) && (
                                <p className="mt-1 text-red-500 text-xs pl-1">{errors.start_date || inlineErrors.start_date}</p>
                            )}
                        </div>


                        {/* this should only be displayed on edit - should not be able to set active season on newly created season */}
                        {/* <div className="my-3">
                            <label className="text-sm block">Set to active season</label>
                            <Toggle />
                        </div> */}

                        {!!edit && (
                            <div className="my-3">
                                <label className="text-sm block pb-1">Set to active season</label>
                                <Toggle
                                    checked={edit.is_active}
                                    disabled={edit.is_active}
                                />

                                {edit.is_active && (
                                    <p className="leading-tight text-sm">You must set another season as active in order to deactivate this season</p>
                                )}

                            </div>
                        )}

                        {!edit && (
                            <>
                                <div className="py-3">
                                    <label className="text-sm block pb-1">Copy from previous season?</label>
                                    {/* <Toggle onChange={e => console.log(e.target.checked, 'eee')} /> */}
                                    <Toggle
                                        onChange={e => setShowCopyFrom(e.target.checked)}
                                        checked={showCopyFrom}
                                    />

                                </div>
                                <div className={classNames({ 'invisible h-0': !showCopyFrom, 'visible h-auto': showCopyFrom })}>
                                    <label htmlFor="type1" className="text-sm">Choose season to copy:</label>
                                    <Dropdown options={[...seasonTypes].slice(1)} name="type1" />
                                </div>
                            </>
                        )}


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
                                {!!edit ? 'Edit' : 'Create'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </Drawer>

    );
};

export default DrawerCreateSeason;

DrawerCreateSeason.propTypes = {
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    edit: PropTypes.object,
};
