import React, { Component } from 'react'
import { connect } from 'react-redux';
import dateFormat from 'date-fns/format';
// import moment from 'moment';
// import InputMoment from 'input-moment';


import { newLocation, getLocations } from '../../../redux/actions/locationsActions';
import { getTeams } from '../../../redux/actions/teamsActions';
import { getGames } from '../../../redux/actions/gamesActions';


export class DashGames extends Component {

    state = {
        locationName: '',
        locationAddress: '',
        // m: moment()
    }

    componentDidMount() {
        this.props.getLocations();
        this.props.getTeams();
        this.props.getGames();
    }

    handleNameChange = e => {
        this.setState({ locationName: e.target.value })
        console.log(this.state);
    }

    handleLocationChange = e => {
        this.setState({ locationAddress: e.target.value })
        console.log(this.state);
    }

    handleLocationsSubmit = e => {
        e.preventDefault();
        this.props.newLocation(this.state.locationName, this.state.locationAddress);
    }

    render() {
        return (
            <div>
                <h1>Dash Games Component</h1>
                <h2>Add New Location</h2>
                <form onSubmit={this.handleLocationsSubmit}>
                    <input type="text" onChange={this.handleNameChange} placeholder={'Location Name'} />
                    <input type="text" onChange={this.handleLocationChange} placeholder={'Location Adress'} />
                    <input type="submit" value="Submit" />
                </form>
                {this.props.locations.map(item => (
                    <div key={item.id}>
                        <p>Name:{item.name} Address: {item.address}</p>
                    </div>
                ))}

                <div>
                    <h2>Add New Game</h2>
                    <form>
                        <label> Home Team:
                            <select name="Home">
                                {this.props.teams.map(item => (
                                    <option key={item.id} value={item.name}>{item.name}</option>
                                ))}
                            </select>
                        </label>

                        <label> Away Team:
                                <select name="Home">
                                {this.props.teams.map(item => (
                                    <option key={item.id} value={item.name}>{item.name}</option>
                                ))}
                            </select>
                        </label>

                        <label> Location:
                                <select name="Home">
                                {this.props.locations.map(item => (
                                    <option key={item.id} value={item.name}>{item.name}</option>
                                ))}
                            </select>
                        </label>
                        
                    </form>


                    <input type="submit" value="Submit" />

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
    newLocation: (name, address) => dispatch(newLocation(name, address)),
    getLocations: () => dispatch(getLocations()),
    getTeams: () => dispatch(getTeams()),
    getGames: () => dispatch(getGames())
})

export default connect(mapStateToProps, mapDispatchToProps)(DashGames);



