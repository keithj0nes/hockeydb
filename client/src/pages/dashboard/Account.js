import React, { useState, useEffect } from 'react';
import { Tabs } from './components';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';


const accountTabs = [
    { name: 'Profile', key: 'profile', component: <Profile /> },
    // { name: 'Email', key: 'email', component: <Email /> },
    { name: 'Change Password', key: 'password', component: <ChangePassword /> },
];


const Account = () => {
    const [activeTab, setActiveTab] = useState(accountTabs[0].key);
    return (
        <div className="h-full p-4 sm:p-7">
            <div className="flex justify-between">
                <h1 className="text-3xl font-semibold">Account</h1>

                <button
                    type="button"
                    className="flex justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                >
                    Logout
                </button>
            </div>

            <Tabs active={activeTab} tabs={accountTabs} onChange={setActiveTab} />

            <div className="p-0">
                {accountTabs.map(item => {
                    if (item.key !== activeTab) return null;
                    return (
                        <div key={item.key}>
                            {item.component}
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default Account;
