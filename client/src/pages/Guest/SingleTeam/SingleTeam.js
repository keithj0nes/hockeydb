import React, { useState } from 'react';
import GuestTable from '../../../components/GuestTable';
import './singleteam.scss';

const SingleTeam = (props) => {
    // console.log(props, 'PROPS IN SINGLE TEAM')

    const [ tabSelected, setTabSelected ] = useState('home');
    let name;
    if(props.location.state) {
        name = props.location.state.name;
    }

    const renderTabComponent = () => {
        if(tabSelected === 'home') {
            return ( <HomeComponent />)
        } else if(tabSelected === 'schedule') {
            return ( <ScheduleComponent /> )
        } else if(tabSelected === 'roster') {
            return ( <RosterComponent />)
        } 
    }
    return (
        <>
            <div className="content-container">
                <div className="white-bg" style={{marginBottom: 20}}>
                    <div className="single-team-content">

                        <div className="single-team-info">
                            <div className="single-team-logo">
                                <div className="actual-image"></div>
                            </div>
                            <div className="single-team-info">
                                <h2>{name || 'Ice Cats'}</h2>
                                <h3>Division 2</h3>
                                <h5>Team Colors: Light Blue</h5>
                            </div>
                        </div>

                        <div className="single-team-record">

                            <h4>Team Record</h4>
                            <table>
                                <tr>
                                    <th title="Games Played">GP</th>
                                    <th>W</th>
                                    <th>L</th>
                                    <th>PTS</th>
                                    <th>GF</th>
                                    <th>GA</th>
                                    <th>PIM</th>
                                </tr>
                                <tr>
                                    <td>20</td>
                                    <td>8</td>
                                    <td>20</td>
                                    <td>16</td>
                                    <td>3.78</td>
                                    <td>7.78</td>
                                    <td>326</td>
                                </tr>
                            </table>

                        </div>

                    </div>

                </div>

                <div className="single-team-tabs">
                    <input id="home" type="radio" name="tabsA" checked={tabSelected === 'home'} onChange={e => setTabSelected(e.target.id)} />
                    <label htmlFor="home">Team Home</label>
                        
                    <input id="schedule" type="radio" name="tabsA" checked={tabSelected === 'schedule'} onChange={e => setTabSelected(e.target.id)} />
                    <label htmlFor="schedule">Schedule</label>
                        
                    <input id="roster" type="radio" name="tabsA" checked={tabSelected === 'roster'} onChange={e => setTabSelected(e.target.id)} />
                    <label htmlFor="roster">Roster & Stats</label>
                </div>

                {/* <div className="white-bg"> */}
                    {renderTabComponent()}
                {/* </div> */}

            </div>

           
        </>
    )
}

export default SingleTeam;


const HomeComponent = () => {
    return (
        <>
            <div className="split-50">

                <GuestTable 
                    title={'Team Leaders'}
                    data={teamLeaders}
                    minWidth={'100%'}
                    containerWidth={'100%'}
                    sections={{'category': 'three','player': 'five', 'points': 'one'}} 
                />

                <GuestTable 
                    title={'Team Standings'}
                    data={teamStandings}
                    minWidth={'100%'}
                    containerWidth={'100%'}
                    sections={{'rank': 'one','team': 'five', 'games_played': 'one', 'points': 'one'}} 
                />

            </div>

            <GuestTable 
                title={'Recent Games'}
                data={recentGames}
                tableType="games"
                minWidth={800}
                sections={{'date': 'one','start_time': 'one', 'location_name': 'two', 'home_team': 'two', 'away_team': 'two', }} 
            />
        </>
    )
}

const ScheduleComponent = () => {
    return (
        <GuestTable 
            title={'Schedule'}
            data={recentGames}
            tableType="games"
            minWidth={800}
            sections={{'date': 'one','start_time': 'one', 'location_name': 'two', 'home_team': 'two', 'away_team': 'two', }} 
        />
    )
}

