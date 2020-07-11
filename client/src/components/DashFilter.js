import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DashSelect, DashCheckbox } from './';
import { history, setQuery } from 'helpers';

export const DashFilter = ({data, getAction, closeFilter}) => {

    // create local state of filters
    const [ filters, setFilters ] = useState({});

    // <Filter data={this.state.filterData} getAction={this.props.getSeasons} history={this.props.history} filterType={'seasons'}/>

    const handleChange = e => {
        const hFilters = {...filters};

        console.log(e.target.type, 'TYPEEEE')
        console.log(e.target.checked, 'CHECCKEED')
        console.log(e.target.name, 'NAMEE')

        // if no value, delete from the filters copy
        if(e.target.value === '' || e.target.checked === false){
            console.log(' false, hitting ehre')
            delete hFilters[e.target.name];
        } else {
            hFilters[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        }

        // // delete the divisions key off filters when the props.reloadOn of state.filters is changed
        // if(prevState.filters[this.props.reloadOn] !== filters[this.props.reloadOn]){
        //     delete filters['division'];
        // }

        const search = setQuery(hFilters);
        getAction(search);
        history.push({ search });
        return setFilters(hFilters);
    }

    const clearFilters = () => {
        history.push({search: ''});
        getAction();
        setFilters({});
        closeFilter()
    }

    // need to use redux to hold filter state

    return (
        <>
            <div className="popover-header">
                <h2>Filter Options</h2>

                {history.location.search.length > 0 && (
                    <p class="clear-btn" onClick={clearFilters}>Clear X</p>
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
                                            onChange={handleChange} 
                                            defaultValue={field.defaultValue} 
                                            useKey={field.useKey} />
                                    )}

                                    {field.type === 'checkbox' && (
                                        <div className="popover-checkbox-container">  {/* fix UI - this container should be around all checboxes */}
                                            <DashCheckbox 
                                                name={field.name}
                                                title={field.title}
                                                defaultValue={field.defaultValue} 
                                                onChange={handleChange} />
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

DashFilter.propTypes = {
    data: PropTypes.array.isRequired,
    getAction: PropTypes.func.isRequired
}