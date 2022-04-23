import React, { useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSeasons } from '../../../redux/slices/seasons';

const Seasons = () => {
    const PAGE_TITLE = 'Seasons';
    const [searchParams, setSearchParams] = useSearchParams();

    const { seasons, isLoading } = useSelector((state) => state.seasons);
    const dispatch = useDispatch();
    const location = useLocation();


    // console.log(searchParams, 'searchParams');
    // console.log(location, 'location')

    useEffect(() => {
        const currentParams = Object.fromEntries([...searchParams]);
        console.log(currentParams); // get new values onchange
        // console.log(getSeasons, 'get seasons')

        dispatch(getSeasons(location.search));
    }, [searchParams]);

    console.log(seasons, ' seassonnss');

    return (
        <div className="h-full p-4 sm:p-7">

            <div className="flex justify-between">
                <h1 className="text-3xl font-semibold">{PAGE_TITLE}</h1>

                <button
                    type="button"
                    className="flex justify-center items-center border p-2 text-lg lg:text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                >
                    Create Season
                </button>
            </div>


            <div className="mt-8">

                <div className="md:flex md:space-x-5 pb-4 md:border-b border-gray-300 items-center justify-end">


                    <div className="relative w-full lg:w-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 lg:h-4 lg:w-4 absolute left-2 top-3 lg:top-3 stroke-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>

                        <input
                            type="text"
                            className="w-full lg:w-64 border py-2 pl-10 lg:pl-8 pr-2 text-lg lg:text-sm border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-200"
                            placeholder="Search meeee"
                        />
                    </div>

                    <div className="h-8 lg:h-6 w-[3px] bg-gray-300 hidden md:block" />


                    <div className="flex space-x-5 items-center pb-5 pt-3 md:p-0 border-b border-gray-300 md:border-none w-full lg:w-auto">
                        <button
                            type="button"
                            className="w-full lg:w-32 flex justify-center items-center gap-2 border p-2 text-lg lg:text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 lg:h-4 lg:w-4 stroke-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            Filter
                        </button>

                        <div className="h-8 lg:h-6 w-[3px] bg-gray-300 lg:hidden" />

                        <button
                            type="button"
                            className="w-full flex justify-center  lg:hidden items-center border p-2 text-lg lg:text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 lg:h-4 lg:w-4 stroke-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Sort
                        </button>
                    </div>
                </div>


            </div>


            <div className="bg-red-100 p-10">
                {!isLoading && seasons.map(item => (
                    <div key={item.id} className="bg-yellow-100 my-5 p-3">
                        {item.name}
                    </div>
                ))}
            </div>

            <div className="mt-12">
                {myList.map(item => (
                    <div className="bg-white flex justify-between px-2 py-1 my-3 items-center">
                        <div>
                            <p className="font-semibold text-sm">{item.city}</p>
                            <p className="text-gray-400 text-xs">{item.address}</p>
                        </div>
                        <div className="flex items-center">
                            <p className="mr-1">{item.rating}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Seasons;

const myList = [
    { city: 'Anacortes', address: '123 4th street', rating: 3.5 },
    { city: 'Battle Ground', address: '123 4th street', rating: 2.2 },
    { city: 'Bellevue', address: '123 4th street', rating: 4.8 },
    { city: 'Kenmore', address: '123 4th street', rating: 1.9 },
    { city: 'Lake Stevens', address: '123 4th street', rating: 4.1 },
    { city: 'Mill Creek', address: '123 4th street', rating: 3.9 },
];
