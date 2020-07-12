import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'date-fns/format';
import distanceInWords from 'date-fns/distance_in_words'
// import Edit from 'assets/icons/edit_icon.svg';
// import Delete from 'assets/icons/delete_icon.svg';
// import Hide from 'assets/icons/hide_icon.svg';
// import Auth, { accessAdmin, accessONLYScorekeeper } from 'components/Auth';
// import { ICONS } from 'assets/ICONS';
import { Popover } from 'components';
import { wait } from 'helpers';


const DashTable = ({ data, sections, minWidth, isLoading, onEdit, onDelete, onHide, tableType, emptyTableText, popoverData }) => {

    const sectionKeys = Object.keys(sections);
    const isLoadingIsBoolean = typeof isLoading === 'boolean';

    let flexValues;
    if(isLoading) {
        flexValues = sectionKeys.map(item => typeof sections[item] === 'object' ? sections[item].flex : sections[item])
    }

    return (
        <div className="ot-container-dash-r">
            <div className="ot-table" style={{minWidth}}>
                
                <div className="ot-row-header">
                    {sectionKeys.map(sk => {
                        const isObj = typeof sections[sk] === 'object';
                        return <p key={sk} title={sk.replace(/_/g, ' ')} className={`ot-header ot-flex-${isObj ? sections[sk].flex : sections[sk]}`}>{isObj ? sections[sk].as : sk.split('_')[0]}</p>
                    })}

                    {/* {tableType !== 'users' && (
                        <p className="ot-header ot-manage">Manage</p>
                    )} */}

                    <button className="ot-ellipsis hidden">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </button>
                </div>


                {(isLoadingIsBoolean ? isLoading : isLoading[0]) ? (
                    <TableLoader count={(isLoadingIsBoolean ? undefined : isLoading[1])} format={flexValues} manage={tableType !== 'users'} />
                ) : (

                    data.length <= 0 ? (
                        <h4 style={{textAlign: 'center', padding: '20px 0'}}>{emptyTableText}</h4>
                    ) : (

                    data.map((d, indx) => {
                        if(tableType === 'games') [ d.date, d.start_time ] = dateFormat(d.start_date, 'MM/DD/YY h:mmA').split(' ');
                        if(tableType === 'users') {
                            d.is_suspended === null ? d.is_suspendedd = '[active]' : d.is_suspendedd = '[inactive]';
                            d.last_loginn = (d.last_login ? distanceInWords( new Date(), d.last_login, {addSuffix: true}) : 'never');
                        }
                        return (

                            <TableRow d={d} sectionKeys={sectionKeys} sections={sections} tableType={tableType} indx={indx} onEdit={onEdit} onHide={onHide} onDelete={onDelete} key={d.id} popoverData={popoverData}/>
                            // <div className="ot-row" key={d.id}>
                        
                            //     {sectionKeys.map(section => {
                            //         const isObj = typeof sections[section] === 'object';
                            //         // const sectionLink = sections[section].link;
                            //         return <p key={section} className={`ot-cell ot-flex-${isObj ? sections[section].flex : sections[section]}`}>{d[section]} {d.is_active && section === sectionKeys[0] && '- (current)'}</p>
                            //     })}

                            //     {tableType !== 'users' && (
                            //         <p className="ot-cell ot-manage">
                            //             <Auth.User roles={accessAdmin}>
                            //                 {!d.hidden_date && <span onClick={() => onEdit(d)}><img src={Edit} width="25px" alt=""/></span> }
                            //                 <span onClick={() => onDelete(d)}><img src={Delete} width="25px" alt=""/></span>
                            //                 {!d.is_active && <span onClick={() => onHide(d)}><img src={Hide} width="25px" alt=""/></span> }
                            //             </Auth.User>

                            //             <Auth.User roles={accessONLYScorekeeper}>
                            //                 {!d.hidden_date && <span onClick={() => onEdit(d)}><img src={Edit} width="25px" alt=""/></span> }
                            //             </Auth.User>
                            //         </p>
                            //     )}
                                
                            //     <button className="ot-ellipsis">
                            //         <div className="dot"></div>
                            //         <div className="dot"></div>
                            //         <div className="dot"></div>
                            //     </button>
                                
                            //     {indx === 2 && (

                            //         <div className="ot-options-popout">
                            //             <ul>
                            //                 <li>View Profile</li>
                            //                 <li>Active Status</li>
                            //                 <li>Edit Permissions</li>
                            //                 <li>Resend Invite</li>
                            //             </ul>
                            //         </div>
                            //     )}
                            // </div>
                        )

                    }))
                )}
            </div>
        </div>
    )
}

DashTable.defaultProps = {
    minWidth: null, // set at 900px in App.scss
    onEdit: () => alert('Edit functionality not hooked up yet'),
    onDelete: () => alert('Delete functionality not hooked up yet'),
    onHide: () => alert('Hide functionality not hooked up yet'),
}

