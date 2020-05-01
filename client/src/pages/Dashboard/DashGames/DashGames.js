import React, { Component } from 'react'
import { connect } from 'react-redux';
// import dateFormat from 'date-fns/format';
import qs from 'query-string';
import { Button } from '../../../components';
// import DashGamesListItem from './DashGamesListItem';
// import ListItem from '../ListItem';
import { getLocations } from '../../../redux/actions/locationsActions';
import { getTeams } from '../../../redux/actions/teamsActions';
import { getGames, newGame } from '../../../redux/actions/gamesActions';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toggleModal } from '../../../redux/actions/misc';
import DashTable from '../DashTable';




export class DashGames extends Component {

    state = {
        start_date: new Date(),
        home_team: null,
        away_team: null,
        location_id: null,

        page: 1,
        fromLoadMore: false

    }
    componentDidMount() {
        this.props.locations.length <= 0 && this.props.getLocations();
        this.props.getTeams('orderby=division_name');
        this.props.getGames('page=1');
    }

    handleDateChange = date => {
        console.log(date, 'date')
        console.log(this.state.start_date)
        this.setState({ start_date: date }, () => this.handleAddGame());
    }

    handleLoadMore = () => {
        this.setState({page: this.state.page + 1, fromLoadMore: true}, () => {
            const search = qs.stringify({page: this.state.page, fromLoadMore: this.state.fromLoadMore});
            this.props.getGames(search).then(() => this.setState({fromLoadMore: false}))
        });
    }

