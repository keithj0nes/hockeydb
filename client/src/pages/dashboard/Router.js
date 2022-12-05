/* eslint-disable react/no-children-prop */
import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
// import { logout } from '../../redux/slices/auth';
import { useAuth } from '../../hooks';

import Dashboard from './Dashboard';
import Seasons from './Seasons';
import SingleSeason from './SingleSeason';
import Account from './Account';
import Locations from './Locations';

import RegistrationWizard from './components/wizards/registration/RegistrationWizard';
import OpenRegistrations from './OpenRegistrations';

const ROLES = {
    Super: 1,
    Admin: 2,
    Scorekeeper: 3,
    Manager: 4,
    Player: 5,
};


// TODO: remove nav items depending on logged in user

const initialNavigation = [
    { title: 'Dashboard', to: '', icon: '', component: <Dashboard /> },
    { title: 'Seasons', to: 'seasons', icon: '', component: <Seasons />, allowed_roles: [ROLES.Super, ROLES.Admin] },
    { title: 'Seasons', to: 'seasons/:id', icon: '', component: <SingleSeason />, hide: true, allowed_roles: [ROLES.Super, ROLES.Admin] },
    { title: 'Seasons', to: 'seasons/:id/registrations/:registration_id', icon: '', component: <RegistrationWizard />, hide: true, allowed_roles: [ROLES.Super, ROLES.Admin] },

    // { title: 'Divisions', to: 'divisions', icon: '' },
    // { title: 'Teams', to: 'teams', icon: '' },
    { title: 'Locations', to: 'locations', icon: '', component: <Locations /> },
    { title: 'Users', to: 'users', icon: '' },
    { title: 'Announcements', to: 'announcements', icon: '' },
    { title: 'Messages', to: 'messages', icon: '' },
    { title: 'Pages', to: 'pages', icon: '' },
    { title: 'Payments', to: 'payments', icon: '' },
    { title: 'Settings', to: 'settings', icon: '' },
    { title: 'Account', to: 'account', icon: '', component: <Account />, hide: true },
];

const icon = (fill = 'fill-white') => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" className={fill}>
        <path d="M6,9H1A1,1,0,0,1,0,8V1A1,1,0,0,1,1,0H6A1,1,0,0,1,7,1V8A1,1,0,0,1,6,9Z" />
        <path d="M6,16H1a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H6a1,1,0,0,1,1,1v3A1,1,0,0,1,6,16Z" />
        <path d="M15,6H10A1,1,0,0,1,9,5V1a1,1,0,0,1,1-1h5a1,1,0,0,1,1,1V5A1,1,0,0,1,15,6Z" />
        <path d="M15,16H10a1,1,0,0,1-1-1V9a1,1,0,0,1,1-1h5a1,1,0,0,1,1,1v6A1,1,0,0,1,15,16Z" />
    </svg>
);

const Router = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isOpenMobile, setIsOpenMobile] = useState(false);
    const auth = useAuth();

    // TODO: this may not work depending on how long the user name / role is
    const [auth_role] = [...auth.roles].sort((a, b) => a.role_id - b.role_id);
    let navigation = initialNavigation;

    // TODO: be able to add more role id / nav menu items dynamically

    // if (auth.hasPermission([ROLES.Player])) {
    // navigation = [...initialNavigation, { title: 'Register', to: '/register', icon: '' }];
    navigation = [...initialNavigation, { title: 'Register', to: 'registrations', icon: '', component: <OpenRegistrations /> }];

    // }

    // if (auth.hasPermission([ROLES.Player])) {
    //     navigation = [...initialNavigation, { title: 'My Teams', to: 'my-teams', icon: '', component: <Seasons /> }];
    // }


    return (
        <main className="lg:flex">

            <div className="lg:hidden h-20 w-full bg-primary flex items-center p-4">
                <div className="h-10 w-10 rounded bg-blue-300" onClick={() => setIsOpenMobile(true)} />
            </div>

            <div className={classNames('hidden lg:flex flex-col justify-between h-screen p-5 pt-8 duration-300 bg-primary relative', {
                'w-72': isOpen,
                'w-20': !isOpen,
            })}
            >
                <DasbhoardNav isOpen={isOpen} setIsOpen={setIsOpen} navigation={navigation} auth_role={auth_role} />
            </div>

            <div className="flex-1 min-h-screen bg-light-gray">

                <Routes>
                    {navigation.map(page => (
                        <Route
                            key={page.to}
                            path={`${page.to}/*`}
                            element={(
                                <PrivateRoute allowed={page.allowed_roles}>
                                    {page.component}
                                </PrivateRoute>
                            )}
                            exact={page.exact}
                        />
                    ))}
                    <Route
                        path="/*"
                        element={(
                            <main style={{ padding: '1rem' }}>
                                <p>404 - There is nothing here in the Dashboard!</p>
                            </main>
                        )}
                    />
                </Routes>
                {/* <Routes>
                    {navigation.map(page => (
                        <Route
                            key={page.to}
                            path={`${page.to}`}
                            element={page.component}
                            exact={page.exact}
                        />
                    ))}
                    <Route
                        path="/*"
                        element={(
                            <main style={{ padding: '1rem' }}>
                                <p>404 - There is nothing here in the Dashboard!</p>
                            </main>
                        )}
                    />
                </Routes> */}
            </div>

            <Drawer
                className="lg:hidden"
                width="80%"
                placement="left"
                closable={false}
                onClose={() => setIsOpenMobile(false)}
                visible={isOpenMobile}
            >
                <div className="flex flex-col justify-between h-screen p-5 pt-8 duration-300 bg-primary relative">
                    <DasbhoardNav isOpen={isOpenMobile} setIsOpenMobile={setIsOpenMobile} navigation={navigation} auth_role={auth_role} />
                </div>
            </Drawer>
        </main>
    );
};

