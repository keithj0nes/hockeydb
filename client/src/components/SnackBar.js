import React, { useState, useEffect } from 'react';
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
            }, ANIMATION_DURATION);

        } else {
            setIsVisible(props.isVisible)
        }
    }, [props.isVisible])

    return (
        <div className={`snack-bar-container ${isVisible ? 'snack-bar-visible' : null}`}>
            <div className={`snack-bar-content ${!hideSnack ? 'snack-bar-remove' : null}`} style={{animationDuration: `${ANIMATION_DURATION}ms`}}>

                SNACKKKKK

            </div>
        </div>
    )
}

export default SnackBar;

// snackbar logic

// if isVisible, add the snack-bar-visible class
// this will add the animation to slide / opacity in

// when the snackbar is removed, we add the snack-bar-remove 
// class which will have the animation slide / opacity out.
// the snack-bar-visible class is then timeout before being removed
