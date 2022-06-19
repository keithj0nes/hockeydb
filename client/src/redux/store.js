import { configureStore } from '@reduxjs/toolkit';
import counter from './slices/counter';
import auth from './slices/auth';
import seasons from './slices/seasons';
import standings from './slices/standings';
import games from './slices/schedule';
import players from './slices/players';

export const store = configureStore({
    reducer: {
        counter,
        auth,
        seasons,
        standings,
        games,
        players,
    },
});
