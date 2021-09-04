/* eslint-disable arrow-body-style */
/* eslint-disable no-param-reassign */
// helper functions
import { createBrowserHistory } from 'history';
import qs from 'query-string';

export const history = createBrowserHistory();
export const isProduction = process.env.NODE_ENV === 'production';


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


export const sortKeys = ['page', 'dir', 'order_by'];

// this function, paired with reduceForQueryParams and sortKeys, will
// return true ONLY if there are query params (location.search) that
// are NOT in the sortKeys array
// //////////////////////////////// //
// the idea behind this is to NOT show the filter button as seleted if
// there are ONLY ordering/sorting keys preset in the location.search

export const searchReduce = (array, userInput, value) => {
    const [q] = getQuery();

    return reduceForQueryParams(Object.keys(q), (_, element) => {
        return !sortKeys.includes(element);
    }, false);
};


// not exported
const reduceForQueryParams = (array, func, acc) => {
    const result = func(acc, array[0]);
    return array.length === 0 ? acc
        : (result || reduceForQueryParams(array.slice(1), func, result));
};

export const capitalizeWords = (words, splitter = '_') => {
    return words.split(splitter).map(word => {
        return word[0].toUpperCase() + word.substring(1).toLowerCase();
    }).join(' ');
};

// static mapClassNames(classNames, classProps = {}) {

//     if (typeof classNames === 'object') {
//         classProps = {...classNames};
//         classNames = ''
//     }

//     classNames += ' ';

//     for (let [name, active] of Object.entries(classProps)) {
//         if (active) {
//             classNames += name;
//             classNames += ' '
//         }
//     }
//     return classNames
// }


// usage :

// mapClassNames("step", {
//     "active-step": isActive,
//     "middle-step-border": index === 1,
// })
