import React, { useState } from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../redux/slices/auth';

const Login = () => {
    const [form] = Form.useForm();
    const [showForm, setShowForm] = useState('login'); // one of login | reset | reset_success | create
    const [focus, setFocus] = useState(true);

    const auth = useSelector(state => state.auth);

    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        // console.log(location, 'LOCATION')
        if (auth.isAuthenticated) {
            // console.log('user is atuhed!')
            const { from } = location.state || { from: '/dashboard' };
            navigate(from, { replace: true });
        }
    }, [auth.isAuthenticated]);

    // const games = useSelector((state) => state.games);
    const dispatch = useDispatch();

    const handleSubmit = values => {
        // console.log(values, 'values on submit');
        dispatch(login({
            email: values.email.toLowerCase(),
            password: values.password,
            redirect: location.state?.from
        }));
    };

    const handleAutoLogin = async user => {
        dispatch(login({
            email: `${user}@hockeydb.com`,
            password: process.env.REACT_APP_TESTING_PASSWORD,
            redirect: location.state?.from,
        }));
    };


    return (
        <div>

            {/* <button type="button" onClick={() => setFocus(!focus)}>
                show stuff
            </button> */}
            <Form
                form={form}
                layout="vertical"
                onFinish={values => handleSubmit(values)}
                // className="w-full bg-white p-4 mt-20 max-w-sm m-auto rounded-md shadow-xl transition duration-300 select-none pointer-events-none"
                className={classNames('w-full bg-white p-4 mt-20 max-w-sm m-auto rounded-md shadow-xl transition duration-300',
                    {
                        'select-none pointer-events-none opacity-0': !focus,
                    })}

                // className={`box-shadow login-form ${showForm === 'login' ? 'toggleIn' : 'toggleOut'}`}
            >
                <p className="text-center">Login to your account</p>

                <img src="/images/logo.png" alt="Logo" className="h-16 m-auto flex my-4" />

                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Email is required' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Password is required' }]}>
                    <Input type="password" />
                </Form.Item>

                <div className="flex justify-end">
                    {/* <Button onClick={() => setShowForm('reset')} htmlType="button" type="link" title="Forgot your password?" /> */}

                    <button type="button" className="p-1 text-secondary underline active:opacity-80">
                        Forgot Password?
                    </button>
                </div>


                <button type="submit" className="mt-4 uppercase w-full p-3 text-white rounded bg-secondary active:opacity-80">
                    Log In
                </button>

                <div className="mt-6 flex justify-between">
                    <p className="p-1">Don&apos;t have an account?</p>
                    {/* <Button onClick={() => setShowForm('create')} htmlType="button" type="link" title="Create account" /> */}

                    <button type="button" className="p-1 text-secondary underline active:opacity-80">
                        Create account
                    </button>
                </div>


                {/* color pallett
                https://colors.muz.li/palette/0c1d40/081c2d/cbe8ff/97d0ff/ffffff */}

                {/*
                <Button htmlType="submit" title="LOGIN" style={{ width: '100%' }} />

                <div className="m-t-m f-justify-between">
                    <p>Don&apos;t have an account?</p>
                    <Button onClick={() => setShowForm('create')} htmlType="button" type="link" title="Create account" />
                </div> */}
            </Form>


            <div className="p-4">

                <button
                    type="button"
                    className="my-1 block m-auto text-secondary underline active:opacity-80 hover:opacity-80"
                    onClick={() => handleAutoLogin('admin')}
                >
                    Login as [Admin]
                </button>
                <button
                    type="button"
                    className="my-1 block m-auto text-secondary underline active:opacity-80 hover:opacity-80"
                    onClick={() => handleAutoLogin('scorekeeper')}
                >
                    Login as [Scorekeeper]
                </button>
                <button
                    type="button"
                    className="my-1 block m-auto text-secondary underline active:opacity-80 hover:opacity-80"
                    onClick={() => handleAutoLogin('teammanager')}
                >
                    Login as [Team Manager]
                </button>

                {/* <Button onClick={handleAutoLogin} name="admin" type="link" title="Login as [Admin]" />
                <Button onClick={handleAutoLogin} name="scorekeeper" type="link" title="Login as [Scorekeeper]" />
                <Button onClick={handleAutoLogin} name="teammanager" type="link" title="Login as [Team Manager]" /> */}
            </div>
        </div>
    );
};

export default Login;


// const ForgotPassword = () => (
//     <Form
//         layout="vertical"
//         onFinish={handleResetPassword}
//         className={`box-shadow login-form ${showForm === 'reset' ? 'toggleIn' : 'toggleOut'}`}
//     >
//         <p className="text-center">Forgot your password?</p>

//         <img src={logo} alt="Logo" className="logo" />

//         <p className="text-center p-b-m">Don’t worry! Resetting your password is easy. Just type in the email you used to register at USHL.</p>


//         <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Email is required' }]}>
//             <Input />
//         </Form.Item>

//         <Button loading={isLoading} htmlType="submit" title="SEND PASSWORD RESET" style={{ width: '100%' }} />
//         <p className="p-t-m">
//             Did you remember your password? &nbsp;
//             <Button onClick={() => setShowForm('login')} htmlType="button" type="link" title="Try logging in!" />
//         </p>
//     </Form>
// );