    handleChange = edit => e => {
        if(!!edit){
            const editStateCopy = {...this.state.edit};
            editStateCopy[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            return this.setState({edit: editStateCopy})
        }
        const val = JSON.parse(e.target.value);
        // console.log({[e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value})
        this.setState({ [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : val })
    }

    handleAddGame = () => {

        // this variable sets the default disabled value to the season name
        // const defaultValue = Object.keys(qs.parse(this.props.location.search)).length > 0 ? qs.parse(this.props.location.search).season : this.props.currentSeason.name;

        const {start_date} = this.state;

        this.props.toggleModal({
            isVisible: true,
            title: 'Add Game',
            isClosableOnBackgroundClick: false,
            fields: [
                {
                    title: 'Home Team',
                    type: 'select',
                    name: 'home_team',
                    defaultValue: null,
                    dash: { dashValue: 'division_id', dashName: 'division_name'},
                    listOfSelects: [{name: 'Select Home Team', value: null}, ...this.props.teams]
                },
                {                    
                    title: 'Away Team',
                    type: 'select',
                    name: 'away_team',
                    defaultValue: null,
                    dash: { dashValue: 'division_id', dashName: 'division_name'},
                    listOfSelects: [{name: 'Select Away Team', value: null}, ...this.props.teams]
                },
                {
                    title: 'Location',
                    type: 'select',
                    name: 'location_id',
                    defaultValue: null,
                    listOfSelects: [{name: 'Select Location', value: null}, ...this.props.locations]
                },
                {
                    title: 'Date',
                    name: 'start_date',
                    customComponent: <DatePicker
                                        selected={start_date}
                                        onChange={this.handleDateChange}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        timeCaption="time"
                                        withPortal
                                    />
                }
            ],
            onChange: this.handleChange(),
            confirmActionTitle: 'Create Game',
            // confirmAction: () => console.log({home: this.state.home_team, away: this.state.away_team,location_id: this.state.location_id, start_date: this.state.start_date})
            // confirmAction: () => { this.props.newGame({home: this.state.home_team, away: this.state.away_team,location_id: this.state.location_id, start_date: this.state.start_date});}, //this.setState(defaultState) },
            confirmAction: () => { return this.handleNewGameSubmit()}, //this.setState(defaultState) },

        }, 'prompt');
    }

    handleNewGameSubmit = () => {
        const { home_team, away_team, location_id, start_date } = this.state
        if (!home_team || !away_team || !location_id || !start_date) {
            return alert('please fill all inputs');
            // return this.props.toggleModal()
        }

        if (home_team === away_team) {
            return alert('teams cannot be the same');
        }

        const season_id = Object.keys(qs.parse(this.props.location.search)).length > 0 ? qs.parse(this.props.location.search).season : this.props.currentSeason.id;

        console.log('submitting!', { home_team, away_team, location_id, start_date, season_id })
        this.props.newGame({ home_team, away_team, location_id, start_date, season_id });

        // store.dispatch({
        //     type: TOGGLE_MODAL,
        //     modalProps: {
        //         ...state.misc.modalProps,
        //         isVisible: true,
        //         // title: 'Error',
        //         // isClosableOnBackgroundClick: true,
        //         errors: message,
        //         // errors: `${message}\nError code: ${status}`
        //         confirmAction: shouldLogOut ? () => store.dispatch(logout()) : null
        //     },
        //     modalType: state.misc.modalType
        // })


    }

    render() {

        const { games } = this.props;
        return (
            <div>
                <div className="dashboard-filter-header">
                    <Button title="Add Game" onClick={this.handleAddGame} />
                </div>

                <div className="dashboard-list-container">
                    <div className="dashboard-list">

                        {games && games.length <= 0 ? (
                            <div>
                                {this.props.location.search.length > 0 ? 'Sorry, there are no games within your filter criteria' : 'Sorry, no games have been created. Start by adding a games above.'}
                            </div>
                        ) : (
                            <DashTable 
                                data={games}
                                // sections={{ 'name': 'two', 'type': 'one' }}
                                tableType="games"
                                minWidth={775}
                                sections={{'date': 'one','start_time': 'one', 'home_team': 'two', 'away_team': 'two', 'location_name': 'two'}} 
                                />
                        )}
                        {/* <div className="dashboard-list-item hide-mobile">
                            <div style={{display: 'flex'}}>

                                <p className="flex-one">Date</p>
                                <p className="flex-one">Time</p>
                                <p className="flex-two">Home</p>
                                <p className="flex-two">Away</p>
                                <p className="flex-two">Location</p>
                                <p className="flex-one">Manage</p>

                            </div>
                        </div>

                        {this.props.games && this.props.games.map(item => {

                            const mydate = dateFormat(item.start_date, 'MM/DD/YYYY h:mmA').split(' ');

                            item.date = mydate[0];
                            item.start_time = mydate[1];
                            
                            // this should work below, but not
                            // [ item.date, item.start_time ] = dateFormat(item.start_date, 'MM/DD/YYYY h:mm A').split(' ');
                            return (

                                <div key={item.id}>
                                    <div className="hide-desktop">
                                        <DashGamesListItem 
                                            key={item.id} 
                                            item={item} 
                                            sections={{'date': 'one','start_time': 'one', 'home_team': 'two', 'away_team': 'two', 'location_name': 'two'}} 
                                            onClick={() => console.log('delete item!')} 
                                            locations={this.props.locations}
                                        />

                                    </div>

                                    <div className="hide-mobile">
                                        <ListItem 
                                            key={item.id} 
                                            item={item} 
                                            sections={{'date': 'one','start_time': 'one', 'home_team': 'two', 'away_team': 'two', 'location_name': 'two'}} 
                                            onClick={() => console.log('delete item!')} 
                                            locations={this.props.locations}
                                        />
                                    </div>
                                </div>
                            )
                        })} */}
                    </div>

                    { Number(this.props.totalGamesCount) !== this.props.games.length && (
                        <div style={{padding: '20px 0', textAlign: 'center'}}>
                            <Button title={'Load more'} onClick={this.handleLoadMore}/>
                        </div>
                    )}
                </div>

            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        currentSeason: state.seasons.currentSeason,
        locations: state.locations.locations,
        totalGamesCount: state.games.totalGamesCount,
        teams: state.teams.teams,
        games: state.games.allGames,
        isLoading: state.games.isLoading,
    };
};


const mapDispatchToProps = dispatch => ({
    getLocations: () => dispatch(getLocations()),
    getTeams: filter => dispatch(getTeams(filter)),
    getGames: filter => dispatch(getGames(filter)),
    newGame: game => dispatch(newGame(game)),
    toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashGames);



