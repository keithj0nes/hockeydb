import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTeams } from '../../redux/slices/teams';

const Teams = () => {
    const dispatch = useDispatch();

    const { teams, isLoading } = useSelector(state => state.teams);

    useEffect(() => {
        dispatch(getTeams());
    }, []);

    console.log('TEAMS IN COMPONENT ', teams);

    return (
        <div>
            Display Teams Data Here
        </div>
    );
};

export default Teams;
