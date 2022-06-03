import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Popover } from 'antd';
import classNames from 'classnames';
import { getSeasons } from '../../redux/slices/seasons';
import { Loader } from '../../components';

import { useQueryParams } from '../../hooks/useQueryParams';

const filterTypes = ['Type', 'Hidden'];

const Seasons = () => {
    const PAGE_TITLE = 'Seasons';
    // const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useQueryParams(getSeasons);

    console.log({ filters, setFilters })


    const { seasons, isLoading } = useSelector((state) => state.seasons);
    const dispatch = useDispatch();
    const location = useLocation();


    // console.log(searchParams, 'searchParams');
    // console.log(location, 'location')

    // useEffect(() => {
    //     // const currentParams = Object.fromEntries([...searchParams]);
    //     // console.log(currentParams); // get new values onchange
    //     // console.log(getSeasons, 'get seasons')
    //     console.log(location.search, ' LOCLAT ION>SIRAECH');

    //     !seasons.length && dispatch(getSeasons(location.search));
    // }, [searchParams]);

    // useEffect(() => {

    // }, [])

    console.log(seasons, ' seassonnss');

    const content = (
        <div className="w-44 py-1">

            {/* {filterTypes.map(item => (
                <FilterItem item={item} key={item} setSearchParams={setSearchParams} />
            ))} */}

            <div className="hidden">


                <button type="button" className="w-full outline-none focus:bg-gray-100 hover:bg-gray-100 flex px-3 py-2 items-center">
                    <svg className="w-4 h-4 mr-3 invisible" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <p>Name</p>
                </button>


                <button type="button" className="w-full outline-none focus:bg-gray-100 hover:bg-gray-100 flex px-3 py-2 items-center">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <p>Name</p>
                </button>
                <p>Content</p>
                <p>Content</p>

                <input type="checkbox" className="form-checkbox rounded text-pink-500" />

                <label className="inline-flex items-center">
                    <input type="checkbox" className="rounded mr-2 checked:text-pink-500 border-green-500 focus:ring-indigo-400 focus:ring-opacity-25" />
                    Checkbox
                </label>

                <div className="max-w-sm mx-auto p-8">
                    <label className="inline-flex items-center">
                        <input className="text-indigo-500 w-4 h-4 mr-2 focus:ring-transparent focus:ring-opacity-100 border border-gray-300 rounded" type="checkbox" />
                        Checkbox
                    </label>
                </div>


                <div className="p-4">
                    <div className="flex items-center mr-4 mb-2">
                        <input type="checkbox" id="A3-yes" name="A3-confirmation" value="yes" className="opacity-0 absolute h-8 w-8" />
                        <div className="bg-white border-2 rounded-md border-blue-400 w-8 h-8 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                            <svg className="fill-current hidden w-3 h-3 text-blue-600 pointer-events-none" version="1.1" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fillRule="evenodd">
                                    <g transform="translate(-9 -11)" fill="#1F73F1" fillRule="nonzero">
                                        <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <label htmlFor="A3-yes" className="select-none">Yes</label>
                    </div>
                </div>
            </div>

        </div>
    );


    return (
        <div className="h-full p-4 sm:p-7 relative">

            {isLoading && <Loader />}

            <div className="flex justify-between">
                <h1 className="text-3xl font-semibold">{PAGE_TITLE}</h1>

                <button
                    type="button"
                    className="flex justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                    onClick={() => setFilters({ hidden: true })}
                >
                    Create Season
                </button>
            </div>


            <div className="mt-8">

                <div className="md:flex md:space-x-5 pb-4 md:border-b border-gray-300 items-center justify-end">


                    <div className="relative w-full lg:w-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2 top-3 stroke-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>

                        <input
                            type="text"
                            className="w-full lg:w-64 border py-2 pl-8 pr-2 text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                            placeholder="Search meeee"
                        />
                    </div>

                    <div className="h-8 lg:h-6 w-[3px] bg-gray-300 hidden md:block" />


                    <div className="flex space-x-5 items-center pb-5 pt-3 md:p-0 border-b border-gray-300 md:border-none w-full lg:w-auto">

                        <Popover content={content} trigger="click" placement="bottomRight">
                            <button
                                type="button"
                                className="w-full lg:w-32 flex justify-center items-center gap-2 border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                Filter
                            </button>
                        </Popover>


                        <div className="h-8 lg:h-6 w-[3px] bg-gray-300 lg:hidden" />
                        <Popover content={content} trigger="click" placement="bottomRight">

                            <button
                                type="button"
                                className="w-full flex justify-center  lg:hidden items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Sort
                            </button>
                        </Popover>

                    </div>
                </div>


            </div>

            {!isLoading && !seasons.length && !!Object.keys(filters).length && (
                <div className="w-full flex items-center pt-20 justify-center">

                    <p>No results found with your search criteria</p>
                </div>

            )}

            <div className="md:grid md:grid-cols-2 gap-x-10">
                {seasons.map(item => (
                    <div key={item.id} className="w-full bg-white my-5 p-3 shadow-md">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <p className="text-gray-500">{item.type}</p>

                            <p className={classNames('px-2 py-1 rounded-lg', {
                                'bg-green-100 text-green-600': item.is_active,
                                'bg-gray-100 text-gray-600': !item.is_active,
                            })}
                            >
                                {item.is_active ? 'Active' : 'Inactive'}
                            </p>
                        </div>

                        <h3 className="text-lg text-black font-semibold pt-2">{item.name}</h3>

                        <ul className="odd:bg-white even:bg-slate-100">
                            <li className="rounded-lg p-2 flex justify-between odd:bg-white even:bg-light-gray">
                                <p className="text-xs text-gray-500">Start</p>
                                <p className="text-xs font-bold text-black">10/16/2022</p>
                            </li>

                            <li className="rounded-lg p-2 flex justify-between odd:bg-white even:bg-light-gray">
                                <p className="text-xs text-gray-500">Expected Finish</p>
                                <p className="text-xs font-bold text-black">12/29/2022</p>
                            </li>

                            <li className="rounded-lg p-2 flex justify-between odd:bg-white even:bg-light-gray">
                                <p className="text-xs text-gray-500">Teams</p>
                                <p className="text-xs font-bold text-black">44</p>
                            </li>

                            <li className="rounded-lg p-2 flex justify-between odd:bg-white even:bg-light-gray">
                                <p className="text-xs text-gray-500">Registered Players</p>
                                <p className="text-xs font-bold text-black">659</p>
                            </li>
                        </ul>


                    </div>
                    // <div key={item.id} className="bg-yellow-100 my-5 p-3">
                    //     {item.name}
                    // </div>
                ))}
            </div>
        </div>
    );
};

export default Seasons;


// playing around with futue sorting / filtering dropdown

const FilterItem = ({ item, setSearchParams }) => {
    const [isChecked, setIsChecked] = useState(false);
    console.log(item, 'item')
    return (
        <button type="button" onClick={() => { setIsChecked(!isChecked); setSearchParams({ hi: 'lol' }); }} className="w-full outline-none focus:bg-gray-100 hover:bg-gray-100 flex px-3 py-2 items-center">
            <svg className={classNames('w-4 h-4 mr-3', { invisible: !isChecked })} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            <p>{item}</p>
        </button>
    );
};
