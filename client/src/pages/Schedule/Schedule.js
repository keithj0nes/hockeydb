import React, { Component } from 'react';
import { connect } from 'react-redux';
import dateFormat from 'date-fns/format';
import { getGames } from '../../redux/actions/gamesActions';
// import { getFilters } from '../../redux/actions/misc';

import { Select } from '../../components/';
import './schedule.scss';

const games = [
    { id: 1, date: 'Wed, Apr. 1', time: '3:15 PM', location: 'Castle Ice',     home: 'The Grocery Stick', away: 'Benchwarmers', homeScore: 2, awayScore: 2},
    { id: 2, date: 'Fri, Apr. 3', time: '5:20 PM', location: 'Showare Center', home: 'The Grocery Stick', away: 'Benchwarmers', homeScore: 1, awayScore: 4},
    { id: 3, date: 'Fri, Apr. 3', time: '6:50 PM', location: 'The Igloo'     , home: 'The Grocery Stick', away: 'Benchwarmers', homeScore: 7, awayScore: 6},
    { id: 4, date: 'Sat, Apr. 4', time: '9:10 PM', location: 'Castle Ice'    , home: 'The Grocery Stick', away: 'Benchwarmers', homeScore: 1, awayScore: 0},
    { id: 5, date: 'Sun, Apr. 5', time: '6:50 PM', location: 'The Igloo'     , home: 'The Grocery Stick', away: 'Benchwarmers', homeScore: 7, awayScore: 6},
    { id: 6, date: 'Mon, Apr. 6', time: '5:10 PM', location: 'Castle Ice'    , home: 'The Grocery Stick', away: 'Benchwarmers', homeScore: 1, awayScore: 0},    
    { id: 7, date: 'Mon, Apr. 6', time: '6:50 PM', location: 'The Igloo'     , home: 'The Grocery Stick', away: 'Benchwarmers', homeScore: 7, awayScore: 6},
    { id: 8, date: 'Mon, Apr. 6', time: '9:30 PM', location: 'Showare Center', home: 'The Grocery Stick', away: 'Benchwarmers', homeScore: 1, awayScore: 0},
]

const selectData = [
    {id: 1, name: "option 1"},
    {id: 2, name: "option 2"},
    {id: 4, name: "option 3"},
    {id: 6, name: "option 4"}
]

class Schedule extends Component {

    componentDidMount() {
        this.props.getGames()
        // this.props.getFilters();
    }

    render() {


        return (
            <div className="schedule-container">
                <div className="white-bg">
                    <h1>Schedule</h1>

                    <div className="schedule-filters"> 
                        <Select name='demo' title="Season"   listOfSelects={this.props.scheduleFilters.seasons}   hiddenValue='Select Season'    onChange={(e) => console.log(e.target.value,'changed!')}  />
                        <Select name='demo' title="Division" listOfSelects={[{name: 'All', value: ''}, ...this.props.scheduleFilters.divisions]} onChange={(e) => console.log(e.target.value,'changed!')}  />
                        <Select name='demo' title="Team"     listOfSelects={[{name: 'All', value: ''}, ...this.props.scheduleFilters.teams]}     onChange={(e) => console.log(e.target.value,'changed!')}  />
                        <a>Clear Filters</a>
                    </div>

                    <h2>APRIL</h2>

                    <div className="schedule-headings">

                        <p className="flex-two">Date</p>
                        <p className="flex-one">Time</p>
                        <p className="flex-three">Location</p>
                        <p className="flex-three">Home</p>
                        <p className="flex-three">Away</p>
                        <p className="flex-one">Score</p>
                        <p className="flex-one">Scoresheet</p>

                    </div>

                    {this.props.games.map(game => {


                        const mydate = dateFormat(game.start_date, 'ddd, MMM M h:mm A').split(' ');

                        game.date = `${mydate[0]} ${mydate[1]} ${mydate[2]}`;
                        game.start_time = `${mydate[3]} ${mydate[4]}`;

                        console.log(game, 'GAME!')

                        return (
                            <div className="schedule-list-item" key={game.id}>

                                <p className="flex-two">{game.date}</p>
                                <p className="flex-one">{game.start_time}</p>
                                <p className="flex-three">{game.location_name}</p>
                                <p className="flex-three">{game.home_team}</p>
                                <p className="flex-three">{game.away_team}</p>
                                <p className="flex-one">{game.has_been_played && ( `${game.home_score} : ${game.away_score}` )}</p>
                                <p className="flex-one">{game.has_been_played && 'Boxscore'}</p>
    
                            </div>
                        )
                    })}

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {

    console.log(state, 'STATE IN SCHEUDLE')

    return {
        games: state.games.allGames,
        scheduleFilters: state.misc.scheduleFilters
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getGames: () => dispatch(getGames()),
        // getFilters: () => dispatch(getFilters())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);