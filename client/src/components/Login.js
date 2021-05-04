import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Redirect } from 'react-router-dom';
import { Form, Input } from 'antd';
import logo from 'assets/images/logo.png';
import { login, loginFromCookie, sendResetPassword } from '../redux/actions/auth';
import { Button } from '.';
import './login.scss';
import { wait } from '../helpers'

const initialState = {
    email: '',
    password: '',
    redirectToReferrer: false,
};

const Login = ({ loginFromCookie, login, location, history, user, sendResetPassword }) => {
    const [form] = Form.useForm();
    const [state, setState] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState('login'); // one of login | reset | reset_success

    useEffect(() => {
        let redirectToReferrer;
        async function tryLoginAndRedirect() {
            if (!!Object.keys(user).length) {
                redirectToReferrer = true;
            } else {
                redirectToReferrer = await loginFromCookie();
            }

            const { from } = location.state || { from: { pathname: 'dashboard' } };
            if (redirectToReferrer) return history.push(from);
            return false;
        }

        tryLoginAndRedirect();
    }, [location.state, history, loginFromCookie, user]);

    const handleSubmit = async values => {
        login({ email: values.email.toLowerCase(), password: values.password });
    };

    const handleAutoLogin = async e => {
        e.preventDefault();
        login({ email: `${e.target.name}@hockeydb.com`, password: e.target.name === 'teammanager' ? 'manager' : e.target.name });
    };

    const handleResetPassword = async (values) => {
        setIsLoading(true);

        await wait(1000);
        const sendSuccess = await sendResetPassword({ email: values.email.toLowerCase() });
        setIsLoading(false);
        if (!sendSuccess) {
            return;
        }
        setState({ ...state, email: values.email.toLowerCase() });
        setShowForm('reset_success');
    };

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={values => handleSubmit(values)}
                className={`box-shadow login-form ${showForm === 'login' ? 'toggleIn' : 'toggleOut'}`}
            >
                <p className="text-center">Login to your account</p>

                <img src={logo} alt="Logo" className="logo" />

                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Email is required' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Password is required' }]}>
                    <Input type="password" />
                </Form.Item>

                <div className="m-b-m f-justify-between f-justify-end">
                    {/* <Form.Item name="remember_me" valuePropName="checked" style={{marginBottom: 0}}>
                        <Checkbox>Remember Me</Checkbox>
                    </Form.Item> */}
                    <Button onClick={() => setShowForm('reset')} htmlType="button" type="link" title="Forgot your password?" />
                </div>
                <Button htmlType="submit" title="LOGIN" style={{ width: '100%' }} />
            </Form>


            <Form
                layout="vertical"
                onFinish={handleResetPassword}
                className={`box-shadow login-form ${showForm === 'reset' ? 'toggleIn' : 'toggleOut'}`}
            >
                <p className="text-center">Forgot your password?</p>

                <img src={logo} alt="Logo" className="logo" />

                <p className="text-center p-b-m">Don’t worry! Resetting your password is easy. Just type in the email you used to register at USHL.</p>


                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Email is required' }]}>
                    <Input />
                </Form.Item>

                <Button disabled={isLoading} htmlType="submit" title="SEND PASSWORD RESET" style={{ width: '100%' }} />
                <p className="p-t-m">
                    Did you remember your password? &nbsp;
                    <Button onClick={() => setShowForm('login')} htmlType="button" type="link" title="Try logging in!" />
                </p>
            </Form>

            <div className={`box-shadow login-form ${showForm === 'reset_success' ? 'toggleIn' : 'toggleOut'}`}>
                <p className="text-center">We've sent you an email!</p>

                <img src={logo} alt="Logo" className="logo" />

                <p className="text-center p-b-m">
                    We have sent a password reset link to <strong>{state.email}</strong>. Please check your email and click the password reset link.
                </p>

                <Button htmlType="button" title="RETURN TO LOGIN" style={{ width: '100%' }} onClick={() => setShowForm('login')} />
            </div>

            <div className="f-align-center f-column" style={{ paddingTop: 535 }}>
                <Button onClick={handleAutoLogin} name="admin" type="link" title="Login as [Admin]" />
                <Button onClick={handleAutoLogin} name="scorekeeper" type="link" title="Login as [Scorekeeper]" />
                <Button onClick={handleAutoLogin} name="teammanager" type="link" title="Login as [Team Manager]" />
            </div>

        </>
    );
};

const mapStateToProps = state => ({
    user: state.user && state.user.user,
});


const mapDispatchToProps = dispatch => ({
    login: loginData => dispatch(login(loginData)),
    loginFromCookie: () => dispatch(loginFromCookie()),
    sendResetPassword: userData => dispatch(sendResetPassword(userData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

Login.propTypes = {
    loginFromCookie: PropTypes.func,
    login: PropTypes.func.isRequired,
    location: PropTypes.object,
    history: PropTypes.object,
    user: PropTypes.object,
    sendResetPassword: PropTypes.func,
};
