import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import dateFormat from 'date-fns/format';
import { TableLoader } from './';

const GuestTable = ({ data, sections, minWidth, tableType, containerWidth, title, uniqueKey, emptyTableText }) => {

    const isGame = tableType === 'games';
    const sectionKeys = Object.keys(sections);
    return (
        // <div className="ot-container" style={{padding: '20px 0 40px 6px'}}>
        //     <div className="ot-table" style={{minWidth, paddingRight: 6}}>
        <div className="ot-container" style={{width: containerWidth}}>

            {title && ( <h3>{title}</h3> )}

            {data.length <= 0 ? (
                <h4 style={{textAlign: 'center', paddingTop: 20}}>{emptyTableText}</h4>
            ) : (

                <div className="ot-table" style={{minWidth}}>
                    <div className="ot-row-header">
                        {sectionKeys.map(sk => {

                            const isObj = typeof sections[sk] === 'object';
                            return (
                                // <p key={sk} className={`ot-header ot-flex-${sections[sk]}`}>{sk.split('_')[0]}</p>
                                <p key={sk} title={sk.replace(/_/g, ' ')} className={`ot-header ot-flex-${isObj ? sections[sk].flex : sections[sk]}`}>{isObj ? sections[sk].as : sk.split('_')[0]}</p>
                            )
                        })}

                        {isGame && (
                            <>
                                <p title={'score'} className="ot-header ot-flex-one">Score</p>
                                <p title={'scoresheet'} className="ot-header ot-flex-one">Scoresheet</p>
                            </>
                        )}
                    </div>

                    {/* if loading, show loading component */}
                    {/* <TableLoader count={2} format={['one', 'five','one','one']} /> */}

                    {data.map(d => {
                        if(isGame) [ d.date, d.start_time ] = dateFormat(d.start_date, 'MM/DD/YY h:mmA').split(' ');
                        return (
                            <div className="ot-row" key={uniqueKey ? d[uniqueKey] : d.id}>
                        
                                {sectionKeys.map(section => {

                                    const isObj = typeof sections[section] === 'object';
                                    const sectionLink = sections[section].link;

                                    if(isObj && sectionLink) {
                                        // could provide link state if query for previous season is provided
                                        let newLink = sectionLink.to;
                                        if(sectionLink.key) {
                                            newLink += `/${d[sectionLink.key]}`;
                                        }

                                        return <Link to={{pathname: newLink }} key={section} className={`ot-cell ot-flex-${isObj ? sections[section].flex : sections[section]}`}>{d[section]}</Link>
                                    } else {
                                        return <p key={section} className={`ot-cell ot-flex-${isObj ? sections[section].flex : sections[section]}`}>{d[section]} {d.is_active && section === sectionKeys[0] && '- (current)'}</p>

                                    }

                                })}

                                {isGame && (
                                        <>
                                            <p className="ot-cell ot-flex-one">{d.has_been_played && ( `${d.home_score} : ${d.away_score}` )}</p>
                                            <p className="ot-cell ot-flex-one">
                                                {d.has_been_played && (
                                                    // <Link to={`/boxscore/${d.id}`}>
                                                    'Boxscore'
                                                    // {/* </Link> */}
                                                )}
                                            </p>
                                        </>
                                )}
                            </div>
                        )

                    })}
                </div>
            )}
        </div>
    )
}

GuestTable.defaultProps = {
    minWidth: null,
    emptyTableText: 'Table is empty'
}

GuestTable.propTypes = {
    data: PropTypes.array.isRequired,
    sections: PropTypes.object.isRequired,  // shape = [{ columnName (same key you want from data object): size (one - five)}]
    // shape = if key is an object, must use format { columnName : { as: string, flex: size (one -five), link: object (/teams/key_name) { to: string ('/teams'), key: string ('key_name')}}}
    minWidth: PropTypes.oneOfType([
        PropTypes.string,                   // string is the min width of the table in px or %
        PropTypes.number                    // number is the min width of the table in px
    ]),             
    tableType: PropTypes.string,
    uniqueKey: PropTypes.string,            // key to be used in mapping ELSE use .id
    emptyTableText: PropTypes.string,       // string to show if table is empty
}

export default GuestTable;


// code for if [ d.date, d.start_time ] = dateFormat(d.start_date, 'MM/DD/YYYY h:mmA').split(' '); doesnt work
// const gameDate = dateFormat(d.start_date, 'MM/DD/YYYY h:mmA').split(' ');
// d.date = gameDate[0];
// d.start_time = gameDate[1];