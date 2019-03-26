import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getGames } from '../../redux/actions/gamesActions';
import dateFormat from 'date-fns/format';

class Games extends Component {
  componentDidMount() {
    this.props.getGames();
  }

  renderGames() {
    if (this.props.games.length <= 0) {
      return (
        <h1>No Games</h1>
      )
    }
    return this.props.games.map(item => (
      <div key={item.id}>
        <p>{dateFormat(item.start_date, 'MM/DD/YYYY')} {item.away_team} at {item.home_team}  {item.location_name}  {dateFormat(item.start_date, 'h:mm A')} {item.has_been_played && `${item.away_score} : ${item.home_score}`}</p>
      </div>
    ))
  }


  render() {
    return (
      <div>
        <h1>gamesss page</h1>
        {this.renderGames()}
      </div>
    )
  }
}


const mapStateToProps = state => {
  console.log(state, "our state in blogs🈯️");

  return {
    games: state.games.allGames
  };
};



const mapDispatchToProps = dispatch => ({
  getGames: () => dispatch(getGames())
})

export default connect(mapStateToProps, mapDispatchToProps)(Games);
