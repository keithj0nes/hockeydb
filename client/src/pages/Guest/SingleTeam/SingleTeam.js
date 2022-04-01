import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tooltip } from 'antd';
import { getTeamById, clearSingleTeamState } from '../../../redux/actions/teams';
import STSchedule from './STSchedule';
import STHome from './STHome';
import STRoster from './STRoster';
import { Select } from '../../../components';
import { getQuery, setQuery, capitalizeWords } from '../../../helpers';
import Auth, { basicList } from '../../../components/Auth';
import './singleteam.scss';


const SingleTeam = ({ location, match, getTeamById, clearSingleTeamState, team, record, seasonsSelect, currentSeasonId, teamPlayerStats }) => {
    const [tabSelected, setTabSelected] = useState('home');
    const [selectedSeason, setSelectedSeason] = useState(null);

    // component did update on pathname change (will fire when going to new team route)
    useEffect(() => {
        // get team info
        window.scrollTo(0, 0);
        if (location.search.length > 0) {
            const [, filterString] = getQuery();
            getTeamById(match.params.id, filterString).then(res => {
                setSelectedSeason(res);
                setTabSelected('home');
            });
        } else {
            getTeamById(match.params.id).then(res => {
                setSelectedSeason(res);
                setTabSelected('home');
            });
        }

        // return () => clearSingleTeamState();
    }, [location.search, match.params.id, clearSingleTeamState, getTeamById]);
    // FIX: currently useeffect is infinite firing with the below
    // }, [props.location.pathname, props.location.search, props]);

    const handleChange = ({ target }) => {
        const { value, name } = target;
        setSelectedSeason(value);
        // remove season={id} from query params if season is current
        const search = setQuery(currentSeasonId !== Number(value) ? { [name]: value } : null);
        getTeamById(match.params.id, search);
    };

    const renderTabComponent = () => {
        if (tabSelected === 'home') {
            return (<STHome />);
        }
        if (tabSelected === 'schedule') {
            return (<STSchedule match={match} />);
        }
        if (tabSelected === 'roster') {
            return (<STRoster stats={teamPlayerStats} />);
        }
        return null;
    };


    const sections = {
        games_played: { as: 'GP', flex: 'one' },
        wins: { as: 'W', flex: 'one' },
        losses: { as: 'L', flex: 'one' },
        ties: { as: 'T', flex: 'one' },
        points: { as: 'PTS', flex: 'one' },
        goals_for: { as: 'GF', flex: 'one' },
        goals_against: { as: 'GA', flex: 'one' },
        penalties_in_minutes: { as: 'PIM', flex: 'one' },
    };

    const recordValues = Object.keys(record[0] || []).map(item => (
        <p className={`flex-${sections[item].flex}`} key={item}>
            {record[0][item]}
        </p>
    ));

    const recordHeader = Object.keys(sections || []).map(item => (
        // <Tooltip title={item.replace(/_/g, ' ')} placement="bottomLeft" color="#0C1D40">
        <Tooltip title={capitalizeWords(item)} placement="bottomLeft" color="#0C1D40" key={item}>
            <p className={`table-header flex-${sections[item].flex}`}>
                {sections[item].as}
            </p>
        </Tooltip>
    ));


    return (
        <div className="content-container">
            <div className="white-bg" style={{ marginBottom: 20 }}>
                <div className="single-team-content">

                    <div className="single-team-info">
                        <div className="single-team-logo">
                            <div className="actual-image" />
                        </div>
                        <div className="single-team-info">
                            <h2>{team.name || 'Unavailable'}</h2>
                            <h3>Division: {team.division_name}</h3>
                            <h5>Team Colors: &nbsp;
                                {team.colors?.map((item, ind) => <span key={item.color}>{item.name} {ind !== team.colors.length - 1 && ' / '}</span>)}
                            </h5>
                            <div className="f m-t-xs">
                                {team.colors?.map(item => (
                                    <Tooltip title={capitalizeWords(item.name)} placement="bottom" color="#0C1D40" key={item.name}>
                                        <div className="team-color-square" style={{ background: item.color }} />
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="single-team-season-record">
                        <Select
                            name="season"
                            title="Season"
                            listOfSelects={seasonsSelect}
                            onChange={handleChange}
                            defaultValue={selectedSeason || ''}
                            useKey="id"
                        />

                        <p className="label m-t-m">Record</p>
                        <div className="single-team-record-header">
                            {recordHeader}
                        </div>
                        <div className="f">
                            {recordValues}
                        </div>
                    </div>
                </div>
            </div>

            <div className="single-team-tabs">
                <input id="home" type="radio" name="tabsA" checked={tabSelected === 'home'} onChange={e => setTabSelected(e.target.id)} />
                <label htmlFor="home">Team Home</label>

                <input id="schedule" type="radio" name="tabsA" checked={tabSelected === 'schedule'} onChange={e => setTabSelected(e.target.id)} />
                <label htmlFor="schedule">Schedule</label>


                <Auth.Tier tiers={basicList}>
                    <input id="roster" type="radio" name="tabsA" checked={tabSelected === 'roster'} onChange={e => setTabSelected(e.target.id)} />
                    <label htmlFor="roster">Roster & Stats</label>
                </Auth.Tier>

            </div>

            {renderTabComponent()}
        </div>
    );
};

const mapStateToProps = state => ({
    record: state.teams.singleTeam.record,
    team: state.teams.singleTeam.team || {},
    seasons: state.seasons.seasons,
    seasonsSelect: state.teams.singleTeam.seasonsSelect,
    currentSeasonId: state.seasons.currentSeason?.id,
    teamPlayerStats: state.teams.singleTeam?.teamPlayerStats,
});

const mapDispatchToProps = dispatch => ({
    getTeamById: (id, filter) => dispatch(getTeamById(id, filter)),
    clearSingleTeamState: () => dispatch(clearSingleTeamState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleTeam);

SingleTeam.propTypes = {
    seasonsSelect: PropTypes.array,
    getTeamById: PropTypes.func.isRequired,
    clearSingleTeamState: PropTypes.func.isRequired,
    record: PropTypes.array,
    team: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    currentSeasonId: PropTypes.number,
    teamPlayerStats: PropTypes.array,
};
