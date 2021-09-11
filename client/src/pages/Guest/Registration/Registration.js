// /* eslint-disable no-multi-str */
// import React, { useState, useEffect } from 'react';
// import { connect } from 'react-redux';
// import { Route } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import { Form, Input, InputNumber, Steps, Collapse, Checkbox, Radio } from 'antd';
// import { Button } from 'components';
// import { CheckOutlined } from '@ant-design/icons';
// import { getAuthedPlayerAccounts } from '../../../redux/actions/auth';

// import StepInfo from './InfoStep';
// import WaiverStep from './WaiverStep';
// import PaymentStep from './PaymentStep';


// import './registration.scss';

// const fakeData1 = {
//     registrationFormName: 'USHL - 2020 Spring Registration Form',
//     step1_description: ' \
//         <p>Fall season is here! We’ve got a 6 week schedule (this is subject to change), which should \
//         be 9/20, 9/27, 10/4, 10/11, 10/18, 10/25. This season we are able to secure Showare Center Arena \
//         for all 6 weeks!</p> <br /> <p>There is an age minimum of 30 years old this season. Anyone who is \
//         close can email abrinkerhoff@ushl.com to discuss your options as you’ll need pre-approval permissions.\
//         </p> <br /> <p>Each player will be assigned to a team based on their skill to ensure teams are even.</p>',
//     personalInputs: [
//         { label: 'First Name', name: 'first_name', required: true, type: 'text' },
//         { label: 'Last Name', name: 'last_name', required: true, type: 'text' },
//         { label: 'Birth Date', name: 'birth_date', required: false, type: 'date' },
//         { label: 'Phone', name: 'phone', required: false, type: 'text' },
//     ],
//     teamInputs: [
//         { label: 'Requested Team', name: 'requested_team', required: false, type: 'text' },
//         { label: 'Previous Team', name: 'previous_team', required: false, type: 'text' },
//         { label: 'Skill Level', name: 'skill_level', required: false, type: 'text' },
//         { label: 'Preferred Position', name: 'preferred_position', required: false, type: 'text' },
//     ],
//     step2_description: ' \
//         <p>Below is a list of documents for you to read and sign before you are able to proceed. Please \
//         ensure all forms are read and signed.</p> <br /> <p>If you have any concerns or questions about \
//         these documents, you can email abrinkerhoff@ushl.com to discuss your concerns or questions.</p>',
//     step2_important: '\
//         Below are the documents that need to be signed before being able to practice and join a team for the 2020 Spring season.',

//     step2_waivers: [
//         {
//             body: 'WAIVER 1 -> Lorem ipsum dolor sit amet, or sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in',
//             downloadUrl: null,
//             id: 15,
//             name: 'injury_waiver',
//             title: 'Injury Waiver',
//             signed: '',
//         },
//         {
//             body: 'WAIVER 2 -> Lorem ipsum dolor sit amet, or sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in',
//             downloadUrl: null,
//             id: 22,
//             name: 'another_waiver',
//             title: 'Another Waiver',
//             signed: '',
//         },
//     ],
//     step3_description: ' \
//         <p>Registrations are listed as below</p> <br /> <p>Lots and lots of monies</p>',
//     step3_allowDiscountCode: true,
//     step3_payment_options: [
//         { label: 'New Player Registration', name: 'new_player_registration', amount: 5000, remaining: 10 },
//         { label: 'Returning Player Registration', name: 'returning_player_registration', amount: 4000, remaining: 4 },
//     ],
// };

// // let userInputedValues = {};


// // to do =
// // make NEXT button be submit button that fires the form's onFinish prop


// // if user is NOT selected, show buttons asking user to select player associated with user signed in
// // or create a new registration

// // {!userSelect ? () : (

// //     )}


// const Registration = ({ getAuthedPlayerAccounts, isAuthAccountsLoading, accounts, history, location }) => {
//     const [currentStep, setCurrentStep] = useState(0);
//     const [fakeData, setFakeData] = useState(fakeData1);

//     const [userInputedValues, setUserInputedValues] = useState({});

//     const [openPanelKey, setOpenPanelKey] = useState(null);

//     const [isGettingUserDataLoading, setisGettingUserDataLoading] = useState(false);
//     const [showForm, setShowForm] = useState(false);


