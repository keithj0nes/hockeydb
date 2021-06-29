import React from 'react';
import { DashPageHeader, Button, ColorPicker } from '../../../components';


const DashPlayers = () => {
    const pageHeaderInfo = {
        title: 'Players',
        hideSearchAndButtons: true,
    };
    return (
        <>
            <DashPageHeader pageHeaderInfo={pageHeaderInfo} />
            <h1>DASH PLAYERS COMPONENT</h1>
        </>
    );
};

export default DashPlayers;
