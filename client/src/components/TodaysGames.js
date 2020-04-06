import React, { Component } from 'react';
import { connect } from 'react-redux';
import dateFormat from 'date-fns/format';
import { Button } from './';
import './todaysgames.scss';

// const data = [
//     {
//         id: 1,
//         home_team: 'Bench Warmers',
//         away_team: 'Grocery Sticks',
//         location_name: 'Showare Center',
//         start_date: '2020-04-05T13:45:45.775Z'
//     },
//     {
//         id: 2,
//         home_team: 'Avalanche',
//         away_team: 'Penguins',
//         location_name: 'Key Arena',
//         start_date: '2020-04-05T13:45:45.775Z'
//     },
//     {
//         id: 3,
//         home_team: 'Hosers',
//         away_team: 'Hoseheads',
//         location_name: 'The Igloo',
//         start_date: '2020-04-05T13:45:45.775Z'
//     },
//     {
//         id: 4,
//         home_team: 'Thunderbirds',
//         away_team: 'Totems',
//         location_name: 'Key Arena',
//         start_date: '2020-04-05T13:45:45.775Z'
//     },
// ]

class TodaysGames extends Component {

    render() {
        console.log(this.props, 'PROPZZZZ')
        return (
            
            <div className="todays-games-container">
                <h2>Today's games</h2>


                {this.props.todaysGames.map(game => {
                    const mydate = dateFormat(game.start_date, 'MM/DD/YYYY h:mmA').split(' ');
                    game.start_time = mydate[1];
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


const mapStateToProps = state => {
    console.log(state, 'STATE IN TODAYS GAME');

    return { 
        todaysGames: state.games.todaysGames
    }

}

export default connect(mapStateToProps)(TodaysGames);