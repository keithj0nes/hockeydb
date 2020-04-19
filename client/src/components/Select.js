import React from 'react';
import './select.scss';


export const Select = ({name, defaultValue, hiddenValue, listOfSelects, onChange, title, useKey}) => {
    return (
        <div className="custom-select">
            <label htmlFor="">{title}</label>
            {/* <select className='custom-select' name={name} defaultValue={defaultValue} onChange={onChange}> */}
            <select className='custom-select' name={name} value={defaultValue} onChange={onChange}>

                {!!hiddenValue && <option value="" hidden>{hiddenValue}</option>}
                {/* {listOfSelects && listOfSelects.map((item, ind) => (
                    <option key={ind} value={item[useKey] || item.value}>{item.name}</option>
                ))} */}

                {listOfSelects && listOfSelects.map((item, ind) => {
                   return (
                        <option key={ind} value={item[useKey] || item.value}>{item.name}</option>
                    )
                })}
            </select>
            <span className="arrow" style={title && {top: 30}}/>
        </div>
    )
}