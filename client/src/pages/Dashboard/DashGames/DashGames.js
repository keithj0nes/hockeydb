import React, { Component } from 'react'
import { connect } from 'react-redux';
import dateFormat from 'date-fns/format';





import { newLocation, getLocations } from '../../../redux/actions/locationsActions';
import { getTeams } from '../../../redux/actions/teamsActions';
import { getGames, newGame } from '../../../redux/actions/gamesActions';


import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";




export class DashGames extends Component {

    state = {
        start_date: new Date(),
        home_team: null,
        away_team: null,
        location_id: null,

    }
    componentDidMount() {
        this.props.locations.length <= 0 && this.props.getLocations();
        this.props.getTeams();
        this.props.getGames();
    }

    handleDateChange = date => {
        this.setState({ start_date: date });
    }

    handleHomeTeamChange = e => {
        this.setState({ home_team: e.target.value })
    }

    handleAwayTeamChange = e => {
        this.setState({ away_team: e.target.value })
    }

    handleGameLocationChange = e => {
        this.setState({ location_id: e.target.value })
    }

    handleNewGameSubmit = (e) => {
        e.preventDefault();
        const { home_team, away_team, location_id, start_date } = this.state
        if (!home_team || !away_team || !location_id || !start_date) {
            return alert('please fill all inputs');
        }
        this.props.newGame({ home_team, away_team, location_id, start_date });
    }

    render() {
        return (
            <div>
                <div>
                    <h2>Add New Game</h2>
                    <form onSubmit={this.handleNewGameSubmit}>
                        <label> Home Team:
                            <select name="Home" onChange={this.handleHomeTeamChange}>
                                <option >Select</option>
                                {this.props.teams.map(item => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </label>

                        <label> Away Team:
                                <select name="Home" onChange={this.handleAwayTeamChange}>
                                <option>Select</option>
                                {this.props.teams.map(item => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </label>

                        <label> Location:
                                <select name="Home" onChange={this.handleGameLocationChange}>
                                <option>Select</option>
                                {this.props.locations.map(item => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </label>
                        <DatePicker
                            selected={this.state.start_date}
                            onChange={this.handleDateChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            timeCaption="time"
                        />
                        <input type="submit" value="Submit" />
                    </form>


                    <div>
                        {this.props.games.map(item => (
                            <div key={item.id}>
                                <p>{dateFormat(item.start_date, 'MM/DD/YYYY')} {item.away_team} at {item.home_team}  {item.location_name}  {dateFormat(item.start_date, 'h:mm A')} {item.has_been_played && `${item.away_score} : ${item.home_score}`}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log(state, "our state in dashNav!s");

    return {
        locations: state.locations.allLocations,
        teams: state.teams.allTeams,
        games: state.games.allGames
    };
};



const mapDispatchToProps = dispatch => ({
    getLocations: () => dispatch(getLocations()),
    getTeams: () => dispatch(getTeams()),
    getGames: () => dispatch(getGames()),
    newGame: (home, away, location, date) => dispatch(newGame(home, away, location, date)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashGames);



