/* eslint-disable react/no-children-prop */
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
// import PropTypes from 'prop-types';
// import { Drawer } from 'antd';
import { Routes, Route, Link, Outlet, useParams, useSearchParams, useLocation, matchPath, useNavigate, NavLink } from 'react-router-dom';
import { useAuth, useForm } from '../../hooks';
import { getRegistration, updatePlayerRegistration } from '../../redux/slices/registrations';

import WizardSelectPlayer from './registrationsWizard/wizard/WizardSelectPlayer';
import WizardPlayerInfo from './registrationsWizard/wizard/WizardPlayerInfo';
import WizardConfirmDetails from './registrationsWizard/wizard/WizardConfirmDetails';

import { toast } from '../../utils';

const steps = [
    // { name: 'Register As', com },
    { name: 'Who', slug: 'who', component: <WizardSelectPlayer /> },
    { name: 'Info', slug: 'info', component: <WizardPlayerInfo /> },
    // { name: 'Docs' },
    // { name: 'Waivers' },
    // { name: 'Fees' },
    // { name: 'Pay' },
    // { name: 'Review' },
    { name: 'Review', slug: 'review', component: <WizardConfirmDetails /> },
];


const Register = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isOpenMobile, setIsOpenMobile] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    // const user = useAuth();
    const formData = useForm({});
    const { isFetching, formFields: registrationFields, model } = useSelector((state) => state.registrations);

    const dispatch = useDispatch();
    const { registration_id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();


    const currentStep2 = useMemo(() => {
        const match = matchPath({ path: '/register/:id/:step' }, location.pathname);
        return match?.params?.step;
    }, [location?.pathname]);


    useEffect(() => {
        console.log(currentStep2, 'currentStep2');
        console.log(!Object.keys(formData?.fields).length, 'formData?.fields');

        // first time mounting and has from=X??? remove it
        setSearchParams({});
        // if (!currentStep2 && !Object.keys(formData?.fields).length) {
        if (!currentStep2 || !Object.keys(formData?.fields).length) {
            console.log('hereeee');
            // navigate(`${location?.pathname}/${steps[0].slug}`, { replace: true });
            navigate({ ...location, pathname: steps[0].slug }, { replace: true });
        }

        dispatch(getRegistration({ registration_id }));
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [currentStep]);


    // const handleNext = () => currentStep < steps.length && setCurrentStep(currentStep + 1);
    // const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);

    const handleBack = () => {
        const stepIndex = steps.findIndex(step => step.slug === currentStep2);
        return navigate({
            ...location,
            pathname: steps[stepIndex - 1].slug,
        }, {
            // replace: true,
            // state: location.state || {},
        });
    };


    const handleNext = async (indexToGoTo) => {
        const stepIndex = steps.findIndex(step => step.slug === currentStep2);
        const from = searchParams.get('from');

        console.log(indexToGoTo, 'indexToGoTo')
        console.log(currentStep2, 'current step');
        console.log(stepIndex, 'stepIndex')

        const goToStep = indexToGoTo || stepIndex + 1;

        if (stepIndex > 0) {
            // set up loading state here
            const didUpdate = await dispatch(updatePlayerRegistration({ registration_id, fields: formData.fields, step: stepIndex + 1 }));
            if (!didUpdate) return null;
        }


        console.log({ goToStep: steps[goToStep]?.slug });

        if (((stepIndex + 1) || goToStep) < steps.length) {
            return navigate({
                ...location,
                pathname: !!from ? from : steps[goToStep].slug,
                search: null,
            }, {
                // replace: true,
                // state: { },
            });
        }

        // this should navigate to a success page
        // like /dashboard/my/registrations
        return toast({}, 'SUBMITTED!!');
    };

    // console.log(registrationFields, 'registrationFields')

    // TODO: need to load in full data before redirecting to the specific step page


    return (
        <main className="lg:flex">

            <div className="w-full bg-primary items-center p-4 lg:hidden">
                {/* <div className="h-10 w-10 rounded bg-blue-300" onClick={() => setIsOpenMobile(true)} /> */}

                {/* <h2 className="text-white block">Step name here</h2> */}

                <Link
                    to="/dashboard/registrations"
                    // className="border whitespace-nowrap border-green-500 rounded inline-flex justify-center gap-x-2 items-center p-2"
                    className="text-gray-300 group relative flex items-center gap-x-4 p-2 text-sm rounded-md hover:bg-primary-100 hover:text-white "
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Registrations
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
                <div>
                    <Link
                        to="/dashboard/registrations"
                        // className="border whitespace-nowrap border-green-500 rounded inline-flex justify-center gap-x-2 items-center p-2"
                        className="text-gray-300 group relative flex items-center gap-x-4 p-2 text-sm rounded-md hover:bg-primary-100 hover:text-white "
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Registrations
                    </Link>


                    <ul className="pt-8">
                        {steps.map((step, ind) => {
                            const registerAs = formData.fields?.['register-as'];
                            const foundRegisteringUser = model.registered_players?.find(item => item.value['register-as'] === registerAs);

                            const lastStepBySubmission = foundRegisteringUser?.step;
                            const thisPageStepIndex = steps.findIndex(step => step.slug === currentStep2);
                            const isNewSubmission = !foundRegisteringUser && !!Object.keys(formData.fields).length && thisPageStepIndex > 0;

                            let isDisabled = false;
                            let ico;

                            if (currentStep2 === steps[0].slug || !registerAs) {
                                ico = (<svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>);
                                if (ind > 0) {
                                    isDisabled = true;
                                }
                            } else if (lastStepBySubmission >= ind) {
                                ico = (<svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>);
                            } else if (isNewSubmission && thisPageStepIndex >= ind) {
                                ico = (<svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>);
                            } else {
                                isDisabled = true;
                                ico = (<svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
                            }

                            return (
                                <li key={step.slug} className={classNames('text-gray-300 group hover:text-white text-sm cursor-pointer rounded-md', { 'hover:bg-primary-100': !isDisabled })}>
                                    <NavLink
                                        onClick={e => isDisabled && e.preventDefault()}
                                        to={step.slug}
                                        // className={({ isActive }) => (isActive ? 'flex items-center p-2 disabled:bg-red-100 hover:text-db-secondary text-db-secondary' : 'flex p-2  items-center gap-x-4 hover:text-white')}
                                        className={({ isActive }) => {
                                            if (isActive) {
                                                return classNames('flex items-center p-2 hover:text-db-secondary text-db-secondary', {
                                                    'opacity-50 cursor-not-allowed': isDisabled,
                                                });
                                            }
                                            return classNames('flex p-2 items-center gap-x-4 hover:text-white', {
                                                'opacity-50 cursor-not-allowed': isDisabled,
                                            });
                                        }}
                                        children={({ isActive }) => (
                                            <div className="flex h-full items-center gap-x-4">
                                                <div className={classNames('absolute transition duration-100 left-0 h-8 w-0.5 bg-db-secondary', {
                                                    hidden: !isActive,
                                                })}
                                                />
                                                <div className="block p-1">
                                                    {ico}
                                                </div>
                                                <span className={classNames('origin-left duration-100', { 'scale-0': !isOpen })}>
                                                    {step.name}
                                                </span>

                                                <div className={classNames('whitespace-nowrap text-white absolute hidden ml-1 mb-8 left-full py-1 px-2 rounded bg-gray-700', {
                                                    'group-hover:block': !isOpen,
                                                })}
                                                >
                                                    {step.name}
                                                </div>
                                            </div>
                                        )}
                                    />
                                </li>
                            );
                        })}
                    </ul>

                </div>
            </div>

            {/* <div className="flex-1 min-h-screen bg-light-gray"> */}
            <div className="flex-1 h-screen overflow-scroll bg-light-gray">

                <Outlet
                    context={{
                        onNext: handleNext,
                        onBack: handleBack,
                        formData,
                        model,
                        steps,
                    }}
                />

            </div>
        </main>
    );
};

// export default Register;

const RegisterLayout = (props) => {
    console.log(props, 'props');
    return (
        <Routes>
            {/* <Route path="*" element={<PositionWizard {...props} />}> */}
            {/* <Route path="title" element={<WizardSelectPlayer onNext={handleNext} onBack={handleBack} formData={formData} model={model} />} /> */}

            {/* <Route path="/" element={<Account />} /> */}
            <Route path="*" element={<Register />}>
                {/* <Route index path={null} element={<Account />} /> */}
                {steps.map(step => (
                    <Route key={step.slug} path={step.slug} element={step.component} />
                ))}
            </Route>
            {/* </Route> */}

        </Routes>
    );
};

export default RegisterLayout;
