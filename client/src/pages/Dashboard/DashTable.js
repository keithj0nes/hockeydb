/* eslint-disable react/no-array-index-key */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'date-fns/format';
import distanceInWords from 'date-fns/distance_in_words';
// import Edit from 'assets/icons/edit_icon.svg';
// import Delete from 'assets/icons/delete_icon.svg';
// import Hide from 'assets/icons/hide_icon.svg';
// import Auth, { accessAdmin, accessONLYScorekeeper } from 'components/Auth';
// import { ICONS } from 'assets/ICONS';
import { Popover } from 'components';
import { wait } from 'helpers';


const DashTable = ({ data, sections, minWidth, isLoading, tableType, emptyTableText, popoverData }) => {
    const sectionKeys = Object.keys(sections);
    const isLoadingIsBoolean = typeof isLoading === 'boolean';

    let flexValues;
    if (isLoading) {
        flexValues = sectionKeys.map(item => (typeof sections[item] === 'object' ? sections[item].flex : sections[item]));
    }

    return (
        <div className="ot-container-dash-r">
            <div className="ot-table" style={{ minWidth }}>

                <div className="ot-row-header">
                    {sectionKeys.map(sk => {
                        const isObj = typeof sections[sk] === 'object';
                        return <p key={sk} title={sk.replace(/_/g, ' ')} className={`ot-header ot-flex-${isObj ? sections[sk].flex : sections[sk]}`}>{isObj ? sections[sk].as : sk.split('_')[0]}</p>;
                    })}

                    <button type="button" className="ot-ellipsis hidden">
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                    </button>
                </div>


                {(isLoadingIsBoolean ? isLoading : isLoading[0]) ? (
                    <TableLoader count={(isLoadingIsBoolean ? undefined : isLoading[1])} format={flexValues} />
                ) : (

                    data.length <= 0 ? (
                        <h4 style={{ textAlign: 'center', padding: '20px 0' }}>{emptyTableText}</h4>
                    ) : (

                        data.map((d, indx) => {
                            if (tableType === 'games') [d.date, d.start_time] = dateFormat(d.start_date, 'MM/DD/YY h:mmA').split(' ');
                            if (tableType === 'users') {
                                d.is_suspended === null ? d.is_suspendedd = '[active]' : d.is_suspendedd = '[inactive]';
                                d.last_loginn = (d.last_login ? distanceInWords(new Date(), d.last_login, { addSuffix: true }) : 'never');
                            }
                            return (
                                <TableRow d={d} sectionKeys={sectionKeys} sections={sections} tableType={tableType} indx={indx} key={d.id} popoverData={popoverData} />
                            );
                        })
                    )
                )}
            </div>
        </div>
    );
};

DashTable.defaultProps = {
    minWidth: null, // set at 900px in App.scss
};

DashTable.propTypes = {
    data: PropTypes.array.isRequired,
    sections: PropTypes.object.isRequired, // shape = [{ columnName (same key you want from data object): size (one - five)}]
    minWidth: PropTypes.number, // number is the min width of the table
    tableType: PropTypes.string,
    // isLoading: PropTypes.bool,
    isLoading: PropTypes.oneOfType([ // this defines how many shimmer rows are rendered during isLoading
        PropTypes.bool, // isLoading={isLoading}
        PropTypes.array, // isLoading={[isLoading, 15]}
    ]),
    emptyTableText: PropTypes.string,
    popoverData: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

export default DashTable;


// code for if [ d.date, d.start_time ] = dateFormat(d.start_date, 'MM/DD/YYYY h:mmA').split(' '); doesnt work
// const gameDate = dateFormat(d.start_date, 'MM/DD/YYYY h:mmA').split(' ');
// d.date = gameDate[0];
// d.start_time = gameDate[1];


const TableLoader = ({ count = 5, format }) => {
    const [showShimmer, setShowShimmer] = useState(false);

    useEffect(() => {
        let setShowShimmerAfterWaiting = true;
        wait(500).then(() => setShowShimmerAfterWaiting && setShowShimmer(true)); // wait half a second until showing the shimmer (so there's not a flash of shimmer on load)
        return () => setShowShimmerAfterWaiting = false;
    }, []);

    return Array(count).fill().map((_, idx) => (
        <div className="ot-row" key={idx}>
            {format.map((flexNum, fidx) => (
                <p key={fidx} className={`ot-cell ot-flex-${flexNum} ${showShimmer && 'shimmer'}`} />
            ))}

            <button type="button" className="ot-ellipsis hidden">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
            </button>
        </div>
    ));
};


const TableRow = ({ d, sectionKeys, sections, indx, popoverData }) => {
    const [ellipsisOpen, setEllipsisOpen] = useState(false);

    return (
        <div className="ot-row" id={`row-${indx}`}>

            {sectionKeys.map(section => {
                const isObj = typeof sections[section] === 'object';
                // const sectionLink = sections[section].link;
                return <p key={section} className={`ot-cell ot-flex-${isObj ? sections[section].flex : sections[section]}`}>{d[section]} {d.is_active && section === sectionKeys[0] && '- (current)'}</p>;
            })}

            <button type="button" className="ot-ellipsis" onClick={() => setEllipsisOpen(!ellipsisOpen)}>
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
            </button>

            <Popover isVisible={ellipsisOpen} setIsVisible={setEllipsisOpen} closest={`#row-${indx}`} row>
                { typeof popoverData === 'function' ? (close) => (popoverData(d, close)) : popoverData }
            </Popover>
        </div>
    );
};

TableRow.propTypes = {
    d: PropTypes.object.isRequired,
    sectionKeys: PropTypes.array,
    sections: PropTypes.object,
    indx: PropTypes.number,
    popoverData: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};
