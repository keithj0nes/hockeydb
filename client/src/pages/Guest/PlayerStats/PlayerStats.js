import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTeamsPageFilters } from '../../../redux/actions/teams';
import { getPlayersStats } from '../../../redux/actions/players';
import { Select, Table } from '../../../components';
import { getQuery, setQuery } from '../../../helpers';
// import { useQueryParam } from '../../../components/useQueryParams';

//
// player stats should default to showing top few players per division, then filter from there
//

const PlayerStats = ({ location, getPlayersStats, getTeamsPageFilters, scheduleFilters, playerStats }) => {
    const [filters, setFilters] = useState({
        show: '10',
        playersFrom: '',
        sortBy: 'pts',
    });
    // const [filters, setFilters] = useQueryParam({ getMethod: props.getPlayersStats });

    useEffect(() => {
        if (location.search.length > 0) {
            const [filters, filterString] = getQuery();

            console.log('filter===', filterString, filters);
            getPlayersStats(filterString);
            // get the standings list here by passing in the filterString
            setFilters(filters);
        } else {
            getPlayersStats();
        }
        getTeamsPageFilters();
    }, [location.search, getPlayersStats, getTeamsPageFilters]);


    const handleChange = e => {
        const _filters = { ...filters };
        const { name, value } = e.target;
        // console.log({ [name]: value });
        _filters[name] = value;
        setQuery(_filters);
        setFilters({ ..._filters });
    };

    return (
        <>
            <div className="schedule-container" style={{ paddingBottom: 0 }}>
                <div className="white-bg" style={{ paddingBottom: 40 }}>
                    <h1>Player Stats</h1>

                    <div className="schedule-filters">
                        <Select name="show" title="Show" listOfSelects={[{ name: 'top 10', value: '10' }, { name: 'top 50', value: '50' }]} onChange={handleChange} defaultValue={filters.show || '10'} useKey="id" />
                        <Select name="playersFrom" title="Players from" listOfSelects={[{ name: 'All', value: '' }, ...scheduleFilters.allTeams]} onChange={handleChange} defaultValue={filters.playersFrom || ''} useKey="id" />
                        <Select name="sortBy" title="Sort by" listOfSelects={[{ name: 'Pts', value: 'pts' }, { name: 'G', value: 'g' }]} onChange={handleChange} defaultValue={filters.sortBy || 'pts'} useKey="id" />

                        {/* <a>Clear Filters</a> */}
                        <div />
                        <div />
                    </div>

                </div>

            </div>

            <Table
                data={playerStats}
                minWidth={800}
                columns={{
                    // 'rank': 'one',
                    // first_name: { as: 'name', flex: 'one' },
                    // last_name: { flex: 'one' },
                    player: { as: 'player', flex: 'two', format: '$first_name $last_name' },
                    games_played: { as: 'gp', flex: 'one' },
                    points: { as: 'Pts', flex: 'one' },
                    goals: { as: 'G', flex: 'one' },
                    assists: { as: 'A', flex: 'one' },
                    power_play_goals: { as: 'PPG', flex: 'one' },
                    // 'power_play_assists': { as: 'PPA', flex: 'one' },
                }}
                emptyTableText="No recent games have been played"
            />
        </>
    );
};


const mapStateToProps = state => ({
    scheduleFilters: state.misc.scheduleFilters,
    playerStats: state.players.playerStats,

});

const mapDispatchToProps = dispatch => ({
    getTeamsPageFilters: () => dispatch(getTeamsPageFilters()),
    getPlayersStats: filter => dispatch(getPlayersStats(filter)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerStats);

PlayerStats.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
    getPlayersStats: PropTypes.func,
    match: PropTypes.object,
    newsById: PropTypes.object,
    getTeamsPageFilters: PropTypes.func,
    getNewsPostById: PropTypes.func,
    getNewsTags: PropTypes.func,
    scheduleFilters: PropTypes.object,
    playerStats: PropTypes.array,
};
