import React, { useState } from 'react';

import GuestTable from '../../../components/GuestTable';
import './singleteam.scss';

const SingleTeam = (props) => {
    // console.log(props, 'PROPS IN SINGLE TEAM')

    const [ tabSelected, setTabSelected ] = useState('home');
    // let name;
    // if(props.location.state) {
    //     name = props.location.state.name;
    // }

    const renderTabComponent = () => {
        if(tabSelected === 'home') {
            return ( 
                <GuestTable 
                    data={recentGames}
                    // sections={{ 'name': 'two', 'type': 'one' }}
                    // minWidth={550}

                    tableType="games"
                    minWidth={800}
                    sections={{'date': 'one','start_time': 'one', 'location_name': 'two', 'home_team': 'two', 'away_team': 'two', }} 
                />
            )
        } else if(tabSelected === 'schedule') {
            return ( <p> Rendering schedule Screen </p>)
        } else if(tabSelected === 'roster') {
            return ( <p> Rendering Roster Screen </p>)
        } 
    }
    return (
        // <div>Single Team Component - {name || 'team loading'}</div>

        <>
            <div className="content-container">
                <div className="white-bg" style={{marginBottom: 20}}>
                    <div className="single-team-content">

                        <div className="single-team-info">
                            <div className="single-team-logo">
                                <div className="actual-image"></div>
                            </div>
                            <div className="single-team-info">
                                <h2>Ice Cats</h2>
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

                <div className="white-bg">
                    {renderTabComponent()}
                </div>

            </div>

           
        </>
    )
}

export default SingleTeam;

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
        id: 44,
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
        id: 45,
        location_id: 5,
        location_name: "Center Ice Arena",
        season_name: "Summer 2016",
        start_date: "2020-04-25T07:00:00.000Z",
        start_time: "3:00 AM",
    },
]