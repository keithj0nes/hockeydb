import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from '../../../components';
import Auth, { basicList } from '../../../components/Auth';
import { getQuery } from '../../../helpers';


const STHome = ({ recent, standings, currentSeasonId }) => {
    const [state, setState] = useState({});
    const [, filterString] = getQuery();
    useEffect(() => {
        setState({ filterString });
    }, [filterString]);
    const search = currentSeasonId !== Number(state.season) ? state.filterString : '';
    return (
        <>
            <div className="split-50">
                <Auth.Tier tiers={basicList}>
                    <Table
                        title="Team Leaders"
                        data={teamLeaders}
                        minWidth="50%"
                        columns={{
                            category: { as: 'cat', flex: 'two' },
                            player: 'five',
                            points: { as: 'pts', flex: 'one' },
                        }}
                        uniqueKey="category"
                        emptyTableText="Leaders not available"
                    />
                </Auth.Tier>

                <Table
                    title="Team Standings - Top 5"
                    data={standings}
                    minWidth="50%"
                    columns={{
                        rank: 'one',
                        team_name: { as: 'team', flex: 'five', link: { to: '/teams', key: 'team_id', search } },
                        games_played: { as: 'gp', flex: 'one' },
                        points: { as: 'pts', flex: 'one' },
                    }}
                    uniqueKey="rank"
                    emptyTableText="Standings not available"
                />
            </div>

            <Table
                title="Recent"
                data={recent}
                tableType="games"
                minWidth={800}
                columns={{
                    date: { as: 'date', flex: 'one', date: { format: 'MM/DD/YY', key: 'start_date' } },
                    start: { as: 'start', flex: 'one', date: { format: 'h:mmA', key: 'start_date' } },
                    location_name: 'two',
                    home_team: { as: 'home', flex: 'two', link: { to: '/teams', key: 'home_team_id', search } },
                    away_team: { as: 'away', flex: 'two', link: { to: '/teams', key: 'away_team_id', search } },
                    score: { as: 'score', flex: 'one', format: '$home_score : $away_score' },
                    scoresheet: { as: 'scoresheet', flex: 'one', link: { to: '/boxscore', key: 'id', as: 'Boxscore' } },
                }}
                emptyTableText="No recent games have been played"
            />
        </>
    );
};

const mapStateToProps = state => ({
    recent: state.teams.singleTeam.recent,
    standings: state.teams.singleTeam.standings,
    currentSeasonId: state.seasons.currentSeason?.id,
});

export default connect(mapStateToProps)(STHome);


STHome.propTypes = {
    standings: PropTypes.array,
    recent: PropTypes.array,
    currentSeasonId: PropTypes.number,
};


const teamLeaders = [
    { category: 'Points', player: 'Tanner Seramur', points: 26 },
    { category: 'Goals', player: 'Adrian Kenepah', points: 25 },
    { category: 'Assists', player: 'Jerry Johnson', points: 22 },
    { category: 'PIMs', player: 'Adam Kessler', points: 159 },
    { category: 'Wins', player: 'Roberto Luongo', points: 0 },
];
