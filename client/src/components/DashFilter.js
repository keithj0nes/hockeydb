import React from 'react';
import PropTypes from 'prop-types';
import { history } from 'helpers';
// import qs from 'query-string';
import { DashSelect, DashCheckbox } from '.';
import { sortKeys } from '../helpers';

const DashFilter = ({ data, closeFilter, onChange, filters, setFilters }) => {
    const handleFilterChange = e => {
        if (e === null) {
            closeFilter();
            return setFilters({});
        }

        const _filters = { ...filters };
        // remove all sortKeys any time handleFilterChange is fired (getting a new set of data)
        for (const key in _filters) {
            if (sortKeys.includes(key)) {
                delete _filters[key];
            }
        }

        if (e.target.value === '' || e.target.checked === false) {
            delete _filters[e.target.name];
        } else {
            _filters[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        }
        return setFilters(_filters);
    };

    // use this function until all routes are using hoooks
    // this function allows the whole site not to crash
    const changeFunc = params => {
        if (!!onChange) {
            return onChange(params);
        }
        return handleFilterChange(params);
    };

    return (
        <>
            <div className="popover-header">
                <h2>Filter Options</h2>

                {history.location.search.length > 0 && (
                    <p className="clear-btn" onClick={() => changeFunc(null)}>Clear X</p>
                )}
            </div>

            {data.map(d => (
                <div className="popover-section" key={d.title}>
                    <h5>{d.title}</h5>
                    {d.options.map(field => (
                        <span key={field.name}>
                            {field.type === 'select' && (
                                <DashSelect
                                    name={field.name}
                                    listOfSelects={field.listOfSelects}
                                    onChange={changeFunc}
                                    defaultValue={field.defaultValue}
                                    useKey={field.useKey}
                                />
                            )}

                            {field.type === 'checkbox' && (
                                <div className="popover-checkbox-container">  {/* fix UI - this container should be around all checboxes */}
                                    <DashCheckbox
                                        name={field.name}
                                        title={field.title}
                                        defaultValue={Boolean(field.defaultValue)}
                                        onChange={changeFunc}
                                    />
                                </div>
                            )}
                        </span>
                    ))}
                </div>
            ))}
        </>
    );
};

export default DashFilter;

DashFilter.propTypes = {
    data: PropTypes.array.isRequired,
    getAction: PropTypes.func, // .isRequired,
    closeFilter: PropTypes.func, // .isRequired,
    filterType: PropTypes.string, // .isRequired
};
