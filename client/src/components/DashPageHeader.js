import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, ProfilePic, Popover } from '.';

// why are we managing state of filter inside dashSeasons component?
// let's manage state inside the dash page header component

export const DashPageHeader = ({ pageHeaderInfo }) => {
    const { title, subTitle, searchPlaceholder, onChange, buttons, hideSearchAndButtons } = pageHeaderInfo;

    return (
        <div className="page-header">
            <div className="page-header-title-container">

                {/* add season name to side of divisions */}

                {/* <div style={{display: 'flex'}}> */}
                <div>
                    <h1>{title}</h1>
                    {subTitle && <p>{subTitle}</p>}
                </div>
                {/* <p>Summer 3028</p> */}
                {/* </div> */}

                {/* { !hideSearchAndButtons && (
                    <input type="text" className="page-header-search hide-mobile" placeholder={searchPlaceholder} onChange={onChange} />
                )} */}

                <div className="icons-container">

                    { !hideSearchAndButtons && buttons && buttons.map(button => (
                        <IconComponent key={button.iconName} button={button} />
                    ))}

                    <div className="hide-mobile">
                        <div className="profile-housing">
                            <ProfilePic />
                        </div>
                    </div>
                </div>
            </div>
            {/* { !hideSearchAndButtons && ( */}
            { !true && (
                <input type="text" className="page-header-search hide-desktop" placeholder={searchPlaceholder} onChange={onChange} />
            )}
        </div>
    );
};

DashPageHeader.propTypes = {
    pageHeaderInfo: PropTypes.object.isRequired,
};

// remove this ternary below after reformatting to hooks {button.onClick ? (button.onClick(), setIsPopoverVisible(!isPopoverVisible)) : setIsPopoverVisible(!isPopoverVisible) }}>


const IconComponent = ({ button }) => {
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);

    return (
        <div style={{ position: 'relative' }} id={button.iconName}>

            <div key={button.iconName} className={`icon-housing ${button.isActive ? 'is-active' : ''}`} title={button.title} onClick={() => (button.onClick ? (button.onClick(), setIsPopoverVisible(!isPopoverVisible)) : setIsPopoverVisible(!isPopoverVisible))}>
                <Icon name={button.iconName} size={button.size || 20} x />
            </div>

            {button.popoverUI && (
                <Popover isVisible={isPopoverVisible} setIsVisible={setIsPopoverVisible} closest={`#${button.iconName}`} fullWidth>
                    {(props) => button.popoverUI(props)}
                </Popover>
            )}
        </div>
    );
};

IconComponent.propTypes = {
    button: PropTypes.object.isRequired,
};

// PAGE HEADER INFO STRUCTURE FROM PARENT COMPONENT

// const pageHeaderInfo = {
//     title: 'Users',
//     hideSearchAndButtons: true,
//     searchPlaceholder: 'Search by name or role',
//     onChange: () => console.log('changing placeholder text'),
//     buttons: [
//         {
//             iconName: 'ADD_USER',
//             title: 'Add User',
//             onClick: () => console.log('clickedddd ADD_USER')
//         },
//         {
//             iconName: 'FILTER',
//             title: 'Filter',
//             onClick: () => console.log('clickedddd FILTER')
//         }
//     ]
// }


// <div className="icon-housing" title="Add User">
// // {/* <Icon name={ICONS.ADD_USER} size={20}/> */}
// <Icon name={'ADD_USER'} size={20} x/>

// </div>
// <div className="icon-housing" title="Filter">
// {/* <Icon name={ICONS.FILTER} size={20} /> */}
// <Icon name={'FILTER'} size={20} x/>

// </div>
