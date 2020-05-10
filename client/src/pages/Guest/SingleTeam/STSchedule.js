// import React, { useEffect } from 'react';
import React from 'react';

import { connect } from 'react-redux';
import GuestTable from '../../../components/GuestTable';
import { getGameById } from '../../../redux/actions/gamesActions';

// const STSchedule = ({teamId, filter, getGameById, schedule}) => {
const STSchedule = ({schedule}) => {

    // useEffect(() => {
    //     // get team schedule by id

    // }, [])

    return (
        <GuestTable 
            title={'Schedule'}
            data={schedule}
            tableType="games"
            minWidth={800}
            sections={{'date': 'one','start_time': 'one', 'location_name': 'two', 'home_team': 'two', 'away_team': 'two', }} 
            emptyTableText="Schedule is not complete"
        />
    )
}

const mapStateToProps = state => {
    return {
        schedule: state.teams.singleTeam.schedule
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getGameById: (id, filter) => dispatch(getGameById(id, filter))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(STSchedule);


// const recentGames = [
//     {
//         away_score: 1,
//         away_team: "navigate virtuals",
//         away_team_id: 40,
//         date: "Fri, Apr 4",
//         division_name: "C1",
//         has_been_played: true,
//         home_score: 2,
//         home_team: "hack wirelesss",
//         home_team_id: 44,
//         id: 44,
//         location_id: 6,
//         location_name: "The Coliseum",
//         season_name: "Summer 2016",
//         start_date: "2020-04-24T09:15:01.130Z",
//         start_time: "5:15 AM"
//     },
//     {
//         away_score: 5,
//         away_team: "navigate virtuals",
//         away_team_id: 40,
//         date: "Fri, Apr 4",
//         division_name: "C1",
//         has_been_played: true,
//         home_score: 2,
//         home_team: "hack wirelesss",
//         home_team_id: 44,
//         id: 49,
//         location_id: 6,
//         location_name: "The Coliseum",
//         season_name: "Summer 2016",
//         start_date: "2020-04-24T22:30:00.000Z",
//         start_time: "6:30 PM"
//     },
//     {
//         away_score: 1,
//         away_team: "array arrays",
//         away_team_id: 20,
//         date: "Sat, Apr 4",
//         division_name: "A1",
//         has_been_played: false,
//         home_score: 2,
//         home_team: "synthesize onlines",
//         home_team_id: 27,
//         id: 55,
//         location_id: 5,
//         location_name: "Center Ice Arena",
//         season_name: "Summer 2016",
//         start_date: "2020-04-25T07:00:00.000Z",
//         start_time: "3:00 AM",
//     },
// ]