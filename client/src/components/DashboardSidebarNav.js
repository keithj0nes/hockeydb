import React, { Component } from 'react';
import '../style/dashboardsidebarnav.scss';

class DashboardSidebarNav extends Component {

    render(){
        let visibility = this.props.visible ? "show" : "hide";
        return (
            <div className={`dashboard-nav-container dashboard-nav-container-${visibility}`}>

                <div className={`dashboard-nav-background fade-in-${visibility}`}>
                </div>

                <div className={`dashboard-nav-sliding-container dashboard-nav-${visibility}`}>
                
                
                    <div className="dashboard-nav">
                        <button onClick={this.props.toggle}>close</button>
                        <ul>
                            <li>Seasons</li>
                            <li>Divisions</li>
                            <li>Teams</li>
                            <li>Players</li>
                            <li>Games</li>
                        </ul>
                    </div>

                    <div className="dashboard-nav-close" onClick={this.props.toggle}>

                    </div>
                
                
                </div>

            </div>
        )
    }
}

export default DashboardSidebarNav;