import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import dateFormat from 'date-fns/format';
import { getQuery, setQuery } from '../../../helpers';
import { getGames } from '../../../redux/actions/gamesActions';
import { Select, Button } from '../../../components/';
import './schedule.scss';


class Schedule extends Component {

    state = {
        filters: {
            page: 1,
            fromLoadMore: false
        }
    }

    componentDidMount() {
        const { location, getGames } = this.props;
            if(location.search.length > 0){
                const [filters, filterString] = getQuery();
                // console.log(filters, 'FILTERS!')
                return getGames(filterString).then(res => {
                       return res && this.setState({filters}) //this adds filters to default values
                });
            }
            return getGames('page=1').then(res => this.setState({filters: {...this.state.filters, ...res}}))
    }

    handleChange = e => {
        const filters = { ...this.state.filters };
        const { name, value, checked, type } = e.target

        console.log({name, value})

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
        // delete to not put it in the URL params
        delete filters['page']
        delete filters['fromLoadMore'];

        this.setState(() => {
            const search = setQuery(filters);
            this.props.getGames(search)
            filters.page = 1;
            return {filters, statechanged: name === 'season' && true}
        })
    }

    handleLoadMore = () => {
        this.setState({filters: {...this.state.filters, page: this.state.filters.page + 1, fromLoadMore: true}}, () => {
            const search = setQuery(this.state.filters);
            this.props.getGames(search).then(() => this.setState({filters: {...this.state.filters, fromLoadMore: false}}))
        });
    }


    renderTableData = () => {

        const { games } = this.props;

        // if( isLoading ) return (<TableLoader count={10} format={['two', 'one', 'three', 'three', 'three', 'one', 'one']} />);
        if( games.length <= 0 ) return <h3 style={{textAlign: 'center', marginTop: 50}}>No games fit that search criteria :(</h3>
            
        // const season = this.state.filters.season && `?season=${this.state.filters.season}`;
        const season = this.state.statechanged && `?season=${this.state.filters.season}`; // wonky - added above on line 67
        // const seasonZ = Number(this.state.filters.season) !== this.props.currentSeasonId && `?season=${this.state.filters.season}`;

        return games.map(game => {
                            
            const d = dateFormat(game.start_date, 'ddd, MMM M h:mm A').split(' ');
            
            game.date = `${d[0]} ${d[1]} ${d[2]}`;
            game.start_time = `${d[3]} ${d[4]}`;

            return (
                <div className="ot-row" key={game.id}>
                    <p className="ot-cell ot-flex-two">{game.date}</p>
                    <p className="ot-cell ot-flex-two">{game.start_time}</p>
                    <p className="ot-cell ot-flex-three">{game.location_name}</p>
                    <p className="ot-cell ot-flex-four">
                        <Link to={{pathname:`/teams/${game.home_team_id}`, search: season}}>
                            {game.home_team}
                        </Link>
                    </p>
                    <p className="ot-cell ot-flex-four">
                        <Link to={{pathname:`/teams/${game.away_team_id}`, search: season}}>
                            {game.away_team}
                        </Link>
                    </p>
                    <p className="ot-cell ot-flex-one">{game.has_been_played && ( `${game.home_score} : ${game.away_score}` )}</p>
                    <p className="ot-cell ot-flex-one">
                        {game.has_been_played && (
                            <Link to={`/boxscore/${game.id}`}>
                                Boxscore
                            </Link>
                        )}
                    </p>
                </div>
            )
        })
    }

    renderLoadMore = () => {
        const { division, team } = this.state.filters;
        const { totalGamesCount, games, isLoading } = this.props;

        if(!isLoading && Number(totalGamesCount) !== games.length && !division && !team) {
            return (
                <div style={{paddingTop: 40, textAlign: 'center'}}>
                    <Button title={'Load more'} onClick={this.handleLoadMore}/>
                </div>
            )
        }
    }

    render() {

        return (
            <div className="schedule-container">
                <div className="white-bg">
                    <h1>Schedule</h1>

                    <div className="schedule-filters"> 
                        <Select name='season'   title="Season"   listOfSelects={this.props.scheduleFilters.seasons}                                  onChange={this.handleChange}  defaultValue={this.state.filters.season || ''}   useKey="id" />
                        <Select name='division' title="Division" listOfSelects={[{name: 'All', value: ''}, ...this.props.scheduleFilters.divisions]} onChange={this.handleChange}  defaultValue={this.state.filters.division || ''} useKey="id" />
                        <Select name='team'     title="Team"     listOfSelects={[{name: 'All', value: ''}, ...this.props.scheduleFilters.teams]}     onChange={this.handleChange}  defaultValue={this.state.filters.team || ''}     useKey="id" />
                        {/* <a>Clear Filters</a> */}
                        <div></div>
                    </div>


                    {/* <h2>APRIL</h2> */}
                </div>


                <div className="ot-container">
                    <div className="ot-table" style={{minWidth: null}}>
                        <div className="ot-row-header">
                            <p className="ot-header ot-flex-two">Date</p>
                            <p className="ot-header ot-flex-two">Time</p>
                            <p className="ot-header ot-flex-three">Location</p>
                            <p className="ot-header ot-flex-four">Home</p>
                            <p className="ot-header ot-flex-four">Away</p>
                            <p className="ot-header ot-flex-one">Score</p>
                            <p className="ot-header ot-flex-one">Scoresheet</p>
                        </div>

                        {this.renderTableData()}
                        {this.state.filters.fromLoadMore && (<TableLoader count={10} format={['two', 'one', 'three', 'three', 'three', 'one', 'one']} />)}
                        
                    </div>

                    {this.renderLoadMore()}

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        // isLoading: state.games.isLoading,
        totalGamesCount: state.games.totalGamesCount,
        games: state.games.allGames,
        scheduleFilters: state.misc.scheduleFilters,
        currentSeasonId: state.seasons.currentSeason && state.seasons.currentSeason.id,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getGames: filter => dispatch(getGames(filter)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);




const TableLoader = ({count = 5, format}) => {
    return Array(count).fill().map( (_, idx) => {
        return (
            <div className="ot-row" key={idx}>
                {format.map((flexNum, fidx) => (
                    <p key={fidx} className={`ot-cell ot-flex-${flexNum} shimmer`}></p>
                ))}
            </div>
        )
    })
}
