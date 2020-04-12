import React from 'react';
import './select.scss';


export const Select = ({name, defaultValue, hiddenValue, listOfSelects, onChange, title}) => {

    return (
        <div className="custom-select">
            <label htmlFor="">{title}</label>
            <select className='custom-select' name={name} defaultValue={defaultValue} onChange={onChange}>
                {!!hiddenValue && <option value="" hidden>{hiddenValue}</option>}
                {listOfSelects && listOfSelects.map((item, ind) => (
                    <option key={ind} value={item.value}>{item.name}</option>
                ))}
            </select>
            <span className="arrow" style={title && {top: 30}}/>
        </div>
    )

    // return (
    //     <div className="custom-select">
    //         <select className='custom-select'>
    //             <option value="tesla">Tesla</option>
    //             <option value="volvo">Volvo</option>
    //             <option value="mercedes">Mercedes</option>
    //         </select>
    //         <span className="arrow"/>
    //     </div>
    // )
}

// <div className="modal-field">
//    <label htmlFor={field.name}>{field.title}</label>
//    <select className="select-css" name={field.name} defaultValue={field.defaultValue} onChange={this.handleChange}>
//        {!!field.hiddenValue && <option value="" hidden>{field.hiddenValue}</option>}
//        {field.listOfSelects.map((item, ind) => (
//            <option key={ind} value={item.value}>{item.name}</option>
//        ))}
//    </select>
// </div>