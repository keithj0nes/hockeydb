// import React, { Component } from 'react';

// class DashGamesDetails extends Component { 

//     render() {
//         return (
//             <h1>DashGamesDetails</h1>
//         )
//     }
// }

import React, { useState, useEffect } from 'react';

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
}

const DashGamesDetails = ({ match }) => {

    // const [ gameDetails, setGameDetails ] = useState(defaultState)
    const [ gameDetails ] = useState(defaultState)


    // console.log(location, 'location!')
    console.log(gameDetails, 'gamedetails')

    useEffect(() => {
        // setGameDetails({...gameDetails, home_team: 'HAHAH', away_team: 'awww'})
        // console.log(gameDetails, 'gamedetails')

        console.log(match.params.id, 'GET API CALL HERE IN USEEFFECT')

    }, [])



    return (
        <h1>DashGamesDetails</h1>
    )
}

export default DashGamesDetails;