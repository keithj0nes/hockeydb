import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import classNames from 'classnames';
// import PropTypes from 'prop-types';
// import { Drawer } from 'antd';
import { format, parseISO } from 'date-fns';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
// import { logout } from '../../redux/slices/auth';
// import { useAuth } from '../../hooks';
import { getOpenRegistrations } from '../../redux/slices/registrations';
import { Loader, Pagination } from '../../components';


const OpenRegistrations = () => {
    const PAGE_TITLE = 'Registrations';
    const dispatch = useDispatch();
    const { isFetching, openRegistrations, myRegistrations } = useSelector((state) => state.registrations);

    useEffect(() => {
        if (!openRegistrations.length) {
            dispatch(getOpenRegistrations());
        }
    }, []);

    const renderSpotsLeft = (regTemplate) => {
        if (!regTemplate.show_max_spots) return null;
        if (regTemplate.max_spots) {
            return (
                <p className="font-semibold text-xs pt-1">{regTemplate.max_spots - regTemplate.filled_spots} spots left</p>
            );
        }
        return (
            <p className="font-semibold text-xs pt-1">{regTemplate.filled_spots} spots filled</p>
        );
    };

    // this filters my registrations with open registrations
    // const result = myRegistrations.filter(item => openRegistrations.every(fd => fd.id !== item.registration_template_id));
    // console.log(result, 'resul!!!')

    // TODO: need to determine if a users registration is completed or not

    return (
        <div className="h-screen overflow-scroll p-4 sm:p-7 relative max-w-5xl">

            {isFetching && <Loader />}

            <div className="flex justify-between">
                <h1 className="text-3xl font-semibold">{PAGE_TITLE}</h1>
            </div>


            <div className="mt-10" />

            <h3 className="text-xl mb-4 font-semibold">Open Registrations</h3>

            {openRegistrations.map(item => {
                console.log(item, 'item')
                // const bb = myRegistrations.find(reg => reg.registration_template_id === item.id);
                // console.log(bb, 'bb')
                return (
                    <Link
                        key={item.id}
                        to={`/register/${item.id}`}
                        className="w-full my-4 relative flex gap-2 border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                    >
                        <div className="w-full flex justify-between">
                            <div className="bg-yllow-100 text-left">
                                <p>{item.name}</p>
                                {renderSpotsLeft(item)}
                            </div>

                            <div className="bg-ble-100 flex items-center">
                                FINISH = NEED TO ADD
                            </div>
                        </div>
                    </Link>
                );
            })}


            <div className="my-10 border-b border-gray-300" />

            <h3 className="text-xl mb-4 font-semibold">My Completed Registrations</h3>
            <p>Send to page of previously filled out data</p>


            {myRegistrations.map(item => {
                // console.log(item, ' myRegistrations');
                const b = '';
                return (
                    <button
                        type="button"
                        key={item.registration_id}
                        // to={`/register/${item.id}`}
                        className="w-full my-4 relative flex gap-2 border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                    >
                        <div className="w-full flex justify-between">
                            <div className="bg-yllow-100 text-left">
                                <p>{item.name}</p>

                                <div className="flex">
                                    <p className="text-xs">Registration #{item.registration_id} for {item.full_name}</p>
                                    {item.submitted_at && (<p className="text-xs">&nbsp;| Submitted: {format(parseISO(item.submitted_at), 'MM/dd/yyyy hh:mmaaa')}</p>)}

                                </div>
                            </div>

                            <div className="flex items-center">
                                {/* <p className="text-green-600">Completed</p> */}
                                <button type="button" className="flex items-center text-indigo-700 hover:text-indigo-400 duration-200">View</button>

                            </div>
                        </div>
                    </button>
                );
            })}


            {/* <div className="my-10 border-b border-gray-300" /> */}
            {/*
            <Link
                to="/register/5"
                className="w-full my-4 relative flex gap-2 border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
            >
                <div className="w-full flex justify-between">
                    <div className="bg-yllow-100 text-left">
                        <p>2022 Open League</p>
                        <p className="font-semibold text-xs pt-1">28 spots left</p>
                    </div>

                    <div className="bg-ble-100 flex items-center">
                        FINISH
                    </div>
                </div>
            </Link>


            <button
                type="button"
                className="w-full my-4 relative flex gap-2 border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
            >
                <div className="w-full flex justify-between">
                    <div className="bg-yllow-100 text-left">
                        <p>2020 Open League</p>
                        <p className="font-semibold text-xs pt-1">13 spots left</p>
                    </div>

                    <div className="bg-ble-100 flex items-center">
                        OPEN
                    </div>
                </div>
            </button>

            <button
                type="button"
                className="w-full my-4 relative flex gap-2 border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
            >
                <div className="w-full flex justify-between">
                    <div className="bg-yllow-100 text-left">
                        <p>2019 Open League</p>
                        <p className="font-semibold text-xs pt-1">No spots left</p>
                    </div>

                    <div className="bg-ble-100 flex items-center">
                        CLOSED
                    </div>
                </div>
            </button> */}

        </div>

    );
};

export default OpenRegistrations;
