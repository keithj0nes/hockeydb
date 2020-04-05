// import React from 'react';

// const Button = ({title, onClick, cancel, danger, success, disabled}) => {

//     //cancel #88C12D;
//     //delete #C12D2D;

//     let color;
//     // if(cancel){
//     //     color = '#88C12D';
//     // } else 
//     if (danger){
//         color = '#C12D2D'; //red
//     } else if (success){
//         color = '#72cc2d'; //green
//     } else {
//         color = '#50C0F0'; //blue
//     }

//     const styles = {
//         background: cancel ? '#fff' : disabled ? '#ccc' : color,
//         padding: '9px 20px',
//         fontSize: '15px',
//         // boxShadow: '10px 10px rgba(51,51,51,0.5)',
//         boxShadow: '0 4px 10px 0 rgba(51,51,51,0.3)',
//         border: cancel ? '1px solid #50C0F0' : 'none',
//         fontFamily: 'Poppins, sans-serif', 
//         cursor: disabled ? 'not-allowed' : 'pointer',
//         color: cancel ? '#50C0F0' : '#FFFFFF',
//         letterSpacing: 1,
//         borderRadius: 3
//     }


//     return (
//         <button style={styles} onClick={onClick} disabled={disabled}>{title}</button>
//     )
// }

// export default Button; 








import React from 'react';
import './button.scss';

//opa (opacity) is for the site.com/styleguide page to perminaently be in the 'hover' state

const Button = ({title, onClick, cancel, danger, success, disabled, opa, outline, style}) => {
    // let color = '#FFFFFF';
    // let background = '#19AEC0';
    // if(cancel){
    //     color = '#7E92A3';
    //     background = '#FFFFFF';
    // } else if (danger){
    //     background = '#D62B2B';
    // } else if (success){
    //     console.log('success not coded in button.js')
    // } else if (disabled) {
    //     color = '#7E92A3';
    //     background = '#EAEEF5';
    // }

    // const styles = {
    //     background: disabled ? '#EAEEF5' : background,
    //     padding: '10px 20px',
    //     minWidth: '150px',
    //     minHeight: '40px',
    //     fontSize: '15px',
    //     fontFamily: 'Poppins, sans-serif', 
    //     cursor: disabled ? 'not-allowed' : 'pointer',
    //     color,
    //     letterSpacing: 1,
    //     borderRadius: 3,
    //     border: 'none',
    // }

    // return (
    //     <button style={styles} onClick={onClick} disabled={disabled}>{title}</button>
    // )

    let classNames = '';

    if(cancel) {
        classNames = 'cancel';
    } else if (disabled) {
        classNames = 'disabled';
    } else if (danger) {
        classNames = 'danger';
    } else if (success) {
        classNames = 'success';
    }  else if (outline) {
        classNames = 'outline'
    }
    // else if (disabled) {
    //     classNames = 'disabled';
    // }

    const _style = {
        opacity: opa ? 0.8 : 1,
        background: cancel && 'transparent',
        color: cancel && 'black',
        ...style // props.style
    }

    return (
        <button className={classNames} style={_style} onClick={onClick} disabled={disabled}>{title}</button>
    )
}

export default Button; 
