import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSeasons } from '../../../redux/actions/seasons';
import { Button } from '../../../components';
import './DashSeasons.scss';

class DashSeasons extends Component{

    state = {
        isAddSeasonVisible: false
    }

    componentDidMount(){
        if(this.props.seasons.length <= 0){
            this.props.getSeasons();
        } 

        // this.props.history.push({
        //     query: { someparam: 'MY PARAM!'}
        // })
    }

    toggleSeasonVisible = () => {
        this.setState({isAddSeasonVisible: !this.state.isAddSeasonVisible})
    }

    render(){
        //this should be it's own loading icon component
        if(this.props.isLoading){
            return <div>Loading...</div>
        }
        return (
            <div>

                <div className="dashboard-filter-header">
                    <div>
                        <Button title="Add Season" onClick={this.toggleSeasonVisible}/>
                    </div>

                    {/* <div className="sort-section hide-desktop" style={{background: 'red'}}>
                        Sort By
                        <div className="select-style">
                            <select name="" id="">
                                <option value="name">Name</option>
                                <option value="type">Type</option>
                            </select>
                        </div>
                    </div> */}
                </div>

                {/* <div className="dashboard-list-container">
                    <div className="dashboard-list">
                        <div className="dashboard-list-item">
                            
                            <input type="text"/>
                            <input type="text"/>
                        </div>                
                    </div>
                </div> */}

                {this.state.isAddSeasonVisible && (

                    
                    <div className="dashboard-add-container">
                        <input type="text" placeholder="Enter season name"/>
                        <input type="text" placeholder="Select season type"/>

                        <div className="dashboard-add-button-container">
                            <Button title="Save Season" success onClick={this.toggleSeasonVisible}/>
                        </div>

                    </div>

                )}


                <div className="dashboard-list-container">

                    <div className="dashboard-list">

                        <div className="dashboard-list-item hide-mobile">
                            <div style={{display: 'flex'}}>

                                <p className="flex-three">Name</p>
                                <p className="flex-one">Type</p>
                                <p className="flex-one">Manage</p>
                            </div>
                        </div>

                    {this.props.seasons && this.props.seasons.map(item => {

                        return (
                            <div key={item.id} className="dashboard-list-item">
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>

                                    <p className="flex-three">{item.name}</p>
                                    <p className="flex-one">{item.type}</p>

                                    <div className="flex-one hide-mobile">
                                        {'<edit>'}
                                        {'<delete>'} 
                                    </div>
                                </div>
                            </div>
                        )

                    })}

                    {/* <div className="dashboard-list-item"></div>
                    <div className="dashboard-list-item"></div> */}


                        {/* <div>Name</div>
                        <div>Type</div>
                        <div>Manage/Edit</div> */}
                    </div>

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    // console.log(state, 'state!')
    return {
        seasons: state.seasons.seasons,
        isLoading: state.seasons.isLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getSeasons: () => dispatch(getSeasons())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashSeasons) 