/* eslint-disable no-param-reassign */
// helper functions
import { createBrowserHistory } from 'history';
import qs from 'query-string';

export const history = createBrowserHistory();

// queries
export const getQuery = (q) => {
    if (!q) q = history.location.search.slice(1);
    const parsed = qs.parse(q);
    return [parsed, q];
};

export const setQuery = (q, noPush) => {
    // if (!q) return null;
    const search = qs.stringify(q);
    if (!noPush) {
        history.push({ search });
    }
    return search;
};

export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
