import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { logout } from '../../redux/slices/auth';
import { useAuth } from '../../hooks';

const OpenRegistrations = () => {
    const PAGE_TITLE = 'Registrations';
    return (
        <div className="h-screen overflow-scroll p-4 sm:p-7 relative">

            <div className="flex justify-between">
                <h1 className="text-3xl font-semibold">{PAGE_TITLE}</h1>
            </div>


            <div className="mt-10" />

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
            </button>

        </div>

    );
};

export default OpenRegistrations;
