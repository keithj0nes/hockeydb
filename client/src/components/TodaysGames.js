import React, { Component } from 'react';
import { Button } from './';
import './todaysgames.scss';

const data = [
    {
        id: 1,
        home_team: 'Bench Warmers',
        away_team: 'Grocery Sticks',
        location_name: 'Showare Center',
        start_time: '7:15 PM'
    },
    {
        id: 2,
        home_team: 'Avalanche',
        away_team: 'Penguins',
        location_name: 'Key Arena',
        start_time: '9:50 PM'
    },
    {
        id: 3,
        home_team: 'Hosers',
        away_team: 'Hoseheads',
        location_name: 'The Igloo',
        start_time: '10:30 PM'
    },
    {
        id: 4,
        home_team: 'Thunderbirds',
        away_team: 'Totems',
        location_name: 'Key Arena',
        start_time: '10:40 PM'
    },
]

class TodaysGames extends Component {

    render() {
        return (
            
            <div className="todays-games-container">
                <h2>Today's games</h2>

                {data.map(game => {

                    return (
                        <div className="todays-games-game" key={game.id}>

                            <div className="todays-game-section">
                                <p className="team-name">{game.home_team}</p>
                                <p>vs</p>
                                <p className="team-name">{game.away_team}</p>
                            </div>
            
                            <div className="todays-game-section">
                                <p>{game.location_name}</p>
                                <p>{game.start_time}</p>
                            </div>
            
                        </div>
                    )
                })}

                <div style={{display: 'flex', justifyContent: 'center', padding: 24}}>

                    <Button
                        title="VIEW SCHEDULE"
                        onClick={() => console.log('view schedule pushed')}
                        outline
                        />
                </div>
            </div>
        )
    }
}


export default TodaysGames;