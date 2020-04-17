import React from 'react';

const SingleTeam = (props) => {
    // console.log(props, 'PROPS IN SINGLE TEAM')
    let name;
    if(props.location.state) {
        name = props.location.state.name;
    }
    return (
        <div>Single Team Component - {name || 'team loading'}</div>
    )
}

export default SingleTeam;