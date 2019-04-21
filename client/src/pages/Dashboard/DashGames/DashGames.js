import React, { Component } from 'react'
import { connect } from 'react-redux';
import dateFormat from 'date-fns/format';

import { Button } from '../../../components';
import DashGamesListItem from './DashGamesListItem';
import ListItem from '../ListItem';



import { getLocations } from '../../../redux/actions/locationsActions';
import { getTeams } from '../../../redux/actions/teamsActions';
import { getGames, newGame } from '../../../redux/actions/gamesActions';


import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";




export class DashGames extends Component {

    state = {
        isAddGameVisible: false,

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

        if (home_team === away_team) {
            return alert('teams cannot be the same');
        }

        this.props.newGame({ home_team, away_team, location_id, start_date });
    }

    toggleGameVisible = () => {
        this.setState({isAddGameVisible: !this.state.isAddGameVisible})
    }

    render() {
        return (
            <div>

                <div className="dashboard-filter-header">
                    <div>
                        <Button title="Add Game" onClick={this.toggleGameVisible}/>
                    </div>
                </div>



                {this.state.isAddGameVisible && (
              
                    <div className="dashboard-add-container">
                        {/* <form onSubmit={this.handleNewGameSubmit}> */}
                            {/* <label> Home Team: */}
                                <select name="Home" onChange={this.handleHomeTeamChange}>
                                    <option value="">Home Team</option>
                                    {this.props.teams.map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            {/* </label> */}

                            {/* <label> Away Team: */}
                                <select name="Home" onChange={this.handleAwayTeamChange}>
                                    <option value="">Away Team</option>
                                    {this.props.teams.map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            {/* </label> */}

                            {/* <label> Location: */}
                                <select name="Home" onChange={this.handleGameLocationChange}>
                                    <option value="">Location</option>
                                    {this.props.locations.map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            {/* </label> */}
                            <DatePicker
                                selected={this.state.start_date}
                                onChange={this.handleDateChange}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="time"
                                withPortal
                            />
                            <div className="dashboard-add-button-container">
                                <Button title="Save Game" success onClick={this.handleNewGameSubmit} />
                            </div>
                        {/* </form> */}

                    </div>
                )}


                <div className="dashboard-list-container">

                    <div className="dashboard-list">

                        <div className="dashboard-list-item hide-mobile">
                            <div style={{display: 'flex'}}>

                                <p className="flex-one">Date</p>
                                <p className="flex-one">Home</p>
                                <p className="flex-one">Away</p>
                                <p className="flex-one">Location</p>
                                <p className="flex-one">Time</p>
                                <p className="flex-one">Manage</p>


                            </div>
                        </div>

                    {this.props.games && this.props.games.map(item => {

                        // console.log(item, 'befroe')
                        item.date = dateFormat(item.start_date, 'MM/DD/YYYY');
                        item.start_time = dateFormat(item.start_date, 'h:mm A')
                        // console.log(item, 'after')

                        return (

                            <div key={item.id}>
                                <div className="hide-desktop">
                                    <DashGamesListItem 
                                        key={item.id} 
                                        item={item} 
                                        sections={{'date': 'one', 'home_team': 'one', 'away_team': 'one', 'location_name': 'one', 'start_time': 'one'}} 
                                        onClick={() => this.props.deleteSeason(item.id)} 
                                        locations={this.props.locations}
                                    />

                                </div>

                                <div className="hide-mobile">
                                    <ListItem 
                                        key={item.id} 
                                        item={item} 
                                        sections={{'date': 'one', 'home_team': 'one', 'away_team': 'one', 'location_name': 'one', 'start_time': 'one'}} 
                                        onClick={() => this.props.deleteSeason(item.id)} 
                                        locations={this.props.locations}
                                    />

                                </div>

                            </div>


                        )

                    })}

                    {/* <div className="dashboard-list-item"></div>
                    <div className="dashboard-list-item"></div> */}


                        {/* <div>Name</div>
                        <div>Type</div>
                        <div>Manage/Edit</div> */}
                    </div>

                </div>
                

                    {/* <div>
                        {this.props.games.map(item => (
                            <div key={item.id}>
                                <p>{dateFormat(item.start_date, 'MM/DD/YYYY')} {item.away_team} at {item.home_team}  {item.location_name}  {dateFormat(item.start_date, 'h:mm A')} {item.has_been_played && `${item.away_score} : ${item.home_score}`}</p>
                            </div>
                        ))}
                    </div> */}
            </div>
        )
    }
}

const mapStateToProps = state => {
    // console.log(state, "our state in dashNav!s");

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



