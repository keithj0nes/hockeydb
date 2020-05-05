import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'date-fns/format';

const GuestTable = ({ data, sections, minWidth, tableType }) => {

    const isGame = tableType === 'games';

    const sectionKeys = Object.keys(sections);
    return (
        <div className="ot-container" style={{padding: '20px 0 40px 6px'}}>
            <div className="ot-table" style={{minWidth, paddingRight: 6}}>
                
                <div className="ot-row-header">
                    {sectionKeys.map(sk => {
                        return (
                            <p key={sk} className={`ot-header ot-flex-${sections[sk]}`}>{sk.split('_')[0]}</p>
                        )
                    })}

                    {isGame && (
                        <>
                            <p className="ot-header ot-flex-one">Score</p>
                            <p className="ot-header ot-flex-one">Scoresheet</p>
                        </>
                    )}
                </div>

                {data.map(d => {
                    if(isGame) [ d.date, d.start_time ] = dateFormat(d.start_date, 'MM/DD/YY h:mmA').split(' ');
                    return (
                        <div className="ot-row" key={d.id}>
                    
                                {sectionKeys.map(section => {
                                    return (
                                        <p key={section} className={`ot-cell ot-flex-${sections[section]}`}>{d[section]} {d.is_active && section === sectionKeys[0] && '- (current)'}</p>
                                    )
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
        </div>
    )
}

GuestTable.defaultProps = {
    minWidth: null,
}

GuestTable.propTypes = {
    data: PropTypes.array.isRequired,
    sections: PropTypes.object.isRequired,  // shape = [{ columnName (same key you want from data object): size (one - five)}]
    minWidth: PropTypes.number,             // number is the min width of the table
    tableType: PropTypes.string
}

export default GuestTable;



// code for if [ d.date, d.start_time ] = dateFormat(d.start_date, 'MM/DD/YYYY h:mmA').split(' '); doesnt work
// const gameDate = dateFormat(d.start_date, 'MM/DD/YYYY h:mmA').split(' ');
// d.date = gameDate[0];
// d.start_time = gameDate[1];