//     const [formStep1] = Form.useForm();
//     const [formStep2] = Form.useForm();
//     const [formStep3] = Form.useForm();


//     const formsList = { formStep1, formStep2, formStep3 };

//     useEffect(() => {
//         // if (!location.state?.season_id) {
//         //     history.push('/');
//         // }

//         window.onpopstate = () => currentStep === 0 && setShowForm(false);

//         // get all players associated with user
//         getAuthedPlayerAccounts();
//     }, []);


//     useEffect(() => {
//         // auto show form if theres no accounts associated with the current user
//         if (!isAuthAccountsLoading && !accounts.length) {
//             setShowForm(true);
//             history.push(`/registration/${location.state?.season_id}`);
//         }
//     }, [isAuthAccountsLoading]);

//     // console.log(fakeData, 'FAKE DATA HOME *******')
//     // const [inputData, setInputDate] = useState(init)

//     useEffect(() => {
//         const waiverListIds = fakeData1.step2_waivers.map(item => item.id);
//         // console.log(waiverListIds, 'id')
//         setOpenPanelKey(waiverListIds[0]);
//     }, []);

//     const handleSetOpenPanelKey = key => {
//         const waiverListIds = fakeData1.step2_waivers.map(item => item.id);

//         // console.log(openPanelKey, waiverListIds)

//         if (key === 'next') {
//             const nextId = waiverListIds.indexOf(openPanelKey) + 1;
//             console.log({ nextId });
//             waiverListIds[nextId] && setOpenPanelKey(waiverListIds[nextId]);
//         } else {
//             setOpenPanelKey(key);
//         }
//     };

//     const submitOnGoToNext = () => {
//         const currentForm = formsList[`formStep${currentStep + 1}`];

//         currentForm.validateFields().then((values) => {
//             console.log(values, 'VALUESSSSS');
//             // Submit values
//             // submitValues(values);

//             if (currentStep === 0) {
//                 // userInputedValues = values;
//                 setUserInputedValues(values);
//             }

//             if (currentStep === 1) {
//                 // make sure all required waivers are signed

//                 const m = fakeData1.step2_waivers.reduce((acc, n) =>
//                     // console.log(acc, n)
//                     [...acc, n.name],
//                 []);

//                 const n = Object.keys(values);
//                 console.log({ m, n });

//                 if (m.length !== n.length) {
//                     return false;
//                 }

//                 setUserInputedValues({ ...userInputedValues, waivers: values });


//                 // console.log(values)
//             }

//             if (currentStep === 2) {
//                 setUserInputedValues({ ...userInputedValues, ...values });
//             }

//             setCurrentStep(currentStep + 1);
//         }).catch((errorInfo) => {
//             console.log(errorInfo, 'EROR RIFFNOOOO');
//         });
//     };

//     console.log(`currentStep: ${currentStep}`, userInputedValues, 'userInputedValues');

//     // const accountss = [...accounts, ...accounts]
//     // console.log(accountss, 'USER ACCOUNTS');

//     // click player you want to resgister
//     // show loading spinner and grayed out background
//     // go get data for that player
//     // hide loading spinner
//     // set field values to form

//     const handleRegisterAs = player => {
//         console.log(player, 'playerrrr!');

//         if (!player) {
//             setShowForm(true);
//             return history.push(`/registration/${location.state?.season_id}`);
//         }

//         setisGettingUserDataLoading(true);


//         formStep1.setFieldsValue({ ...player, requested_team: player.previous_team });
//         console.log(formStep1);

//         setTimeout(() => {
//             setisGettingUserDataLoading(false);
//             setShowForm(true);
//             history.push(`/registration/${location.state?.season_id}`);
//         }, 3000);

//         // WORK ON TRYING TO ADD SELECTED PLAYER TO FORM FIELDS
//     };

//     const renderRegistrationForm = () => (
//         <div className="registration-container box-shadow">
//             <div className="registration-header">{fakeData.registrationFormName}</div>
//             <div className="registration-body">
//                 <div className="hide-mobile" style={{ minHeight: 100, borderBottom: '1px solid gray', marginBottom: 24 }}>
//                     <Steps labelPlacement="vertical" current={currentStep}>
//                         <Steps.Step title="Info" />
//                         <Steps.Step title="Waivers" />
//                         <Steps.Step title="Payment" />
//                         <Steps.Step title="Confirmation" />
//                     </Steps>

