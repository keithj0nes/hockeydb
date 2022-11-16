import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from '../../components/guest';
// import { Select } from 'antd';
import { getGames } from '../../redux/slices/games';
// import Select from 'react-select';
// import { select } from 'react-cookies';
import { getQuery, setQuery } from '../../queryHelpers';
import { Select } from '../../components/dashboard/Select';
import { history } from '../../queryHelpers';

const Schedule = () => {
    const { allGames, isLoading, scheduleFilters } = useSelector(
        (state) => state.games
    );
    console.log('TEAMS IN SCHEDULE', scheduleFilters.teams);
    console.log('ALLGAMES IN SCHEDULE', allGames);
    const dispatch = useDispatch();
    // console.log('ALLGAMES STATE IN COMPONENT', allGames);

    const [filters, setFilters] = useState({
        page: 1,
        fromLoadMore: false,
    });

    useEffect(() => {
        console.log('fetching schedule');
        //  filters / query
        // apply filters if search / filter selected from dropdown, else retreive all results
        // if (history.location.search) {
        //     const [parsedQuery, queriesString] = getQuery();
        //     console.log(
        //         'parsedQuery, queriesString',
        //         parsedQuery,
        //         queriesString
        //     );
        // }
        // retrieve all results
        dispatch(getGames('page=1')).then((res) =>
            console.log('RES FROM DISPATCH', res)
        );
    }, []);

    const handleFilterChange = (e) => {
        console.log('EVENT', e);

        const { name, value, checked, type } = e.target;

        console.log('NAME, VALUE', { name, value });

        if (value === '' || checked === false) {
            delete filters[name];
        } else {
            filters[name] = type === 'checkbox' ? checked : value;
        }

        // reset the select divisions and teams fields if season is changed
        if (name === 'season') {
            delete filters['division'];
            delete filters['team'];
        }
        // reset the select teams fields if season is changed
        if (name === 'division') {
            delete filters['team'];
        }
        // delete to not put it in the URL params
        delete filters['page'];
        delete filters['fromLoadMore'];

        const search = setQuery(filters);
        dispatch(getGames(search)).then((res) => {
            console.log('SEARCH RES', res);
        });
        // setFilters(() => {
        //     filters.page = 1;
        //     return { filters, stateChanged: name === 'season' && true };
        // });
    };

    /*********** React Select Options *************/
    // const seasonOptions = scheduleFilters.seasons.map((season) => {
    //     return { value: season, label: season.name };
    // });

    // const divisionOptions = scheduleFilters.divisions.map((division) => {
    //     return { value: division, label: division.name };
    // });

    // const teamOptions = scheduleFilters.teams.map((team) => {
    //     return { value: team, label: team.name };
    // });
    /**********************************/

    // console.log('SEASONOPTIONS', seasonOptions);

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
                                name="season"
                                title="Season"
                                listOfSelects={scheduleFilters.seasons}
                                onChange={handleFilterChange}
                                defaultValue={filters.season || ''}
                                useKey="id"
                            />
                        </div>
                        <div>
                            <span>Division</span>
                            <Select
                                name="division"
                                title="Division"
                                listOfSelects={[
                                    { name: 'All', value: '' },
                                    ...scheduleFilters.divisions,
                                ]}
                                onChange={handleFilterChange}
                                defaultValue={filters.division || ''}
                                useKey="id"
                            />
                        </div>
                        <div>
                            <span>Team</span>
                            <Select
                                name="team"
                                title="Team"
                                listOfSelects={[
                                    { name: 'All', value: '' },
                                    ...scheduleFilters.teams,
                                ]}
                                onChange={handleFilterChange}
                                defaultValue={filters.team || ''}
                                useKey="id"
                            />
                        </div>
                    </div>
                    {/* <div className="hidden md:block"> */}
                    <div className="overflow-scroll">
                        <Table
                            data={allGames}
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

// Old code
// const handleChange = (e) => {
//     const filters = { ...this.state.filters };
//     const { name, value, checked, type } = e.target;

//     console.log({ name, value });

//     if (value === '' || checked === false) {
//         delete filters[name];
//     } else {
//         filters[name] = type === 'checkbox' ? checked : value;
//     }

//     // reset the select divisions and teams fields if season is changed
//     if (name === 'season') {
//         delete filters['division'];
//         delete filters['team'];
//     }
//     // reset the select teams fields if season is changed
//     if (name === 'division') {
//         delete filters['team'];
//     }
//     // delete to not put it in the URL params
//     delete filters['page'];
//     delete filters['fromLoadMore'];

//     this.setState(() => {
//         const search = setQuery(filters);
//         this.props.getGames(search);
//         filters.page = 1;
//         return { filters, statechanged: name === 'season' && true };
//     });
// };
