import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { currency } from '../../../utils';
import DrawerCreateRegistration from './drawers/DrawerCreateRegistration';
import { registrationTabs } from './wizards/registration/RegistrationWizard';

const all_forms = [
    {
        id: 2425,
        form: '2022 Winter Open',
        status: 'Open',
        participants: 35,
        unpaid: 4,
        fees: 200000,
        collected: 195000,
        refunds: 0,
        credits: 0,
        // balance: total - collected
    },
    {
        id: 45,
        form: '2022 Winter Over 35',
        status: 'Open',
        participants: 23,
        unpaid: 7,
        fees: 300000,
        collected: 225000,
        refunds: 0,
        credits: 0,
        // balance: total - collected
    },
];

const Registrations = () => {
    const [isCreateVisible, setIsCreateVisible] = useState(false);

    const { seasonById } = useSelector((state) => state.seasons);

    console.log(seasonById, 'SEASON BY ID');


    const overview = all_forms.reduce((curr, acc) => ({
        total: (curr.total || 0) + acc.fees,
        collected: (curr.collected || 0) + acc.collected,
        refunds: (curr.refunds || 0) + acc.refunds,
        credits: (curr.credits || 0) + acc.credits,
        balance: ((acc.fees || 0) - (acc.collected || 0)) + (curr.balance || 0),
    }), {});

    return (
        <div>

            <div className="flex justify-end py-4">
                {/* <h1 className="text-3xl font-semibold">{PAGE_TITLE}</h1> */}

                <button
                    type="button"
                    className="flex justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                    onClick={() => setIsCreateVisible(true)}
                >
                    Create Registration
                </button>
            </div>

            <div className="bg-white p-3 mb-6">
                <h2 className="text-lg text-black font-semibold pb-2 border-b mb-2">Overview</h2>

                <div className="flex justify-between">

                    <div className="flex-1">
                        <p className="text-black font-semibold">Total</p>
                        <p>{currency(overview.total)}</p>

                    </div>

                    <div className="flex-1">
                        <p>Collected</p>
                        <p>{currency(overview.collected)}</p>

                        <div className="bg-gray-300 rounded-lg mt-1 h-1 w-1/2">
                            <div className="bg-green-500 h-full rounded-lg" style={{ width: `${(overview.collected / overview.total) * 100}%` }} />
                        </div>
                    </div>

                    <div className="flex-1">
                        <p>Balance</p>
                        <p>{currency(overview.total - overview.collected)}</p>

                        <div className="bg-gray-300 rounded-lg mt-1 h-1 w-1/2">
                            <div className="bg-red-500 h-full rounded-lg" style={{ width: `${((overview.total - overview.collected) / overview.total) * 100}%` }} />
                        </div>
                    </div>

                    <div className="flex-1">
                        <p>Refunds</p>
                        <p>{currency(overview.refunds)}</p>
                    </div>

                    <div className="flex-1">
                        <p>Credits</p>
                        <p>{currency(overview.credits)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-3">

                <table className="table-auto w-full">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="py-2">Form Name</th>
                            <th className="py-2">Status</th>
                            <th className="py-2">Participants</th>
                            <th className="py-2">Unpaid</th>
                            <th className="py-2">Total Fees</th>
                            <th className="py-2">Collected</th>
                            <th className="py-2">Refunds</th>
                            <th className="py-2">Credits</th>
                            <th className="py-2">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {all_forms?.map(item => (
                            <tr key={item.id} className="w-full border-b">
                                <td className="py-2">{item.form}</td>
                                <td className="py-2">{item.status}</td>
                                <td className="py-2">{item.participants}</td>
                                <td className="py-2">{item.unpaid}</td>
                                <td className="py-2">{currency(item.fees)}</td>
                                <td className="py-2">{currency(item.collected)}</td>
                                <td className="py-2">{currency(item.refunds)}</td>

                                <td className="py-2">{currency(item.credits)}</td>
                                <td className="py-2">{currency(item.fees - item.collected)}</td>


                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            {!seasonById?.template_registrations?.length && (
                <p className="pt-12 text-center">No registrations, create a new registration above to get started</p>
            )}

            {!!seasonById?.template_registrations?.length && (
            <div className="p-3 bg-pink-200 mt-10">

                <table className="table-auto w-full">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="py-2">Form Name</th>
                            <th className="py-2">Status</th>
                            {/* <th className="py-2">Participants</th>
                            <th className="py-2">Unpaid</th>
                            <th className="py-2">Total Fees</th>
                            <th className="py-2">Collected</th>
                            <th className="py-2">Refunds</th>
                            <th className="py-2">Credits</th>
                            <th className="py-2">Balance</th> */}
                        </tr>
                    </thead>

                    <tbody>


                        {seasonById?.template_registrations.map(item => (
                            <tr key={item.id} className="w-full border-b">
                                <td className="py-2">
                                    {/* {item.is_open ? ( */}
                                        {/* // <Link to={`registrations/${item.id.toString()}`}> */}
                                        <Link to={`registrations/${item.id}/${registrationTabs[0].key}`}>
                                            {item.name}
                                        </Link>

                                    {/* ) : (
                                        <p className="cursor-default">{item.name}</p>
                                    )} */}
                                </td>
                                <td className="py-2">{item.is_open ? 'Open' : 'Closed'}</td>
                                {/* <td className="py-2">{item.participants}</td>
                                <td className="py-2">{item.unpaid}</td>
                                <td className="py-2">{currency(item.fees)}</td>
                                <td className="py-2">{currency(item.collected)}</td>
                                <td className="py-2">{currency(item.refunds)}</td>

                                <td className="py-2">{currency(item.credits)}</td>
                                <td className="py-2">{currency(item.fees - item.collected)}</td> */}
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
            )}

            <DrawerCreateRegistration
                onClose={() => setIsCreateVisible(false)}
                visible={isCreateVisible}
            />
        </div>
    );
};

export default Registrations;
