import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { useParams } from 'react-router-dom';
import { Routes, Route, Link, Outlet, useParams, useSearchParams, useLocation, matchPath, useNavigate, NavLink } from 'react-router-dom';

import { Tabs } from '../..';
import { Loader } from '../../../../../components';
import { getRegistrationByRegIdAdmin } from '../../../../../redux/slices/registrations';

import WizardFields from './WizardFields';

// function mapObj(obj) {
//     return Object.entries(obj).map(([key, value]) => ({ key, value }));
// }

const currentRegistration = {
    name: 'testing 2020',
};

export const registrationTabs = [
    { name: 'Fields', key: 'fields', component: <WizardFields /> },
    { name: 'Documents', key: 'documents' },
    { name: 'Waivers', key: 'waivers' },
    { name: 'Fees', key: 'fees' },
    { name: 'Payments', key: 'payments' },
    { name: 'Review & Publish', key: 'review' },
];


const RegistrationWizard = () => {
    const [activeTab, setActiveTab] = useState(registrationTabs[0].key);

    const { isFetching } = useSelector((state) => state.registrations);
    const dispatch = useDispatch();
    const { id: season_id, registration_id } = useParams();

    useEffect(() => {
        dispatch(getRegistrationByRegIdAdmin({ season_id, registration_id }));
    }, []);


    return (
        <div className="h-screen p-4 sm:p-7 overflow-scroll relative">

            {isFetching && <Loader />}

            <div className="flex justify-between items-start">
                <h1 className="text-3xl font-semibold">{currentRegistration.name}</h1>
            </div>

            <Tabs navLink active={activeTab} tabs={registrationTabs} onChange={setActiveTab} />

            <Outlet />

            {/* {activeTab === 'fields' && (
                <WizardFields />
            )} */}

            {/* {activeTab === 'waivers' && (
                <WizardFields />
            )} */}

        </div>
    );
};

// export default RegistrationWizard;

const RegistrationLayout = (props) => {
    console.log(props, 'props');
    return (
        <Routes>
            {/* <Route path="*" element={<PositionWizard {...props} />}> */}
            {/* <Route path="title" element={<WizardSelectPlayer onNext={handleNext} onBack={handleBack} formData={formData} model={model} />} /> */}

            {/* <Route path="/" element={<Account />} /> */}
            <Route path="*" element={<RegistrationWizard />}>
                {registrationTabs.map(tab => (
                    <Route key={tab.key} path={tab.key} element={tab.component} />
                ))}
            </Route>
            {/* </Route> */}

        </Routes>
    );
};

export default RegistrationLayout;


// new naming convetion -
// ADMIN views will be REGISTRATION
// non-admin will be REGISTER
