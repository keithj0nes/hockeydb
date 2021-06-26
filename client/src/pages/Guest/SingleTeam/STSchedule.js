import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from '../../../components';
import { getTeamScheduleById } from '../../../redux/actions/teams';
import { getQuery } from '../../../helpers';


const STSchedule = ({ schedule, currentTeam, match, getTeamScheduleById, currentSeasonId }) => {
    const [state, setState] = useState({});
    useEffect(() => {
        // get team schedule by id
        if (schedule.length <= 0 || match.params.id !== currentTeam) {
            const [filterParsed, filterString] = getQuery();
            getTeamScheduleById(match.params.id, filterString);
            setState({ ...filterParsed, filterString });
        }
    }, [schedule.length, match.params.id, currentTeam, getTeamScheduleById]);
    // FIX: currently useeffect is infinite firing with the below
    // }, [getTeamScheduleById, schedule, match, currentTeam]);

    const search = currentSeasonId !== state.season ? state.filterString : '';

    return (
        <Table
            title="Schedule"
            data={schedule}
            tableType="games"
            minWidth={800}
            columns={{
                date: { as: 'date', flex: 'one', date: { format: 'MM/DD/YY', key: 'start_date' } },
                start: { as: 'start', flex: 'one', date: { format: 'h:mmA', key: 'start_date' } },
                location_name: 'two',
                home_team: { as: 'home', flex: 'two', link: { to: '/teams', key: 'home_team_id', search } },
                away_team: { as: 'away', flex: 'two', link: { to: '/teams', key: 'away_team_id', search } },
                score: { as: 'score', flex: 'one', format: '$home_score : $away_score' },
                scoresheet: { hidden: '!has_been_played', as: 'scoresheet', flex: 'one', link: { to: '/boxscore', key: 'id', as: 'Boxscore' } },
            }}
            emptyTableText="Schedule is not complete"
        />
    );
};

const mapStateToProps = state => ({
    schedule: state.teams.singleTeam.schedule,
    currentTeam: state.teams.singleTeam.team?.id,
    currentSeasonId: state.seasons.currentSeason?.id,
});

const mapDispatchToProps = dispatch => ({
    getTeamScheduleById: (id, filter) => dispatch(getTeamScheduleById(id, filter)),
});

export default connect(mapStateToProps, mapDispatchToProps)(STSchedule);

STSchedule.propTypes = {
    schedule: PropTypes.array,
    currentTeam: PropTypes.number,
    match: PropTypes.object,
    getTeamScheduleById: PropTypes.func,
    currentSeasonId: PropTypes.number,
};
