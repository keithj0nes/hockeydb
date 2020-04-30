import React from 'react';
import PropTypes from 'prop-types';

import Edit from "../../assets/icons/edit_icon.svg";
import Delete from '../../assets/icons/delete_icon.svg';
import Hide from '../../assets/icons/hide_icon.svg';


const DashTable = ({ data, sections, minWidth, onEdit, onDelete, onHide }) => {

    const sectionKeys = Object.keys(sections);
    return (
        <div className="ot-container-dash">
            <div className="ot-table" style={{minWidth}}>
                
                <div className="ot-row-header">
                    {sectionKeys.map(sk => {
                        return (
                            <p key={sk} className={`ot-header ot-flex-${sections[sk]}`}>{sk}</p>
                        )
                    })}
                    <p className="ot-header ot-manage">Manage</p>
                </div>

                {data.map(d => {
                    return (
                        <div className="ot-row" key={d.id}>
                    
                                {sectionKeys.map(section => {
                                    return (
                                        <p key={section} className={`ot-cell ot-flex-${sections[section]}`}>{d[section]} {d.is_active && section === sectionKeys[0] && '- (current)'}</p>
                                    )
                                })}
                                <p className="ot-cell ot-manage">
                                    {!d.hidden_date && <span onClick={onEdit}><img src={Edit} width="25px" alt=""/></span> }
                                    <span onClick={onDelete}><img src={Delete} width="25px" alt=""/></span>
                                    {!d.is_active && <span onClick={onHide}><img src={Hide} width="25px" alt=""/></span> }
                                </p>
                        </div>
                    )

                })}
            </div>
        </div>
    )
}

DashTable.defaultProps = {
    minWidth: null
}

DashTable.propTypes = {
    data: PropTypes.array.isRequired,
    sections: PropTypes.object.isRequired,  // shape = [{ columnName (same key you want from data object): size (one - five)}]
    minWidth: PropTypes.number,             // number is the min width of the table
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onHide: PropTypes.func,
}

export default DashTable;
