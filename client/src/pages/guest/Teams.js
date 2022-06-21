import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTeamsByDivision } from '../../redux/slices/teams';
import TeamsDropdown from '../../components/guest/TeamsDropdown';

const Teams = () => {
    const dispatch = useDispatch();

    const { teams, isLoading } = useSelector(state => state.teams);

    const [selectedSeason, setSeason] = useState('All');

    const seasonFilterHandler = (selectedSeason) => {
        setSeason(selectedSeason);
        console.log('SELECTED SEASON: ', selectedSeason);
    };

    useEffect(() => {
        dispatch(getTeamsByDivision());
    }, []);

    

    return (
        <>
            <h1>Teams</h1>
            {isLoading ? (
                <p>Teams Loading</p>
            ) : (
                <>
                    <TeamsDropdown teams={teams} seasonFilterHandler={seasonFilterHandler} />
                    <p>Divisions: {teams.length}</p>
                    {teams.map(division => (
                        <p>{division.division_name}</p>
                    ))}
                </>
            )}
        </>
    );
};

export default Teams;
