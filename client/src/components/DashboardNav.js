import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from 'redux/actions/auth';
import { Icon } from 'components';
import { Site_Name_Full } from 'assets/resourceStrings';
import logo from 'assets/images/logo.png';
import { history } from '../helpers';
import './dashboardnav.scss';

class DashboardNav extends Component {
    // this componentDidMount checks to make sure the URL matches a path the logged in
    // user can access otherwise it redirects to the first page in the navLinks array
    componentDidMount() {
        const hasAccess = this.props.dashLinks[this.props.admin_type].filter(navLink => this.props.location.pathname.includes(navLink.to));

        if (hasAccess.length <= 0) {
            console.log('Not allowed at this route, redirecting to', `/dashboard${this.props.dashLinks[this.props.admin_type][0].to}`);
            return history.push(`/dashboard${this.props.dashLinks[this.props.admin_type][0].to}`);
        }
        return true;
    }

    render() {
        const { match } = this.props;
        return (
            <div className="dashboard-nav-a">
                {/* might not need this div? test before deleting */}
                <div style={{ height: '100%', display: 'flex', overflow: 'scroll', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div className="dashboard-nav-header">
                            <img src={logo} alt="Logo" />
                            <div>
                                <h2>{Site_Name_Full}</h2>
                                <p>{this.props.currentSeason && this.props.currentSeason.name}</p>
                            </div>
                        </div>

                        <h3>Navigation</h3>
                        <ul>
                            {this.props.dashLinks[this.props.admin_type].map(link => (
                                !link.hideFromNavigation
                                && (
                                    <li key={link.to}>
                                        <NavLink to={`${match.url}${link.to}`} exact={link.to === ''} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                            <div className="nav-icon-container">
                                                {/* {link.svg} */}
                                                <Icon name={link.icon} />
                                            </div>
                                            {link.name}
                                        </NavLink>
                                    </li>
                                )
                            ))}
                        </ul>
                    </div>

                    <div style={{ margin: '40px 0 10px', textAlign: 'center' }}>
                        <a className="powered-by" href="#a">Powered by Playmaker Leagues</a>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    admin_type: state.user.user.admin_type,
    currentSeason: state.seasons.currentSeason,
});
const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
});
export default connect(mapStateToProps, mapDispatchToProps)(DashboardNav);

DashboardNav.propTypes = {
    dashLinks: PropTypes.object,
    admin_type: PropTypes.string,
    match: PropTypes.object,
    toggleNavSlider: PropTypes.func,
    location: PropTypes.object,
    currentSeason: PropTypes.object,
};