//                 </div>

//                 <div className="hide-desktop" style={{ minHeight: 100, borderBottom: '1px solid gray', marginBottom: 24 }}>
//                     <Steps className="hide-desktop" current={currentStep}>
//                         <Steps.Step title="Info" />
//                         <Steps.Step title="Waivers" />
//                         <Steps.Step title="Payment" />
//                         <Steps.Step title="Confirmation" />
//                     </Steps>
//                 </div>

//                 {/* {currentStep === 0 && <Step1 fakeData={fakeData} form={formStep1} userInputedValues={userInputedValues} />} */}
//                 {/* {currentStep === 1 && <Step2 fakeData={fakeData} setFakeData={setFakeData} form={formStep2} userInputedValues={userInputedValues} openPanelKey={openPanelKey} setOpenPanelKey={handleSetOpenPanelKey} />} */}
//                 {/* {currentStep === 2 && <Step3 fakeData={fakeData} setFakeData={setFakeData} form={formStep3} userInputedValues={userInputedValues} />} */}

//                 {currentStep === 0 && <StepInfo fakeData={fakeData} form={formStep1} userInputedValues={userInputedValues} />}
//                 {currentStep === 1 && <WaiverStep fakeData={fakeData} setFakeData={setFakeData} form={formStep2} userInputedValues={userInputedValues} openPanelKey={openPanelKey} setOpenPanelKey={handleSetOpenPanelKey} />}
//                 {currentStep === 2 && <PaymentStep fakeData={fakeData} setFakeData={setFakeData} form={formStep3} userInputedValues={userInputedValues} />}

//                 <div className="hide-mobile" style={{ minHeight: 50, margin: '24px 0' }}>
//                     <Steps direction="horizontal" size="small" current={currentStep}>
//                         <Steps.Step />
//                         <Steps.Step />
//                         <Steps.Step />
//                         <Steps.Step />
//                     </Steps>
//                 </div>

//                 <div className="f-justify-between">
//                     <Button disabled={currentStep <= 0} title="Back" onClick={() => setCurrentStep(currentStep - 1)} />
//                     {/* NEED TO ADD THE ABILITY TO DISABLE NEXT BUTTON BASED ON STEP */}
//                     {/* <Button disabled={currentStep >= 3} title="Next" onClick={() => {setCurrentStep(currentStep + 1); submitOnGoToNext()}} /> */}
//                     <Button disabled={currentStep >= 3} title="Next" onClick={() => { submitOnGoToNext(); }} />

//                     {/* NEED TO ADD THE ABILITY TO DISABLE NEXT BUTTON BASED ON STEP */}
//                 </div>

//                 {/* <Button disabled title="Save & Continue" onClick={() => console.log('clikced')} /> */}
//             </div>
//         </div>
//     );
//     return (
//         <div className="content-container registration-register-as">


//             {!showForm ? (
//                 <>
//                     <h1 className="text-center">Who would you like to register as?</h1>
//                     <p className="muted text-center p-t-xxs">We noticed your account tied to previous registrations. You can use an existing player, or create a new one</p>

//                     <div className="f-justify-center f-wrap p-h-s">
//                         {/* {accounts.map(item => <div key={item.id}><Button title={`Register as ${item.first_name}`} onClick={() => handleRegisterAs(item)} /></div>)} */}
//                         {accounts.map(item => (
//                             <button key={item.id} className="register-as-btn" type="button" onClick={() => handleRegisterAs(item)}>
//                                 {/* {`Register as ${item.first_name}`} */}
//                                 <span>Register as</span>
//                                 <span>{item.first_name}</span>
//                                 <span>Select</span>
//                             </button>
//                         ))}

//                     </div>


//                     <div className="text-center">
//                         <p className="p-v-m">or</p>
//                         <Button title="Register new player" onClick={() => handleRegisterAs(null)} />
//                     </div>


//                     {isGettingUserDataLoading && (
//                         <div style={{ background: 'rgba(0, 0, 0, 0.25)', zIndex: 10000, height: '100vh', width: '100vw', position: 'absolute', top: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                             <h2>LOADING...</h2>
//                         </div>
//                     )}
//                 </>
//             ) : renderRegistrationForm()}


