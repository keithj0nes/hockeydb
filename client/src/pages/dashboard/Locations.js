import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Popover } from 'antd';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { format, parseISO } from 'date-fns';
import { Loader, Pagination } from '../../components';
import { Dropdown } from '../../components/dashboard';
import { DrawerCreateSeason } from './components';

import { getLocations } from '../../redux/slices/locations';

import { useQueryParams } from '../../hooks/useQueryParams';


const Locations = () => {
    const PAGE_TITLE = 'Locations';
    const [filters, setFilters] = useQueryParams(getLocations);
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [isCreateVisible, setIsCreateVisible] = useState(false);


    // this omits the searched text from being being added to the filters length
    const filtersLength = Object.keys((({ search, page, ...f }) => f)(filters)).length;

    const inputRef = useRef();


    const { locations, isFetching, pagination } = useSelector((state) => state.locations);

    console.log(locations, 'locations');

    const dispatch = useDispatch();
    const location = useLocation();


    const handleFilterChange = e => {
        const _filters = { ...filters };

        if (e.target.type === 'checkbox' ? e.target.checked === false : e.target.value === '') {
            delete _filters[e.target.name];
        } else {
            _filters[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        }
        delete _filters.page;

        setFilters(_filters);
        setShowFiltersModal(false);
    };

    const debouncedChangeHandler = useMemo(() => debounce(handleFilterChange, 600), []);
    // Stop the invocation of the debounced function
    // after unmounting
    useEffect(() => () => {
        debouncedChangeHandler.cancel();
    }, []);


    const content = (
        <div className="w-64 py-1 px-2">
            <form className="hiddeen">
                <fieldset disabled={isFetching}>

                    <button
                        type="button"
                        onClick={() => {
                            inputRef.current.value = '';
                            setFilters(null);
                            setShowFiltersModal(false);
                        }}
                        className="text-blue-400 py-2"
                    >
                        Clear Filters
                    </button>

                    <div className="pb-4">
                        <p className="pb-1">Type</p>
                        {/* <Dropdown options={seasonTypes} onChange={handleFilterChange} value={filters.type} name="type" /> */}
                    </div>

                    <div className="pb-2">
                        <p className="pb-1">Other</p>
                        <div className="max-w-sm mx-auto">
                            <label className="inline-flex items-center">
                                <input
                                    onChange={handleFilterChange}
                                    name="show_hidden"
                                    type="checkbox"
                                    // defaultChecked={filters.show_hidden}
                                    checked={filters.show_hidden || false}
                                    className="text-indigo-500 w-4 h-4 mr-2 focus:ring-transparent focus:ring-opacity-100 border border-gray-300 rounded"
                                />
                                Hidden
                            </label>
                        </div>
                    </div>

                    <div className="mb-2" />

                    <div className="pb-4">
                        <div className="flex justify-between">
                            <p className="pb-1">Sort By</p>

                            <div className="flex gap-x-2">
                                <button
                                    onClick={() => handleFilterChange({ target: { name: 'dir', value: filters.dir === 'asc' ? '' : 'asc' } })}
                                    type="button"
                                    className={classNames('text-xs p-0.5 px-1 self-center rounded-sm', { 'font-bold bg-[#dce5f8] ': filters.dir === 'asc' })}
                                >
                                    ASC
                                </button>

                                <button
                                    onClick={() => handleFilterChange({ target: { name: 'dir', value: filters.dir === 'desc' ? '' : 'desc' } })}
                                    type="button"
                                    className={classNames('text-xs p-0.5 px-1 self-center rounded-sm', { 'font-bold bg-[#dce5f8] ': filters.dir === 'desc' })}
                                >
                                    DESC
                                </button>
                            </div>

                        </div>
                        {/* <Dropdown options={sortBy} onChange={handleFilterChange} value={filters.sort} name="sort" /> */}
                    </div>

                </fieldset>
            </form>
        </div>
    );

    return (
        <div className="h-screen overflow-scroll p-4 sm:p-7 relative">

            {/* comment out loading to avoid flicker for now */}
            {/* {isFetching && <Loader />} */}

            <div className="flex justify-between">
                <h1 className="text-3xl font-semibold">{PAGE_TITLE}</h1>

                <button
                    type="button"
                    className="flex justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                    onClick={() => setIsCreateVisible(true)}
                >
                    Create Location
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
                            className="w-full lg:w-64 border py-2 px-7 text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                            placeholder={`Search ${PAGE_TITLE}`}
                            onChange={debouncedChangeHandler}
                            name="search"
                            // use ref with defaultvalue to eliminate weirdness with debouncing
                            defaultValue={filters.search}
                            ref={inputRef}
                        />

                        <button
                            type="button"
                            className={`${!filters.search?.length && 'hidden'}`}
                            onClick={() => {
                                const { search, ...rest } = filters;
                                setFilters(rest);
                                inputRef.current.value = '';
                            }}
                        >
                            <svg className="h-4 w-4 absolute right-2 top-3 stroke-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* <div className="h-8 lg:h-6 w-[3px] bg-gray-300 hidden md:block" /> */}

                    {/* <div className="flex space-x-5 items-center pb-5 pt-3 md:p-0 border-b border-gray-300 md:border-none w-full lg:w-auto">
                        <Popover visible={showFiltersModal} onVisibleChange={visible => setShowFiltersModal(visible)} content={content} trigger="click" placement="bottomRight">
                            <button
                                type="button"
                                className="w-full relative lg:w-32 flex justify-center items-center gap-2 border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                Filter

                                {!!filtersLength && (
                                    <div className={classNames('absolute -top-2 -right-2 bg-red-400 text-white h-6 w-6 rounded-full flex items-center justify-center', {
                                        'text-sm': filtersLength < 10,
                                        'text-xs': filtersLength > 9,
                                    })}
                                    >
                                        {filtersLength > 9 ? 9 : filtersLength}
                                        {filtersLength > 9 && ('+')}
                                    </div>
                                )}
                            </button>
                        </Popover>


                        <div className="h-8 lg:h-6 w-[3px] bg-gray-300 lg:hidden" />
                        <Popover content={content} trigger="click" placement="bottomRight">
                            <button
                                type="button"
                                className="w-full flex justify-center  items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Sort
                            </button>
                        </Popover>

                    </div> */}
                </div>
            </div>

            {!isFetching && !locations.length && (
                <div className="w-full flex items-center pt-20 justify-center">
                    {!!Object.keys(filters).length ? (
                        <p>No results found with your search criteria</p>
                    ) : (
                        <p>No locations found. Start by creating a new location above</p>
                    )}
                </div>

            )}

            {/* <div className="md:grid md:grid-cols-2 gap-x-10"> */}
            <div className="bg-white my-5 shadow-md">

                {locations.map(item => {
                    const b = '';
                    return (
                        <div className="py-3 px-4 border-b flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    {/* TODO: on click of name, send to games page with filter of location.id */}
                                    <p
                                        className="text-lg text-black font-semibold"
                                        onClick={() => console.log('on click of name, send to games page with filter of location.id')}
                                    >
                                        {item.name}
                                    </p>
                                    <p className="text-sm text-gray-400">(22 games this season)</p>
                                </div>
                                <p className="text-gray-500">{item.address}</p>
                            </div>

                            <div>
                                <button type="button" onClick={() => console.log('button clicked')}>Edit</button>
                            </div>
                        </div>
                    );
                })}

            </div>

            {/* {!!seasons.length && (
                <div className="flex justify-end sticky top-[100vh]">
                    <Pagination
                        defaultCurrent={pagination.page}
                        total={pagination.total_count}
                        pageSize={pagination.limit}
                        onChange={page => {
                            const _filters = { ...filters, page };
                            if (page === 1) delete _filters.page;
                            setFilters(_filters);
                        }}
                    />
                </div>
            )} */}

            {/* <DrawerCreateSeason
                onClose={() => setIsCreateVisible(false)}
                visible={isCreateVisible}
            /> */}
        </div>
    );
};

export default Locations;
