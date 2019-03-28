import React from 'react';

export const HamburgerIcon = ({onClick}) => {

    return (
        <div className={"hide-desktop"} onClick={onClick}>
            <div style={styles.container} >
                <div style={styles.bar}></div>
                <div style={styles.bar}></div>
                <div style={styles.shortBar}></div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        cursor: 'pointer',
        marginLeft: 20,
        height: 21,
        width: 36,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    bar: {
        width: '100%',
        height: 3,
        background: '#000',
    },
    shortBar: {
        width: '80%',
        height: 3,
        background: '#000',
        alignSelf: 'flex-end'
    }

}