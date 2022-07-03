/* eslint-disable arrow-body-style */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Tabs = ({ active, tabs, onChange }) => {
    return (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
                {tabs.map(item => {
                    const isActive = item.key === active;
                    return (
                        <li className="mr-2" key={item.key}>
                            <button
                                type="button"
                                onClick={() => onChange(item.key)}
                                // className="inline-block p-4 transition duration-100 rounded-t-lg border-b-2 border-transparent hover:text-secondary hover:border-secondary"
                                className={classNames('inline-block px-4 py-3 transition duration-100 rounded-t-lg border-b-2 border-transparent', {
                                    'text-primary border-primary': isActive,
                                    'hover:text-db-secondary hover:border-db-secondary': !isActive,
                                })}
                            >
                                {item.name}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Tabs;

Tabs.propTypes = {
    active: PropTypes.string,
    tabs: PropTypes.array,
    onChange: PropTypes.func,
};
