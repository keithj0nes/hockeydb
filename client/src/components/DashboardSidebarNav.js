import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleNavSlider } from '../redux/actions/misc';
import { Link } from 'react-router-dom';
import '../style/dashboardsidebarnav.scss';

class DashboardSidebarNav extends Component {

    render(){
        const { match, navSliderVisible } = this.props;
        let visibility = navSliderVisible ? "show" : "hide";
        
        return (
            <div className={`dashboard-nav-container dashboard-nav-container-${visibility}`}>

                <div className={`dashboard-nav-background fade-in-${visibility}`}>
                </div>

                <div className={`dashboard-nav-sliding-container dashboard-nav-${visibility}`}>
                
                
                    <div className={"dashboard-nav"}>
                        <button className={"hide-desktop"} onClick={this.props.toggleNavSlider}>close</button>
                        <ul>
                            <li>
                                <Link to={`${match.url}`} onClick={this.props.toggleNavSlider}>Home</Link>    
                            </li>
                            <li>
                                <Link to={`${match.url}/seasons`} onClick={this.props.toggleNavSlider}>Seasons</Link>    
                            </li>
                            <li>
                                <Link to={`${match.url}/divisions`} onClick={this.props.toggleNavSlider}>Divisions</Link>    
                            </li>
                            <li>
                                <Link to={`${match.url}/teams`} onClick={this.props.toggleNavSlider}>Teams</Link>    
                            </li>
                            <li>
                                <Link to={`${match.url}/players`} onClick={this.props.toggleNavSlider}>Players</Link>    
                            </li>
                            <li>
                                <Link to={`${match.url}/games`} onClick={this.props.toggleNavSlider}>Games</Link>    
                            </li>
                        </ul>
                    </div>

                    <div className={"dashboard-nav-close"} onClick={this.props.toggleNavSlider}>

                    </div>
                
                
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        navSliderVisible: state.misc.navSliderVisible
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleNavSlider: () => dispatch(toggleNavSlider())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSidebarNav);