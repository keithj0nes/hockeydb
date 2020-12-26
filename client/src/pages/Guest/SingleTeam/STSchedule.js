// import React, { useEffect } from 'react';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GuestTable from '../../../components/GuestTable';
import { getTeamScheduleById } from '../../../redux/actions/teams';
import { getQuery } from '../../../helpers';


const STSchedule = ({ schedule, currentTeam, match, getTeamScheduleById }) => {
    useEffect(() => {
        // get team schedule by id
        if (schedule.length <= 0 || match.params.id !== currentTeam) {
            const [, filterString] = getQuery();
            getTeamScheduleById(match.params.id, filterString);
        }
    }, [schedule.length, match.params.id, currentTeam, getTeamScheduleById]);
    // FIX: currently useeffect is infinite firing with the below
    // }, [getTeamScheduleById, schedule, match, currentTeam]);


    return (
        <GuestTable
            title="Schedule"
            data={schedule}
            tableType="games"
            minWidth={800}
            // sections={{'date': 'one','start_time': 'one', 'location_name': 'two', 'home_team': 'two', 'away_team': 'two', }}
            sections={{
                date: 'one',
                start_time: 'one',
                location_name: 'two',
                home_team: { as: 'home', flex: 'two', link: { to: '/teams', key: 'home_team_id' } },
                away_team: { as: 'away', flex: 'two', link: { to: '/teams', key: 'away_team_id' } },
            }}
            emptyTableText="Schedule is not complete"
        />
    );
};

const mapStateToProps = state => ({
    schedule: state.teams.singleTeam.schedule,
    currentTeam: state.teams.singleTeam.team && state.teams.singleTeam.team.id,
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
};
