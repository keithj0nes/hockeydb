import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { getSchedule } from '../../redux/slices/schedule';
import { Table } from '../../components/guest';
// import { Select } from 'antd';
import { getGames } from '../../redux/slices/games';
import Select from 'react-select';
import { select } from 'react-cookies';

const Schedule = () => {
    const { games, isLoading } = useSelector((state) => state.games);
    const dispatch = useDispatch();
    console.log('SCHEDULE STATE IN COMPONENT', games);

    // const { seasons } = useSelector((state) => state.seasons);

    // const { divisions } = useSelector((state) => state.divisions);

    // const [selectedSeason, setSelectedSeason] = useState('Summer 2021');

    // const [selectedDivision, setSelectedDivision] = useState('All');

    // console.log('SEASONS', seasons);

    useEffect(() => {
        console.log('fetching schedule');
        // dispatch(getSchedule());
        dispatch(getGames());
        // dispatch(getSeasons());
        // dispatch(getDivisions());
    }, []);

    // seasons options
    // const seasonOptions = seasons.map((season) => {
    //     return { value: season.name, label: season.name };
    // });

    // const divisionOptions = divisions.map((division) => {
    //     return { value: division.name, label: division.name };
    // });

    const handleSeasonSelect = (e) => {
        // setSelectedSeason(e.value);
    };

    const handleDivisionSelect = (e) => {
        // console.log('DIVISON EVENT');
        // setSelectedDivision(e.value);
        // console.log('SELECTED DIVISON', selectedDivision);
    };

    // console.log('SELECTED SEASON', selectedSeason);

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
                        <div>
                            <span>Season</span>
                            <Select
                            // name="seasons"
                            // options={seasonOptions}
                            // label="seasons"
                            // onChange={handleSeasonSelect}
                            />
                        </div>
                        <div>
                            <span>Division</span>
                            <Select
                            // name="divisons"
                            // options={divisionOptions}
                            // label="divisons"
                            // onChange={handleDivisionSelect}
                            />
                        </div>
                        <div>
                            <span>Team</span>
                            <Select />
                        </div>
                    </div>
                    {/* <div className="hidden md:block"> */}
                    <div className="overflow-scroll">
                        <Table
                            // selectedSeason={selectedSeason}
                            // selectedDivison={selectedDivision}
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
