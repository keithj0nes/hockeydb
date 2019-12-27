import React, { Component } from 'react';
import { connect } from 'react-redux';


import { Route } from 'react-router-dom';
// import { connect } from 'react-redux';
import { toggleNavSlider } from '../../redux/actions/misc';

import DashSeasons from './DashSeasons/DashSeasons';
import DashDivisions from './DashDivisions/DashDivisions';
import DashTeams from './DashTeams/DashTeams';
import DashPlayers from './DashPlayers/DashPlayers';
import DashGames from './DashGames/DashGames';
import DashBlogs from './DashBlogs/DashBlogs';
import DashLocations from './DashLocations/DashLocations';


// import Swiper from '../../components/Swiper';

// import { Button } from '../../components';


import { DashboardSidebarNav, DashboardNav, HamburgerIcon } from '../../components';

import '../../assets/styles/dashboard.scss';

class Dashboard extends Component {


    render() {
        const { match } = this.props;

        // console.log(this.props.location, 'LOCATION')
        return (
            <div className="dashboard-container">


                <DashboardSidebarNav {...this.props} >
                    <DashboardNav {...this.props} />
                </DashboardSidebarNav>

                <div className="dashboard-content">

                    <div className="dashboard-header">

                        <p>{this.props.currentSeason && this.props.currentSeason.name}</p>
                        <p>{this.props.user.first_name}</p>

                        <HamburgerIcon onClick={this.props.toggleNavSlider} />
                        {/* <button className={"hide-desktop"} onClick={this.props.toggleNavSlider}>Toggle Side Nav</button> */}
                    </div>

                    <Route path={`${match.path}/seasons`} component={DashSeasons} />
                    <Route path={`${match.path}/divisions`} component={DashDivisions} />
                    <Route path={`${match.path}/teams`} component={DashTeams} />
                    <Route path={`${match.path}/players`} component={DashPlayers} />
                    <Route path={`${match.path}/games`} component={DashGames} />
                    <Route path={`${match.path}/blogs`} component={DashBlogs} />
                    <Route path={`${match.path}/locations`} component={DashLocations} />


            {/* <h1>hello</h1>

<Swiper ref={el => this.myyReff = el} options={{speed: 1000, loop: true}}>
  <Content type="first" next={() => this.myyReff.nextSlide()}/>
  <div>PANE 1</div>
  <div>PANE 2</div>
  <Content  prev={() => this.myyReff.prevSlide()}></Content>
  <div>PANE 3</div>
</Swiper>  */}
            


                    {/* <hr/>

                                    <div className="dashboard-filter-header">
                                        <div>
                                            <Button title="Add Season" onClick={() => console.log('clicked to add season!')}/>
                                        </div>

                                        <div className="sort-section hide-desktop">
                                            Sort By
                                            <div className="select-style">
                                                <select name="" id="">
                                                    <option value="name">Name</option>
                                                    <option value="type">Type</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dashboard-list-container">

                                        <div className="dashboard-list">

                                        <div className="dashboard-list-item"></div>
                                        <div className="dashboard-list-item"></div>
                                        <div className="dashboard-list-item"></div>
                                        <div className="dashboard-list-item"></div>

                                        </div>

                                    </div> */}

                </div>

            </div>
        )
    }
}

const mapStateToProps = state => {
    // console.log(state, 'state in dashboardMain component')
    return {
        user: state.user.user,
        currentSeason: state.seasons.currentSeason
    }
}

const mapDispatchToProps = dispatch => ({
    toggleNavSlider: () => dispatch(toggleNavSlider())

})
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);