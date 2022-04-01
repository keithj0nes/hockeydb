import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
// import { CheckOutlined } from '@ant-design/icons';
// import { Button } from 'components';

function mapObj(obj) {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
}

const ConfirmationStep = ({ fakeData, setFakeData, form, userInputedValues, openPanelKey, setOpenPanelKey }) => {
    // const userName = `${userInputedValues.first_name} ${userInputedValues.last_name}`;

    console.log(userInputedValues, 'user inputed values  CONFIRMATION PAGE')

    const userDataStuff = {
        information: {
            // first_name: 'First Name',
            first_name: ['First Name', 'John'],
            last_name: ['Last Name', 'Smith'],
            birth_date: ['Birthdate', '99/99/99'],
            phone: ['Phone #', '1234567890'],
        },
        team_details: {
            previous_team: ['Last team played for', 'Rangers'],
            previous_division: ['Last team\'s division', '1A'],
            requesting_team: ['Team you\'re signing up for', 'Rangers'],
            requesting_division: ['Team\'s division', '1A'],
            experience: ['Experince', '5 years'],
            preferred_position: ['Preferred Position', 'Any'],
        },
        waivers: {
            injury_waiver: ['Injury Waiver', 'AA'],
            another_waiver: ['Another Waiver', 'AA'],
        },
        payment_options: {
            pay_in_full: ['Pay in Full', 5000],
            type: ['Card Type', 'Visa/Mastercard']
        },
    };


    return (
        <>
            <div className="section-border">
                <h2>Confirmation</h2>
                <p>Please review</p>
            </div>

            <div className="registration-form">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={values => console.log(values, 'values')}
                >
                    {mapObj(userDataStuff).map(section => {
                    // {mapObj(userInputedValues).map(section => {
                        return (
                            <>
                                <h2 style={{textTransform: 'uppercase', paddingTop: 10 }}>{section.key.replace(/_/g, ' ')}</h2>
                                {mapObj(section.value).map(keys => {
                                    // console.log(keys, 'keys')

                                    return (
                                        <div style={{ display: 'flex', background: '#f8f8f8', margin: '10px 0' }}>
                                            <p style={{ flex: 1 }}>{keys.value[0]}</p>
                                            <p style={{ flex: 2, borderLeft: '1px solid gray', paddingLeft: 10 }}>{keys.value[1]}</p>
                                        </div>
                                    );
                                })}
                            </>
                        );
                    })}

                </Form>
            </div>
        </>
    );
};

export default ConfirmationStep;

ConfirmationStep.propTypes = {
    fakeData: PropTypes.object,
    form: PropTypes.object,
    setFakeData: PropTypes.func,
    userInputedValues: PropTypes.object,
    openPanelKey: PropTypes.number,
    setOpenPanelKey: PropTypes.func,
};
