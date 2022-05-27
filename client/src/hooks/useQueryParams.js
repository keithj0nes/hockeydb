import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { history, getQuery, setQuery } from '../helpers';
import qs from 'query-string';
import { history } from '../utils';

const useQueryParams = (getMethod) => {
    const [queryParams, setQueryParams] = useState([]);
    const dispatch = useDispatch();


    console.log(history.location, 'locaaattionn')
    useEffect(() => {
        if (history.location.search.length > 0) {
            const [filters, filterString] = getQuery();
            console.log(filters, 'filterrrrzzzz')
            setQueryParams([filters, filterString]);
            dispatch(getMethod(`?${filterString}`));
        } else {
            console.log('firing get method without serach')
            dispatch(getMethod());
        }
    }, [getMethod]);

    const setQueryParamsCustom = (obj, append) => {
        const [filters] = getQuery();
        const search = setQuery(append ? { ...filters, ...obj } : obj) || undefined;
        setQueryParams([obj, search]);
        dispatch(getMethod(!!obj && !!search && `?${search}`));
    };
    return [queryParams[0] || {}, setQueryParamsCustom, queryParams[1]];
};

export { useQueryParams };

// EXAMPLE
// const [filters, setFilters, filtersString] = useQueryParam({ getMethod: getSeasons });

// filters = object - used for local component filter state
// setFilters = func - used to update URL query params when filtering has changed
// filterString = string - used if needing to use the filter string instead of filter object


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
