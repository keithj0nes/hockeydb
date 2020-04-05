import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { DashboardSidebarNav } from '../../components'; // maybe add a 'right' prop 
import TodaysGames from '../../components/TodaysGames';
import './home.scss';

import News from './News';

export class Home extends Component {

  state = {
    leftSliderVisible: false
  }


  toggleLeftSlider = () => {
    this.setState({leftSliderVisible: !this.state.leftSliderVisible})
  }

  render() {

    const { leftSliderVisible } = this.state;
    let visibility = leftSliderVisible ? "show" : "hide";

    // console.log(this.state.leftSliderVisible, 'toggleLeftSlider')

    return (
      <div>
        <h1>Home</h1>

        <Link to={'/dashboard'}>
          Admin
        </Link>

        <div className="home-container">

          <div className="hide-desktop">
            <div className={`dashboard-nav-container right dashboard-nav-container-${visibility}`}>
              <div className={`dashboard-nav-background fade-in-${visibility}`} />
              <div className={`dashboard-nav-sliding-container right dashboard-nav-${visibility}`}>
                  <div className={"dashboard-nav right"}>
                      <div className={"hide-desktop close"} onClick={this.toggleLeftSlider}>&times;</div>
                      <TodaysGames />
                  </div>
                  <div className={"dashboard-nav-close"} onClick={this.toggleLeftSlider} />
              </div>
            </div>
          </div>

          <News />

          <div className="hide-mobile">
            <TodaysGames />
          </div>
        </div>

        <div 
          className="todays-games-toggle-button"
          onClick={this.toggleLeftSlider}
          >
            Today's Games
        </div>

      </div>
    )
  }
}

export default Home

          
