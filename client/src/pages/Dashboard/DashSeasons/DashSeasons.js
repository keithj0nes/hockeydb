import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSeasons, deleteSeason } from '../../../redux/actions/seasons';
import { Button } from '../../../components';
import './DashSeasons.scss';
import ListItem from '../ListItem';
import DashSeasonsListItem from './DashSeasonsListItem';

import { toggleModal } from '../../../redux/actions/misc';


class DashSeasons extends Component{

    state = {
        isAddSeasonVisible: false,
        seasonTypes: ['Regular Season', 'Playoffs', 'Tournament'],

        name: '',
        type: '',
        is_active: false,
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

    handleDeleteSeason = (item) => {
        this.props.toggleModal({
            isVisible: true,
            toBeDeleted: item,
            title: 'Delete Season',
            message: 'Are you sure you want to delete this season?',
            deleteAction: () => this.props.deleteSeason(item.id),
        }, 'delete');
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value})
    }

    handleEditSeason = (item) => {
        this.props.toggleModal({
            isVisible: true,
            // toBeDeleted: item,
            title: 'Edit Season',
            // message: 'Are you sure you want to delete this season?',
            fields: [
                {
                    type: 'input',
                    name: 'name',
                    defaultValue: item.name
                },
                {
                    type: 'select',
                    name: 'type',
                    defaultValue: item.type,
                    listOfSelects: this.state.seasonTypes
                },
                {
                    type: 'checkbox',
                    name: 'is_active',
                    defaultValue: item.is_active
                }
            ],
            onChange: this.handleChange,
            confirmAction: () => console.log(this.state, 'this.state'),
            deleteAction: () => this.props.deleteSeason(item.id),
        }, 'prompt');
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

                {this.state.isAddSeasonVisible && (

                    <div className="dashboard-add-container">
                        <input type="text" name="name" placeholder="Season name" onChange={this.handleChange}/>
                        {/* <input type="text" placeholder="Select season type"/> */}
                        <select name="type" defaultValue={this.state.type || null} onChange={this.handleChange}>
                            {this.state.seasonTypes.map((seasonType, ind) => (
                                <option key={ind} value={seasonType}>{seasonType}</option>
                            ))}
                        </select>

                        <div className="dashboard-add-button-container">
                            <Button title="Save Season" success onClick={this.toggleSeasonVisible}/>
                        </div>

                    </div>

                )}


                <div className="dashboard-list-container">

                    <div className="dashboard-list">

                        <div className="dashboard-list-item hide-mobile">
                            <div style={{display: 'flex'}}>

                                <p className="flex-two">Name</p>
                                <p className="flex-one">Type</p>
                                <p className="flex-one">Manage</p>
                            </div>
                        </div>

                    {this.props.seasons && this.props.seasons.map(item => {

                        return (

                            // <ListItem key={item.id} item={item} sections={{'name': 'three', 'type': 'one'}} onClick={() => this.handleDeleteSeason(item)} />
                            // <div key={item.id} className="dashboard-list-item">
                            //     <div style={{display: 'flex', justifyContent: 'space-between'}}>

                            //         <p className="flex-three">{item.name}</p>
                            //         <p className="flex-one">{item.type}</p>

                            //         <div className="flex-one hide-mobile">
                            //             {'<edit>'}
                            //             <span onClick={() => this.props.deleteSeason(item.id)}>{'<delete>'}</span>
                            //         </div>
                            //     </div>
                            // </div>

                            // <div key={item.id}>
                            //     <div className="hide-desktop">
                                    <DashSeasonsListItem 
                                        key={item.id} 
                                        item={item} 
                                        sections={{'name': 'two', 'type': 'one'}}
                                        onClick={() => this.handleDeleteSeason(item)} 
                                        onEdit={() => this.handleEditSeason(item)}
                                        locations={this.props.locations}
                                    />

                            //     {/* </div> */}

                            //     {/* <div className="hide-mobile">
                            //         <ListItem 
                            //             key={item.id} 
                            //             item={item} 
                            //             sections={{'name': 'three', 'type': 'one'}}
                            //             onClick={() => this.props.handleDeleteSeason(item)} 
                            //             locations={this.props.locations}
                            //         />

                            //     </div> */}

                            // {/* </div> */}
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
        getSeasons: () => dispatch(getSeasons()),
        deleteSeason: id => dispatch(deleteSeason(id)),
        toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType))

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashSeasons) 