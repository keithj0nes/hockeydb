import React from 'react';
import PropTypes from 'prop-types';
import './slideout.scss';

const SlideOut = props => {

    let body = document.getElementsByTagName('body')[0].style;
    body.overflow = 'auto';
    body.position = 'auto';

    let visibility = props.isVisible ? "show" : "hide";
    if(visibility === "show") {
        // body.overflow = 'hidden';
        body.position = 'relative';
    }

    const sticky = props.sticky ? 'sticky' : ''

    return (
        <div className={`slideout-container slideout-container-${visibility} ${sticky} ${props.slideFrom} `}>

            <div className={`slideout-opacity-bg slideout-fadein-${visibility}`} /> {/* self closing */}

            <div className={`slideout-child-container slideout-child-${visibility} ${props.slideFrom}`}>
                {props.children}
            </div>

            <div className={`slideout-close-bar ${props.slideFrom}`} onClick={props.onClose}/>

        </div>
    )
}


SlideOut.defaultProps = {
    isVisible: false,
    slideFrom: 'left'
}

SlideOut.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    slideFrom: PropTypes.oneOf(['left', 'right']), // add top bottom later
    sticky: PropTypes.bool // sticks slideout to left side on desktop view
}

export default SlideOut;