import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTeamsPageFilters, getTeamsByDivision } from '../../../redux/actions/teamsActions';
import { Select } from '../../../components/';
import { getQuery, setQuery } from '../../../helpers';
import './teams.scss';

const Teams = (props) => {

    const [ filters, setFilters ] = useState({});

    useEffect(() => {

        if(props.location.search.length > 0) {
            const [ filters, filterString ] = getQuery();
            // get the teams list here by passing in the filterString
            setFilters(filters)
            props.getTeamsPageFilters(filterString)
            props.getTeamsByDivision(filterString)

        } else {
            // if theres no seasons or allTeams, get the filters
            // const { seasons, allTeams } = props.scheduleFilters;
            // if(seasons.length <= 0 && allTeams.length <= 0) {
                // const res = props.getTeamsByDivision();
                // props.getTeamsPageFilters(res);
                props.getTeamsByDivision().then(res => setFilters({...filters, season: res}));
                props.getTeamsPageFilters();

            // }
        }
        
    }, [])

    const handleChange = e => {
        const _filters = { ...filters };
        const { name, value } = e.target; 

        // console.log({[name]: value})

        // if name === team, history push the team id
        // if name === season, getteamspagefilters with season_id
        if(name === 'team') {
            props.history.push(`/teams/${value}`)
        }

        if(name === 'season') {

            // if(props.currentSeasonId === Number(value)) {
            //     delete _filters['season'];
            // } else {
                _filters[name] = value;
            // }
            const search = setQuery(_filters)
            props.getTeamsPageFilters(search)
            props.getTeamsByDivision(search)
            setFilters({..._filters}); 
        }
    }

    return (
        <div className="schedule-container">
            <div className="white-bg" style={{paddingBottom:40}}>
                <h1>Teams</h1>

                <div className="schedule-filters"> 
                    <Select name='season'   title="Season"   listOfSelects={props.scheduleFilters.seasons}                                     onChange={handleChange}  defaultValue={filters.season || ''}   useKey="id" />
                    <Select name='team'     title="Team"     listOfSelects={[{name: 'All', value: ''}, ...props.scheduleFilters.allTeams]}     onChange={handleChange}  defaultValue={filters.allTeams || ''} useKey="id" />
                    {/* <a>Clear Filters</a> */}
                    <div></div>
                    <div></div>
                </div>

                <div className="teams-container">
                    {
                        props.teamsByDivision.length <= 0 ? (
                            <p>No teams under this season</p>
                        ):(
                            props.teamsByDivision.map(t => {
                                return (
                                    <div key={t.division_name} className="division-container">
                                    <h2>{t.division_name}</h2>
                                    
                                    {t.teams_in_division.map(team => {
                                        return (
                                            <p key={team.id}>
                                            
                                            <Link to={`teams/${team.id}`}    >{team.name}</Link>
                                            </p>
                                            )
                                        })}
                                    </div>
                                )
                            })
                        )
                    }
                </div>
            </div>

        </div>
    )
}

const mapStateToProps = state => {
    return {
        scheduleFilters: state.misc.scheduleFilters,
        currentSeasonId: state.seasons.currentSeason && state.seasons.currentSeason.id,
        teamsByDivision: state.teams.teamsByDivision
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTeamsPageFilters: filter => dispatch(getTeamsPageFilters(filter)),
        getTeamsByDivision: filter => dispatch(getTeamsByDivision(filter))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Teams);
