import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Radio } from 'antd';
// import { CheckOutlined } from '@ant-design/icons';
// import { Button } from 'components';

const PaymentStep = ({ fakeData, setFakeData, form, userInputedValues, openPanelKey, setOpenPanelKey }) => {
    const userName = `${userInputedValues.first_name} ${userInputedValues.last_name}`;

    const [value, setValue] = useState(1);

    const onChange = e => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    return (
        <>
            <div className="section-border">
                <h2>Participant Fees</h2>
                <p dangerouslySetInnerHTML={{ __html: fakeData.step3_description }} />

                <p style={{ fontSize: 12, fontStyle: 'italic', marginTop: '24px' }}>
                    All fields with an <span style={{ color: 'red' }}>*</span> are required. You will not be able to continue through the form if a field is left unfilled.
                </p>
            </div>

            <div className="registration-form">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={values => console.log(values, 'values')}
                >
                    <p><strong>Participant Fee for {userName}</strong></p>
                    <p>The fee is $70 through 3/1, then will increase to $80. If you are paying offline, continue with registration and just email abrinkerhoff@ushl.com when you’re registration is complete. Primary GOALIES are $40.</p>

                    <div className="fields-group" style={{ flexDirection: 'column' }}>
                        <Form.Item name="payment_options" rules={[{ required: true, message: 'Payment option is required' }]}>
                            <Radio.Group onChange={onChange} value={value}>
                                {fakeData.step3_payment_options?.map(item => (
                                    <Radio value={item.name} key={item.name}>
                                        {item.label} | {item.amount} | {item.remaining ? (<span style={{ fontWeight: 'bold' }}>{item.remaining} Spots remaining</span>) : null}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </>
    );
};

export default PaymentStep;

PaymentStep.propTypes = {
    fakeData: PropTypes.object,
    form: PropTypes.object,
    setFakeData: PropTypes.func,
    userInputedValues: PropTypes.object,
    openPanelKey: PropTypes.number,
    setOpenPanelKey: PropTypes.func,
};
