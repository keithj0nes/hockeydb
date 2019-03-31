import React from 'react';

const Button = ({title, onClick, cancel, danger}) => {

    //cancel #88C12D;
    //delete #C12D2D;

    let color;
    if(cancel){
        color = '#88C12D';
    } else if (danger){
        color = '#C12D2D';
    } else {
        color = '#50C0F0';
    }

    const styles = {
        background: color,
        padding: '9px 20px',
        fontSize: '15px',
        // boxShadow: '10px 10px rgba(51,51,51,0.5)',
        boxShadow: '0 4px 10px 0 rgba(51,51,51,0.3)',
        border: 'none',
        fontFamily: 'Poppins, sans-serif', 
        cursor: 'pointer',
        color: '#FFFFFF',
        letterSpacing: 1,
        borderRadius: 3
    }


    return (
        <button style={styles} onClick={onClick}>{title}</button>
    )
}

export default Button; 
