import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '../../../components';
import { getGameById } from '../../../redux/actions/games';

const defaultState = {
    id: null,
    away_score: null,
    away_team: '',
    away_team_id: null,
    date: '',
    start_time: '',
    start_date: '',
    division_name: '',
    division_id: '',
    has_been_played: false,
    home_score: null,
    home_team: '',
    home_team_id: null,
    location_name: '',
    location_id: null,
    season_name: '',
    season_id: null,
};

// const players1 = [
//     { id: 1, name: 'adrian', played_in_game: false },
//     { id: 2, name: 'keith', played_in_game: false },
//     { id: 3, name: 'josh', played_in_game: false },
//     { id: 4, name: 'matt', played_in_game: false },
//     { id: 5, name: 'toby', played_in_game: false },
// ]

// const players2 = [
//     { id: 8, name: 'greggory', played_in_game: false },
//     { id: 10, name: 'john', played_in_game: false },
//     { id: 22, name: 'jake', played_in_game: false },
//     { id: 15, name: 'seth', played_in_game: false },
//     { id: 55, name: 'adam', played_in_game: false },
// ]


const DashGamesDetails = ({ history, match, getGameById, gameDetails }) => {
    // const [ gameDetails, setGameDetails ] = useState(defaultState)
    const [_gameDetails, setGameDetails] = useState(defaultState);

    // console.log(location, 'location!')
    console.log(_gameDetails, 'gamedetails');

    // commented out due to infinite load currently

    // component did mount
    // useEffect(() => {
    //     // setGameDetails({...gameDetails, home_team: 'HAHAH', away_team: 'awww'})
    //     // console.log(gameDetails, 'gamedetails')
    //     console.log(match.params.id, 'GET API CALL HERE IN USEEFFECT');

    //     getGameById(match.params.id);
    // }, [match.params.id, getGameById]);

    // // update game details from redux state
    // useEffect(() => {
    //     console.log(gameDetails, 'in use effect 2');
    //     setGameDetails({ ..._gameDetails, ...gameDetails });
    // }, [gameDetails, _gameDetails]);


    return (
        <>
            <div className="dashboard-filter-header">
                <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button title="Back to Games" onClick={history.goBack} />
                    </div>
                </div>
            </div>

            <div className="dashnews-container">
                <h1>DashGamesDetails</h1>
                <p>home team: { _gameDetails.home_team_name}</p>
                <p>away team: { _gameDetails.away_team_name}</p>
            </div>
        </>
    );
};

const mapStateToProps = state => ({
    gameDetails: state.games.gameDetails,
});

const mapDispatchToProps = dispatch => ({
    getGameById: id => dispatch(getGameById(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashGamesDetails);

DashGamesDetails.propTypes = {
    gameDetails: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    getGameById: PropTypes.func,
};
