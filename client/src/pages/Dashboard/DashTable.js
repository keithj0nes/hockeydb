/* eslint-disable react/no-array-index-key */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'date-fns/format';
import distanceInWords from 'date-fns/distance_in_words';
import { Popover, DraggableIcon } from 'components';
import { wait } from 'helpers';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// currently drag n drop is only being used by DashNews component
const DashTable = ({ data, sections, minWidth, isLoading, tableType, emptyTableText, popoverData, draggableProps }) => {
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

                    {!!draggableProps && (
                        <DraggableIcon style={{ visibility: 'hidden', height: 0 }} />
                    )}
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
                        // currently drag n drop is only being used by DashNews component
                        !!draggableProps ? (
                            <DragDropContext onDragEnd={draggableProps.onDragEnd}>
                                <Droppable droppableId="news-dnd-container">
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            // isDraggingOver={snapshot.isDraggingOver}
                                        >
                                            {
                                                data.map((d, indx) => {
                                                    return (
                                                        <Draggable draggableId={d.id} index={indx} key={d.id}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    {...provided.draggableProps}
                                                                    ref={provided.innerRef}
                                                                    style={{ ...provided.draggableProps.style, display: 'flex', alignItems: 'center', backgroundColor: snapshot.isDragging && '#e4e4e4' }}
                                                                >
                                                                    <TableRow d={d} sectionKeys={sectionKeys} sections={sections} tableType={tableType} indx={indx} key={d.id} popoverData={popoverData} draggable={provided} />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })
                                            }
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
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
    draggableProps: PropTypes.shape({
        onDragEnd: PropTypes.func,
    }),
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


const TableRow = ({ d, sectionKeys, sections, indx, popoverData, draggable }) => {
    const [ellipsisOpen, setEllipsisOpen] = useState(false);

    return (
        <div className="ot-row" id={`row-${indx}`}>

            {!!draggable && (
                <DraggableIcon {...draggable.dragHandleProps} />
            )}

            {sectionKeys.map(section => {
                const isObj = typeof sections[section] === 'object';
                // const sectionLink = sections[section].link;
                return <p key={section} className={`ot-cell ot-flex-${isObj ? sections[section].flex : sections[section]}`}>{d[section]} {d.is_active && section === sectionKeys[0] && '- (active)'}</p>;
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
    draggable: PropTypes.object,
};
