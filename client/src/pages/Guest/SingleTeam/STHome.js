import React from 'react';
import { connect } from 'react-redux';
import GuestTable from '../../../components/GuestTable';

const STHome = ({recent}) => {

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
                />

                <GuestTable 
                    title={'Team Standings'}
                    data={teamStandings}
                    minWidth={'100%'}
                    containerWidth={'100%'}
                    // sections={{'rank': 'one','team': 'five', 'games_played': 'one', 'points': 'one'}} 

                    sections={{
                        'rank': 'one',
                        'team': 'five', 
                        'games_played': { as: 'gp',  flex: 'one' }, 
                        'points':       { as: 'pts', flex: 'one' }
                    }} 
                    uniqueKey='rank'
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
    return {
        recent: state.teams.singleTeam.recent || []
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
    {rank: 1, team: 'Benchwarmers', games_played: 19, points: 26},
    {rank: 2, team: 'Grocery Stick', games_played: 20, points: 26},
    {rank: 3, team: 'Puck Bunnies', games_played: 19, points: 24},
    {rank: 4, team: 'Gretzky Fanboys', games_played: 19, points: 22},
    {rank: 5, team: 'The Other Guys', games_played: 20, points: 20},
]