import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
// import { useAuth } from '../../hooks';
import { useAuth } from '../../../../hooks';

// const obj


const VALIDATIONS = {
    hellooooo: {
        required: false,
    },
};


const WizardPlayerInfo = ({ onNext, onBack, formData, registrationFields }) => {
    // console.log(registrationFields, 'registrationFields');

    const [sectionNames, setSectionNames] = useState([]);
    const [sections2, setSections2] = useState({});

    const { fields, handleChange, errors, validate, resetForm } = formData;


    useEffect(() => {
        sorter(registrationFields);

        registrationFields.forEach(item => {
            VALIDATIONS[item.label] = { required: item.is_required };
        });
    }, [registrationFields]);


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
        console.log(fields, 'fieeeeldldlsss on submit')
        onNext();
    };


    return (
        <form onSubmit={handleSubmit} className="p-4">
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

export default WizardPlayerInfo;

WizardPlayerInfo.propTypes = {
    onNext: PropTypes.func,
    onBack: PropTypes.func,
    formData: PropTypes.object,
    registrationFields: PropTypes.array,
};


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
        // case 'checkbox':
        //     return <Toggle disabled checked />;
        default:
            return null;
    }
};
