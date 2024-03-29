import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPlayers } from '../../redux/slices/players';

const Players = () => {
    const { players, isLoading } = useSelector(state => state.players);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPlayers());
    }, []);

    return (
        <div>
            Show schedule here
            {isLoading ? (
                <p>Page Loading</p>
            ) : (
                <div className="bg-green-100">
                    <p>Players in DB: {players.length}</p>
                    {players.map(player => (
                        <div>
                            {`Player name: ${player.first_name} ${player.last_name} | Team: ${player.name}`}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Players;
