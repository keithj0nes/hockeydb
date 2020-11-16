import { useState, useEffect } from 'react';
import { history, getQuery, setQuery } from '../helpers';

const useQueryParam = ({ getMethod }) => {
    const [queryParams, setQueryParams] = useState([]);
    useEffect(() => {
        if (history.location.search.length > 0) {
            const [filters, filterString] = getQuery();
            setQueryParams([filters, filterString]);
            getMethod(`?${filterString}`);
        } else {
            getMethod();
        }
    }, []);

    const setQueryParamsCustom = obj => {
        const search = setQuery(obj) || undefined;
        setQueryParams([obj, search]);
        getMethod(!!obj && !!search && `?${search}`);
    };
    return [queryParams[0] || {}, setQueryParamsCustom, queryParams[1]];
};

export { useQueryParam };

// EXAMPLE
// const [filters, setFilters, filtersString] = useQueryParam({ getMethod: getSeasons });

// filters = object - used for local component filter state
// setFilters = func - used to update URL query params when filtering has changed
// filterString = string - used if needing to use the filter string instead of filter object
