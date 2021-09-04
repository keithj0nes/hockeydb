import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tooltip } from 'antd';
import { getTeamById, clearSingleTeamState } from '../../../redux/actions/teams';
import STSchedule from './STSchedule';
import STHome from './STHome';
import { Select, Table } from '../../../components';
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

    console.log(teamPlayerStats, 'teamPlayerStats')


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

            {/* <div className="white-bg"> */}
            {renderTabComponent()}
            {/* </div> */}

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

const STRoster = ({ stats }) => (
    <Table
        title="Player Stats"
        data={stats}
        minWidth={800}
        uniqueKey="number"
        columns={{
            player_number: { as: '#', flex: 'one' },
            // name: 'five',
            name: { as: 'name', flex: 'five', format: '$first_name $last_name' },
            games_played: { as: 'gp', flex: 'one' },
            goals: { as: 'g', flex: 'one' },
            assists: { as: 'a', flex: 'one' },
            points: { as: 'pts', flex: 'one' },
            penalties_in_minutes: { as: 'pim', flex: 'one' },
            game_winning_goals: { as: 'gwg', flex: 'one' },
            power_play_goals: { as: 'ppg', flex: 'one' },
            short_handed_goals: { as: 'shg', flex: 'one' },
            goals_per_game: { as: 'gpg', flex: 'one' },
        }}
    />
);

// const recentGames = [
//     {
//         away_score: 1,
//         away_team: "navigate virtuals",
//         away_team_id: 40,
//         date: "Fri, Apr 4",
//         division_name: "C1",
//         has_been_played: true,
//         home_score: 2,
//         home_team: "hack wirelesss",
//         home_team_id: 44,
//         id: 44,
//         location_id: 6,
//         location_name: "The Coliseum",
//         season_name: "Summer 2016",
//         start_date: "2020-04-24T09:15:01.130Z",
//         start_time: "5:15 AM"
//     },
//     {
//         away_score: 5,
//         away_team: "navigate virtuals",
//         away_team_id: 40,
//         date: "Fri, Apr 4",
//         division_name: "C1",
//         has_been_played: true,
//         home_score: 2,
//         home_team: "hack wirelesss",
//         home_team_id: 44,
//         id: 49,
//         location_id: 6,
//         location_name: "The Coliseum",
//         season_name: "Summer 2016",
//         start_date: "2020-04-24T22:30:00.000Z",
//         start_time: "6:30 PM"
//     },
//     {
//         away_score: 1,
//         away_team: "array arrays",
//         away_team_id: 20,
//         date: "Sat, Apr 4",
//         division_name: "A1",
//         has_been_played: false,
//         home_score: 2,
//         home_team: "synthesize onlines",
//         home_team_id: 27,
//         id: 55,
//         location_id: 5,
//         location_name: "Center Ice Arena",
//         season_name: "Summer 2016",
//         start_date: "2020-04-25T07:00:00.000Z",
//         start_time: "3:00 AM",
//     },
// ]

// const teamLeaders = [
//     {category: 'Points', player: 'Tanner Seramur', points: 26},
//     {category: 'Goals', player: 'Adrian Kenepah', points: 25},
//     {category: 'Assists', player: 'Jerry Johnson', points: 22},
//     {category: 'PIMs', player: 'Adam Kessler', points: 159},
//     {category: 'Wins', player: 'Roberto Luongo', points: 0},
// ]

// const teamStandings = [
//     {rank: 1, team: 'Benchwarmers', games_played: 19, points: 26},
//     {rank: 2, team: 'Grocery Stick', games_played: 20, points: 26},
//     {rank: 3, team: 'Puck Bunnies', games_played: 19, points: 24},
//     {rank: 4, team: 'Gretzky Fanboys', games_played: 19, points: 22},
//     {rank: 5, team: 'The Other Guys', games_played: 20, points: 20},
// ]


const playerStats = [
    { number: 25, name: 'Tanner Seramur', games_played: 5, goals: 12, assists: 14, points: 26, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0 },
    { number: 22, name: 'Adrian Kenepah', games_played: 4, goals: 25, assists: 0, points: 25, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0 },
    { number: 18, name: 'Jerry Johnson', games_played: 4, goals: 2, assists: 22, points: 24, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0 },
    { number: 30, name: 'Patrick Fedora', games_played: 5, goals: 6, assists: 2, points: 8, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0 },
    { number: 7, name: 'John Singmore', games_played: 5, goals: 2, assists: 2, points: 4, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0 },
    { number: 15, name: 'Ian Grute', games_played: 5, goals: 0, assists: 3, points: 3, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0 },
    { number: 23, name: 'Lee Spikman', games_played: 4, goals: 1, assists: 0, points: 1, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0 },
    { number: 3, name: 'Glen Brooks', games_played: 5, goals: 0, assists: 0, points: 0, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0 },
    // {number: 30, name: 'Patrick Fedora', gp: 5, g: 6, a: 2, p: 8, pim: 0, gwg: 0, ppg: 0, shg: 0, gpg: 0},
];


// const goalieStats = [

// ]