//         </div>
//     );
// };


// // export default Registration;

// const mapStateToProps = state => ({
//     accounts: state.user.accounts,
//     isAuthAccountsLoading: state.user.isAuthAccountsLoading,
// });


// const mapDispatchToProps = dispatch => ({
//     getAuthedPlayerAccounts: () => dispatch(getAuthedPlayerAccounts()),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Registration);


// // const Step1 = ({fakeData, form}) => {
// //     return (
// //         <>
// //             <div className="section-border">
// //                 <h2>Player Information</h2>
// //                 {/* <p>{fakeData.description}</p> */}
// //                 <p dangerouslySetInnerHTML={{ __html: fakeData.step1_description}} />

// //                 <p style={{fontSize: 12, fontStyle: 'italic', marginTop: '24px'}}>
// //                     All fields with an <span style={{color: 'red'}}>*</span> are required. You will not be able to continue through the form if a field is left unfilled.
// //                 </p>
// //             </div>

// //             <div className="registration-form">


// //                 <Form
// //                     form={form}
// //                     layout="vertical"
// //                     onFinish={values => console.log(values, 'values')}
// //                     // onFieldsChange={changes => {
// //                     //     console.log(changes, 'haha')
// //                     // }}
// //                     // className=""
// //                 >
// //                     <p><strong>Personal Information</strong></p>
// //                     <p>The fields below are required to so we can contact you. Please ensure all information in the fields are correct before continuing the registration process.</p>

// //                     <div className="fields-group">
// //                         {fakeData.personalInputs?.map(item => {
// //                             return (
// //                                 <Form.Item label={item.label} name={item.name} rules={[{ required: item.required, message: `${item.label} is required` }]}>
// //                                     <Input type={item.type}/>
// //                                 </Form.Item>
// //                             )
// //                         })}
// //                     </div>

// //                     <p><strong>Team Information</strong></p>
// //                     <p>The fields below are required to so we can contact you. Please ensure all information in the fields are correct before continuing the registration process.</p>

// //                     <div className="fields-group">
// //                         {fakeData.teamInputs?.map(item => {
// //                             return (
// //                                 <Form.Item label={item.label} name={item.name} rules={[{ required: item.required, message: `${item.label} is required` }]}>
// //                                     <Input type={item.type}/>
// //                                 </Form.Item>
// //                             )
// //                         })}

// //                     </div>

// //                 </Form>
// //             </div>
// //         </>
// //     )
// // }

// // const Step2 = ({ fakeData, setFakeData, form, userInputedValues, openPanelKey, setOpenPanelKey }) => (
// //     <div className="section-border">
// //         {/* <h2>Docs & Waivers</h2> */}
// //         <h2>Waivers</h2>
// //         {/* <p>{fakeData.description}</p> */}
// //         <p dangerouslySetInnerHTML={{ __html: fakeData.step2_description }} />

// //         <div style={{ marginTop: '24px' }} />

// //         <h3>Participant: {userInputedValues.first_name} {userInputedValues.last_name}</h3>
// //         {/* <p style={{fontSize: 12}}>
// //                 Below are the documents that <strong>John Smith</strong> needs to sign before being able to practice and join a team for the 2020 Spring season.
// //             </p> */}

// //         <p dangerouslySetInnerHTML={{ __html: fakeData.step2_important }} />

// //         <div style={{ marginTop: '24px' }} />

// //         <Form
// //             form={form}
// //             // onFinish={values => console.log(values, 'VALUES HAHA')}
// //             // onFinish={() => setOpenPanelKey(openPanelKey + 1)}
// //             onFinish={values => {
// //                 console.log(values, 'VALUES ON FINISH OPEN PANEL');

// //                 const [entry] = Object.entries(values);
// //                 console.log(entry[0], entry[1], 'key balueeeee');
// //                 // form.setFieldsValue({ [waiver.name]: e.target.value?.toUpperCase() });
// //                 form.setFieldsValue({ [entry[0]]: entry[1]?.toUpperCase() });

// //                 setOpenPanelKey('next');

// //                 // TO DO

