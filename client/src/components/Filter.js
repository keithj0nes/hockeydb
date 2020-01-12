import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleFilter } from '../redux/actions/misc';
import qs from 'query-string';


// const Filter = ({isVisible, data, filterType}) => {

class Filter extends Component {


    state = {
        filters: {}
    }
    
    componentWillUnmount(){
        console.log('toggle on dismount')
        this.props.toggleFilter(false);
    }
    ya = () => {
        this.props.history.push({
            search: 'helloworkd'
        })
    }
    
    handleChange = e => {
        // console.log(e.target.type === 'checkbox' ? e.target.checked : e.target.value ,'hitting')
        // this.setState({ [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

        const filters = {...this.state.filters};
        filters[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({filters})
        
        const stringed = qs.stringify(filters)

        this.props.getAction(stringed)

        this.props.history.push({
            search: stringed
        })

    }
    
    render(){
        
        const { isVisible, data, filterType } = this.props;
        if(!isVisible) return null;
        console.log(this.state.filters, 'state.filtersss')

        
        return (
            <div style={{background: 'pink', display: 'flex', padding: '10px 0'}}>

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
                                                    <option key={ind} value={item}>{item}</option>
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

                        {/* <button onClick={ya}>click</button> */}
                    </div>
                )
            })}

             {/* {data.map(field => {
                 console.log(field, 'field')
                return (
                    <div key={field.name}>

                        {field.type === 'input' && (
                            <div className="modal-field">
                                <label htmlFor={field.name}>{field.title}</label>
                                <input type="text" name={field.name} defaultValue={field.defaultValue} disabled={field.disabled} onChange={data.onChange}/>
                            </div>
                        )}

                        {field.type === 'select' && (
                            <div className="modal-field">
                                <label htmlFor={field.name}>{field.title}</label>
                                <select className="select-css" name={field.name} defaultValue={field.defaultValue} onChange={data.onChange}>
                                    {!!field.hiddenValue && <option value="" hidden>{field.hiddenValue}</option>}
                                    {field.listOfSelects.map((item, ind) => (
                                        <option key={ind} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>

                        )}

                        {field.type === 'checkbox' && (
                            <div className="modal-field">
                                <div style={{display: 'flex'}}>
                                {!field.hidden && (
                                    <input type="checkbox" style={{margin: '5px 10px 0 0'}} id={field.name} name={field.name} defaultChecked={field.defaultValue} onChange={data.onChange} />
                                )}
                                <label htmlFor={field.name}>{field.title}</label>
                            </div>

                            </div>

                        )}


                    </div>
                )
            })} */}
        </div>
    )
    }   

}

const mapStateToProps = (state, {filterType}) => {
    console.log(state, 'STATE')
    return {
        isVisible: state.seasons.isVisible
    }
}

const mapDispatchToProps = (dispatch, {filterType}) => {
    return {
        toggleFilter: (bool) => dispatch(toggleFilter(filterType, bool))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Filter);

//use redux for state of isVisible
//handle close (redux)
//handle clear filters (redux)

// DONE/
//make filter use dropdown instead of checkboxes for now 

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