import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

// import { format, parseISO } from 'date-fns';
import { getSeasonById } from '../../redux/slices/seasons';
import { Tabs, DrawerCreateSeason, Divisions, Teams, Players, Registrations } from './components';

// const myTabs = ['Divisions', 'Teams', 'Players', 'Registrations'];
const myTabs2 = [
    { name: 'Teams', key: 'teams', component: <Teams /> },
    { name: 'Divisions', key: 'divisions', component: <Divisions /> },
    { name: 'Players', key: 'players', component: <Players /> },
    { name: 'Registrations', key: 'registrations', component: <Registrations /> },
];


const SingleSeason = () => {
    const [activeTab, setActiveTab] = useState(myTabs2[0].key);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect(() => {
        dispatch(getSeasonById({ id }));
    }, []);


    const is_active = true;
    return (
        <div className="bg-red-10 h-screen p-4 sm:p-7 overflow-scroll">


            <div className="flex justify-between items-start">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold">Fall 2022</h1>
                    <button
                        type="button"
                        className="ml-4"
                        onClick={() => setIsEditModalVisible(true)}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                </div>

                <div className="text-center">
                    <div className="group relative">
                        <p className={classNames('px-2 py-1 rounded-lg self-center', {
                            'bg-green-100 text-green-600': is_active,
                            'bg-gray-100 text-gray-600': !is_active,
                        })}
                        >
                            {is_active ? 'Active' : 'Inactive'}

                        </p>
                        <p className="group-hover:block whitespace-nowrap text-xs text-white absolute hidden mt-2 right-0 py-1 px-2 rounded bg-gray-700">
                            The &quot;Active&quot; season is displayed <br /> on the website by default
                        </p>
                    </div>

                </div>
            </div>


            <Tabs active={activeTab} tabs={myTabs2} onChange={setActiveTab} />

            <div className="p-0">
                {myTabs2.map(item => {
                    if (item.key !== activeTab) return null;
                    return (
                        <div key={item.key}>
                            {item.component}
                        </div>
                    );
                })}
            </div>

            <DrawerCreateSeason
                onClose={() => setIsEditModalVisible(false)}
                visible={isEditModalVisible}
                edit={{
                    name: 'Fall 2020',
                    type: 'Tournament',
                    copy_from: '',
                    start_date: '2022-06-30',
                    // start_date: format(parseISO('2019-02-11T14:00:00'), 'yyyy-MM-dd'),
                    is_active: true,
                }}
            />
        </div>
    );
};

export default SingleSeason;
