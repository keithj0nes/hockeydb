import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { closeSnackBar } from '../redux/actions/misc';
import './snackbar.scss';

const ANIMATION_DURATION = 350; // in MS

const SnackBar = props => {

    const [ isVisible, setIsVisible ] = useState(false);
    const [ hideSnack, setHideSnack ] = useState(true);

    useEffect(() => {
        if(isVisible) {
            setHideSnack(false)
            
            setTimeout(() => {
                    setIsVisible(props.isVisible)
                    setHideSnack(true)
            }, ANIMATION_DURATION - 10); // - 10 avoids flash when animating out

        } else {
            setIsVisible(props.isVisible)
        }
    }, [props.isVisible])

    let colorScheme;
    if(props.type === 'error') colorScheme = 'sb-error';
    if(props.type === 'alert') colorScheme = 'sb-alert';
    if(props.type === 'success') colorScheme = 'sb-success';

    return (
        <div className={`snack-bar-container ${isVisible ? 'snack-bar-visible' : ''}`}>
            <div className={`snack-bar-content ${!hideSnack ? 'snack-bar-remove' : ''} ${colorScheme}`} style={{animationDuration: `${ANIMATION_DURATION}ms`}}>
                <p> {props.message} </p>
            </div>
            <div className={`snack-bar-close-btn ${!hideSnack ? 'snack-bar-remove' : ''} ${colorScheme}`} onClick={props.closeSnackBar} style={{animationDuration: `${ANIMATION_DURATION}ms`}}>&times;</div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        isVisible: state.misc.snackBar.isVisible,
        message: state.misc.snackBar.message,
        type: state.misc.snackBar.type
    }
}

const mapDispatchToProps = dispatch => ({
    closeSnackBar: () => dispatch(closeSnackBar())
})

export default connect(mapStateToProps, mapDispatchToProps)(SnackBar);

// snackbar logic

// if isVisible, add the snack-bar-visible class
// this will add the animation to slide / opacity in

// when the snackbar is removed, we add the snack-bar-remove 
// class which will have the animation slide / opacity out.
// the snack-bar-visible class is then timeout before being removed
