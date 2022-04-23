import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSchedule } from '../../redux/slices/games';


const Schedule = () => {
    const games = useSelector((state) => state.games);
    const dispatch = useDispatch();

    console.log(games.schedule, 'games');

    useEffect(() => {
        console.log('fetching schedule');
        dispatch(getSchedule());
    }, []);


    return (
        <div>
            Show schedule here
        </div>
    );
};

export default Schedule;
