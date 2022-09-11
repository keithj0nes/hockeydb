import React, { useState, useEffect } from 'react';
import { Tabs } from './components';
import Profile from './components/Profile';


const ChangePassword = () => (
    <div>
        Change Password Tab
        <p>current password</p>
        <p>new password</p>
        <p>confirm new password</p>

        <p>add strength package</p>
    </div>
);

const accountTabs = [
    { name: 'Profile', key: 'profile', component: <Profile /> },
    // { name: 'Email', key: 'email', component: <Email /> },
    { name: 'Change Password', key: 'password', component: <ChangePassword /> },
];


const Account = () => {
    const [activeTab, setActiveTab] = useState(accountTabs[0].key);
    return (
        <div className="h-full p-4 sm:p-7">
            <h1 className="text-3xl font-semibold">Account</h1>

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