DashTable.propTypes = {
    data: PropTypes.array.isRequired,
    sections: PropTypes.object.isRequired,  // shape = [{ columnName (same key you want from data object): size (one - five)}]
    minWidth: PropTypes.number,             // number is the min width of the table
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onHide: PropTypes.func,
    tableType: PropTypes.string,
    // isLoading: PropTypes.bool,
    isLoading: PropTypes.oneOfType([        // this defines how many shimmer rows are rendered during isLoading
        PropTypes.bool,                     // isLoading={isLoading}
        PropTypes.array                     // isLoading={[isLoading, 15]}
    ]),
    emptyTableText: PropTypes.string
}

export default DashTable;



// code for if [ d.date, d.start_time ] = dateFormat(d.start_date, 'MM/DD/YYYY h:mmA').split(' '); doesnt work
// const gameDate = dateFormat(d.start_date, 'MM/DD/YYYY h:mmA').split(' ');
// d.date = gameDate[0];
// d.start_time = gameDate[1];


// {/* <TableLoader count={10} format={['two', 'one', 'three', 'three', 'three', 'one', 'one']} /> */}


const TableLoader = ({count = 5, format, manage}) => {

    const [ showShimmer, setShowShimmer ] = useState(false);

    useEffect(() => {
        let setShowShimmerAfterWaiting = true;
        wait(500).then(() => setShowShimmerAfterWaiting && setShowShimmer(true));        // wait half a second until showing the shimmer (so there's not a flash of shimmer on load)
        return () => setShowShimmerAfterWaiting = false;
    }, [])

    return Array(count).fill().map( (_, idx) => {
        return (
            <div className="ot-row" key={idx}>
                {format.map((flexNum, fidx) => (
                    <p key={fidx} className={`ot-cell ot-flex-${flexNum} ${showShimmer && 'shimmer'}`}></p>
                ))}
                {/* {manage && <p className={`ot-cell ot-manage shimmer`}></p>} */}

                <button className="ot-ellipsis hidden">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </button>
            </div>
        )
    })
}



const TableRow = ({d, sectionKeys, sections, tableType, indx, onEdit, onHide, onDelete, popoverData}) => {

    const [ellipsisOpen, setEllipsisOpen ] = useState(false)

    // const listener = e => {
    //     if(!e.target.closest(`#row-${indx}`)) {
    //         setEllipsisOpen(false);
    //     }
    // }

    // useEffect(() => {
    //     if(ellipsisOpen) {
    //         window.addEventListener('click', listener)
    //     } else {
    //         window.removeEventListener('click', listener);
    //     }
    //     return () => window.removeEventListener('click', listener);

    // }, [ellipsisOpen])

    // const renderOptions = () => {
    //     switch (tableType) {
    //         case 'users':
    //             return (
    //                 <ul>
    //                     <li> <Icon name={ICONS.FILTER} /> View Profile</li>
    //                     <li>Active Status</li>
    //                     <li>Edit Permissions</li>
    //                     <li>Resend Invite</li>
    //                 </ul>
    //             )
        
    //         default:
    //             // return <li className="not-available">No options available</li>
    //             return (
    //                 <ul>
    //                     <Auth.User roles={accessAdmin}>
    //                         {/* {!d.hidden_date && <li onClick={() => onEdit(d)}><Icon name={ICONS.EDIT} /> Edit</li> } */}
    //                         {!d.hidden_date && <li onClick={() => onEdit(d)}><img src={Edit} width="25px" alt=""/> Edit</li> }
    //                         <li onClick={() => onDelete(d)}><img src={Delete} width="25px" alt=""/> Delete</li>
    //                         {!d.is_active && <li onClick={() => onHide(d)}><img src={Hide} width="25px" alt=""/> Hide</li> }
    //                     </Auth.User>

    //                     <Auth.User roles={accessONLYScorekeeper}>
    //                         {!d.hidden_date && <li onClick={() => onEdit(d)}><img src={Edit} width="25px" alt=""/>Edit Boxscore</li> }
    //                     </Auth.User>
    //                 </ul>
    //             )
    //     }
    // }

    return (
        <div className="ot-row" id={`row-${indx}`}>
            
            {sectionKeys.map(section => {
                const isObj = typeof sections[section] === 'object';
                // const sectionLink = sections[section].link;
                return <p key={section} className={`ot-cell ot-flex-${isObj ? sections[section].flex : sections[section]}`}>{d[section]} {d.is_active && section === sectionKeys[0] && '- (current)'}</p>
            })}

            {/* {tableType !== 'users' && (
                <p className="ot-cell ot-manage">
                    <Auth.User roles={accessAdmin}>
                        {!d.hidden_date && <span onClick={() => onEdit(d)}><img src={Edit} width="25px" alt=""/></span> }
                        <span onClick={() => onDelete(d)}><img src={Delete} width="25px" alt=""/></span>
                        {!d.is_active && <span onClick={() => onHide(d)}><img src={Hide} width="25px" alt=""/></span> }
                    </Auth.User>

                    <Auth.User roles={accessONLYScorekeeper}>
                        {!d.hidden_date && <span onClick={() => onEdit(d)}><img src={Edit} width="25px" alt=""/></span> }
                    </Auth.User>
                </p>
            )} */}
            
            <button className="ot-ellipsis" onClick={() => setEllipsisOpen(!ellipsisOpen)}>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </button>

            <Popover isVisible={ellipsisOpen} setIsVisible={setEllipsisOpen} closest={`#row-${indx}`} row>
                {/* <ul>
                    <li>View Profile</li>
                    <li>Active Status</li>
                    <li>Edit Permissions</li>
                    <li>Resend Invite</li>
                </ul> */}
                {/* {popoverData} */}
                {/* {(close) => (popoverData(d, close))} */}

                { typeof popoverData === 'function' ? (close) => (popoverData(d, close)): popoverData }

            </Popover>

{/*             
            {ellipsisOpen && (

                // <div className="ot-options-popout">
                //     { renderOptions() }
                // </div>

            )} */}
        </div>
    )


}





