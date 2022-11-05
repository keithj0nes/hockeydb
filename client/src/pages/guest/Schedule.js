import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSchedule } from '../../redux/slices/schedule';
import { Table } from '../../components/guest';
// import { Select } from 'antd';
import { getSeasons } from '../../redux/slices/seasons';
import Select from 'react-select';

const Schedule = () => {
    const { games, isLoading } = useSelector((state) => state.games);
    const dispatch = useDispatch();
    // console.log('SCHEDULE STATE IN COMPONENT', games);

    const { seasons } = useSelector((state) => state.seasons);

    console.log('SEASONS', seasons);

    useEffect(() => {
        console.log('fetching schedule');
        dispatch(getSchedule());
        dispatch(getSeasons());
    }, []);

    // seasons options
    const seasonOptions = seasons.map((season) => {
        return { value: season.name, label: season.name };
    });

    // division options

    // team options

    return (
        <div>
            <h1>Schedule</h1>
            {isLoading ? (
                <p>Page Loading</p>
            ) : (
                <div>
                    <div className="flex">
                        <Select
                            name="Seasons"
                            options={seasonOptions}
                            label="Seaons"
                        />
                        <Select />
                        <Select />
                    </div>
                    {/* <div className="hidden md:block"> */}
                    <div className="overflow-scroll">
                        <Table
                            data={games}
                            columns={{
                                date: {
                                    as: 'Date',
                                    flex: 'two',
                                    date: {
                                        format: 'E, MMM do',
                                        key: 'start_date',
                                    },
                                },
                                time: {
                                    as: 'Time',
                                    flex: 'two',
                                    date: { format: 'p', key: 'start_date' },
                                },
                                location_name: {
                                    as: 'Location',
                                    flex: 'three',
                                },
                                home_team: {
                                    as: 'Home',
                                    flex: 'four',
                                    link: {
                                        to: '/teams',
                                        key: 'home_team_id',
                                        search: null,
                                    },
                                },
                                away_team: {
                                    as: 'Away',
                                    flex: 'four',
                                    link: {
                                        to: '/teams',
                                        key: 'away_team_id',
                                        search: null,
                                    },
                                },
                                score: {
                                    as: 'Score',
                                    flex: 'one',
                                    format: '$home_score : $away_score',
                                },
                            }}
                            minWidth={1000}
                        />
                    </div>

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