const RosterComponent = () => {
    return (
        <GuestTable 
            title={'Player Stats'}
            data={playerStats}
            minWidth={800}
            sections={{'number': 'one','name': 'five', 'games_played': 'one', 'goals': 'one', 'assists': 'one', 'points': 'one', 'penalties_in_minutes': 'one',}} 
        />
    )
}

const recentGames = [
    {
        away_score: 1,
        away_team: "navigate virtuals",
        away_team_id: 40,
        date: "Fri, Apr 4",
        division_name: "C1",
        has_been_played: true,
        home_score: 2,
        home_team: "hack wirelesss",
        home_team_id: 44,
        id: 44,
        location_id: 6,
        location_name: "The Coliseum",
        season_name: "Summer 2016",
        start_date: "2020-04-24T09:15:01.130Z",
        start_time: "5:15 AM"
    },
    {
        away_score: 5,
        away_team: "navigate virtuals",
        away_team_id: 40,
        date: "Fri, Apr 4",
        division_name: "C1",
        has_been_played: true,
        home_score: 2,
        home_team: "hack wirelesss",
        home_team_id: 44,
        id: 49,
        location_id: 6,
        location_name: "The Coliseum",
        season_name: "Summer 2016",
        start_date: "2020-04-24T22:30:00.000Z",
        start_time: "6:30 PM"
    },
    {
        away_score: 1,
        away_team: "array arrays",
        away_team_id: 20,
        date: "Sat, Apr 4",
        division_name: "A1",
        has_been_played: false,
        home_score: 2,
        home_team: "synthesize onlines",
        home_team_id: 27,
        id: 55,
        location_id: 5,
        location_name: "Center Ice Arena",
        season_name: "Summer 2016",
        start_date: "2020-04-25T07:00:00.000Z",
        start_time: "3:00 AM",
    },
]

const teamLeaders = [
    {category: 'Points', player: 'Tanner Seramur', points: 26},
    {category: 'Goals', player: 'Adrian Kenepah', points: 25},
    {category: 'Assists', player: 'Jerry Johnson', points: 22},
    {category: 'Penalities In Minutes', player: 'Adam Kessler', points: 159},
    {category: 'Wins', player: 'Roberto Luongo', points: 0},
]

const teamStandings = [
    {rank: 1, team: 'Benchwarmers', games_played: 19, points: 26},
    {rank: 2, team: 'Grocery Stick', games_played: 20, points: 26},
    {rank: 3, team: 'Puck Bunnies', games_played: 19, points: 24},
    {rank: 4, team: 'Gretzky Fanboys', games_played: 19, points: 22},
    {rank: 5, team: 'The Other Guys', games_played: 20, points: 20},
]


const playerStats = [
    {number: 25, name: 'Tanner Seramur', games_played: 5, goals: 12, assists: 14, points: 26, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0},
    {number: 22, name: 'Adrian Kenepah', games_played: 4, goals: 25, assists: 0, points: 25, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0},
    {number: 18, name: 'Jerry Johnson', games_played: 4, goals: 2, assists: 22, points: 24, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0},
    {number: 7, name: 'John Singmore', games_played: 5, goals: 2, assists: 2, points: 4, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0},
    {number: 23, name: 'Lee Spikman', games_played: 4, goals: 1, assists: 0, points: 1, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0},
    {number: 15, name: 'Ian Grute', games_played: 5, goals: 0, assists: 3, points: 3, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0},
    {number: 3, name: 'Glen Brooks', games_played: 5, goals: 0, assists: 0, points: 0, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0},
    {number: 30, name: 'Patrick Fedora', games_played: 5, goals: 6, assists: 2, points: 8, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0},
    // {number: 30, name: 'Patrick Fedora', gp: 5, g: 6, a: 2, p: 8, pim: 0, gwg: 0, ppg: 0, shg: 0, gpg: 0},
]


// const goalieStats = [

// ]