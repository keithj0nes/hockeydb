import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleNavSlider } from '../redux/actions/misc';
import '../assets/styles/dashboardsidebarnav.scss';

const DashboardSidebarNav = ({ navSliderVisible, toggleNavSlider, children }) => {
    const body = document.getElementsByTagName('body')[0].style;
    body.overflow = 'auto';
    body.position = 'auto';

    const visibility = navSliderVisible ? 'show' : 'hide';
    if (visibility === 'show') {
        body.overflow = 'hidden';
        body.position = 'relative';
    }
    return (
        <div className={`dashboard-nav-container dashboard-nav-container-${visibility}`}>

            <div className={`dashboard-nav-background fade-in-${visibility}`} />

            <div className={`dashboard-nav-sliding-container dashboard-nav-${visibility}`}>
                <div className="dashboard-nav">
                    <div className="hide-desktop close" onClick={toggleNavSlider}>&times;</div>
                    {children}
                </div>
                <div className="dashboard-nav-close" onClick={toggleNavSlider} />
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    navSliderVisible: state.misc.navSliderVisible,
});

const mapDispatchToProps = dispatch => ({
    toggleNavSlider: () => dispatch(toggleNavSlider()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSidebarNav);

DashboardSidebarNav.propTypes = {
    navSliderVisible: PropTypes.bool,
    toggleNavSlider: PropTypes.func,
    children: PropTypes.element,
};
