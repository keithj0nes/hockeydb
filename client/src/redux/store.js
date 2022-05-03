import { configureStore } from '@reduxjs/toolkit';
import counter from './slices/counter';
import games from './slices/games';
import auth from './slices/auth';
import seasons from './slices/seasons';
import standings from './slices/standings';

export const store = configureStore({
    reducer: {
        counter,
        games,
        auth,
        seasons,
        standings,
    },
});
