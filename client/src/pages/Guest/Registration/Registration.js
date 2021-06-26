import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, Steps, Collapse } from 'antd';
import { Button } from 'components';
import { CheckOutlined } from '@ant-design/icons';


import './registration.scss';

const expectedName = 'keith'

const fakeData1 = {
    registrationFormName: 'USHL - 2020 Spring Registration Form',
    step1_description: ' \
        <p>Fall season is here! We’ve got a 6 week schedule (this is subject to change), which should \
        be 9/20, 9/27, 10/4, 10/11, 10/18, 10/25. This season we are able to secure Showare Center Arena \
        for all 6 weeks!</p> <br /> <p>There is an age minimum of 30 years old this season. Anyone who is \
        close can email abrinkerhoff@ushl.com to discuss your options as you’ll need pre-approval permissions.\
        </p> <br /> <p>Each player will be assigned to a team based on their skill to ensure teams are even.</p>',
    personalInputs: [
        { label: 'First Name', name: 'first_name', required: true, type: 'text' },
        { label: 'Last Name', name: 'last_name', required: true, type: 'text' },
        { label: 'Birth Date', name: 'birth_date', required: true, type: 'date' },
        { label: 'Phone', name: 'phone', required: true, type: 'text' },
    ],
    teamInputs: [
        { label: 'Requested Team', name: 'requested_team', required: false, type: 'text' },
        { label: 'Previous Team', name: 'previous_team', required: false, type: 'text' },
        { label: 'Skill Level', name: 'skill_level', required: true, type: 'text' },
        { label: 'Preferred Position', name: 'preferred_position', required: false, type: 'text' },
    ],
    step2_description: ' \
        <p>Below is a list of documents for you to read and sign before you are able to proceed. Please \
        ensure all forms are read and signed.</p> <br /> <p>If you have any concerns or questions about \
        these documents, you can email abrinkerhoff@ushl.com to discuss your concerns or questions.</p>',
    step2_important: '\
        Below are the documents that <strong>John Smith</strong> needs to sign before being able to practice and join a team for the 2020 Spring season.',

    step2_waivers: [
        {
            body: 'Lorem ipsum dolor sit amet, or sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in',
            completed: false,
            downloadUrl: null,
            id: 1,
            name: 'injury_waiver',
            title: 'Injury Waiver',
        },
        {
            body: 'Lorem ipsum dolor sit amet, or sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in',
            completed: false,
            downloadUrl: null,
            id: 2,
            name: 'another_waiver',
            title: 'Another Waiver',
        }
    ]
};


// to do =
// make NEXT button be submit button that fires the form's onFinish prop

const Registration = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [fakeData, setFakeData] = useState(fakeData1);
    // const [inputData, setInputDate] = useState(init)
    return (
        <div className="content-container">
            <div className="registration-container box-shadow">
                <div className="registration-header">{fakeData.registrationFormName}</div>
                <div className="registration-body">
                    <div className="hide-mobile" style={{minHeight: 100, borderBottom: '1px solid gray', marginBottom: 24}}>
                        <Steps labelPlacement="vertical" current={currentStep}>
                            <Steps.Step title="Info" />
                            <Steps.Step title="Waivers" />
                            <Steps.Step title="Payment" />
                            <Steps.Step title="Confirmation" />
                        </Steps>

                    </div>

                    <div className="hide-desktop" style={{minHeight: 100, borderBottom: '1px solid gray', marginBottom: 24}}>
                        <Steps className="hide-desktop" current={currentStep}>
                            <Steps.Step title="Info" />
                            <Steps.Step title="Waivers" />
                            <Steps.Step title="Payment" />
                            <Steps.Step title="Confirmation" />
                        </Steps>
                    </div>

                    {currentStep === 0 && step1(fakeData)}
                    {currentStep === 1 && step2(fakeData, setFakeData)}
                    
                    <div className="hide-mobile" style={{minHeight: 50, margin: '24px 0'}}>
                        <Steps direction="horizontal" size="small" current={currentStep}>
                            <Steps.Step />
                            <Steps.Step />
                            <Steps.Step />
                            <Steps.Step />
                        </Steps>
                    </div>

                    <div className="f-justify-between">
                        <Button disabled={currentStep <= 0} title="Back" onClick={() => setCurrentStep(currentStep - 1)} />
                        <Button disabled={currentStep >= 3} title="Next" onClick={() => setCurrentStep(currentStep + 1)} />
                    </div>

                    {/* <Button disabled title="Save & Continue" onClick={() => console.log('clikced')} /> */}
                </div>
            </div>
        </div>
    );
};

