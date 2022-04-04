import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import jwt from 'jsonwebtoken';
import qs from 'query-string';
import logo from 'assets/images/logo.png';
import { Form, Input } from 'antd';
import { connect } from 'react-redux';
import { Button } from '.';
import { updatePassword } from '../redux/actions/auth';

const ResetPassword = ({ location, history, updatePassword }) => {
    const [form] = Form.useForm();
    const [jwtIsExpired, setJwtIsExpired] = useState(false);
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
                <p className="text-center">Sorry, looks like your reset password code has expired. Please re-submit a reset password code from the login form.</p>

                <div className="m-t-xl">
                    <Button htmlType="button" onClick={() => history.push('/login')} title="RETURN TO LOGIN" style={{ width: '100%' }} />
                </div>
            </div>
        );
    }

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                className="box-shadow login-form toggleIn"
                onFinish={values => updatePassword({ userData: values, token: userToken })}
            >
                <p className="text-center">Reset your password</p>

                <img src={logo} alt="Logo" className="logo" />

                <p className="p-v-s text-center">Please enter a new password.</p>

                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Password is required' }]}>
                    <Input type="password" />
                </Form.Item>

                <Form.Item label="Confirm Password" name="password_confirmation" rules={[{ required: true, message: 'Password is required' }]}>
                    <Input type="password" />
                </Form.Item>

                <div className="m-t-xl">
                    <Button htmlType="submit" title="UPDATE PASSWORD" style={{ width: '100%' }} />
                </div>
            </Form>
        </>
    );
};

const mapStateToProps = state => ({
    isUserLoggedIn: state.user && state.user.isUserLoggedIn,
});

const mapDispatchToProps = dispatch => ({
    updatePassword: data => dispatch(updatePassword(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);


ResetPassword.propTypes = {
    location: PropTypes.object,
    updatePassword: PropTypes.func,
    history: PropTypes.object,
};
