import React, { Component } from 'react';
import PropTypes from 'prop-types';



class DashSeasonsListItem extends Component {

    state = {
        isEditing: false,
        name: '',
        type: ''
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    render(){
        const { onClick, item, sections } = this.props;
        return ( 
            <div className="dashboard-list-item">
               hi
            </div>
        )
    }
}

DashSeasonsListItem.propTypes = {
    onClick: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired
}

export default DashSeasonsListItem;