// //                 // formStep2 waivers should be updated here
// //                 // it is currently being updated on line 451 via onchange
// //             }}


// //         >
// //             {/* <Collapse defaultActiveKey={openPanelKey}> */}
// //             <Collapse activeKey={openPanelKey} onChange={e => setOpenPanelKey(e)}>

// //                 {fakeData.step2_waivers.map(waiver => (
// //                     <WaiverCollapse waiver={waiver} fakeData={fakeData} setFakeData={setFakeData} key={waiver.id} form={form} userInputedValues={userInputedValues} setOpenPanelKey={setOpenPanelKey} />
// //                 ))}

// //             </Collapse>
// //         </Form>
// //     </div>
// // );

// // todo:
// // figure out storing of input field when clicking "back" after submitting waviers
// // user userInputedValues in useeefect didmount

// // const WaiverCollapse = ({ waiver, fakeData, setFakeData, form, userInputedValues, setOpenPanelKey, ...props }) => {
// //     const [canSubmit, setCanSubmit] = useState(false);
// //     const [disabled, setDisabled] = useState(false);
// //     const [myValue, setMyValue] = useState('');

// //     useEffect(() => {
// //         setCanSubmit(!!validateSign(myValue, expectedName2));
// //     }, [myValue]);

// //     // console.log(props)
// //     // console.log(waiver, 'waiver')
// //     // console.log(fakeData, 'fakd dataddd ****')

// //     const expectedName2 = `${userInputedValues.first_name} ${userInputedValues.last_name}`;

// //     const handleFormChange = e => {
// //         setMyValue(e.target.value?.toUpperCase());
// //     };

// //     const validateWaiver = () => {
// //         if (!myValue || validateSign(myValue, expectedName2)) {
// //             return Promise.resolve();
// //         }
// //         return Promise.reject('Please sign initials');
// //     };

// //     return (
// //         <Collapse.Panel {...props} collapsible="header" header={waiver.title} key={waiver.id} extra={(<p>{canSubmit ? (<> <CheckOutlined style={{ color: '#4F9300' }} /> Completed </>) : 'Pending Completion'}</p>)}>

// //             <p className="waiver-container">{waiver.body}</p>

// //             <div className="m-t-xl m-b-s f-justify-between">
// //                 <p>By entering my name in the box below, I agree to the terms of the waiver.</p>

// //                 <Button title="Download Waiver" type="link" onClick={() => console.log('ONCLICK: create modal with list of PDF waivers to choose from')} />
// //             </div>

// //             <div className="sign-download-container">

// //                 <div className="f-align-start">

// //                     <Form.Item
// //                         name={waiver.name}
// //                         style={{ marginBottom: 0 }}
// //                         validateTrigger="onBlur"
// //                         rules={[
// //                             { required: true, message: 'Initials are required' },
// //                             { validator() { return validateWaiver(); } },
// //                         ]}
// //                     >
// //                         <Input type="text" style={{ minHeight: 42, textTransform: 'uppercase' }} disabled={disabled || !!waiver.signed} value={myValue} onChange={handleFormChange} />
// //                     </Form.Item>

// //                     <div style={{ marginRight: 24 }} />

// //                     {canSubmit && (
// //                         <Button disabled={!canSubmit || disabled} title="NEXT" onClick={() => setOpenPanelKey('next')} />
// //                     )}
// //                 </div>

// //                 <p>{canSubmit ? (<> <CheckOutlined style={{ color: '#4F9300' }} /> Completed </>) : 'Pending Completion'}</p>


// //                 {/* <div className="p-b-m" /> */}
// //                 {/* <Button title="Download Waiver" type="link" onClick={() => console.log('ONCLICK: create modal with list of PDF waivers to choose from')}/> */}
// //             </div>

// //         </Collapse.Panel>
// //     );
// // };

// // step3_description: ' \
// // <p>Registrations are listed as below</p> <br /> <p>Lots and lots of monies</p>',
// // step3_allowDiscountCode: true,
// // step3_payment_options: [
// // { name: 'New Player Registration', amount: 5000, remaining: 10 },
// // { name: 'Returning Player Registration', amount: 4000, remaining: 4 },
// // ]

// // const Step3 = ({ fakeData, form, userInputedValues }) => {
// //     const userName = `${userInputedValues.first_name} ${userInputedValues.last_name}`;

