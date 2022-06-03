/* eslint-disable react/no-children-prop */
import React from 'react';
// import { useDispatch } from 'react-redux';
// import classNames from 'classnames';
// import { Drawer } from 'antd';
// import { Routes, Route, NavLink } from 'react-router-dom';
// import { logout } from '../../../redux/slices/auth';
// import { useAuth } from '../../../hooks';


const Dashboard = () => {
    const PAGE_TITLE = 'Dashboard';

    return (
        <div className="h-full p-4 sm:p-7">
            <h1 className="text-3xl font-semibold">{PAGE_TITLE}</h1>

            <div className="mt-8 flex flex-wrap gap-x-5">

                {/* card */}

                <div className="bg-white rounded w-full sm:w-64 border border-gray-200">
                    <h4 className="px-5 py-3 border-b border-gray-200 text-base font-semibold">Payments</h4>
                    <div className="p-5">

                        <div className="mb-3">
                            <div className="flex justify-between pb-1">
                                <p>Paid in full</p>
                                <p>44</p>
                            </div>

                            <div className="bg-gray-300 rounded-lg h-1">
                                <div className="bg-green-500 h-full rounded-lg" style={{ width: '29%' }} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="flex justify-between pb-1">
                                <p>Monthly payments</p>
                                <p>90</p>
                            </div>

                            <div className="bg-gray-300 rounded-lg h-1">
                                <div className="bg-red-500 h-full rounded-lg" style={{ width: '79%' }} />
                            </div>
                        </div>


                        <button type="button" className="flex items-center mt-5 text-indigo-700 hover:text-indigo-400 duration-200">
                            View all payments
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>


                <div className="bg-white rounded w-full sm:w-64 border border-gray-200 mt-4 sm:mt-10">
                    <h4 className="px-5 py-3 border-b border-gray-200 text-base font-semibold">Registrations</h4>
                    <div className="p-5">

                        <div className="mb-3">
                            <div className="flex justify-between pb-1">
                                <p>Completed</p>
                                <p>57/100</p>
                            </div>

                            <div className="bg-gray-300 rounded-lg h-1">
                                <div className="bg-green-500 h-full rounded-lg" style={{ width: '57%' }} />
                            </div>
                        </div>

                        {/* <div className="mb-3">
                            <div className="flex justify-between pb-1">
                                <p>Pending</p>
                                <p>90</p>
                            </div>

                            <div className="bg-gray-300 rounded-lg h-1">
                                <div className="bg-red-500 h-full rounded-lg" style={{ width: '79%' }} />
                            </div>
                        </div> */}


                        <button type="button" className="flex items-center mt-5 text-indigo-700 hover:text-indigo-400 duration-200">
                            View all registrations
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                    </div>

                </div>


                <div className="bg-white p-5 rounded w-full sm:w-64 border border-gray-200 mt-4 sm:mt-10">
                    <p className="text-2xl font-bold">$8000.00</p>
                    <p>Total revenue</p>
                </div>


                <div className="bg-blue-50 p-5 rounded w-full sm:w-96 border border-blue-300 mt-4 sm:mt-10">
                    <div className="flex justify-between">
                        <h4 className="text-base font-semibold">Upgrade your plan </h4>

                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    <p className="text-gray-600 my-2">Upgrading your plan opens up opportunities for your players to have a more interactive experience with your league.</p>

                    <button type="button" className="flex items-center text-indigo-700 hover:text-indigo-400 duration-200">
                        Learn more about upgrading
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
