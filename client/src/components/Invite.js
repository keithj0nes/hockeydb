import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';
import qs from 'query-string';
import { Site_Name_Full } from 'assets/resourceStrings';
import { Form, Input, Select, Checkbox } from 'antd';
import { connect } from 'react-redux';
// import { Redirect } from 'react-router-dom';
import { Button } from '.';
import { registerFromInvite } from '../redux/actions/auth';

const Invite = ({ location, registerFromInvite }) => {
    const [form] = Form.useForm();
    const [jwtIsExpired, setJwtIsExpired] = useState(false);
    const [userData, setUserData] = useState({});
    const [userToken, setUserToken] = useState('');


    useEffect(() => {
        try {
            const { token } = qs.parse(location.search.slice(1));
            console.log(token)
            // const token = qs.parse(location.search.slice(1))?.jwt;
            const decodedToken = jwt.decode(token);
            console.log({decodedToken});

            if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
                console.log('its expired');
                return setJwtIsExpired(true);
            }
            setUserData(decodedToken);
            setUserToken(token);
            // form.setFieldsValue({ first_name: decodedToken.first_name });
            form.setFieldsValue(decodedToken);
        } catch (error) {
            console.log(error, 'an error occured');
        }
    }, []);

    if (jwtIsExpired) {
        return (
            <p>Sorry, looks like your registration code has expired. Please contact your administrator for a new registration code.</p>
        );
    }

    return (
        <div>
            <Form
                form={form}
                layout="vertical"
                style={{ width: 500, margin: '20px auto' }}
                onFinish={values => registerFromInvite({ userData: values, token: userToken })}
            >
                <p>{`You\'ve been invited to join the ${Site_Name_Full}'s admin team as a ${userData.user_role}.`}</p>
                <p style={{ marginBottom: 25 }}>Please complete your registration below.</p>
                <Form.Item label="First name" name="first_name" rules={[{ required: true, message: 'Please enter your first name' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Last name" name="last_name" rules={[{ required: true, message: 'Please enter your last name' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Email">
                    <Form.Item name="email" noStyle>
                        <Input placeholder="field.title" disabled />
                    </Form.Item>
                    <span>You can update your email in Settings</span>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter a password' }]}
                >
                    <Input.Password
                        className="input-password"
                        type="password"
                    />
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20 }}>
                    <Button htmlType="submit" title="Complete Registration" type="admin" />
                </div>
            </Form>
        </div>
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