// //     const [value, setValue] = React.useState(1);

// //     const onChange = e => {
// //         console.log('radio checked', e.target.value);
// //         setValue(e.target.value);
// //     };

// //     return (
// //         <>
// //             <div className="section-border">
// //                 <h2>Participant Fees</h2>
// //                 <p dangerouslySetInnerHTML={{ __html: fakeData.step3_description }} />

// //                 <p style={{ fontSize: 12, fontStyle: 'italic', marginTop: '24px' }}>
// //                     All fields with an <span style={{ color: 'red' }}>*</span> are required. You will not be able to continue through the form if a field is left unfilled.
// //                 </p>
// //             </div>

// //             <div className="registration-form">
// //                 <Form
// //                     form={form}
// //                     layout="vertical"
// //                     onFinish={values => console.log(values, 'values')}
// //                 >
// //                     <p><strong>Participant Fee for {userName}</strong></p>
// //                     <p>The fee is $70 through 3/1, then will increase to $80. If you are paying offline, continue with registration and just email abrinkerhoff@ushl.com when you’re registration is complete. Primary GOALIES are $40.</p>

// //                     <div className="fields-group" style={{ flexDirection: 'column' }}>
// //                         <Form.Item name="payment_options" rules={[{ required: true, message: 'Payment option is required' }]}>
// //                             <Radio.Group onChange={onChange} value={value}>
// //                                 {fakeData.step3_payment_options?.map(item => (
// //                                     <Radio value={item.name} key={item.name}>
// //                                         {item.label} | {item.amount} | {item.remaining ? (<span style={{ fontWeight: 'bold' }}>{item.remaining} Spots remaining</span>) : null}
// //                                     </Radio>
// //                                 ))}
// //                             </Radio.Group>
// //                         </Form.Item>
// //                     </div>
// //                 </Form>
// //             </div>
// //         </>
// //     );
// // };









/* eslint-disable no-multi-str */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Form, Steps } from 'antd';
import { Button } from 'components';

import StepInfo from './InfoStep';
import WaiverStep from './WaiverStep';
import PaymentStep from './PaymentStep';
import RegisterAsStep from './RegisterAsStep';
import ConfirmationStep from './ConfirmationStep';

import './registration.scss';


const userDataStuff = {
    information: {
        // first_name: 'First Name',
        first_name: ['First Name', 'John'],
        last_name: ['Last Name', 'Smith'],
        birth_date: ['Birthdate', '99/99/99'],
        phone: ['Phone 3', '1234567890'],
    },
    team_details: {
        previous_team: ['Last team played for', 'Rangers'],
        previous_division: ['Last team\'s division', '1A'],
        requesting_team: ['Team you\'re signing up for', 'Rangers'],
        requesting_division: ['Team\s division', '1A'],
        experience: ['Experince', '5 years'],
        preferred_position: ['Preferred Position', 'Any'],
    },
    waivers: {
        injury_waiver: ['Injury Waiver', 'AA'],
        another_waiver: ['Another Waiver', 'AA'],
    },
};



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
        { label: 'Birth Date', name: 'birth_date', required: false, type: 'date' },
        { label: 'Phone', name: 'phone', required: false, type: 'text' },
    ],
    teamInputs: [
        { label: 'Requested Team', name: 'requested_team', required: false, type: 'text' },
        { label: 'Previous Team', name: 'previous_team', required: false, type: 'text' },
        { label: 'Experience', name: 'experience', required: false, type: 'text' },
        { label: 'Preferred Position', name: 'preferred_position', required: false, type: 'text' },
    ],
    step2_description: ' \
        <p>Below is a list of documents for you to read and sign before you are able to proceed. Please \
        ensure all forms are read and signed.</p> <br /> <p>If you have any concerns or questions about \
        these documents, you can email abrinkerhoff@ushl.com to discuss your concerns or questions.</p>',
    step2_important: '\
        Below are the documents that need to be signed before being able to practice and join a team for the 2020 Spring season.',

    step2_waivers: [
        {
            body: 'WAIVER 1 -> Lorem ipsum dolor sit amet, or sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in',
            downloadUrl: null,
            id: 15,
            name: 'injury_waiver',
            title: 'Injury Waiver',
            signed: '',
        },
        {
            body: 'WAIVER 2 -> Lorem ipsum dolor sit amet, or sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in dignissim sodales, ante magna molestie libero, in tristique nunc metus et leo. Aliquam felis justo, luctus eget condimentum in, volutpat pulvinar orci. Suspendisse iaculis vitae arcu in iaculis. Nullam euismod, mi ac lacinia laoreet, libero nulla dignissim enim, ut finibus ex elit ut elit. Sed non facilisis enim. Praesent et accumsan dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae elit tempor, dapibus purus at, efficitur est. Donec urna tortor, sagittis quis auctor ut, tempor ac mauris. In congue, justo in',
            downloadUrl: null,
            id: 22,
            name: 'another_waiver',
            title: 'Another Waiver',
            signed: '',
        },
    ],
    step3_description: ' \
        <p>Registrations are listed as below</p> <br /> <p>Lots and lots of monies</p>',
    step3_allowDiscountCode: true,
    step3_payment_options: [
        { label: 'New Player Registration', name: 'new_player_registration', amount: 5000, remaining: 10 },
        { label: 'Returning Player Registration', name: 'returning_player_registration', amount: 4000, remaining: 4 },
    ],
};


