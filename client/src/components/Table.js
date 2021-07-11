/* eslint-disable no-param-reassign */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import dateFormat from 'date-fns/format';
import { Tooltip } from 'antd';
import { capitalizeWords } from '../helpers';


const Table = ({ data, columns, minWidth, containerWidth, title, uniqueKey, emptyTableText }) => {
    const sectionKeys = Object.keys(columns);
    return (
        <div className="ot-container" style={{ width: containerWidth }}>

            {title && (<h3>{title}</h3>)}

            {data.length <= 0 ? (
                <h4 style={{ textAlign: 'center', paddingTop: 20 }}>{emptyTableText}</h4>
            ) : (

                <div className="ot-table" style={{ minWidth }}>
                    <div className="ot-row-header">
                        {sectionKeys.map(sk => {
                            const isObj = typeof columns[sk] === 'object';
                            return (
                                <Tooltip title={capitalizeWords(sk)} placement="bottomLeft" color="#0C1D40" key={sk}>
                                    <p className={`ot-header ot-flex-${isObj ? columns[sk].flex : columns[sk]}`}>{isObj ? columns[sk].as : sk.split('_')[0]}</p>
                                </Tooltip>
                            );
                        })}

                    </div>

                    {data.map(d => (
                        <div className="ot-row" key={uniqueKey ? d[uniqueKey] : d.id}>
                            {console.log(d, 'ddddd')}
                            {sectionKeys.map(section => {
                                const isObj = typeof columns[section] === 'object';
                                const sectionLink = columns[section].link;
                                if (isObj && columns[section].hidden) {
                                    if ((columns[section].hidden.charAt(0) === '!' && !d[columns[section].hidden.slice(1)]) || d[columns[section].hidden]) {
                                        return <p key={section} className={`ot-cell ot-flex-${isObj ? columns[section].flex : columns[section]}`} />;
                                    }
                                }

                                if (isObj && sectionLink) {
                                    // could provide link state if query for previous season is provided
                                    let newLink = sectionLink.to;
                                    if (sectionLink.key) {
                                        newLink += `/${d[sectionLink.key]}`;
                                    }

                                    return <Link to={{ pathname: newLink, search: sectionLink.search }} key={section} className={`ot-cell ot-flex-${isObj ? columns[section].flex : columns[section]}`}>{columns[section].link.as ? columns[section].link.as : d[section]}</Link>;
                                }

                                if (isObj && columns[section].date) {
                                    return <p key={section} className={`ot-cell ot-flex-${isObj ? columns[section].flex : columns[section]}`}>{dateFormat(d[columns[section].date.key], columns[section].date.format)}</p>;
                                }

                                if (isObj && columns[section].format) {
                                    return <p key={section} className={`ot-cell ot-flex-${isObj ? columns[section].flex : columns[section]}`}> {variableStringFormatter(columns[section].format, d)}</p>;
                                }
                                return <p key={section} className={`ot-cell ot-flex-${isObj ? columns[section].flex : columns[section]}`}>{d[section]} {d.is_active && section === sectionKeys[0] && '- (active)'}</p>;
                            })}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

Table.defaultProps = {
    minWidth: null,
    emptyTableText: 'Table is empty',
};

Table.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.object.isRequired, // shape = [{ columnName (same key you want from data object): size (one - five)}]
    // shape = if key is an object, must use format { columnName : { as: string, flex: size (one -five), link: object (/teams/key_name) { to: string ('/teams'), key: string ('key_name')}}}
    minWidth: PropTypes.oneOfType([
        PropTypes.string, // string is the min width of the table in px or %
        PropTypes.number, // number is the min width of the table in px
    ]),
    uniqueKey: PropTypes.string, // key to be used in mapping ELSE use .id
    emptyTableText: PropTypes.string, // string to show if table is empty
    containerWidth: PropTypes.number,
    title: PropTypes.string,
};

export default Table;

// this function takes the format string, replaces the $variable_name with the variable passed into the data prop and returns the original string with replaced variables
// format: '$home_score : $away_score' returns '3 : 5'
function variableStringFormatter(str, data) {
    // return str.split(/(?=[\s.,:;-])|(?<=[\s.,:;-])/g).map(item => {
    return str.split(/([\s().,:;-])/g).map(item => {
        if (item.charAt(0) === '$') {
            return Object.keys(data).map(i => {
                if (i === item.slice(1)) {
                    return data[i] || '0';
                }
                return null;
            }).filter(Boolean);
        }
        return item;
    }).join('');
}