export default Router;

function PrivateRoute({ children, allowed }) {
    if (!allowed) return children;
    const auth = useAuth();

    // TODO: determine if we should should show a "no permission" page or redirect to the dashboard

    if (!auth.hasPermission(allowed)) {
        console.log('Not allowed at this route, redirecting to the dashboard');

        // TODO: show a slideout alert notifitying the user they do not have permission to view this route
        return <Navigate to="/dashboard" />;
    }
    return children;
}

PrivateRoute.propTypes = {
    children: PropTypes.any,
    allowed: PropTypes.array,
};


const DasbhoardNav = ({ isOpen, setIsOpen, setIsOpenMobile, navigation, auth_role }) => {
    const auth = useAuth();
    // const dispatch = useDispatch();

    return (
        <>
            <div>
                <div className="flex gap-x-4 items-center relative">
                    <img src="/images/logo.png" alt="Logo" className={classNames('w-10 rounded flex cursor-poiner duration-500')} />

                    <h1 className={classNames('text-white origin-left font-medium text-xl duration-100', {
                        'scale-0': !isOpen,
                    })}
                    >
                        USHL
                    </h1>

                    {/* <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="hidden lg:flex absolute cursor-pointer hover:shadow-lg hover:shadow-black/30  -right-9 transition duration-200 rounded-full items-center justify-center mr-0 bottom-1/2 w-8 h-8 bg-light-gray"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={classNames('h-6 w-6 stroke-black transition duration-200', { 'rotate-180': isOpen })} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </div> */}

                </div>

                <ul className="pt-6">
                    {navigation.map(link => {
                        if (link.hide) return null;
                        if (link.allowed_roles && !auth.hasPermission(link.allowed_roles)) return null;
                        return (
                            <li key={link.to} className="text-gray-300 group hover:text-white text-sm  cursor-pointer rounded-md hover:bg-primary-100">
                                <NavLink
                                    to={link.to}
                                    exact={(link.to === '').toString()}
                                    end={!link.to}
                                    onClick={() => !!setIsOpenMobile && setIsOpenMobile(false)}
                                    className={({ isActive }) => (isActive ? 'flex items-center p-2  hover:text-db-secondary text-db-secondary' : 'flex p-2  items-center gap-x-4 hover:text-white')}
                                    children={({ isActive }) => (
                                        <div className="flex h-full items-center gap-x-4">
                                            <div className={classNames('absolute transition duration-100 left-0 h-8 w-0.5 bg-db-secondary', {
                                                hidden: !isActive,
                                            })}
                                            />
                                            <div className="block p-1">
                                                {icon(isActive ? 'fill-db-secondary transition duration-100' : 'fill-white transition duration-100')}
                                            </div>
                                            <span className={classNames('origin-left duration-100', { 'scale-0': !isOpen })}>
                                                {link.title}
                                            </span>

                                            <div className={classNames('whitespace-nowrap text-white absolute hidden ml-1 mb-8 left-full py-1 px-2 rounded bg-gray-700', {
                                                'group-hover:block': !isOpen,
                                            })}
                                            >
                                                {link.title}
                                            </div>
                                        </div>
                                    )}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div
                onClick={() => setIsOpen(!isOpen)}
                className="hidden lg:flex absolute z-10 cursor-pointer shadow-lg hover:shadow-black/30 -right-4 transition duration-200 rounded-full items-center justify-center mr-0 bottom-1/2 w-8 h-8 bg-light-gray"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={classNames('h-6 w-6 stroke-black transition duration-200', { 'rotate-180': isOpen })} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </div>

            <div>
                {/* <div onClick={() => dispatch(logout())} className="text-gray-300 group relative flex items-center gap-x-4 p-2 hover:text-white text-sm  cursor-pointer rounded-md hover:bg-primary-100">
                    <div className="block">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <span className={classNames(' duration-100', { 'scale-0': !isOpen })}>
                        Logout
                    </span>

                    <div className={classNames('absolute hidden ml-6 mb-8 left-full py-1 px-2  rounded bg-gray-700', {
                        'group-hover:block': !isOpen,
                    })}
                    >
                        Logout
                    </div>
                </div> */}

                <div className="border-t border-gray-400 rounded w-full h-0 my-2" />


                <NavLink to="account">
                    <div className="text-gray-300 flex items-center gap-x-4 p-2 hover:text-white text-sm cursor-pointer rounded-md hover:bg-primary-100">
                        <div className="block">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>

                        <div className={classNames('whitespace-nowrap text-xs duration-100 w-full', { 'scale-0': !isOpen })}>
                            <div className="flex justify-between">
                                <span className="block font-bold">
                                    {auth.full_name}
                                </span>

                                <span className="block font-bold">
                                    {auth_role.name}
                                </span>
                            </div>
                            <span className="block">
                                {auth.email}
                            </span>
                        </div>
                    </div>
                </NavLink>


            </div>
        </>
    );
};

DasbhoardNav.propTypes = {
    isOpen: PropTypes.bool,
    setIsOpen: PropTypes.func,
    setIsOpenMobile: PropTypes.func,
    navigation: PropTypes.array,
    auth_role: PropTypes.object,
};
