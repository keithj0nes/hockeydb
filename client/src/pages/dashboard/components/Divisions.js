import React from 'react';
import { useSelector } from 'react-redux';


const Divisions = () => {
    const { seasonById } = useSelector((state) => state.seasons);
    const { divisions } = seasonById;

    // use front end sorting


    return (
        <div>

            <div className="flex justify-end py-4">
                {/* <h1 className="text-3xl font-semibold">{PAGE_TITLE}</h1> */}

                <button
                    type="button"
                    className="flex justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                    // onClick={() => setIsCreateVisible(true)}
                >
                    Create Division
                </button>
            </div>

            <div className="bg-white p-3">

                <table className="table-auto w-full">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="py-2">Name</th>
                            <th className="py-2">Teams</th>
                        </tr>
                    </thead>
                    <tbody>
                        {divisions?.map(item => (
                            <tr key={item.id} className="w-full border-b">
                                <td className="py-2">{item.name}</td>
                                <td className="py-2">{item.teams_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default Divisions;
