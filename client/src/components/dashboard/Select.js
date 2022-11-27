
// Used for Schedule Dropdowns
export const Select = ({ name, defaultValue, hiddenValue, listOfSelects, onChange, title, useKey }) => (
    <div className="custom-select">
        {/* <label htmlFor="">{title}</label> */}
        <select className="custom-select" name={name} value={defaultValue} onChange={onChange}>
            {!!hiddenValue && <option value="" hidden>{hiddenValue}</option>}
            {listOfSelects && listOfSelects.map((item, ind) => (
                <option key={item[useKey] || item.value} value={item[useKey] || item.value}>{item.name}</option>
            ))}
        </select>
        <span className="arrow" style={title && { top: 36 }} />
    </div>
);