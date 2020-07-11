import React from 'react';
import PropTypes from 'prop-types';
import { Icon, ProfilePic, Popover, DashSelect, DashCheckbox } from './';


const myOptions = [
    {id: 1, name: 'haha'},
    {id: 2, name: 'hihi'},
    {id: 3, name: 'hehe'},
    {id: 4, name: 'hoho'},
    {id: 5, name: 'huhu'},
]
export const DashPageHeader = ({pageHeaderInfo}) => {
    const { title, searchPlaceholder, onChange, buttons, hideSearchAndButtons } = pageHeaderInfo;

    return (
        <div className="page-header">
            <div className="page-header-title-container">
                <h1>{title}</h1> 

                {  !hideSearchAndButtons && (
                    <input type="text" className="page-header-search hide-mobile" placeholder={searchPlaceholder} onChange={onChange} />
                )}

                <div className="icons-container">

                    { !hideSearchAndButtons && buttons && buttons.map(button => (
                        <div style={{position: 'relative'}} id={button.iconName} key={button.iconName}>

                            <div key={button.iconName} className={`icon-housing ${button.isActive ? 'is-active' : ''}`} title={button.title} onClick={() => button.onClick()}>
                                <Icon name={button.iconName} size={button.size || 20} x/>
                            </div>

                            {button.popoverUI && (
                                <Popover isVisible={button.isPopoverVisible} setIsVisible={button.onClick} closest={`#${button.iconName}`}>
                                    {/* {button.popoverUI()} */}
                                    {(props) => button.popoverUI(props)}
                                </Popover>                        
                            )}
                        </div>
                    ))}

                    <div className="hide-mobile">
                        <div className="profile-housing">
                            <ProfilePic />
                        </div>
                    </div>
                </div>
            </div>
            {  !hideSearchAndButtons && (
                <input type="text" className="page-header-search hide-desktop" placeholder={searchPlaceholder} onChange={onChange} />
            )}
        </div>
    )
}

DashPageHeader.propTypes = {
    pageHeaderInfo: PropTypes.object.isRequired
}

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