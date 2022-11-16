import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { format as dateFNFormat, parseISO } from 'date-fns';

const Table = ({
    data,
    columns,
    emptyText,
    minWidth,
    selectedSeason,
    selectedDivison,
}) => {
    const sectionKeys = Object.keys(columns);

    console.log('SELECTED SEASON', selectedSeason);
    console.log('SELECTED DIVISION', selectedDivison);

    if (!data.length) {
        return <h3>{emptyText}</h3>;
    }
    console.log(sectionKeys);

    return (
        <div className="bg-red-100 p-10 overflow-hidden" style={{ minWidth }}>
            <div className="bg-yellow-100 p-2 flex">
                {sectionKeys.map((key) => {
                    const { flex, as } = columns[key];
                    return (
                        <p key={as} className={`flex-${flex}`}>
                            {as}
                        </p>
                    );
                })}
            </div>

            <div>
                {data.map((d) => (
                    <div key={d.id} className="bg-green-100 p-2 flex">
                        {sectionKeys.map((section) => {
                            const { flex, link, date, string, format } =
                                columns[section];
                            // console.log(columns[section], 'columns[section]')
                            // console.log(string, 'string')
                            if (!!link) {
                                let newLink = link.to;
                                if (link.key) {
                                    newLink += `/${d[link.key]}`;
                                }

                                return (
                                    <Link
                                        key={section}
                                        className={`flex-${flex}`}
                                        to={{
                                            pathname: newLink,
                                            search: link.search,
                                        }}
                                    >
                                        {d[section] || string}
                                    </Link>
                                );
                            }

                            if (!!date) {
                                return (
                                    <p key={section} className={`flex-${flex}`}>
                                        {dateFNFormat(
                                            parseISO(d[date.key]),
                                            date.format
                                        )}
                                    </p>
                                );
                            }

                            if (!!format) {
                                return (
                                    <p key={section} className={`flex-${flex}`}>
                                        {variableStringFormatter(format, d)}
                                    </p>
                                );
                            }

                            return (
                                <p key={section} className={`flex-${flex}`}>
                                    {d[section]}
                                </p>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Table;

Table.defaultProps = {
    data: [],
    emptyText: 'No data available',
};

Table.propTypes = {
    data: PropTypes.array,
    columns: PropTypes.object,
    emptyText: PropTypes.string,
    minWidth: PropTypes.number,
};

// this function takes the format string, replaces the $variable_name with the variable passed into the data prop and returns the original string with replaced variables
// format: '$home_score : $away_score' returns '3 : 5'
function variableStringFormatter(str, data) {
    // return str.split(/(?=[\s.,:;-])|(?<=[\s.,:;-])/g).map(item => {
    return str
        .split(/([\s().,:;-])/g)
        .map((item) => {
            if (item.charAt(0) === '$') {
                return Object.keys(data)
                    .map((i) => {
                        if (i === item.slice(1)) {
                            return data[i] || '0';
                        }
                        return null;
                    })
                    .filter(Boolean);
            }
            return item;
        })
        .join('');
}
