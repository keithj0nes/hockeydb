import React, { Component } from 'react';
import PropTypes from 'prop-types';



class DashGamesListItem extends Component {

    state = {
        isEditing: false,
        name: '',
        type: ''
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }



    /// NEED TO PASS LOCATION_ID DOWN TO DASHGAMES COMPONENT

    render(){
        const { onClick, item, sections } = this.props;
        return ( 
            <div className="dashboard-list-item">
               <div style={{display: 'flex'}}>
                    {item.away_team} @ {item.home_team}
               </div>

               <div>
                    {!this.state.isEditing ? item.location_name : (
                    <select name="location" defaultValue={item.location_id} onChange={this.handleChange}>
                        {/* <option>Select</option> */}
                        {this.props.locations.map(location => (
                            <option key={location.id} value={location.id}>{location.name}</option>
                        ))}
                    </select>
                    )}
                </div>

               <div style={{display: 'flex'}}>
                    {item.date} @ {item.start_time}
               </div>

               <div onClick={()=>this.setState({isEditing: !this.state.isEditing})}>{'<edit>'}</div>
            </div>
        )
    }
}

DashGamesListItem.propTypes = {
    onClick: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired
}

export default DashGamesListItem;