import React from 'react';
import { connect } from 'react-redux';
import GuestTable from '../../../components/GuestTable';

const STHome = ({recent, standings}) => {

    return (

        <>
            <div className="split-50">
                <GuestTable 
                    title={'Team Leaders'}
                    data={teamLeaders}
                    minWidth={'100%'}
                    containerWidth={'100%'}
                    // sections={{'category': 'three','player': 'five', 'points': 'one'}} 
                    sections={{
                        'category': { as: 'cat', flex: 'two' },
                        'player': 'five', 
                        'points':   { as: 'pts', flex: 'one' }
                    }} 
                    uniqueKey='category'
                    emptyTableText="Leaders not available"
                />

                <GuestTable 
                    title={'Team Standings - Top 5'}
                    // data={teamStandings}
                    data={standings}
                    minWidth={'100%'}
                    containerWidth={'100%'}
                    // sections={{'rank': 'one','team': 'five', 'games_played': 'one', 'points': 'one'}} 

                    sections={{
                        'rank': 'one',
                        'team_name':  { as: 'team',  flex: 'five', link: { to:'/teams', key: 'team_id' } }, 
                        'games_played': { as: 'gp',  flex: 'one' }, 
                        'points':       { as: 'pts', flex: 'one' }
                    }} 
                    uniqueKey='rank'
                    emptyTableText="Standings not available"
                />
            </div>
            
            <GuestTable 
                title={'Recent'}
                data={recent}
                tableType="games"
                minWidth={800}
                // sections={{'date': 'one','start_time': 'one', 'location_name': 'two', 'home_team': 'two', 'away_team': 'two', }} 
                sections={{
                    'date': 'one',
                    'start_time': 'one', 
                    'location_name': 'two', 
                    'home_team': { as: 'home', flex: 'two', link: { to:'/teams', key: 'home_team_id' }}, 
                    'away_team': { as: 'away', flex: 'two', link: { to:'/teams', key: 'away_team_id' }}
                }} 
                emptyTableText="No recent games have been played"
            />
        </>
    )
}

const mapStateToProps = state => {
    console.log(state.teams.singleTeam.standings, 'STANDINGS')
    return {
        recent: state.teams.singleTeam.recent,
        standings: state.teams.singleTeam.standings
    }
}

export default connect(mapStateToProps)(STHome);

const teamLeaders = [
    {category: 'Points', player: 'Tanner Seramur', points: 26},
    {category: 'Goals', player: 'Adrian Kenepah', points: 25},
    {category: 'Assists', player: 'Jerry Johnson', points: 22},
    {category: 'PIMs', player: 'Adam Kessler', points: 159},
    {category: 'Wins', player: 'Roberto Luongo', points: 0},
]

const teamStandings = [
    {rank: 1, team_name: 'Benchwarmers', games_played: 19, points: 26},
    {rank: 2, team_name: 'Grocery Stick', games_played: 20, points: 26},
    {rank: 3, team_name: 'Puck Bunnies', games_played: 19, points: 24},
    {rank: 4, team_name: 'Gretzky Fanboys', games_played: 19, points: 22},
    {rank: 5, team_name: 'The Other Guys', games_played: 20, points: 20},
]