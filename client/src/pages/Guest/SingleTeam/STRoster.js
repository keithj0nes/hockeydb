import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '../../../components';


const STRoster = ({ stats }) => (
    <Table
        title="Player Stats"
        data={stats}
        minWidth={800}
        uniqueKey="player_id"
        columns={{
            player_number: { as: '#', flex: 'one' },
            name: { as: 'name', flex: 'five', format: '$first_name $last_name' },
            games_played: { as: 'gp', flex: 'one' },
            goals: { as: 'g', flex: 'one' },
            assists: { as: 'a', flex: 'one' },
            points: { as: 'pts', flex: 'one' },
            penalties_in_minutes: { as: 'pim', flex: 'one' },
            game_winning_goals: { as: 'gwg', flex: 'one' },
            power_play_goals: { as: 'ppg', flex: 'one' },
            short_handed_goals: { as: 'shg', flex: 'one' },
            goals_per_game: { as: 'gpg', flex: 'one' },
        }}
    />
);

export default STRoster;

STRoster.propTypes = {
    stats: PropTypes.array,
};
