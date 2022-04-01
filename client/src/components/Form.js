import React from 'react';
import PropTypes from 'prop-types';
// import { Form as AntForm, Input as AntIntput, Select as AntSelect, Checkbox as AntChecbox } from 'antd';
import { Form as AntForm, Input as AntIntput, Select as AntSelect } from 'antd';



// const formFields = {
//     email: {
//         type: 'email',
//         label: 'auth.login.email_label',
//     },
//     password: {
//         type: 'password',
//         label: 'auth.login.password_label',
//     },
//     remember_me: {
//         type: 'checkbox',
//         label: 'auth.login.remember_label',
//         required: false,
//     },
// };

// const formFields = [
//     {
//         style: {},
//         fields: {
//             logo_path: {
//                 label: 'Logo',
//                 type: 'image',
//                 width: 150,
//                 ratio: 1,
//                 required: false,
//             },
//         },
//     },
//     {
//         style: {},
//         fields: {
//             name: {
//                 label: 'Name',
//                 required: true,
//                 style: {},
//                 columns: 8,
//             },
//             size: {
//                 label: 'Company size',
//                 type: 'select',
//                 required: true,
//                 options: [{ label: '0-10', value: 1 }, { label: '11-50', value: 2 }, { label: '51-100', value: 3 }],
//                 style: {},
//                 columns: 4,
//             },
//         },
//     },
//     {
//         style: {},
//         fields: {
//             industry_id: {
//                 label: 'What industry are you in?',
//                 type: 'select',
//                 required: true,
//                 // options: [1, 2, 4, 5],
//                 options: [{ label: 'Food & Beverage', value: 1 }, { label: 'Hospitality', value: 2 }, { label: 'IT', value: 3 }, { label: 'Car Sales', value: 4 }],
//                 style: {},
//             },
//             location: {
//                 label: 'Where are you located?',
//                 type: 'location',
//                 required: false,
//                 style: {},
//             },
//         },
//     },
// ];


// const formFields = [
//     {
//         style: {},
//         fields: {
//             total_price: {
//                 label: 'Season Price',
//                 type: 'text',
//                 // width: 150,
//                 // ratio: 1,
//                 required: false,
//                 rules: [],
//                 placeholder: 'Enter Price',
//             },
//             estimated_transactions: {
//                 label: 'Estimated Transactions',
//                 type: 'text',
//                 // width: 150,
//                 // ratio: 1,
//                 required: false,
//                 placeholder: 'Enter Transactions Count',
//             },
//         },
//     },
//     {
//         style: {},
//         fields: {
//             additional_percentage: {
//                 label: 'Additional Percentage',
//                 type: 'text',
//                 required: true,
//                 style: {},
//                 columns: 8,
//             },
//             additional_cents: {
//                 label: 'Additional Cents',
//                 type: 'text',
//                 required: true,
//                 // options: [{ label: '0-10', value: 1 }, { label: '11-50', value: 2 }, { label: '51-100', value: 3 }],
//                 // style: {},
//                 columns: 4,
//             },
//         },
//     },
//     {
//         style: {},
//         fields: {
//             industry_id: {
//                 label: 'What industry are you in?',
//                 type: 'select',
//                 required: true,
//                 // options: [1, 2, 4, 5],
//                 options: [{ label: 'Food & Beverage', value: 1 }, { label: 'Hospitality', value: 2 }, { label: 'IT', value: 3 }, { label: 'Car Sales', value: 4 }],
//                 style: {},
//             },
//             location: {
//                 label: 'Where are you located?',
//                 type: 'location',
//                 required: false,
//                 style: {},
//             },
//         },
//     },
// ];

