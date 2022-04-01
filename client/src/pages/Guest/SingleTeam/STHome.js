import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from '../../../components';
import Auth, { basicList } from '../../../components/Auth';
import { getQuery } from '../../../helpers';


const STHome = ({ recent, standings, currentSeasonId, leaders }) => {
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
                        data={leaders}
                        minWidth="50%"
                        columns={{
                            category: { as: 'cat', flex: 'two' },
                            player: { as: 'player', flex: 'five', format: '$first_name $last_name' },
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
    // remove this concat when goalie stats are incorporated
    leaders: state.teams.singleTeam.leaders.concat({ category: 'Wins', first_name: 'Roberto', last_name: 'Luongo', points: 0 }),
});

export default connect(mapStateToProps)(STHome);

STHome.propTypes = {
    standings: PropTypes.array,
    recent: PropTypes.array,
    currentSeasonId: PropTypes.number,
    leaders: PropTypes.array,
};
