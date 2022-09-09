import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import { useAuth, useForm } from '../../hooks';
import { getRegistration } from '../../redux/slices/registrations';

import WizardSelectPlayer from './registrationsWizard/wizard/WizardSelectPlayer';
import WizardPlayerInfo from './registrationsWizard/wizard/WizardPlayerInfo';
import WizardConfirmDetails from './registrationsWizard/wizard/WizardConfirmDetails';

const steps = [
    { name: 'Register As' },
    { name: 'Info' },
    { name: 'Docs' },
    { name: 'Waivers' },
    { name: 'Fees' },
    { name: 'Pay' },
    { name: 'Review' },
    { name: 'Confirm' },
];


const Register = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isOpenMobile, setIsOpenMobile] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    // const user = useAuth();
    const formData = useForm({});


    // GET REGISTRATION FORM DATA HERE

    const { isFetching, formFields: registrationFields } = useSelector((state) => state.registrations);
    const dispatch = useDispatch();
    const { registration_id } = useParams();


    useEffect(() => {
        dispatch(getRegistration({ registration_id }));
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [currentStep]);


    const handleNext = () => currentStep < steps.length && setCurrentStep(currentStep + 1);
    const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);

    // console.log(registrationFields, 'registrationFields')


    return (
        <main className="lg:flex">

            <div className="w-full bg-primary items-center p-4 lg:hidden">
                {/* <div className="h-10 w-10 rounded bg-blue-300" onClick={() => setIsOpenMobile(true)} /> */}

                {/* <h2 className="text-white block">Step name here</h2> */}

                <Link
                    to="/dashboard"
                    // className="border whitespace-nowrap border-green-500 rounded inline-flex justify-center gap-x-2 items-center p-2"
                    className="text-gray-300 group relative flex items-center gap-x-4 p-2 text-sm rounded-md hover:bg-primary-100 hover:text-white "
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Dashboard
                </Link>


                <h2 className="p-2 text-gray-200 text-xl">
                    Register - Summer 2023
                </h2>


                <div>
                    {steps.map((item, ind) => {
                        const stepNumber = ind + 1;
                        if (stepNumber !== currentStep) return null;
                        return (
                            <div className="flex justify-between" key={stepNumber}>
                                <p className="text-2xl text-db-secondary">{item.name}</p>
                                <p className="text-xl text-gray-200"><span className="text-db-secondary">{stepNumber}</span> / {steps.length}</p>
                            </div>
                        );
                    })}
                    <div className="flex gap-x-3 py-3">
                        {steps.map((item, ind) => {
                            const stepNumber = ind + 1;
                            return (
                                <div className=" w-full text-center" key={stepNumber}>
                                    <div className={classNames('w-full h-1 rounded-full', {
                                        'bg-db-secondary': stepNumber <= currentStep,
                                        'bg-gray-500': stepNumber > currentStep,
                                    })}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            <div className={classNames('hidden flex-col justify-between h-screen p-5 pt-8 duration-300 bg-primary relative lg:flex', {
                'w-72': isOpen,
                'w-20': !isOpen,
            })}
            >
                <Link
                    to="/dashboard"
                    // className="border whitespace-nowrap border-green-500 rounded inline-flex justify-center gap-x-2 items-center p-2"
                    className="text-gray-300 group relative flex items-center gap-x-4 p-2 text-sm rounded-md hover:bg-primary-100 hover:text-white "
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Dashboard
                </Link>
            </div>

            <div className="flex-1 min-h-screen bg-light-gray">


                {currentStep === 1 && (
                    <WizardSelectPlayer onNext={handleNext} onBack={handleBack} formData={formData} />
                )}

                {currentStep === 2 && (
                    <WizardPlayerInfo onNext={handleNext} onBack={handleBack} formData={formData} registrationFields={registrationFields} />
                )}

                {currentStep === 3 && (
                    <WizardConfirmDetails onBack={handleBack} formData={formData} registrationFields={registrationFields} />
                )}

                {currentStep > 3 && (
                    <>

                        <div className="text-center text-lg pt-12">
                            [FORM PAGE]
                            <p className="text-6xl text-primary">{currentStep}</p>
                        </div>

                        <div className="flex justify-between pt-20 px-5">
                            <button
                                type="button"
                                onClick={handleBack}
                                // className="text-black group relative flex items-center gap-x-4 p-2 text-sm rounded-md hover:bg-primary-100 hover:text-white "
                                className="flex justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                                // onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                disabled={currentStep === steps.length}
                                onClick={handleNext}
                                // onClick={() => currentStep < steps.length && setCurrentStep(currentStep + 1)}
                                className="flex justify-center items-center border p-2 transition duration-200 text-sm border-gray-300 rounded bg-primary text-white hover:bg-primary-100 disabled:bg-primary-100 disabled:ring-0 focus:outline-none active:ring active:ring-primary-50"
                            >
                                Continue
                            </button>
                        </div>
                    </>

                )}


                {/* <div className="w-full py-6 hidden">
                    <div className="flex">
                        <div className="w-1/4">
                            <div className="relative mb-2">
                                <div className="w-10 h-10 mx-auto bg-green-500 rounded-full text-lg text-white flex items-center">
                                    <span className="text-center text-white w-full">
                                        <svg className="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                            <path className="heroicon-ui" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2zm14 8V5H5v6h14zm0 2H5v6h14v-6zM8 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className="text-xs text-center md:text-base">Select Server</div>
                        </div>

                        <div className="w-1/4">
                            <div className="relative mb-2">
                                <div className="absolute flex align-center items-center align-middle content-center" style={{ width: 'calc(100% - 2.5rem - 1rem)', top: '50%', transform: 'translate(-50%, -50%)' }}>
                                    <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                                        <div className="w-0 bg-green-300 py-1 rounded" style={{ width: '100%' }} />
                                    </div>
                                </div>

                                <div className="w-10 h-10 mx-auto bg-green-500 rounded-full text-lg text-white flex items-center">
                                    <span className="text-center text-white w-full">
                                        <svg className="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                            <path className="heroicon-ui" d="M19 10h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2h-2a1 1 0 0 1 0-2h2V8a1 1 0 0 1 2 0v2zM9 12A5 5 0 1 1 9 2a5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h5a5 5 0 0 1 5 5v2z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className="text-xs text-center md:text-base">Add User</div>
                        </div>

                        <div className="w-1/4">
                            <div className="relative mb-2">
                                <div className="absolute flex align-center items-center align-middle content-center" style={{ width: 'calc(100% - 2.5rem - 1rem)', top: '50%', transform: 'translate(-50%, -50%)' }}>
                                    <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                                        <div className="w-0 bg-green-300 py-1 rounded" style={{ width: '100%' }} />
                                    </div>
                                </div>

                                <div className="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center">
                                    <span className="text-center text-gray-600 w-full">
                                        <svg className="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                            <path className="heroicon-ui" d="M9 4.58V4c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v.58a8 8 0 0 1 1.92 1.11l.5-.29a2 2 0 0 1 2.74.73l1 1.74a2 2 0 0 1-.73 2.73l-.5.29a8.06 8.06 0 0 1 0 2.22l.5.3a2 2 0 0 1 .73 2.72l-1 1.74a2 2 0 0 1-2.73.73l-.5-.3A8 8 0 0 1 15 19.43V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.58a8 8 0 0 1-1.92-1.11l-.5.29a2 2 0 0 1-2.74-.73l-1-1.74a2 2 0 0 1 .73-2.73l.5-.29a8.06 8.06 0 0 1 0-2.22l-.5-.3a2 2 0 0 1-.73-2.72l1-1.74a2 2 0 0 1 2.73-.73l.5.3A8 8 0 0 1 9 4.57zM7.88 7.64l-.54.51-1.77-1.02-1 1.74 1.76 1.01-.17.73a6.02 6.02 0 0 0 0 2.78l.17.73-1.76 1.01 1 1.74 1.77-1.02.54.51a6 6 0 0 0 2.4 1.4l.72.2V20h2v-2.04l.71-.2a6 6 0 0 0 2.41-1.4l.54-.51 1.77 1.02 1-1.74-1.76-1.01.17-.73a6.02 6.02 0 0 0 0-2.78l-.17-.73 1.76-1.01-1-1.74-1.77 1.02-.54-.51a6 6 0 0 0-2.4-1.4l-.72-.2V4h-2v2.04l-.71.2a6 6 0 0 0-2.41 1.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className="text-xs text-center md:text-base">Setting</div>
                        </div>

                        <div className="w-1/4">
                            <div className="relative mb-2">
                                <div className="absolute flex align-center items-center align-middle content-center" style={{ width: 'calc(100% - 2.5rem - 1rem)', top: '50%', transform: 'translate(-50%, -50%)' }}>
                                    <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                                        <div className="w-0 bg-green-300 py-1 rounded" style={{ width: '100%' }} />
                                    </div>
                                </div>

                                <div className="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center">
                                    <span className="text-center text-gray-600 w-full">
                                        <svg className="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                            <path className="heroicon-ui" d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-2.3-8.7l1.3 1.29 3.3-3.3a1 1 0 0 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-2-2a1 1 0 0 1 1.4-1.42z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className="text-xs text-center md:text-base">Finished</div>
                        </div>
                    </div>
                </div> */}
            </div>
        </main>
    );
};

export default Register;