export default Registration;

//

/// figure out how to update state of fakedata

//


const step1 = (fakeData) => {
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
                    // form={form}
                    layout="vertical"
                    onFinish={values => console.log(values, 'values')}
                    // className=""
                >
                    <p><strong>Personal Information</strong></p>
                    <p>The fields below are required to so we can contact you. Please ensure all information in the fields are correct before continuing the registration process.</p>

                    <div className="fields-group">
                        {fakeData.personalInputs?.map(item => {
                            return (
                                <Form.Item label={item.label} name={item.name} rules={[{ required: item.required, message: `${item.label} is required` }]}>
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
                                <Form.Item label={item.label} name={item.name} rules={[{ required: item.required, message: `${item.label} is required` }]}>
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

const step2 = (fakeData, setFakeData) => {
    return (
        <div className="section-border">
            <h2>Docs & Waivers</h2>
            {/* <p>{fakeData.description}</p> */}
            <p dangerouslySetInnerHTML={{ __html: fakeData.step2_description}} />

            <div style={{marginTop: '24px'}} />

            <h3>Participant: John Smith</h3>
            {/* <p style={{fontSize: 12}}>
                Below are the documents that <strong>John Smith</strong> needs to sign before being able to practice and join a team for the 2020 Spring season.
            </p> */}

            <p dangerouslySetInnerHTML={{ __html: fakeData.step2_important}} />

            <div style={{marginTop: '24px'}} />

            <Collapse defaultActiveKey={['1']} onChange={key => console.log(key)}>

                {fakeData.step2_waivers.map(waiver => {
                    return (
                        <WaiverCollapse waiver={waiver} fakeData={fakeData1} setFakeData={setFakeData} key={waiver.id} />
                    )
                })}

            </Collapse>
        </div>
    )
}

const WaiverCollapse = ({ waiver, fakeData, setFakeData, ...props }) => {
    const [canSubmit, setCanSubmit] = useState(false);
    const [disabled, setDisabled] = useState(false);
    console.log(props)
    console.log(waiver, 'waiver')
    console.log(fakeData, 'fakd data')
    const handleSubmit = (values) => {
        console.log(values, 'submitting')

        const [name, value] = Object.entries(values)[0]
        setDisabled(true);
        setFakeData({
            ...fakeData, 
            step2_waivers: fakeData.step2_waivers.map(item => {
                if (item.name === name) {
                    if (value === expectedName) {
                        return { ...item, completed: true }
                    }
                    return { ...item, completed: false }
                }
                return item;
            })
        })
    }
    return (
        <Collapse.Panel {...props} header={waiver.title} key={waiver.id} extra={(<p>{waiver.completed ? (<> <CheckOutlined /> Completed </>) : 'Pending Completion'}</p>)}>
            <p className="waiver-container">
                Lorem ipsum dolor sit amet, or sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in
            </p>

            <p className="m-t-xl m-b-s">
                By entering my name in the box below, I agree to the terms of the waiver.
            </p>

            <Form
                layout="vertical"
                // onFinish={values => console.log(values)}
                onFinish={handleSubmit}
                className="f-align-start"
                onFieldsChange={(changedFields) => {
                    // const name = changedFields[0]?.name[0]
                    // console.log(changedFields, 'changed fields')
                    const value = changedFields[0]?.value

                    setCanSubmit(expectedName === value)
                }}
            >

                <Form.Item name={waiver.name} rules={[{ required: true, message: `Signature is required` }]}>
                    <Input type="text" style={{minHeight: 42}} disabled={disabled}/>
                </Form.Item>

                <div style={{marginRight: 24}} />

                <Button disabled={!canSubmit} htmlType="submit" title="Sign Waiver" />
            </Form>
        </Collapse.Panel>
    )
}