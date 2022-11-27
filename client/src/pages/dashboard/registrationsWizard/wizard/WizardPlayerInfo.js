import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import classNames from 'classnames';
import PropTypes from 'prop-types';
// import { Drawer } from 'antd';
// import { Routes, Route, Link, Navigate } from 'react-router-dom';
// import { useAuth } from '../../../../hooks';
import Select from 'react-select';
import { useOutletContext } from 'react-router-dom';
import { Toggle } from '../../../../components';


const VALIDATIONS = {
    hellooooo: {
        required: false,
    },
};


const WizardPlayerInfo = ({ onNext2, onBa2ck, for2mData, m2odel }) => {
    const [sectionNames, setSectionNames] = useState([]);
    const [sections2, setSections2] = useState({});

    const { onNext, onBack, formData, model } = useOutletContext();

    const { fields, handleChange, errors, validate, resetForm } = formData;

    // console.log(fields, 'feieleldsss');

    useEffect(() => {
        // probably need to add redirect here if no form data
        if (!model.registration_fields) return;
        sorter(model.registration_fields);

        model.registration_fields.forEach(item => {
            VALIDATIONS[item.label] = { required: item.is_required };
        });
    }, [model.registration_fields]);


    // TODO: move this sorter function to a helper as it's called multple times
    const sorter = (f, forceSectionsUpdate = false) => {
        const b = [...f].sort((a, b) => a.section_display_index - b.section_display_index).reduce((acc, curr) => {
            acc[curr.section] = acc[curr.section] || [];
            acc[curr.section].push(curr);
            acc[curr.section].sort((a, b) => a.display_index - b.display_index);
            return acc;
        }, {});

        const l = Object.keys(b);

        if ((l.length > sectionNames.length) || forceSectionsUpdate) {
            setSectionNames(l);
        }

        setSections2(b);
    };

    const handleSubmit = e => {
        e.preventDefault();
        const isValidated = validate(VALIDATIONS);
        console.log(isValidated, 'isvalidated');

        if (!isValidated) return;
        console.log(fields, 'fieeeeldldlsss on submit');
        onNext();
    };


    // console.log(fields, 'fields');
    // console.log(sections2);

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-2xl m-auto">
            {sectionNames.map(section => {
                const m = '';
                return (
                    <div key={section} className="mb-6">
                        <h3 className="font-semibold text-3xl ">{section}</h3>

                        {sections2[section] && sections2[section].map(field => {
                            const l = '';

                            return (
                                <div key={field.field_id} className="">

                                    {renderInputType(field, formData)}
                                </div>

                            );
                        })}
                        <div className="bg-gray-200 h-3 rounded mt-4" />
                    </div>
                );
            })}

            <div className="flex justify-between pt-20 px-5">
                <button
                    type="button"
                    className="flex justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                    onClick={onBack}
                >
                    Back
                </button>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => console.log('Save and exiting')}
                        // className="flex justify-center items-center border p-2 transition duration-200 text-sm border-gray-300 rounded bg-primary text-white hover:bg-primary-100 disabled:bg-primary-100 disabled:ring-0 focus:outline-none active:ring active:ring-primary-50"
                        className="flex justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                    >
                        Save & Exit
                    </button>

                    <button
                        type="submit"
                        className="flex justify-center items-center border p-2 transition duration-200 text-sm border-gray-300 rounded bg-primary text-white hover:bg-primary-100 disabled:bg-primary-100 disabled:ring-0 focus:outline-none active:ring active:ring-primary-50"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </form>
    );
};

export default WizardPlayerInfo;

WizardPlayerInfo.propTypes = {
    onNext: PropTypes.func,
    onBack: PropTypes.func,
    formData: PropTypes.object,
    model: PropTypes.object,
};


// ADD SELECT AND CHECKBOX INPUT TYPES

// react-select


const renderInputType = (field, formData) => {
    // console.log(field, 'tieemmm');
    const { fields, handleChange, errors } = formData;

    switch (field.field_type) {
        case 'text':
            // return <input type="text" className="w-full border p-0.5 m-0 text-sm border-gray-300 rounded disabled:bg-gray-50 disabled:cursor-not-allowed" disabled />;
            return (
                <div className="py-3">
                    <label htmlFor={field.label} className="text-sm">{field.label}</label>
                    <input
                        type="text"
                        id={field.label}
                        name={field.label}
                        className="w-full border scroll-mt-10 py-2 text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                        value={fields[field.label] || ''}
                        onChange={handleChange}
                    />

                    {errors[field.label] && (
                        <p className="mt-1 text-red-500 text-xs pl-1">{errors[field.label]}</p>
                    )}
                </div>
            );
        case 'checkbox':
            return (
                <div className="py-3">

                    <Toggle
                        // disabled
                        label={field.label}
                        name={field.label}
                        checked={fields[field.label] === 'Yes'}
                        onChange={e => handleChange(e, e.target.checked ? 'Yes' : 'No', field.label)} // {value: 'XS', label: 'Extra Small'} 'eee'
                    />

                    {/* {field.label} */}

                </div>
            );
        case 'select': {
            const formattedFieldOptions = Object.keys(field.options).map(opt => ({ value: opt, label: field.options[opt] }));
            // console.log(fields[field.label], 'fields[field.label] fields[field.label]')
            return (
                <div className="py-3">
                    <label htmlFor={field.label} className="text-sm">{field.label}</label>
                    <Select
                        onChange={e => handleChange(e, e.label, field.label)} // {value: 'XS', label: 'Extra Small'} 'eee'
                        options={formattedFieldOptions}
                        // className="w-full border scroll-mt-10 py-2 text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                        // getOptionValue={(option) => option}
                        // value={fields[field.label] || ''}
                        value={formattedFieldOptions.find(item => item.value === fields[field.label])}
                    />

                    {errors[field.label] && (
                        <p className="mt-1 text-red-500 text-xs pl-1">{errors[field.label]}</p>
                    )}
                </div>
            );
        }
        default:
            return null;
    }
};
