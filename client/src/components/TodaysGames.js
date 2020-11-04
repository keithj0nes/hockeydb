import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dateFormat from 'date-fns/format';
import { Button } from '.';
import './todaysgames.scss';
import { history } from '../helpers';


const TodaysGames = ({ todaysGames }) => (
    <div className="todays-games-container">
        <h2>Today's games</h2>

        {todaysGames.length === 0 ? (
            <h3 style={{ textAlign: 'center' }}>No Games Today :(</h3>
        ) : todaysGames.map(game => {
            const mydate = dateFormat(game.start_date, 'MM/DD/YYYY h:mmA').split(' ');
            game.start_time = mydate[1];
            return (
                <div className="todays-games-game" key={game.id}>

                    <div className="todays-game-section">
                        <p className="team-name">{game.home_team}</p>
                        <p>vs</p>
                        <p className="team-name">{game.away_team}</p>
                    </div>

                    <div className="todays-game-section">
                        <p>{game.location_name}</p>
                        <p>{game.start_time}</p>
                    </div>

                </div>
            );
        })}

        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <Button
                title="VIEW SCHEDULE"
                onClick={() => history.push('/schedule')}
                outline
            />
        </div>
    </div>
);

const mapStateToProps = state => ({
    todaysGames: state.games.todaysGames,
});

export default connect(mapStateToProps)(TodaysGames);

TodaysGames.propTypes = {
    todaysGames: PropTypes.array,
};
