import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import dateFormat from 'date-fns/format';
import qs from 'query-string';
import DatePicker from 'react-datepicker';
import { Button, DashPageHeader } from '../../../components';
// import DashGamesListItem from './DashGamesListItem';
// import ListItem from '../ListItem';
import { getLocations } from '../../../redux/actions/locations';
import { getTeams } from '../../../redux/actions/teams';
import { getGames, newGame } from '../../../redux/actions/games';
import 'react-datepicker/dist/react-datepicker.css';
import { toggleModal } from '../../../redux/actions/misc';
import DashTable from '../DashTable';
import Auth, { accessAdmin, accessONLYScorekeeper } from '../../../components/Auth';


class DashGames extends Component {
    state = {
        start_date: new Date(),
        home_team: null,
        away_team: null,
        location_id: null,

        page: 1,
        fromLoadMore: false,

    }

    componentDidMount() {
        this.props.locations.length <= 0 && this.props.getLocations();
        this.props.getTeams('orderby=division_name');
        this.props.getGames('page=1');
    }

    handleDateChange = date => {
        this.setState({ start_date: date }, () => this.handleAddGame());
    }

    handleLoadMore = () => {
        this.setState({ page: this.state.page + 1, fromLoadMore: true }, () => {
            const search = qs.stringify({ page: this.state.page, fromLoadMore: this.state.fromLoadMore });
            this.props.getGames(search).then(() => this.setState({ fromLoadMore: false }));
        });
    }

    handleChange = edit => e => {
        if (!!edit) {
            const editStateCopy = { ...this.state.edit };
            editStateCopy[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            return this.setState({ edit: editStateCopy });
        }
        const val = JSON.parse(e.target.value);
        // console.log({[e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value})
        return this.setState({ [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : val });
    }

    handleAddGame = () => {
        // this variable sets the default disabled value to the season name
        // const defaultValue = Object.keys(qs.parse(this.props.location.search)).length > 0 ? qs.parse(this.props.location.search).season : this.props.currentSeason.name;

        const { start_date } = this.state;

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
                    dash: { dashValue: 'division_id', dashName: 'division_name' },
                    listOfSelects: [{ name: 'Select Home Team', value: null }, ...this.props.teams],
                },
                {
                    title: 'Away Team',
                    type: 'select',
                    name: 'away_team',
                    defaultValue: null,
                    dash: { dashValue: 'division_id', dashName: 'division_name' },
                    listOfSelects: [{ name: 'Select Away Team', value: null }, ...this.props.teams],
                },
                {
                    title: 'Location',
                    type: 'select',
                    name: 'location_id',
                    defaultValue: null,
                    listOfSelects: [{ name: 'Select Location', value: null }, ...this.props.locations],
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
                    />,
                },
            ],
            onChange: this.handleChange(),
            confirmActionTitle: 'Create Game',
            // confirmAction: () => console.log({home: this.state.home_team, away: this.state.away_team,location_id: this.state.location_id, start_date: this.state.start_date})
            // confirmAction: () => { this.props.newGame({home: this.state.home_team, away: this.state.away_team,location_id: this.state.location_id, start_date: this.state.start_date});}, //this.setState(defaultState) },
            confirmAction: () => this.handleNewGameSubmit(), // this.setState(defaultState) },

        }, 'prompt');
    }

    handleNewGameSubmit = () => {
        const { home_team, away_team, location_id, start_date } = this.state;
        if (!home_team || !away_team || !location_id || !start_date) {
            return alert('please fill all inputs');
            // return this.props.toggleModal()
        }

        if (home_team === away_team) {
            return alert('teams cannot be the same');
        }

        const season_id = Object.keys(qs.parse(this.props.location.search)).length > 0 ? qs.parse(this.props.location.search).season : this.props.currentSeason.id;

        return this.props.newGame({ home_team, away_team, location_id, start_date, season_id });

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

    handleEditGame = game => {
        this.props.history.push(`${this.props.location.pathname}/${game.id}`, game);
    }

    render() {
        const { games, isLoading } = this.props;

        const pageHeaderInfo = {
            title: 'Games',
            searchPlaceholder: 'Search by home, away, location, or division',
            onChange: () => console.log('changing placeholder text'),
            buttons: [
                {
                    iconName: 'ADD_USER',
                    title: 'Add Game',
                    onClick: () => console.log('clickedddd ADD_USER'),
                },
                {
                    iconName: 'FILTER',
                    title: 'Filter Games',
                    onClick: () => console.log('clickedddd FILTER'),
                },
            ],
        };

        return (
            <div>

                <DashPageHeader pageHeaderInfo={pageHeaderInfo} />

                <Auth.User roles={accessAdmin}>
                    <div className="dashboard-filter-header">
                        <Button title="Add Game" onClick={this.handleAddGame} />
                    </div>
                </Auth.User>

                <div className="dashboard-list-container">
                    <div className="dashboard-list">
                        <DashTable
                            data={games}
                            sections={{ date: 'one', start_time: 'one', home_team: 'two', away_team: 'two', location_name: 'two' }}
                            tableType="games"
                            minWidth={775}
                            onEdit={this.handleEditGame}
                            isLoading={isLoading}
                            emptyTableText={this.props.location.search.length > 0 ? 'Sorry, there are no games within your filter criteria' : 'Sorry, no games have been created. Start by adding a games above.'}

                            popoverData={ (d, closePopover) => {
                                // console.log(d,' ddddd')
                                return  (
                                <ul>
                                    <Auth.User roles={accessAdmin}>
                                        {!d.hidden_at && <li onClick={() => {this.handleEditGame(d); closePopover() }}>Edit Game</li>}
                                        {/* {!d.is_active && <li onClick={() => {this.handleHideSeason(d); closePopover() }}>{`${showingHidden ? 'Unh' : 'H'}ide Game`}</li> } */}
                                        {/* <li onClick={() => {this.handleDeleteSeason(d); closePopover() }}>Delete Game</li> */}
                                    </Auth.User>

                                    <Auth.User roles={accessONLYScorekeeper}>
                                        {!d.hidden_at && <li onClick={() => {this.handleEditGame(d); closePopover() }}>Edit Boxscore</li> }
                                    </Auth.User>
                                </ul> 
                            )}
                            }
                        />
                    </div>

                    { Number(this.props.totalGamesCount) !== this.props.games.length && (
                        <div style={{ padding: '20px 0', textAlign: 'center' }}>
                            <Button title="Load more" onClick={this.handleLoadMore} />
                        </div>
                    )}
                </div>

            </div>
        );
    }
}


const mapStateToProps = state => ({
    currentSeason: state.seasons.currentSeason,
    locations: state.locations.locations,
    totalGamesCount: state.games.totalGamesCount,
    teams: state.teams.teams,
    games: state.games.allGames,
    isLoading: state.games.isLoading,
});


const mapDispatchToProps = dispatch => ({
    getLocations: () => dispatch(getLocations()),
    getTeams: filter => dispatch(getTeams(filter)),
    getGames: filter => dispatch(getGames(filter)),
    newGame: game => dispatch(newGame(game)),
    toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashGames);

DashGames.propTypes = {
    getGames: PropTypes.func.isRequired,
    getTeams: PropTypes.func.isRequired,
    getLocations: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    locations: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    newGame: PropTypes.func,
    location: PropTypes.object,
    history: PropTypes.object,
    totalGamesCount: PropTypes.number,
    games: PropTypes.array,
    teams: PropTypes.array,
    currentSeason: PropTypes.object,
};
