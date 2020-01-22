import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleFilter } from '../redux/actions/misc';
import qs from 'query-string';


class Filter extends Component {

    state = {
        filters: {}
    }
    
    componentWillUnmount(){
        this.props.toggleFilter(false);
    }

    // componentDidUpdate(prevProps){
    //     console.log(prevProps.data[1], 'prev');
    //     console.log(this.props.data[1], 'current');
    // }

    handleChange = e => {
        const filters = {...this.state.filters};
        
        //if no value, delete from the filters copy
        if(e.target.value === '' || e.target.checked === false){
            delete filters[e.target.name];
        } else {
            filters[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        }

        this.setState({filters}, () => console.log(this.state.filters, 'fitlers'));
        const search = qs.stringify(filters);
        this.props.getAction(search);
        this.props.history.push({search});
    }

    handleClear = () => {
        this.props.history.push({search: ''});
        this.props.getAction();
        this.setState({filters: {}});
    }
    
    render(){
        
        const { isVisible, data } = this.props;
        if(!isVisible) return null;
        console.log(this.state.filters, 'state.filtersss');

        
        return (
            <div style={{background: 'pink', display: 'flex', position: 'relative', padding: '10px 0'}}>

                <div style={{position: 'absolute', top: 0, right: 0, display: 'flex', background: 'yellow'}}>
                    <p onClick={this.handleClear}>clear filters</p>
                    <p style={{marginLeft: 10}}onClick={() => this.props.toggleFilter()}>close</p>
                </div>
               {data.map(d => {
                // console.log(d, 'd')
                    return (
                        <div style={{flex: 1, marginRight: 10}} key={d.title}>
                            <h3>{d.title}</h3>
                            {d.options.map(field => {
                                // console.log(field, 'field')
                                return (
                                    <div key={field.name}>

                                        {field.type === 'input' && (
                                            <div className="modal-field">
                                                <label htmlFor={field.name}>{field.title}</label>
                                                <input type="text" name={field.name} defaultValue={field.defaultValue} disabled={field.disabled} onChange={this.handleChange}/>
                                            </div>
                                        )}

                                        {field.type === 'select' && (
                                            <div className="modal-field">
                                                <label htmlFor={field.name}>{field.title}</label>
                                                <select className="select-css" name={field.name} defaultValue={field.defaultValue} onChange={this.handleChange}>
                                                    {!!field.hiddenValue && <option value="" hidden>{field.hiddenValue}</option>}
                                                    {field.listOfSelects.map((item, ind) => (
                                                        <option key={ind} value={item.value}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                        )}

                                        {field.type === 'checkbox' && (
                                            <div className="modal-field">
                                                <div style={{display: 'flex'}}>
                                                {!field.hidden && (
                                                    <input type="checkbox" style={{margin: '5px 10px 0 0'}} id={field.name} name={field.name} defaultChecked={field.defaultValue} onChange={this.handleChange} />
                                                )}
                                                <label htmlFor={field.name}>{field.title}</label>
                                            </div>

                                            </div>

                                        )}


                                    </div>
                                )
                            })}     

                        </div>
                    )
                })}
            </div>
        )
    }   

}

const mapStateToProps = (state, {filterType}) => {
    // console.log(state, 'STATE')
    return {
        isVisible: state[filterType].isVisible
    }
}

const mapDispatchToProps = (dispatch, {filterType}) => {
    return {
        toggleFilter: (bool) => dispatch(toggleFilter(filterType, bool))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Filter);


//default value for checkbox

// DONE/
//make filter use dropdown instead of checkboxes for now 
//use redux for state of isVisible
//handle close (redux)
//handle clear filters (redux)
//add 'view all' for filtering selection






////////////////

// USING CHECKBOXES

////////////////


// import React from 'react';
// import { connect } from 'react-redux';

// const Filter = ({isVisible, data}) => {

//     if(!isVisible) return null;

//     return (
//         <div style={{background: 'pink', display: 'flex'}}>
//             {data.map(d => {
//                 console.log(d, 'd')
//                 return (
//                     <div style={{flex: 1}}>
//                         <h3>{d.title}</h3>
//                         {d.data && d.data.map( item => (
//                             <div style={{background: 'green', }}>
//                                 <label htmlFor={item.name} style={{background: 'yellow', display: 'flex', alignItems: 'center'}}>
//                                     <input id={item.name} type="checkbox" style={{marginRight: 10}}/>
//                                     {item.name}
//                                 </label>
//                             </div>
//                         ))}
//                     </div>
//                 )
//             })}
//         </div>
//     )
// }

// const mapStateToProps = (state, {filterType}) => {
//     console.log(filterType, 'OWN STATE')
//     return {}
// }
// export default connect(mapStateToProps)(Filter);