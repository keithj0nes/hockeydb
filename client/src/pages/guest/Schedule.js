import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSchedule } from '../../redux/slices/schedule';
import { Table } from '../../components/guest';


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
                <p>Page Loading</p>
            ) : (
                <div>
                    {/* <div className="hidden md:block"> */}
                    <Table
                        data={games}
                        columns={{
                            date: { as: 'Date', flex: 'two', date: { format: 'E, MMM do', key: 'start_date' } },
                            time: { as: 'Time', flex: 'two', date: { format: 'p', key: 'start_date' } },
                            location_name: { as: 'Location', flex: 'three' },
                            home_team: { as: 'Home', flex: 'four', link: { to: '/teams', key: 'home_team_id', search: null } },
                            away_team: { as: 'Away', flex: 'four', link: { to: '/teams', key: 'away_team_id', search: null } },
                            score: { as: 'Score', flex: 'one', format: '$home_score : $away_score' },
                        }}
                        minWidth={1000}
                    />
                    {/* </div> */}

                    {/* <div className="md:hidden bg-red-400">
                        BUILD CARD VEIW HERE
                    </div> */}
                </div>
            )}
        </div>
    );
};

export default Schedule;
