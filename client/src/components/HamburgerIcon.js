import React from 'react';

export const HamburgerIcon = ({onClick}) => {

    return (
        <div className={"hide-desktop"} onClick={onClick}>
            <div className="dashboard-hamburger-icon">
                <div className="bar0"></div>
                <div className="bar1"></div>
                <div className="bar2"></div>
            </div>
            {/* <div style={styles.container} >
                <div style={styles.bar1}></div>
                <div style={styles.bar2}></div>
                <div style={styles.bar3}></div>
            </div> */}
        </div>
    )
}

// const styles = {
//     container: {
//         cursor: 'pointer',
//         // marginLeft: 20,
//         height: 28,
//         width: 36,
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between'
//     },
//     bar1: {
//         width: '100%',
//         height: 4,
//         background: '#000',
//         borderRadius: 100
//     },
//     bar2: {
//         width: '80%',
//         height: 4,
//         background: '#000',
//         borderRadius: 100
//     },
//     bar3: {
//         width: '60%',
//         height: 4,
//         background: '#000',
//         borderRadius: 100
//         // alignSelf: 'flex-end'
//     }

// }