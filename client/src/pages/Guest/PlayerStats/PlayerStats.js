import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getTeamsPageFilters, getStandings, getTeams, getStandingsPageFilters } from '../../../redux/actions/teams';
import { getPlayers, getPlayersStats } from '../../../redux/actions/players'; 
import { Select } from '../../../components/';
import { getQuery, setQuery } from '../../../helpers';
import GuestTable from '../../../components/GuestTable';
import { useQueryParam } from '../../../components/useQueryParams';


const PlayerStats = props => {

    const [ filters, setFilters ] = useState({
        show: '10',
        playersFrom: '',
        sortBy: 'pts'
    });
    // const [filters, setFilters] = useQueryParam({ getMethod: props.getPlayersStats });

    useEffect(() => {
        if(props.location.search.length > 0) {
            const [ filters, filterString ] = getQuery();

            console.log('filter===', filterString, filters)
            props.getPlayersStats(filterString)
            // get the standings list here by passing in the filterString
            setFilters(filters)

        } else {
            props.getPlayersStats();
        }
        props.getTeamsPageFilters();
    }, [])


    const handleChange = e => {
        const _filters = { ...filters };
        const { name, value } = e.target; 

        console.log({[name]: value})

        // if(name === 'season') {
        //     delete _filters['division'];
        // }

        // if(props.currentSeasonId === Number(value)) {
        //     delete _filters['season'];
        // } else {
            _filters[name] = value;
        // }
        const search = setQuery(_filters)
        setFilters({..._filters}); 
    }

    return (
        <>
            <div className="schedule-container" style={{paddingBottom: 0}}>
                <div className="white-bg" style={{paddingBottom:40}}>
                    <h1>Player Stats</h1>

                    <div className="schedule-filters"> 
                        <Select name='show'   title="Show"   listOfSelects={[{name: 'top 10', value: '10'}, {name: 'top 50', value: '50'}]} onChange={handleChange} defaultValue={filters.show || '10'} useKey="id" />
                        <Select name='playersFrom' title="Players from" listOfSelects={[{name: 'All', value: ''}, ...props.scheduleFilters.allTeams]} onChange={handleChange} defaultValue={filters.playersFrom || ''} useKey="id" />
                        <Select name='sortBy' title="Sort by" listOfSelects={[{name: 'Pts', value: 'pts'}, {name: 'G',  value: 'g'}]} onChange={handleChange} defaultValue={ filters.sortBy || 'pts'} useKey="id" />

                        {/* <a>Clear Filters</a> */}
                        <div></div>
                        <div></div>
                    </div>

                </div>

            </div>

            <GuestTable 
                data={props.playerStats}
                minWidth={800}
                sections={{
                    // 'rank': 'one',
                    'first_name':  { as: 'name', flex: 'one'},
                    'last_name':  { flex: 'one'},
                    'games_played': { as: 'gp', flex: 'one' }, 
                    'points': { as: 'Pts', flex: 'one' }, 
                    'goals': { as: 'G', flex: 'one' }, 
                    'assists': { as: 'A', flex: 'one' },
                    'power_play_goals': { as: 'PPG', flex: 'one' },
                    // 'power_play_assists': { as: 'PPA', flex: 'one' },
                }} 
                emptyTableText="No recent games have been played"
            />
        </>
    )
}


const mapStateToProps = state => {
    return {
        scheduleFilters: state.misc.scheduleFilters,
        playerStats: state.players.playerStats
        
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTeamsPageFilters: () => dispatch(getTeamsPageFilters()),
        getPlayersStats: filter => dispatch(getPlayersStats(filter))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerStats);
