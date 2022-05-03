import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSchedule } from '../../redux/slices/schedule';


const Schedule = () => {
    const { games, isLoading } = useSelector((state) => state.games);
    const dispatch = useDispatch();
    console.log('SCHEDULE STATE IN COMPONENT', games);

    useEffect(() => {
        console.log('fetching schedule');
        dispatch(getSchedule());
    }, []);


    return (
        <div>
            Show schedule here
            {isLoading ? (
                <p>Page Loading</p>) : (
                <div>
                    {games.map(game => {
                        return (
                            <div>
                                {`HOME TEAM: ${game.away_team} VS. AWAY TEAM: ${game.home_team}`}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default Schedule;
