import React, { Component } from 'react'
import { connect } from 'react-redux';

import { newLocation, getLocations } from '../../../redux/actions/locationsActions';


export class DashGames extends Component {

  state = {
    name: '',
    address: '',
  }
  componentDidMount() {
    this.props.getLocations();
  }

  handleNameChange = e => {
    this.setState({ name: e.target.value })
    console.log(this.state);
  }

  handleLocationChange = e => {
    this.setState({ address: e.target.value })
    console.log(this.state);
  }

  handleLocationsSubmit = e => {
    e.preventDefault();
    const { name, address } = this.state;
    if (!name || !address) {
      return alert('please enter a input');
    }
    this.props.newLocation({ name, address });
  }

  render() {
    return (
      <div>
        <h1>Dash Games Component</h1>
        <h2>Add New Location</h2>
        <form onSubmit={this.handleLocationsSubmit}>
          <input type="text" onChange={this.handleNameChange} placeholder={'Location Name'} />
          <input type="text" onChange={this.handleLocationChange} placeholder={'Location Adress'} />
          <input type="submit" value="Submit" />
        </form>
        {this.props.locations.map(item => (
          <div key={item.id}>
            <p>Name:{item.name} Address: {item.address}</p>
          </div>
        ))}
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log(state, "our state in dashNav!s");

  return {
    locations: state.locations.allLocations,
  };
};



const mapDispatchToProps = dispatch => ({
  newLocation: (name, address) => dispatch(newLocation(name, address)),
  getLocations: () => dispatch(getLocations()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashGames);