const allSteps = ['info', 'waivers', 'payment', 'confirmation'];
const registeringForSeasonId = 1;

// FLOW

// step 1
//     = if user has previous registrations/players, show Register As component
//     = if user selects previously created player, set basic info to formStep1
//     = if user DOES NOT HAVE previous registrations/players
//         = push to info step (do not show Register As component)
//         = "back" button should be set to cancel and sent to home page

// step 2
//     = show info step

// step 3
//     = show waiver step

// step 4
//     = show confirmation step


const Registration = ({ history, location, match, associatedAccounts }) => {
    const [fakeData, setFakeData] = useState(fakeData1);
    const [userInputedValues, setUserInputedValues] = useState({});
    const [openPanelKey, setOpenPanelKey] = useState(null);

    const [form_info] = Form.useForm();
    const [form_waivers] = Form.useForm();
    const [form_payment] = Form.useForm();
    const [form_confirmation] = Form.useForm();

    const formsList = { form_info, form_waivers, form_payment, form_confirmation };

    // useEffect(() => {
    //     const waiverListIds = fakeData1.step2_waivers.map(item => item.id);
    //     // console.log(waiverListIds, 'id')
    //     setOpenPanelKey(waiverListIds[0]);

    //     history.push(`/registration/${registeringForSeasonId}`);

    //     if (!associatedAccounts.length) {
    //         history.push(`/registration/${registeringForSeasonId}/info`);
    //     }
    // }, []);

    useEffect(() => {
        window.scrollTo(0, 0);

        // if (!associatedAccounts.length) {
        //     history.push(`/registration/${registeringForSeasonId}/info`);
        // }
    }, [location]);

    const handleSetOpenPanelKey = key => {
        const waiverListIds = fakeData1.step2_waivers.map(item => item.id);

        if (key === 'next') {
            const nextId = waiverListIds.indexOf(openPanelKey) + 1;
            // console.log({ nextId });
            waiverListIds[nextId] && setOpenPanelKey(waiverListIds[nextId]);
        } else {
            setOpenPanelKey(key);
        }
    };

    const submitOnGoToNext = () => {
        const found = allSteps.find(step => location.pathname?.includes(step));
        const currentForm = formsList[`form_${found}`];

        currentForm.validateFields().then((values) => {
            console.log(values, 'VALUESSSSS');
            if (found === 'info') {
                setUserInputedValues(values);
            }

            if (found === 'waivers') {
                // make sure all required waivers are signed
                const m = fakeData1.step2_waivers.reduce((acc, n) => [...acc, n.name], []);
                const n = Object.keys(values);
                console.log({ m, n });

                if (m.length !== n.length) {
                    return false;
                }

                setUserInputedValues({ ...userInputedValues, waivers: values });
            }

            if (found === 'payment') {
                setUserInputedValues({ ...userInputedValues, ...values });
            }


            if (found === 'confirmation') {
                setUserInputedValues({ ...userInputedValues, ...values });

                return alert('all steps done!!')
            }

            return history.push(allSteps[allSteps.indexOf(found) + 1]);
        }).catch((errorInfo) => {
            console.log(errorInfo, 'EROR in submitOnGoToNext');
        });
    };


    const renderRegistrationForm = () => {
        const found = allSteps.find(step => location.pathname?.includes(step));
        console.log(`currentStep: ${found}`, '\nuserInputedValues:', userInputedValues);

        return (
            <div className="registration-container box-shadow">
                <div className="registration-header">{fakeData.registrationFormName}</div>
                <div className="registration-body">
                    <div className="hide-mobile" style={{ minHeight: 100, borderBottom: '1px solid gray', marginBottom: 24 }}>
                        <Steps labelPlacement="vertical" current={allSteps.indexOf(found)}>
                            <Steps.Step title="Info" />
                            <Steps.Step title="Waivers" />
                            <Steps.Step title="Payment" />
                            <Steps.Step title="Confirmation" />
                        </Steps>

                    </div>

                    <div className="hide-desktop" style={{ minHeight: 100, borderBottom: '1px solid gray', marginBottom: 24 }}>
                        <Steps className="hide-desktop" current={allSteps.indexOf(found)}>
                            <Steps.Step title="Info" />
                            <Steps.Step title="Waivers" />
                            <Steps.Step title="Payment" />
                            <Steps.Step title="Confirmation" />
                        </Steps>
                    </div>

                    <Route
                        path={`${match.url}/${registeringForSeasonId}/info`}
                        component={() => <StepInfo fakeData={fakeData} form={form_info} userInputedValues={userInputedValues} />}
                        exact
                    />


                    {/* waiver collapse "signing" wont work with using route - why? */}
                    {/* <Route
                        path={`${match.url}/${registeringForSeasonId}/waivers`}
                        component={() => <WaiverStep fakeData={fakeData} setFakeData={setFakeData} form={form_waivers} userInputedValues={userInputedValues} openPanelKey={openPanelKey} setOpenPanelKey={handleSetOpenPanelKey} />}
                        exact
                    /> */}

                    {location.pathname === `${match.url}/${registeringForSeasonId}/waivers` && <WaiverStep fakeData={fakeData} setFakeData={setFakeData} form={form_waivers} userInputedValues={userInputedValues} openPanelKey={openPanelKey} setOpenPanelKey={handleSetOpenPanelKey} />}

                    <Route
                        path={`${match.url}/${registeringForSeasonId}/payment`}
                        component={() => <PaymentStep fakeData={fakeData} setFakeData={setFakeData} form={form_payment} userInputedValues={userInputedValues} />}
                        exact
                    />

                    <Route
                        path={`${match.url}/${registeringForSeasonId}/confirmation`}
                        component={() => <ConfirmationStep fakeData={fakeData} setFakeData={setFakeData} form={form_confirmation} userInputedValues={userInputedValues} />}
                        exact
                    />

                    <div className="hide-mobile" style={{ minHeight: 50, margin: '24px 0' }}>
                        <Steps direction="horizontal" size="small" current={allSteps.indexOf(found)}>
                            <Steps.Step />
                            <Steps.Step />
                            <Steps.Step />
                            <Steps.Step />
                        </Steps>
                    </div>

                    <div className="f-justify-between">
                        <Button title="Back" onClick={() => history.goBack()} />

                        {/* NEED TO ADD THE ABILITY TO DISABLE NEXT BUTTON BASED ON STEP */}
                        <Button title="Next" onClick={submitOnGoToNext} />
                        {/* NEED TO ADD THE ABILITY TO DISABLE NEXT BUTTON BASED ON STEP */}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="content-container registration-register-as">

            <Route
                path={`${match.url}/${registeringForSeasonId}`}
                component={() => <RegisterAsStep associatedAccounts={associatedAccounts} infoForm={form_info} />}
                exact
            />

            <Route
                path={`${match.url}/${registeringForSeasonId}/*`}
                render={renderRegistrationForm}
            />

        </div>
    );
};

const mapStateToProps = state => ({
    associatedAccounts: state.user.user?.associated_accounts,
});

export default connect(mapStateToProps)(Registration);

Registration.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.func,
    associatedAccounts: PropTypes.array,
};
