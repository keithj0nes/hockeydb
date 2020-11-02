import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from 'redux/actions/auth'
import { history } from '../helpers';
import { Icon } from 'components';
import logo from 'assets/images/logo.png';
import './dashboardnav.scss';

class DashboardNav extends Component {
    // this componentDidMount checks to make sure the URL matches a path the logged in 
    // user can access otherwise it redirects to the first page in the navLinks array
    componentDidMount() {
        const hasAccess = this.props.dashLinks[this.props.admin_type].filter(navLink =>  {
            return this.props.location.pathname.includes(navLink.to)
        })

        if(hasAccess.length <= 0) {
            console.log('Not allowed at this route, redirecting to', `/dashboard${this.props.dashLinks[this.props.admin_type][0].to}`)
            return history.push(`/dashboard${this.props.dashLinks[this.props.admin_type][0].to}`)
        }
    }

    handleLogout = () => {
        this.props.logout();
        this.props.history.push('/');
    }

    render() {
        const { match } = this.props;
        return (
            <div className='dashboard-nav-a'>
                {/* might not need this div? test before deleting */}
                <div style={{ height: '100%', display: 'flex', overflow: 'scroll', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div className="dashboard-nav-header">
                            <img src={logo} alt="Logo" />
                            <div>
                                <h2>HockeyDB</h2>
                                <p>{this.props.currentSeason && this.props.currentSeason.name}</p>
                            </div>
                        </div>

                        <h3>Navigation</h3>
                        <ul>
                            {this.props.dashLinks[this.props.admin_type].map(link => (
                                !link.hideFromNavigation &&
                                <li key={link.to}>
                                    <NavLink to={`${match.url}${link.to}`} exact={link.to === ''} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                        <div className="nav-icon-container">
                                            {/* {link.svg} */}
                                            <Icon name={link.icon}/>
                                        </div>
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ margin: '40px 0 10px', textAlign: 'center' }}>
                        <a className="powered-by" href="#a">Powered by Playmaker Leagues</a>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        admin_type: state.user.user.admin_type,
        currentSeason: state.seasons.currentSeason,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashboardNav);
