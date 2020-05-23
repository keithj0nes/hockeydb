import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'date-fns/format';

import Edit from "../../assets/icons/edit_icon.svg";
import Delete from '../../assets/icons/delete_icon.svg';
import Hide from '../../assets/icons/hide_icon.svg';
import Auth, { accessAdmin, accessONLYScorekeeper } from '../../components/Auth';


const DashTable = ({ data, sections, minWidth, onEdit, onDelete, onHide, tableType }) => {

    const sectionKeys = Object.keys(sections);
    return (
        <div className="ot-container-dash">
            <div className="ot-table" style={{minWidth}}>
                
                <div className="ot-row-header">
                    {sectionKeys.map(sk => {
                        return (
                            <p key={sk} className={`ot-header ot-flex-${sections[sk]}`}>{sk.split('_')[0]}</p>
                        )
                    })}
                    <p className="ot-header ot-manage">Manage</p>
                </div>

                {data.map(d => {
                    if(tableType === 'games') [ d.date, d.start_time ] = dateFormat(d.start_date, 'MM/DD/YY h:mmA').split(' ');
                    return (
                        <div className="ot-row" key={d.id}>
                    
                            {sectionKeys.map(section => {
                                return (
                                    <p key={section} className={`ot-cell ot-flex-${sections[section]}`}>{d[section]} {d.is_active && section === sectionKeys[0] && '- (current)'}</p>
                                )
                            })}
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
                        </div>
                    )

                })}
            </div>
        </div>
    )
}

DashTable.defaultProps = {
    minWidth: null,
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
    tableType: PropTypes.string
}

export default DashTable;



// code for if [ d.date, d.start_time ] = dateFormat(d.start_date, 'MM/DD/YYYY h:mmA').split(' '); doesnt work
// const gameDate = dateFormat(d.start_date, 'MM/DD/YYYY h:mmA').split(' ');
// d.date = gameDate[0];
// d.start_time = gameDate[1];