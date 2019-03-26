import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getPlayers } from '../../redux/actions/playerActions';

export class Players extends Component {
  componentDidMount() {
    this.props.getPlayers();
    // console.log(this.props.players, 'HEEEREE');

  }

  render() {
    return (
      <div>
        <h1>Players Page</h1>
        {this.props.players.map(item => (
          <div key={item.player_id}>
            <p>{item.first_name} {item.last_name} {item.name} {item.goals || 0}</p>
          </div>
        ))}
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log(state, "our state in blogs🈯️");
  console.log(state.players);


  return {
    players: state.players.allPlayers
  };
};



const mapDispatchToProps = dispatch => ({
  getPlayers: () => dispatch(getPlayers())
})

export default connect(mapStateToProps, mapDispatchToProps)(Players);