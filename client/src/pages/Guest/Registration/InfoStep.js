import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
// import { Form, Input, InputNumber, Steps, Collapse, Checkbox, Radio } from 'antd';


const InfoStep = ({fakeData, form}) => {
    return (
        <>
            <div className="section-border">
                <h2>Player Information</h2>
                {/* <p>{fakeData.description}</p> */}
                <p dangerouslySetInnerHTML={{ __html: fakeData.step1_description}} />

                <p style={{fontSize: 12, fontStyle: 'italic', marginTop: '24px'}}>
                    All fields with an <span style={{color: 'red'}}>*</span> are required. You will not be able to continue through the form if a field is left unfilled.
                </p>
            </div>

            <div className="registration-form">


                <Form
                    form={form}
                    layout="vertical"
                    onFinish={values => console.log(values, 'values')}
                    // onFieldsChange={changes => {
                    //     console.log(changes, 'haha')
                    // }}
                    // className=""
                >
                    <p><strong>Personal Information</strong></p>
                    <p>The fields below are required to so we can contact you. Please ensure all information in the fields are correct before continuing the registration process.</p>

                    <div className="fields-group">
                        {fakeData.personalInputs?.map(item => {
                            return (
                                <Form.Item key={item.name} label={item.label} name={item.name} rules={[{ required: item.required, message: `${item.label} is required` }]}>
                                    <Input type={item.type}/>
                                </Form.Item>
                            )
                        })}
                    </div>

                    <p><strong>Team Information</strong></p>
                    <p>The fields below are required to so we can contact you. Please ensure all information in the fields are correct before continuing the registration process.</p>

                    <div className="fields-group">
                        {fakeData.teamInputs?.map(item => {
                            return (
                                <Form.Item key={item.name} label={item.label} name={item.name} rules={[{ required: item.required, message: `${item.label} is required` }]}>
                                    <Input type={item.type}/>
                                </Form.Item>
                            )
                        })}

                    </div>
                </Form>
            </div>
        </>
    )
}

export default InfoStep;

InfoStep.propTypes = {
    fakeData: PropTypes.object,
    form: PropTypes.object,
};
