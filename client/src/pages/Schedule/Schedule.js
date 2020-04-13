import React, { Component } from 'react';
import { connect } from 'react-redux';
import dateFormat from 'date-fns/format';
import qs from 'query-string';
import { getGames } from '../../redux/actions/gamesActions';
import { Select } from '../../components/';
import './schedule.scss';


class Schedule extends Component {

    state = {
        filters: {}
    }

    componentDidMount() {
        this.props.getGames()
    }

    handleChange = e => {
        const filters = { ...this.state.filters };
        const { name, value, checked, type } = e.target

        if(value === '' || checked === false){
            delete filters[name];
        } else {
            filters[name] = type === 'checkbox' ? checked : value;
        }

        // reset the select divisions and teams fields if season is changed
        if(name === 'season') {
            delete filters['division'];
            delete filters['team'];
        }
        // reset the select teams fields if season is changed
        if(name === 'division') {
            delete filters['team'];
        }

        this.setState(() => {
            const search = qs.stringify(filters);
            this.props.getGames(search)
            this.props.history.push({ search });
            // this.props.history.push({search: search.replace('%20', '_')});
            return {filters}
        })
    }

    render() {
        return (
            <div className="schedule-container">
                <div className="white-bg">
                    <h1>Schedule</h1>

                    <div className="schedule-filters"> 
                        <Select name='season'   title="Season"   listOfSelects={this.props.scheduleFilters.seasons}                                  onChange={this.handleChange}  defaultValue={this.state.filters.season || ''} />
                        <Select name='division' title="Division" listOfSelects={[{name: 'All', value: ''}, ...this.props.scheduleFilters.divisions]} onChange={this.handleChange}  defaultValue={this.state.filters.division || ''} />
                        <Select name='team'     title="Team"     listOfSelects={[{name: 'All', value: ''}, ...this.props.scheduleFilters.teams]}     onChange={this.handleChange}  defaultValue={this.state.filters.team || ''} />
                        {/* <a>Clear Filters</a> */}
                        <div></div>
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
    return {
        games: state.games.allGames,
        scheduleFilters: state.misc.scheduleFilters
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getGames: filter => dispatch(getGames(filter)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);