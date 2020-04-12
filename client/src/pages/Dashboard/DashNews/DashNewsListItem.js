import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Edit from "../../../assets/icons/edit_icon.svg";
import Delete from '../../../assets/icons/delete_icon.svg';
import Hide from '../../../assets/icons/hide_icon.svg';
import { Draggable } from 'react-beautiful-dnd';


class DashNewsListItem extends Component {

    state = {
        isEditing: false,
        name: '',
        type: ''
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    render(){
        const { onDelete, item, sections, onEdit, onHide, index } = this.props;
        // console.log(item, 'item!')

        const {tag} = item;
        const icon = item.tag ? '!' : '';

        const sectionKeys = Object.keys(sections);
        return (
            <div className="dashboard-list-item">

                <div className="hide-desktop">
                    <div>
                        {item.name} - helo
                    </div>
                    <div>
                        {item.type}
                    </div>

                    {/* <div onClick={()=>this.setState({isEditing: !this.state.isEditing})}>{'<edit>'}</div> */}
                    <div onClick={onEdit}>{'<edit>'}</div>


                </div>

                <div className="hide-mobile">

                        <Draggable draggableId={item.id} index={index} key={item.id}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.draggableProps}
                                    ref={provided.innerRef}
                                    // isDragging={snapshot.isDragging}
                                    style={{...provided.draggableProps.style, display: 'flex', alignItems: 'center', backgroundColor: snapshot.isDragging && '#e4e4e4'}}

                                    // style={{display: 'flex', flexWrap: 'wrap'}}
                                >
                                {sectionKeys.map(section => {
                                    return (
                                        <div 
                                            style={{display: 'flex',width: '100%', justifyContent: 'space-between', alignItems: 'center'}} 
                                            className={`flex-${sections[section]}`}
                                            key={section}
                                        >
                                            <div style={{padding: 10, display: 'flex',width: '100%', alignItems: 'center'}} >

                                                <div style={{height: 16, width: 30, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#f1f1f1', marginRight: 15}} {...provided.dragHandleProps}>
                                                    <div style={{height: 2, width: '100%', backgroundColor: 'black'}}></div>
                                                    <div style={{height: 2, width: '100%', backgroundColor: 'black'}}></div>
                                                    <div style={{height: 2, width: '100%', backgroundColor: 'black'}}></div>
                                                </div>

                                                <div style={{display: 'flex', width: '100%',justifyContent: 'space-between'}}>
                                                    <p  key={item.id}>{item.title}</p>
                                                    {tag && <div className="tag" style={{background: '#E3BA4A'}}>{icon} <span className="hide-mobile">&nbsp;{tag}</span></div> }
                                                </div>
                            



                                                    </div>

                                                    </div>
                                                )
            
                                            })}


                                                <div className="flex-one hide-mobile">

                                                    {!item.hidden_date && (
                                                        <span style={{cursor: "pointer", paddingRight: 10}} onClick={onEdit}><img src={Edit} width="25px" alt=""/></span>
                                                    )}

                                                    <span style={{cursor: "pointer", paddingRight: 10}} onClick={onDelete}><img src={Delete} width="25px" alt=""/></span>
                                                    {!item.is_active && <span style={{cursor: "pointer"}} onClick={onHide}><img src={Hide} width="25px" alt=""/></span>}

                                                </div>


                            </div>
                        )}
                    </Draggable>
                </div>
            </div>
        )
    }
}

DashNewsListItem.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired
}

export default DashNewsListItem;
