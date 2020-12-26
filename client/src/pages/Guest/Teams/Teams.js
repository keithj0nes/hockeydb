import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTeamsPageFilters, getTeamsByDivision } from '../../../redux/actions/teams';
import { Select } from '../../../components';
import { getQuery, setQuery } from '../../../helpers';
import './teams.scss';

// clean this file up

const Teams = ({ location, history, getTeamsPageFilters, getTeamsByDivision, currentSeasonId, teamsByDivision, scheduleFilters }) => {
    const [filters, setFilters] = useState({});

    useEffect(() => {
        if (location.search.length > 0) {
            const [filterss, filterString] = getQuery();
            // get the teams list here by passing in the filterString
            setFilters(filterss);
            getTeamsPageFilters(filterString);
            getTeamsByDivision(filterString);
        } else {
            // if theres no seasons or allTeams, get the filters
            // const { seasons, allTeams } = props.scheduleFilters;
            // if(seasons.length <= 0 && allTeams.length <= 0) {
            // const res = props.getTeamsByDivision();
            // props.getTeamsPageFilters(res);
            getTeamsByDivision().then(res => setFilters(filters => ({ ...filters, season: res })));
            getTeamsPageFilters();

            // }
        }
    }, [location, getTeamsPageFilters, getTeamsByDivision]);

    const handleChange = e => {
        const _filters = { ...filters };
        const { name, value } = e.target;

        // console.log({[name]: value})

        // if name === team, history push the team id
        // if name === season, getteamspagefilters with season_id
        if (name === 'team') {
            history.push(`/teams/${value}`);
        }

        if (name === 'season') {
            // if(props.currentSeasonId === Number(value)) {
            //     delete _filters['season'];
            // } else {
            _filters[name] = value;
            // }
            const search = setQuery(_filters);
            getTeamsPageFilters(search);
            getTeamsByDivision(search);
            setFilters({ ..._filters });
        }
    };

    // pass this as the search param in Link for the get request on the Teams page
    const season = Number(filters.season) !== currentSeasonId && `?season=${filters.season}`;

    return (
        <div className="schedule-container">
            <div className="white-bg" style={{ paddingBottom: 40 }}>
                <h1>Teams</h1>

                <div className="schedule-filters">
                    <Select name="season" title="Season" listOfSelects={scheduleFilters.seasons} onChange={handleChange} defaultValue={filters.season || ''} useKey="id" />
                    <Select name="team" title="Team" listOfSelects={[{ name: 'All', value: '' }, ...scheduleFilters.allTeams]} onChange={handleChange} defaultValue={filters.allTeams || ''} useKey="id" />
                    {/* <a>Clear Filters</a> */}
                    <div />
                    <div />
                </div>

                <div className="teams-container">
                    {
                        teamsByDivision.length <= 0 ? (
                            <p>No teams under this season</p>
                        ) : (
                            teamsByDivision.map(t => (
                                <div key={t.division_name} className="division-container">
                                    <h2>{t.division_name}</h2>

                                    {t.teams_in_division.map(team => (
                                        <p key={team.id}>
                                            <Link to={{ pathname: `teams/${team.id}`, search: season }}>{team.name}</Link>
                                        </p>
                                    ))}
                                </div>
                            ))
                        )
                    }
                </div>
            </div>

        </div>
    );
};

const mapStateToProps = state => ({
    scheduleFilters: state.misc.scheduleFilters,
    currentSeasonId: state.seasons.currentSeason && state.seasons.currentSeason.id,
    teamsByDivision: state.teams.teamsByDivision,
});

const mapDispatchToProps = dispatch => ({
    getTeamsPageFilters: filter => dispatch(getTeamsPageFilters(filter)),
    getTeamsByDivision: filter => dispatch(getTeamsByDivision(filter)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Teams);

Teams.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    teamsByDivision: PropTypes.array,
    getTeamsPageFilters: PropTypes.func,
    getTeamsByDivision: PropTypes.func,
    currentSeasonId: PropTypes.number,
    scheduleFilters: PropTypes.object,
};
