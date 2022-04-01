import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Collapse } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { Button } from 'components';

const WaiverStep = ({ fakeData, setFakeData, form, userInputedValues, openPanelKey, setOpenPanelKey }) => {
    // console.log(userInputedValues, 'userInputedValues')
    return (
        <div className="section-border">
            {/* <h2>Docs & Waivers</h2> */}
            <h2>Waivers</h2>
            {/* <p>{fakeData.description}</p> */}
            <p dangerouslySetInnerHTML={{ __html: fakeData.step2_description }} />

            <div style={{ marginTop: '24px' }} />

            <h3>Participant: {userInputedValues.first_name} {userInputedValues.last_name}</h3>
            {/* <p style={{fontSize: 12}}>
                    Below are the documents that <strong>John Smith</strong> needs to sign before being able to practice and join a team for the 2020 Spring season.
                </p> */}

            <p dangerouslySetInnerHTML={{ __html: fakeData.step2_important }} />

            <div style={{ marginTop: '24px' }} />

            <Form
                form={form}
                // onFinish={values => console.log(values, 'VALUES HAHA')}
                // onFinish={() => setOpenPanelKey(openPanelKey + 1)}
                onFinish={values => {
                    console.log(values, 'VALUES ON FINISH OPEN PANEL');

                    const [entry] = Object.entries(values);
                    console.log(entry[0], entry[1], 'key balueeeee');
                    // form.setFieldsValue({ [waiver.name]: e.target.value?.toUpperCase() });
                    form.setFieldsValue({ [entry[0]]: entry[1]?.toUpperCase() });

                    setOpenPanelKey('next');

                    // TO DO

                    // formStep2 waivers should be updated here
                    // it is currently being updated on line 451 via onchange
                }}
            >
                <Collapse activeKey={openPanelKey} onChange={e => setOpenPanelKey(e)}>

                    {fakeData.step2_waivers.map((waiver, index) => (
                        <WaiverCollapse
                            key={waiver.id}
                            isLastWaiver={fakeData.step2_waivers.length === index + 1}
                            waiver={waiver}
                            fakeData={fakeData}
                            setFakeData={setFakeData}
                            form={form}
                            userInputedValues={userInputedValues}
                            setOpenPanelKey={setOpenPanelKey}
                        >
                            {console.log(fakeData.step2_waivers.length, index)}
                        </WaiverCollapse>
                    ))}

                </Collapse>
            </Form>
        </div>
    );
};

export default WaiverStep;

WaiverStep.propTypes = {
    fakeData: PropTypes.object,
    form: PropTypes.object,
    setFakeData: PropTypes.func,
    userInputedValues: PropTypes.object,
    // openPanelKey: PropTypes.array,
    openPanelKey: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.array,
    ]),
    setOpenPanelKey: PropTypes.func,
};


const WaiverCollapse = ({ waiver, fakeData, isLastWaiver, setFakeData, form, userInputedValues, setOpenPanelKey, ...props }) => {
    const [canSubmit, setCanSubmit] = useState(false);
    const [disabled] = useState(false);
    const [myValue, setMyValue] = useState('');
    const expectedName2 = `${userInputedValues.information?.first_name?.[1]} ${userInputedValues.information?.last_name?.[1]}`;

    useEffect(() => {
        setCanSubmit(!!validateSign(myValue, expectedName2));
    }, [myValue, expectedName2]);

    console.log(userInputedValues.information?.first_name?.[1], 'userInputedValues')


    const handleFormChange = e => {
        setMyValue(e.target.value?.toUpperCase());
    };

    const validateWaiver = () => {
        if (!myValue || validateSign(myValue, expectedName2)) {
            return Promise.resolve();
        }
        return Promise.reject('Please sign initials');
    };

    return (
        <Collapse.Panel {...props} collapsible="header" header={waiver.label} key={waiver.id} extra={(<p>{canSubmit ? (<> <CheckOutlined style={{ color: '#4F9300' }} /> Completed </>) : 'Pending Completion'}</p>)}>

            <p className="waiver-container">{waiver.body}</p>

            <div className="m-t-xl m-b-s f-justify-between">
                <p>By entering my name in the box below, I agree to the terms of the waiver.</p>

                <Button title="Download Waiver" type="link" onClick={() => console.log('ONCLICK: create modal with list of PDF waivers to choose from')} />
            </div>

            <div className="sign-download-container">

                <div className="f-align-start">

                    <Form.Item
                        name={waiver.name}
                        style={{ marginBottom: 0 }}
                        validateTrigger="onBlur"
                        rules={[
                            { required: true, message: 'Initials are required' },
                            { validator() { return validateWaiver(); } },
                        ]}
                    >
                        <Input type="text" style={{ minHeight: 42, textTransform: 'uppercase' }} disabled={disabled || !!waiver.signed} value={myValue} onChange={handleFormChange} />
                    </Form.Item>

                    <div style={{ marginRight: 24 }} />

                    {!isLastWaiver && canSubmit && (
                        <Button disabled={!canSubmit || disabled} title="NEXT" onClick={() => setOpenPanelKey('next')} />
                    )}
                </div>

                <p>{canSubmit ? (<> <CheckOutlined style={{ color: '#4F9300' }} /> Completed </>) : 'Pending Completion'}</p>


                {/* <div className="p-b-m" /> */}
                {/* <Button title="Download Waiver" type="link" onClick={() => console.log('ONCLICK: create modal with list of PDF waivers to choose from')}/> */}
            </div>

        </Collapse.Panel>
    );
};

// this function allows user to enter full name or initials
// returns inputted value if pass or false if fail
function validateSign(userValue, expectedValue) {
    const fullName = expectedValue.split(' ');
    const initials = fullName.shift().charAt(0).toUpperCase() + fullName.pop().charAt(0).toUpperCase();
    const expectedValueFormatted = expectedValue.toUpperCase();
    if (expectedValueFormatted === userValue || initials === userValue) {
        return userValue;
    }
    return false;
}

WaiverCollapse.propTypes = {
    fakeData: PropTypes.object,
    form: PropTypes.object,
    setFakeData: PropTypes.func,
    userInputedValues: PropTypes.object,
    setOpenPanelKey: PropTypes.func,
    waiver: PropTypes.object,
};
