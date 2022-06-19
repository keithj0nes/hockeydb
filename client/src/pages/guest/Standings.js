import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getStandings } from '../../redux/slices/standings';


const Standings = () => {
    const dispatch = useDispatch();
    // get standings state
    const { standings, isLoading } = useSelector(state => state.standings);

    useEffect(() => {
        dispatch(getStandings());
    }, []); // empty array = only fires on the didMount

    return (
        <div className="bg-red-200 h-64">
            <h1 className="text-3xl">Standings</h1>

            {/* Add conditional loading check here */}
            {isLoading ? (
                <p>Page Loading</p>
            ) : (
                <div className="bg-green-100">
                    {standings.map(item => (
                        <div>
                            <h2 className="text-xl">{item.division_name}</h2>
                            {item.teams_in_division.map((team) => (
                                <div>{team.name}</div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Standings;