// TableRow.defaultProps = {
//     minWidth: null, // set at 900px in App.scss
//     onEdit: () => alert('Edit functionality not hooked up yet'),
//     onDelete: () => alert('Delete functionality not hooked up yet'),
//     onHide: () => alert('Hide functionality not hooked up yet'),
// }

// OLD ADMIN TABLE

// const DashTable = ({ data, sections, minWidth, isLoading, onEdit, onDelete, onHide, tableType, emptyTableText }) => {

//     const sectionKeys = Object.keys(sections);
//     const isLoadingIsBoolean = typeof isLoading === 'boolean';

//     let flexValues;
//     if(isLoading) {
//         flexValues = sectionKeys.map(item => typeof sections[item] === 'object' ? sections[item].flex : sections[item])
//     }

//     return (
//         <div className="ot-container-dash">
//             <div className="ot-table" style={{minWidth}}>
                
//                 <div className="ot-row-header">
//                     {sectionKeys.map(sk => {
//                         const isObj = typeof sections[sk] === 'object';
//                         return <p key={sk} title={sk.replace(/_/g, ' ')} className={`ot-header ot-flex-${isObj ? sections[sk].flex : sections[sk]}`}>{isObj ? sections[sk].as : sk.split('_')[0]}</p>
//                     })}

//                     {tableType !== 'users' && (
//                         <p className="ot-header ot-manage">Manage</p>
//                     )}
//                 </div>


//                 {(isLoadingIsBoolean ? isLoading : isLoading[0]) ? (
//                     <TableLoader count={(isLoadingIsBoolean ? undefined : isLoading[1])} format={flexValues} manage={tableType !== 'users'} />
//                 ) : (

//                     data.length <= 0 ? (
//                         <h4 style={{textAlign: 'center', padding: '20px 0'}}>{emptyTableText}</h4>
//                     ) : (

//                     data.map(d => {
//                         if(tableType === 'games') [ d.date, d.start_time ] = dateFormat(d.start_date, 'MM/DD/YY h:mmA').split(' ');
//                         if(tableType === 'users') {
//                             d.is_suspended === null ? d.is_suspendedd = '[active]' : d.is_suspendedd = '[inactive]';
//                             d.last_loginn = (d.last_login ? distanceInWords( new Date(), d.last_login, {addSuffix: true}) : 'never');
//                         }
//                         return (
//                             <div className="ot-row" key={d.id}>
                        
//                                 {sectionKeys.map(section => {
//                                     const isObj = typeof sections[section] === 'object';
//                                     // const sectionLink = sections[section].link;
//                                     return <p key={section} className={`ot-cell ot-flex-${isObj ? sections[section].flex : sections[section]}`}>{d[section]} {d.is_active && section === sectionKeys[0] && '- (current)'}</p>
//                                 })}

//                                 {tableType !== 'users' && (
//                                     <p className="ot-cell ot-manage">
//                                         <Auth.User roles={accessAdmin}>
//                                             {!d.hidden_date && <span onClick={() => onEdit(d)}><img src={Edit} width="25px" alt=""/></span> }
//                                             <span onClick={() => onDelete(d)}><img src={Delete} width="25px" alt=""/></span>
//                                             {!d.is_active && <span onClick={() => onHide(d)}><img src={Hide} width="25px" alt=""/></span> }
//                                         </Auth.User>

//                                         <Auth.User roles={accessONLYScorekeeper}>
//                                             {!d.hidden_date && <span onClick={() => onEdit(d)}><img src={Edit} width="25px" alt=""/></span> }
//                                         </Auth.User>
//                                     </p>
//                                 )}
//                             </div>
//                         )

//                     }))
//                 )}
//             </div>
//         </div>
//     )
// }