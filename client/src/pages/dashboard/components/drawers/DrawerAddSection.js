import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import { useForm } from '../../../../hooks';
// import { Dropdown } from '../../../../components/dashboard';
// import { Toggle } from '../../../../components';


const FORM_FIELDS = {
    section: '',
    // description: '',
};

const VALIDATIONS = {
    section: {
        required: true,
    },
    // type: {
    //     required: true,
    // },
};


const DrawerAddSection = ({ onClose, visible, section, onAddSection }) => {
    const { fields, handleChange, errors, validate, resetForm, setErrors } = useForm({ ...FORM_FIELDS, ...section });

    useEffect(() => { visible && resetForm(); }, [visible]);

    // console.log(section,' SECCIONNNN ')

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValidated = validate(VALIDATIONS);

        console.log(fields, 'FIELDS');
        console.log(isValidated, 'is validated');

        if (!isValidated) return;

        // fields.name = `${fields.label.replace(/\s+/g, '_').toLowerCase()}`; // _${guid()}`;

        const fieldErrors = await onAddSection({ ...fields, old_section_name: section.section });

        console.log(fieldErrors, 'fieldErrors');

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
                        <h2 className="text-2xl pt-10 pb-2">Add Section</h2>
                        {/* <h4>{section.section}</h4> */}
                    </div>

                    <form className="px-6" onSubmit={handleSubmit}>

                        <div className="py-3">
                            <label htmlFor="label" className="text-sm">Field Label</label>
                            <input
                                type="text"
                                id="section"
                                name="section"
                                className="w-full border py-2 text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                                value={fields.section}
                                onChange={handleChange}
                            />

                            {errors.section && (
                                <p className="mt-1 text-red-500 text-xs pl-1">{errors.section}</p>
                            )}
                        </div>

                        <div className="pt-12 flex justify-end gap-x-2">
                            <button
                                type="button"
                                className="flex justify-center items-center p-2 text-sm rounded focus:outline-none active:ring active:ring-gray-200"
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

export default DrawerAddSection;

DrawerAddSection.propTypes = {
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    section: PropTypes.object,
    onAddSection: PropTypes.func,
};
