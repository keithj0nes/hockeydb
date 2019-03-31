import React, { Component } from 'react';

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
        const { onClick, item } = this.props;
        return ( 
            <div className="dashboard-list-item">
                <div style={{display: 'flex', justifyContent: 'space-between'}}>

                    {!this.state.isEditing &&  <p className="flex-three">{item.name}</p> }
                    {!this.state.isEditing &&  <p className="flex-one">{item.type}</p> }

                    {this.state.isEditing &&  <input className="flex-three" type="text" onChange={this.handleChange} name={"name"} defaultValue={item.name}/> }
                    {this.state.isEditing &&  <input className="flex-one" type="text" onChange={this.handleChange} name={"type"} defaultValue={item.type}/> } 

                    <div className="flex-one hide-mobile">
                        <span onClick={()=> {this.setState({isEditing: !this.state.isEditing})}}>{  this.state.isEditing ? '<save>' : '<edit>'}</span>
                        
                        {/* <span onClick={() => this.props.deleteSeason(item.id)}>{'<delete>'}</span> */}

                        {this.state.isEditing ? ( 
                        <span onClick={()=> {this.setState({isEditing: !this.state.isEditing})}}>{'<cancel>'}</span>

                        ):
                        
                        <span onClick={onClick}>{'<delete>'}</span>
                        }
                    
                    </div>
                </div>
            </div>
        )
    }
}

export default ListItem;