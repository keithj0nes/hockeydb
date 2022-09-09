import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Popover } from 'antd';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { format, parseISO } from 'date-fns';
import { getSeasons } from '../../redux/slices/seasons';
import { Loader, Pagination } from '../../components';
import { Dropdown } from '../../components/dashboard';
import { DrawerCreateSeason } from './components';

import { useQueryParams } from '../../hooks/useQueryParams';


// import Toggle from '../../components/Toggle';

// TODO: use seasonTypes IN REDUX INSTEAD OF THIS
const seasonTypes = [
    { name: 'View All', value: '' },
    { name: 'Regular', value: 'Regular' },
    { name: 'Playoffs', value: 'Playoffs' },
    { name: 'Tournament', value: 'Tournament' },
];


// const filterConfig = {
//     Type: {
//         type: {
//             type: 'select',
//             options: [
//                 { name: 'View All', value: '' },
//                 { name: 'Regular', value: 'Regular' },
//                 { name: 'Playoffs', value: 'Playoffs' },
//                 { name: 'Tournament', value: 'Tournament' },
//             ],
//         },
//     },
//     Other: {
//         show_hidden: {
//             type: 'checkbox',
//         },
//     },
//     'Sort By': {
//         sort_by: {
//             type: 'select',
//             options: [
//                 { name: 'None', value: '' },
//                 { name: 'Name', value: 'name' },
//                 { name: 'Created', value: 'created_at' }, // TODO: change this to season start_date when adding to db
//                 { name: 'Type', value: 'type' },
//             ],
//             sub: {
//                 asc: true,
//                 desc: true,
//             },
//         },
//     },
// };


// TODO: look into whether encypting api call is a smart idea?
// ex: url.com/seasons?type=Tournament&dir=asc
// would be
// url.com/seasons?alk242klsjaklgj2020alkkdjf


const sortBy = [
    { name: 'None', value: '' },
    { name: 'Name', value: 'name' },
    { name: 'Created', value: 'created_at' }, // TODO: change this to season start_date when adding to db
    { name: 'Type', value: 'type' },
    { name: 'Active', value: 'is_active' },
];


const Seasons = () => {
    const PAGE_TITLE = 'Seasons';
    const [filters, setFilters] = useQueryParams(getSeasons);
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [isCreateVisible, setIsCreateVisible] = useState(false);


    // this omits the searched text from being being added to the filters length
    const filtersLength = Object.keys((({ search, page, ...f }) => f)(filters)).length;

    const inputRef = useRef();


    const { seasons, isFetching, pagination } = useSelector((state) => state.seasons);


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
                        <Dropdown options={seasonTypes} onChange={handleFilterChange} value={filters.type} name="type" />
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
                        <Dropdown options={sortBy} onChange={handleFilterChange} value={filters.sort} name="sort" />
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
                            onClick={() => {
                                const { search, ...rest } = filters;
                                setFilters(rest);
                                inputRef.current.value = '';
                            }}
                        >
                            <svg className="h-4 w-4 absolute right-2 top-3 stroke-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="h-8 lg:h-6 w-[3px] bg-gray-300 hidden md:block" />

                    <div className="flex space-x-5 items-center pb-5 pt-3 md:p-0 border-b border-gray-300 md:border-none w-full lg:w-auto">
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


                        {/* <div className="h-8 lg:h-6 w-[3px] bg-gray-300 lg:hidden" />
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
                        </Popover> */}

                    </div>
                </div>
            </div>

            {!isFetching && !seasons.length && (
                <div className="w-full flex items-center pt-20 justify-center">
                    {!!Object.keys(filters).length ? (
                        <p>No results found with your search criteria</p>
                    ) : (
                        <p>No seasons found. Start by creating a new season above</p>
                    )}
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
                                {/* <p className="text-xs font-bold text-black">10/16/2022</p> */}
                                <p className="text-xs font-bold text-black">{item.start_date ? format(parseISO(item.start_date), 'MM/dd/yyyy') : 'No start date selected'}</p>
                            </li>

                            <li className="rounded-lg p-2 flex justify-between odd:bg-white even:bg-light-gray">
                                <p className="text-xs text-gray-500">Expected Finish</p>
                                <p className="text-xs font-bold text-black">12/29/2022</p>
                            </li>

                            <li className="rounded-lg p-2 flex justify-between odd:bg-white even:bg-light-gray">
                                <p className="text-xs text-gray-500">Teams</p>
                                {/* <p className="text-xs font-bold text-black">44</p> */}
                                <p className="text-xs font-bold text-black">{item.teams_count}</p>
                            </li>

                            <li className="rounded-lg p-2 flex justify-between odd:bg-white even:bg-light-gray">
                                <p className="text-xs text-gray-500">Registered Players</p>
                                <p className="text-xs font-bold text-black">(need to db query) 659</p>
                            </li>
                        </ul>


                        <div className="flex justify-center pt-3">
                            <Link
                                to={item.id.toString()}
                                state={{ seasonName: item.name }}
                                className="flex w-1/2 justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                            >
                                Select {item.id}
                            </Link>
                        </div>

                    </div>
                ))}
            </div>

            {!!seasons.length && (
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
            )}

            <DrawerCreateSeason
                onClose={() => setIsCreateVisible(false)}
                visible={isCreateVisible}
            />
        </div>
    );
};

export default Seasons;


// { /* <Toggle /> */ }

// { /* <button type="button" className="w-full outline-none focus:bg-gray-100 hover:bg-gray-100 flex px-3 py-2 items-center">
//     <svg className="w-4 h-4 mr-3 invisible" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
//     <p>Name</p>
// </button>


// <button type="button" className="w-full outline-none focus:bg-gray-100 hover:bg-gray-100 flex px-3 py-2 items-center">
//     <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
//     <p>Name</p>
// </button>
// <p>Content</p>
// <p>Content</p> */ }

// { /* <input type="checkbox" className="form-checkbox rounded text-pink-500" />

// <label className="inline-flex items-center">
//     <input type="checkbox" className="rounded mr-2 checked:text-pink-500 border-green-500 focus:ring-indigo-400 focus:ring-opacity-25" />
//     Checkbox
// </label> */ }


// { /* <div className="p-4">
//     <div className="flex items-center mr-4 mb-2">
//         <input type="checkbox" id="A3-yes" name="A3-confirmation" value="yes" className="opacity-0 absolute h-8 w-8" />
//         <div className="bg-white border-2 rounded-md border-blue-400 w-8 h-8 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
//             <svg className="fill-current hidden w-3 h-3 text-blue-600 pointer-events-none" version="1.1" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg">
//                 <g fill="none" fillRule="evenodd">
//                     <g transform="translate(-9 -11)" fill="#1F73F1" fillRule="nonzero">
//                         <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
//                     </g>
//                 </g>
//             </svg>
//         </div>
//         <label htmlFor="A3-yes" className="select-none">Yes</label>
//     </div>
// </div> */ }
