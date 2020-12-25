import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getStandingsPageFilters, getStandings } from '../../../redux/actions/teams';
import { Select } from '../../../components/';
import { getQuery, setQuery } from '../../../helpers';
import GuestTable from '../../../components/GuestTable';


const Standings = props => {

    const [ filters, setFilters ] = useState({});

    useEffect(() => {
        if(props.location.search.length > 0) {
            const [ filterss, filterStringg ] = getQuery();
            // get the standings list here by passing in the filterString
            setFilters(filterss)
            props.getStandingsPageFilters(filterStringg)
            props.getStandings(filterStringg)

        } else {
            props.getStandings().then(res => setFilters({...filters, season: res}));
            props.getStandingsPageFilters();
        }
    }, [filters, props])


    const handleChange = e => {
        const _filters = { ...filters };
        const { name, value } = e.target; 

        console.log({[name]: value})

        if(name === 'season') {
            delete _filters['division'];
        }

        // if(props.currentSeasonId === Number(value)) {
        //     delete _filters['season'];
        // } else {
            _filters[name] = value;
        // }
        const search = setQuery(_filters)
        props.getStandingsPageFilters(search)
        props.getStandings(search)
        setFilters({..._filters}); 
    }

    const season = Number(filters.season) !== props.currentSeasonId && `?season=${filters.season}`;
    return (
        <>
            <div className="schedule-container" style={{paddingBottom: 0}}>
                <div className="white-bg" style={{paddingBottom:40}}>
                    <h1>Standings</h1>

                    <div className="schedule-filters"> 
                        <Select name='season'   title="Season"   listOfSelects={props.standingsFilters.seasons}                                  onChange={handleChange} defaultValue={filters.season || ''}    useKey="id" />
                        <Select name='division' title="Division" listOfSelects={[{name: 'All', value: ''}, ...props.standingsFilters.divisions]} onChange={handleChange} defaultValue={filters.division || ''} useKey="id" />
                        {/* <a>Clear Filters</a> */}
                        <div></div>
                        <div></div>
                    </div>

                </div>

            </div>

            {
                props.standings.length <= 0 ? (
                    <p>No standings under this season</p>
                ):(
                    props.standings.map(t => {
                        return (
                            // <div key={t.division_name} className="division-container">
                            <div key={t.division_name} style={{background: 'white', margin: '0 10px'}}>
                            <h2 style={{paddingLeft: 20}}>{t.division_name}</h2>

                            <GuestTable 
                                data={t.teams_in_division}
                                minWidth={800}
                                sections={{
                                    'rank': 'one',
                                    'name':  { as: 'name', flex: 'four', link: { to:'/teams', key: 'id', search: season }},
                                    'games_played': { as: 'gp', flex: 'one' }, 
                                    'wins': { as: 'w', flex: 'one' }, 
                                    'losses': { as: 'l', flex: 'one' }, 
                                    'points': { as: 'pts', flex: 'one' },
                                    'goals_for': { as: 'gf', flex: 'one' },
                                    'goals_against': { as: 'ga', flex: 'one' },
                                    'penalties_in_minutes': { as: 'PIMs', flex: 'one' },
                                }} 
                                emptyTableText="No recent games have been played"
                            />
                            </div>
                        )
                    })
                )
            }
        </>
    )
}


const mapStateToProps = state => {
    return {
        standingsFilters: state.misc.standingsFilters,
        currentSeasonId: state.seasons.currentSeason && state.seasons.currentSeason.id,
        standings: state.standings.standings
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getStandingsPageFilters: filter => dispatch(getStandingsPageFilters(filter)),
        getStandings: filter => dispatch(getStandings(filter))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Standings);