const Form = (props) => {

    const { title, subTitle, fields, onSubmit, className } = props;
    const renderField = (fieldName, params) => {
        // console.log(fieldName, params);

        const key = `input${fieldName}`;

        if (React.isValidElement(params)) {
            return (
                <div key={key} className="field-element">{params}</div>
            );
        }

        const options = { ...params, fieldName };

        // console.log(fieldName, options, ' OOPTSIOMS');

        let component;
        let className;

        switch (options.type) {
        case 'select':
            component = <RenderSelect {...options} />;
            break;
        case 'text':
        default:
            component = <RenderInput {...options} />;
            break;
        }


        // console.log(`${((options.columns || 12) / 12) * 100}%`, '{((options.columns || 12) / 12) * 100}%')
        return (
            <div
                key={key}
                style={{ flexBasis: `${((options.columns || 12) / 12) * 100}%`, ...options.style || {} }}
                className={className || 'field'}
            >

                {component}

            </div>
        );
    };

    const fieldSections = () => {
        // const { fields } = props;
        // const fields = formFields;

        let fieldSections = [{
            style: { background: 'transparent' },
            fields,
        }];

        if (Array.isArray(fields)) {
            fieldSections = fields;
        }

        return fieldSections;
    };


    const renderFieldSection = (fieldSection, key) => {
        // console.log(fieldSection, key, 'fieldSection, key')
        const { style = {}, fields, className = 'field-section' } = fieldSection;

        if (!fields) return <p>Empty Form</p>;
        return (
            <div
                key={`section${key}`}
                className={className}
                style={style}
            >

                {Object.keys(fields).length > 0 && Object.keys(fields).map((fieldName, i) => {
                    const sectionsFields = fields[fieldName];

                    if (sectionsFields.fields) {
                        const section = {
                            style: sectionsFields.style || {},
                            fields: sectionsFields.fields,
                        };

                        return (
                            <div
                                className={`field-section-group ${fieldSection.groupClass || ''}`}
                                style={fieldSection.groupStyle || {}}
                                key={`field-section-group-${i}`}
                            >
                                {renderFieldSection(section)}
                            </div>
                        );
                    }

                    return renderField(fieldName, fields[fieldName]);
                })}
            </div>
        );
    };

    return (
        <div className={`pml-form ${className}`}>
            <div className="form-container">
                <AntForm
                    layout="vertical"
                    className="haha"
                    // use object.assign to merge array of objects into one object
                    // initialValues={Object.assign({}, ...data.fields.map(item => ({ [item.name]: item.defaultValue })))}
                    // onFinish={data.confirmAction}
                    // onFinish={values => console.log(values)}
                    onFinish={onSubmit}
                >
                    {title && <h1>{title}</h1>}
                    {React.isValidElement(subTitle) ? subTitle : <p>{subTitle}</p>}

                    <div className="p-t-m" />

                    {fieldSections().map(renderFieldSection)}

                    <button type="submit">Submit</button>
                </AntForm>
            </div>
        </div>
    );
};

export default Form;


const RenderInput = ({ ...options }) => {
    // console.log(options, 'toponnss')
    // return (<p>Default Input</p>)

    console.log(options, 'options')

    const rules = [];

    if (!options.rules) {
        if (options.required) {
            rules.push({ required: true });
        }
    }

    // ADD OPTIONAL LABEL IF REQUIRED IS NOT TRUE

    return (
        <AntForm.Item label={options.label} name={options.fieldName} rules={options.rules || rules}>
            <AntIntput placeholder={options.placeholder} disabled={options.disabled} />
        </AntForm.Item>
    );
};

const RenderSelect = ({ ...options }) => {
    // console.log(options, 'topionss')

    // options.options = options.options.map(day => {
    //     return {
    //         label: String(day),
    //         value: day,
    //     };
    // });
    return (
        <AntForm.Item label={options.label} name={options.fieldName} rules={options.rules}>
            <AntSelect>
                {options.options.map(item => <AntSelect.Option key={item.label} value={item.value}>{item.label}</AntSelect.Option>)}
            </AntSelect>
        </AntForm.Item>
    );
};

// const RenderCheckbox = ({ ...options }) => {
//     return (
//         <Form.Item name={options.name} valuePropName="checked">
//             <AntChecbox>{options.label}</AntChecbox>
//         </Form.Item>
//     );
// };


Form.propTypes = {
    fields: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.arrayOf(PropTypes.object),
    ]),
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func,
    title: PropTypes.string,
    subTitle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
    className: PropTypes.string,
};
