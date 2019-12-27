import React from 'react';

const Button = ({title, onClick, cancel, danger, success, disabled}) => {

    //cancel #88C12D;
    //delete #C12D2D;

    let color;
    // if(cancel){
    //     color = '#88C12D';
    // } else 
    if (danger){
        color = '#C12D2D'; //red
    } else if (success){
        color = '#72cc2d'; //green
    } else {
        color = '#50C0F0'; //blue
    }

    const styles = {
        background: cancel ? '#fff' : disabled ? '#ccc' : color,
        padding: '9px 20px',
        fontSize: '15px',
        // boxShadow: '10px 10px rgba(51,51,51,0.5)',
        boxShadow: '0 4px 10px 0 rgba(51,51,51,0.3)',
        border: cancel ? '1px solid #50C0F0' : 'none',
        fontFamily: 'Poppins, sans-serif', 
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: cancel ? '#50C0F0' : '#FFFFFF',
        letterSpacing: 1,
        borderRadius: 3
    }


    return (
        <button style={styles} onClick={onClick} disabled={disabled}>{title}</button>
    )
}

export default Button; 
