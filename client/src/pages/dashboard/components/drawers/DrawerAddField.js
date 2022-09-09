import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import { useForm } from '../../../../hooks';
import { Dropdown } from '../../../../components/dashboard';
import { Toggle } from '../../../../components';

const inputTypes = [
    // { name: 'View All', value: '' },
    { name: 'Text', value: 'text' },
    { name: 'Select', value: 'select' },
    { name: 'Description', value: 'textarea' },
];

const FORM_FIELDS = {
    label: '',
    field_type: inputTypes[0].value,
    pattern: null,
    locked: false,
    is_required: false,
};

const inlineErrors = {};

const VALIDATIONS = {
    label: {
        required: true,
    },
    field_type: {
        required: true,
    },
};


const DrawerAddField = ({ onClose, visible, section, onAddField }) => {
    const { fields, handleChange, errors, validate, resetForm, setErrors } = useForm({ ...FORM_FIELDS, ...section });

    useEffect(() => { visible && resetForm(); }, [visible]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValidated = validate(VALIDATIONS);

        // console.log(fields, 'FIELDS');
        // console.log(isValidated, 'is validated');

        if (!isValidated) return;

        fields.name = `${fields.label.replace(/\s+/g, '_').toLowerCase()}`; // _${guid()}`;

        const fieldErrors = await onAddField(fields);

        if (fieldErrors) {
            setErrors(fieldErrors);
        } else {
            onClose();
        }
    };


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
                    {/* {isPosting && <Loader />} */}

                    <div className="text-center">
                        <h2 className="text-2xl pt-10 pb-2">Add Field</h2>
                        <h4>{section.section}</h4>
                    </div>

                    <form className="px-6" onSubmit={handleSubmit}>

                        <div className="py-3">
                            <label htmlFor="label" className="text-sm">Field Label</label>
                            <input
                                type="text"
                                id="label"
                                name="label"
                                className="w-full border py-2 text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                                value={fields.label}
                                onChange={handleChange}
                            />

                            {(inlineErrors.label || errors.label) && (
                                <p className="mt-1 text-red-500 text-xs pl-1">{errors.label || inlineErrors.label}</p>
                            )}
                        </div>


                        <div className="py-3 flex justify-between gap-x-4">


                            <div className="w-full">
                                <label htmlFor="type" className="text-sm">Field Type</label>
                                <Dropdown options={inputTypes} onChange={handleChange} value={fields.field_type} name="type" />
                                {(inlineErrors.type || errors.type) && (
                                    <p className="mt-1 text-red-500 text-xs pl-1">{errors.type || inlineErrors.type}</p>
                                )}

                            </div>

                            <div className="">
                                <label htmlFor="is_required" className="text-sm block pb-1">Required</label>
                                <Toggle
                                    noText="No"
                                    yesText="yes"
                                    name="is_required"
                                    // checked={edit.is_active}
                                    // disabled={edit.is_active}
                                />

                                {/* {edit.is_active && (
                                    <p className="leading-tight text-sm">You must set another season as active in order to deactivate this season</p>
                                )} */}

                            </div>
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
                                className="flex justify-center items-center border p-2 px-6 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                                // onClick={() => setIsCreateVisible(true)}
                            >
                                Save
                            </button>
                        </div>


                    </form>


                </div>
            </div>
        </Drawer>

    );
};

export default DrawerAddField;

DrawerAddField.propTypes = {
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    section: PropTypes.object,
    onAddField: PropTypes.func,
};
