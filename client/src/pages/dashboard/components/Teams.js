import React from 'react';
import { useSelector } from 'react-redux';


const Teams = () => {
    const { seasonById } = useSelector((state) => state.seasons);
    const { teams } = seasonById;

    // use front end sorting

    return (
        <div>

            <div className="flex justify-end py-4">

                <button
                    type="button"
                    className="flex justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                    // onClick={() => setIsCreateVisible(true)}
                >
                    Create Team
                </button>
            </div>

            <div className="bg-white p-3">

                <table className="table-auto w-full">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="py-2">Name</th>
                            <th className="py-2">Players</th>
                            <th className="py-2">Divisions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams?.map(item => (
                            <tr key={item.team_id} className="w-full border-b">
                                <td className="py-2">{item.team_name}</td>
                                <td className="py-2">{item.players_count || 'N/A'}</td>
                                <td className="py-2">{item.division_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default Teams;
