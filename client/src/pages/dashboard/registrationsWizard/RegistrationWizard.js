import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Tabs } from '../components';
import { Loader } from '../../../components';
import { getRegistrationByRegIdAdmin } from '../../../redux/slices/registrations';

import WizardFields from './WizardFields';

// function mapObj(obj) {
//     return Object.entries(obj).map(([key, value]) => ({ key, value }));
// }

const currentRegistration = {
    name: 'testing 2020',
};

const myTabs2 = [
    { name: 'Fields', key: 'fields' },
    { name: 'Documents', key: 'documents' },
    { name: 'Waivers', key: 'waivers' },
    { name: 'Fees', key: 'fees' },
    { name: 'Payments', key: 'payments' },
    { name: 'Review & Publish', key: 'review' },
];


const RegistrationWizard = () => {
    const [activeTab, setActiveTab] = useState(myTabs2[0].key);

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

            <Tabs active={activeTab} tabs={myTabs2} onChange={setActiveTab} />

            {activeTab === 'fields' && (
                <WizardFields />
            )}

        </div>
    );
};

export default RegistrationWizard;
