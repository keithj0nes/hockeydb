import React from 'react';
import './input.scss';

export const Input = ({name, label, type = 'text', disabled, defaultValue, onChange}) => {

    return (
        <div className="custom-input">
            {/* <div style={{position: 'relative'}}> */}
            <input name={name} id={name} type={type} placeholder='something' disabled={disabled} onChange={onChange}/>
            <label htmlFor={name}>{label}</label>
        </div>
    )
}

export const DashInput = ({name, label, type = 'text', disabled, defaultValue, onChange}) => {

    return (
        <div className="dash-input">
            {/* <div style={{position: 'relative'}}> */}
            <label htmlFor={name}>{label}</label>
            <input name={name} id={name} type={type} defaultValue={defaultValue} disabled={disabled} onChange={onChange}/>
        </div>
    )
}


// type 
// htmlFor
// name
// value 
// label


// for adding show / hide button for password

// class Input extends React.Component {

//     state = {
//         show: false
//     }

//     handleShow = () => {
//         if( this.props.type === 'password' ) {

//         }
//     }

//     render() {

//         const {name, label, type = 'text', disabled } = this.props;

//         return (
//             <div className="custom-input">
//             {/* <div style={{position: 'relative'}}> */}
//                 <input id={name} type={type} placeholder='something' disabled={disabled}/>
//                 <label htmlFor={name}>{label}</label>

//                 {type === 'password' && (
//                     <span onClick={handleShow}>SHOW</span>
//                 )}
//             </div>
//         )
//     }
// }

// export { Input };
