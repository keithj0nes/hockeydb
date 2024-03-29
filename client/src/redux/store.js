import { configureStore } from '@reduxjs/toolkit';
import counter from './slices/counter';
import auth from './slices/auth';
import seasons from './slices/seasons';
import standings from './slices/standings';
import games from './slices/games';
import players from './slices/players';
import teams from './slices/teams';
import news from './slices/news';
import registrations from './slices/registrations';
import locations from './slices/locations';
import divisions from './slices/divisions';

export const store = configureStore({
    reducer: {
        counter,
        auth,
        seasons,
        standings,
        games,
        players,
        teams,
        news,
        registrations,
        locations,
        divisions,
    },
});
