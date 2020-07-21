import React from 'react';
// import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DashSelect, DashCheckbox } from './';
import { history } from 'helpers';

const DashFilter = ({data, getAction, closeFilter, onChange}) => {

    // create local state of filters
    // const [ filters, setFilters ] = useState({});

    // <Filter data={this.state.filterData} getAction={this.props.getSeasons} history={this.props.history} filterType={'seasons'}/>

    // const handleChange = e => {
    //     const hFilters = {...filters};

    //     console.log(e.target.type, 'TYPEEEE')
    //     console.log(e.target.checked, 'CHECCKEED')
    //     console.log(e.target.name, 'NAMEE')

    //     // if no value, delete from the filters copy
    //     if(e.target.value === '' || e.target.checked === false){
    //         console.log(' false, hitting ehre')
    //         delete hFilters[e.target.name];
    //     } else {
    //         hFilters[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    //     }

    //     // // delete the divisions key off filters when the props.reloadOn of state.filters is changed
    //     // if(prevState.filters[this.props.reloadOn] !== filters[this.props.reloadOn]){
    //     //     delete filters['division'];
    //     // }

    //     onChange(e)

    //     const search = setQuery(hFilters);
    //     getAction(search);
    //     history.push({ search });
    //     return setFilters(hFilters);
    // }

    // const clearFilters = () => {
    //     history.push({search: ''});
    //     getAction();
    //     setFilters({});
    //     closeFilter()
    // }

    // // need to use redux to hold filter state

    return (
        <>
            <div className="popover-header">
                <h2>Filter Options</h2>

                {history.location.search.length > 0 && (
                    <p className="clear-btn" onClick={() => onChange(null)}>Clear X</p>
                )}
            </div>

            {data.map(d => {

                return (
                    <div className="popover-section" key={d.title}>
                        <h5>{d.title}</h5>
                        {d.options.map(field => {

                            return (   
                                <span key={field.name}>
                                    {field.type === 'select' && (
                                        <DashSelect 
                                            name={field.name} 
                                            // listOfSelects={[{name: 'All', value: ''}, ...myOptions]} 
                                            listOfSelects={field.listOfSelects} 
                                            onChange={onChange} 
                                            // onChange={handleChange} 

                                            defaultValue={field.defaultValue} 
                                            useKey={field.useKey} />
                                    )}

                                    {field.type === 'checkbox' && (
                                        <div className="popover-checkbox-container">  {/* fix UI - this container should be around all checboxes */}
                                            <DashCheckbox 
                                                name={field.name}
                                                title={field.title}
                                                defaultValue={field.defaultValue} 
                                                // onChange={handleChange} />
                                                onChange={onChange} />

                                        </div>
                                    )}
                                </span>
                            )
                        })}
                    </div>
                )
            })}


            {/* <div className="popover-section">
                <h5>Type</h5>

                <DashSelect 
                    name='type' 
                    // listOfSelects={[{name: 'All', value: ''}, ...myOptions]} 
                    listOfSelects={this.state.seasonTypes} 
                    // onChange={this.handleChange} 
                    defaultValue={this.state.filters.type || ''} 
                    useKey="value" />
            </div>

            <div className="popover-section">
                <h5>Other</h5>
                <div className="popover-checkbox-container">
                    <DashCheckbox name="show_hidden" title="Hidden Seasons" defaultValue={this.state.filters.show_hidden || false} />
                </div>
            </div> */}

            {/* <div className="popover-section">
                <h5>Permissions</h5>
                <div className="popover-checkbox-container">
                    <DashCheckbox name="permissions" title="Default" />
                    <DashCheckbox name="permissions" title="Modified"defaultValue={true} />
                </div>
            </div> */}
        </>
    )
}


export default DashFilter;

// WORKING ON SAVING FILTER STATE IN REDUX

// what if store local to dash seasons component ?????


// const mapStateToProps = (state, {filterType}) => {
//     // console.log(state, 'STATE')
//     return {
//         isVisible: state[filterType].isVisible
//     }
// }

// const mapDispatchToProps = (dispatch, {filterType}) => {
//     return {
//         // toggleFilter: (bool) => dispatch(toggleFilter(filterType, bool))
//     }
// }
// export default connect(mapStateToProps, mapDispatchToProps)(DashFilter);



DashFilter.propTypes = {
    data: PropTypes.array.isRequired,
    getAction: PropTypes.func.isRequired,
    closeFilter: PropTypes.func.isRequired,
    filterType: PropTypes.string.isRequired
}