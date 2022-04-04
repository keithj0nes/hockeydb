import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import jwt from 'jsonwebtoken';
import qs from 'query-string';
import { Site_Name_Full } from 'assets/resourceStrings';
import logo from 'assets/images/logo.png';
import { Form, Input } from 'antd';
import { connect } from 'react-redux';
import { Button } from '.';
import { registerFromInvite } from '../redux/actions/auth';

const Invite = ({ location, registerFromInvite }) => {
    const [form] = Form.useForm();
    const [jwtIsExpired, setJwtIsExpired] = useState(false);
    const [userData, setUserData] = useState({});
    const [userToken, setUserToken] = useState('');

    const jwt_decode = (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
      };


    useEffect(() => {
        try {
            const { token } = qs.parse(location.search.slice(1));
            const decodedToken = jwt_decode(token);

            if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
                return setJwtIsExpired(true);
            }
            setUserData(decodedToken);
            setUserToken(token);
            return form.setFieldsValue(decodedToken);
        } catch (error) {
            return console.log(error, 'an error occured');
        }
    }, [form, location.search]);

    if (jwtIsExpired) {
        return (
            <div className="box-shadow login-form toggleIn">
                <p className="text-center">Something went wrong</p>
                <img src={logo} alt="Logo" className="logo" />
                <p className="text-center">Sorry, looks like your registration code has expired. Please contact your administrator for a new registration code.</p>
            </div>
        );
    }

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                className="box-shadow login-form toggleIn"
                onFinish={values => registerFromInvite({ userData: values, token: userToken })}
            >
                <p className="text-center">Complete your registration</p>

                <img src={logo} alt="Logo" className="logo" />

                <p className="text-center">{`You've been invited to join the ${Site_Name_Full}'s admin team as a ${userData.user_role}.`}</p>
                <p className="p-v-m text-center">Please complete your registration below.</p>

                <Form.Item label="First name" name="first_name" rules={[{ required: true, message: 'Please enter your first name' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Last name" name="last_name" rules={[{ required: true, message: 'Please enter your last name' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Email" className="m-b-xxs">
                    <Form.Item name="email" noStyle>
                        <Input placeholder="field.title" disabled />
                    </Form.Item>
                    <span className="muted">You can update your email in Settings</span>
                </Form.Item>

                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }]}>
                    <Input.Password className="input-password" type="password" />
                </Form.Item>

                <div className="m-t-xl">
                    <Button htmlType="submit" title="COMPLETE REGISTRATION" style={{ width: '100%' }} />
                </div>
            </Form>
        </>
    );
};

const mapStateToProps = state => ({
    isUserLoggedIn: state.user && state.user.isUserLoggedIn,
});

const mapDispatchToProps = dispatch => ({
    registerFromInvite: data => dispatch(registerFromInvite(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Invite);


Invite.propTypes = {
    location: PropTypes.object,
    registerFromInvite: PropTypes.func,
};
