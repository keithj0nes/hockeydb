import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { history } from 'helpers';
import { Button } from 'components';


const RegisterAsStep = ({ waiver, fakeData, infoForm, setFakeData, form, userInputedValues, setOpenPanelKey, associatedAccounts, ...props }) => {
    const location = useLocation();
    const [isGettingUserDataLoading, setisGettingUserDataLoading] = useState(false);

    // click player you want to resgister
    // show loading spinner and grayed out background
    // go get data for that player
    // hide loading spinner
    // set field values to form

    const handleRegisterAs = player => {
        // console.log(player, 'playerrrr!');

        if (!player) {
            infoForm.resetFields();
            return history.push(`${location.pathname}/info`);
        }

        setisGettingUserDataLoading(true);

        infoForm.setFieldsValue({ ...player, requested_team: player.previous_team });

        return history.push(`${location.pathname}/info`);

        // SIMULATE GETTING DATA
        // this may not be needed if sending registered accounts along with current user data

        // return setTimeout(() => {
        //     setisGettingUserDataLoading(false);
        //     history.push(`${location.pathname}/info`);
        // }, 3000);
    };

    return (
        <div className="registration-register-as">
            <h1 className="text-center">Who would you like to register as?</h1>
            <p className="muted text-center p-t-xxs">We noticed your account tied to previous registrations. You can use an existing player, or create a new one</p>

            <div className="f-justify-center f-wrap p-h-s">
                {associatedAccounts.map(item => (
                    <button key={item.id} className="register-as-btn" type="button" onClick={() => handleRegisterAs(item)}>
                        <span>Register as</span>
                        <span>{item.first_name}</span>
                        <span>Select</span>
                    </button>
                ))}
            </div>

            <div className="text-center">
                <p className="p-v-m">or</p>
                <Button title="Register new player" onClick={() => handleRegisterAs(null)} />
            </div>

            {isGettingUserDataLoading && (
                <div style={{ background: 'rgba(0, 0, 0, 0.25)', zIndex: 10000, height: '100vh', width: '100vw', position: 'absolute', top: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h2>LOADING...</h2>
                </div>
            )}
        </div>
    );
};

export default RegisterAsStep;

RegisterAsStep.propTypes = {
    fakeData: PropTypes.object,
    form: PropTypes.object,
    setFakeData: PropTypes.func,
    userInputedValues: PropTypes.object,
    setOpenPanelKey: PropTypes.func,
    waiver: PropTypes.object,
    infoForm: PropTypes.object,
    associatedAccounts: PropTypes.array,
};
