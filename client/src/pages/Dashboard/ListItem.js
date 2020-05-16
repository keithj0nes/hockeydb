// import React, { Component } from 'react';
// import PropTypes from 'prop-types';



// class ListItem extends Component {

//     state = {
//         isEditing: false,
//         name: '',
//         type: ''
//     }

//     handleChange = e => {
//         this.setState({[e.target.name]: e.target.value})
//     }

//     render(){
//         const { onClick, item, sections, onEdit } = this.props;
//         return (
//             <div className="dashboard-list-item">
//                 <div style={{display: 'flex', justifyContent: 'space-between'}}>

//                     {Object.keys(sections).map(section => {
//                         // console.log(section, 'section!')
//                         // console.log(sections[section])
//                         // console.log(item[section])
//                         // console.log(item, 'item')
//                         return !this.state.isEditing ? (
//                             <p key={section} className={`flex-${sections[section]}`}>{item[section]}</p>
//                          ) : (
//                             <input key={section} className={`flex-${sections[section]}`} type="text" onChange={this.handleChange} name={`${sections[section]}`} defaultValue={item[section]}/>
//                          )
//                     })}

//                     {/* {!this.state.isEditing &&  <p className="flex-three">{item.name}</p> }
//                     {!this.state.isEditing &&  <p className="flex-one">{item.type}</p> }

//                     {this.state.isEditing &&  <input className="flex-three" type="text" onChange={this.handleChange} name={"name"} defaultValue={item.name}/> }
//                     {this.state.isEditing &&  <input className="flex-one" type="text" onChange={this.handleChange} name={"type"} defaultValue={item.type}/> }  */}

//                     <div className="flex-one hide-mobile">
//                         {/* <span onClick={()=> {this.setState({isEditing: !this.state.isEditing})}}>{  this.state.isEditing ? '<save>' : '<edit>'}</span> */}

//                         <span onClick={onEdit}>{'<edit>'}</span>

//                         {/* <span onClick={() => this.props.deleteSeason(item.id)}>{'<delete>'}</span> */}

//                         {this.state.isEditing ? (
//                         <span onClick={()=> {this.setState({isEditing: !this.state.isEditing})}}>{'<cancel>'}</span>

//                         ):

//                         <span onClick={onClick}>{'<delete>'}</span>
//                         }

//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }

// ListItem.propTypes = {
//     onClick: PropTypes.func.isRequired,
//     item: PropTypes.object.isRequired,
//     sections: PropTypes.object.isRequired
// }

// export default ListItem;



import React, { Component } from 'react';
import PropTypes from 'prop-types';


import Edit from '../../assets/icons/edit_icon.svg';
import Delete from '../../assets/icons/delete_icon.svg';


class ListItem extends Component {

    state = {
        isEditing: false,
        name: '',
        type: ''
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    render(){
        const { onClick, item, sections, onEdit } = this.props;

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

                    <div style={{display: 'flex', justifyContent: 'space-between'}} >



                        {sectionKeys.map(section => {

                            return !this.state.isEditing ? (
                                <p key={section} className={`flex-${sections[section]}`}>{item[section]} {item.is_active && section === sectionKeys[0] && '- (current)'}</p>
                            ) : (
                                <input key={section} className={`flex-${sections[section]}`} type="text" onChange={this.handleChange} name={`${sections[section]}`} defaultValue={item[section]}/>
                            )
                        })}


                        <div className="flex-one hide-mobile">
                            {/* <span onClick={()=> {this.setState({isEditing: !this.state.isEditing})}}>{  this.state.isEditing ? '<save>' : '<edit>'}</span> */}
                            <span style={{cursor: "pointer", paddingRight: 10}} onClick={onEdit}><img src={Edit} width="25px" alt=""/></span>

                            {/* <span onClick={() => this.props.deleteSeason(item.id)}>{'<delete>'}</span> */}

                            {this.state.isEditing ? (
                                <span onClick={()=> {this.setState({isEditing: !this.state.isEditing})}}>{'<cancel>'}</span>

                            ):

                                <span style={{cursor: "pointer"}} onClick={onClick}><img src={Delete} width="25px" alt=""/></span>
                            }

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ListItem.propTypes = {
    onClick: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired
}

export default ListItem;
