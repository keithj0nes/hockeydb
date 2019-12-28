import React, { Component } from 'react';
import { connect } from 'react-redux';
// import ReactSwipe from 'react-swipe';
import { getSeasons, deleteSeason, createSeason, updateSeason } from '../../../redux/actions/seasons';
import { Button, Swiper } from '../../../components';

import './DashSeasons.scss';
// import ListItem from '../ListItem';
import DashSeasonsListItem from './DashSeasonsListItem';
import { toggleModal } from '../../../redux/actions/misc';
import { slideTime } from '../../../helpers';


const defaultState = {
    isAddSeasonVisible: false,
    seasonTypes: ['Regular Season', 'Playoffs', 'Tournament'],
    name: '',
    type: 'Regular Season',
    is_active: false,
    edit: {}
}

class DashSeasons extends Component {

    // state = {
    //     isAddSeasonVisible: false,
    //     seasonTypes: ['Regular Season', 'Playoffs', 'Tournament'],

    //     name: '',
    //     type: 'Regular Season',
    //     is_active: false,

    //     edit: {}
    // }

    state = defaultState;

    componentDidMount() {
        if (this.props.seasons.length <= 0) {
            this.props.getSeasons();
        }

        // this.props.history.push({
        //     query: { someparam: 'MY PARAM!'}
        // })
    }

    toggleSeasonVisible = () => {
        this.setState({ isAddSeasonVisible: !this.state.isAddSeasonVisible })
    }

    handleAddSeason = () => {
        this.props.toggleModal({
            isVisible: true,
            title: 'Add Season',
            isClosableOnBackgroundClick: false,
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: null
                },
                {
                    title: 'Type',
                    type: 'select',
                    name: 'type',
                    defaultValue: null,
                    listOfSelects: this.state.seasonTypes
                },
            ],
            onChange: this.handleChange(),
            confirmActionTitle: 'Create Season',
            confirmAction: () => { this.validation() && this.props.createSeason({ name: this.state.name, type: this.state.type }); this.setState(defaultState) },
        }, 'prompt');
    }

    validation = () => {
        if (!this.state.name) return false;

        return true;
    }

    handleDeleteSeason = (item) => {
        this.props.toggleModal({
            isVisible: true,
            title: 'Delete Season',
            message: `Are you sure you want to delete this season?\nThis cannot be undone and you will lose any information saved within this season.\n\nPlease type in the name of the season below to delete.`,
            toBeDeleted: item,
            deleteAction: () => this.props.deleteSeason(item.id),
        }, 'delete');
    }

    handleChange = edit => e => {
        console.log(edit, 'edit!')
        if(!!edit){
            var editStateCopy = {...this.state.edit};
            editStateCopy[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

            return this.setState({edit: editStateCopy}, () =>{
                console.log(this.state.edit)
            })
        }
        this.setState({ [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
    }

    handleEditSeason = (item) => {

        console.log(item, 'edtinggggg item!');

        this.setState({ edit: item }, () => {
            console.log(this.state.edit, 'edit!')
        })

        // this.swiper.next();

        // setTimeout(() => {
        //     this.setState({isAddSeasonVisible: false})
        // }, slideTime);
        this.props.toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: false,
            // toBeDeleted: item,
            title: 'Edit Season',
            // message: 'Are you sure you want to delete this season?',
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: item.name
                },
                {
                    title: 'Type',
                    type: 'select',
                    name: 'type',
                    defaultValue: item.type,
                    listOfSelects: this.state.seasonTypes
                },
                {
                    title: item.is_active ? 'Active Season' : 'Set To Active Season',
                    type: 'checkbox',
                    name: 'is_active',
                    hidden: item.is_active,
                    defaultValue: item.is_active
                }
            ],
            onChange: this.handleChange('editing'),
            confirmActionTitle: 'Update Season',
            // confirmAction: () => console.log(this.state, 'this.state'),
            confirmAction: () => this.props.updateSeason(item.id, this.state.edit),
        }, 'prompt');
    }



    render() {
        // console.log(this.state.edit)

        //this should be it's own loading icon component
        if (this.props.isLoading) {
            return <div>Loading...</div>
        }

        const { seasons } = this.props;

        return (
            <div>

                <Swiper ref={el => this.swiper = el} options={{ speed: slideTime, loop: true }}>
                    {/* <Content type="first" next={() => this.myyReff.nextSlide()}/> */}

                    {/* PANE ONE */}

                    <div style={{ width: '100%' }}>


                        <div className="dashboard-filter-header">
                            <div>
                                {this.state.isAddSeasonVisible ? (
                                    <Button title="Cancel" danger onClick={this.toggleSeasonVisible} />
                                ) : (
                                        <Button title="Add Season" onClick={this.handleAddSeason} />
                                    )}

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
                                <input type="text" name="name" placeholder="Season name" onChange={this.handleChange} />
                                {/* <input type="text" placeholder="Select season type"/> */}
                                <select name="type" defaultValue={this.state.type || null} onChange={this.handleChange}>
                                    {this.state.seasonTypes.map((seasonType, ind) => (
                                        <option key={ind} value={seasonType}>{seasonType}</option>
                                    ))}
                                </select>

                                <div className="dashboard-add-button-container">
                                    <Button title="Save Season" success onClick={this.toggleSeasonVisible} />
                                </div>

                            </div>

                        )}


                        <div className="dashboard-list-container">

                            <div className="dashboard-list">

                                { seasons && seasons.length <= 0 ? (
                                    <div>
                                        Sorry, no seasons have been created. Start by adding a season above.
                                    </div>
                                ) : (
                                    <>

                                        <div className="dashboard-list-item hide-mobile">
                                            <div style={{ display: 'flex' }}>

                                                <p className="flex-two">Name</p>
                                                <p className="flex-one">Type</p>
                                                <p className="flex-one">Manage</p>
                                            </div>
                                        </div>

                                        {seasons.map(item => {

                                            return (
                                                <DashSeasonsListItem
                                                    key={item.id}
                                                    item={item}
                                                    sections={{ 'name': 'two', 'type': 'one' }}
                                                    onClick={() => this.handleDeleteSeason(item)}
                                                    onEdit={() => this.handleEditSeason(item)}
                                                />
                                            )

                                        })}
                                    </>
                                )}

                            </div>

                        </div>
                    </div>


                    {/* PANE TWO */}


                    <div style={{ width: '100%' }}>
                        <div className="dashboard-filter-header">
                            <div >

                                EDIT
                                {/* <Button title="Cancel" danger onClick={() => this.swiper.prev()}/> */}
                            </div>
                        </div>


                        <div className="dashboard-list-container">

                            <div className="dashboard-list">

                                <div className="dashboard-list-item hide-mobile">
                                    <div style={{ display: 'flex' }}>

                                        <p className="flex-two">Name</p>
                                        <p className="flex-one">Type</p>
                                        <p className="flex-one">Manage</p>
                                    </div>
                                </div>


                                <div className="dashboard-list-item">
                                    {/* <div style={{display: 'flex'}}>

                                        <p className="flex-two">Name</p>
                                        <p className="flex-one">Type</p>
                                        <p className="flex-one">Manage</p>
                                    </div> */}

                                    <input type="text" name="name" defaultValue={this.state.edit.name} onChange={this.handleChange} />
                                    <select name="type" value={this.state.edit.type || ''} onChange={this.handleChange}>
                                        {this.state.seasonTypes.map((seasonType, ind) => (
                                            <option key={ind} value={seasonType}>{seasonType}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button title="Cancel" danger onClick={() => this.swiper.prev()} />
                                    <div style={{ width: 15 }} />
                                    <Button title="Save" onClick={() => this.swiper.prev()} />
                                </div>



                                {/* {this.props.seasons && this.props.seasons.map(item => {

                                    return (
                                        <DashSeasonsListItem 
                                            key={item.id} 
                                            item={item} 
                                            sections={{'name': 'two', 'type': 'one'}}
                                            onClick={() => this.handleDeleteSeason(item)} 
                                            onEdit={() => this.handleEditSeason(item)}
                                            locations={this.props.locations}
                                        />
                                    )

                                })} */}
                            </div>

                        </div>


                    </div>
                    <div>PANE 2</div>
                    {/* <Content  prev={() => this.myyReff.prevSlide()}></Content> */}
                    <div>PANE 3</div>
                </Swiper>
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
        createSeason: data => dispatch(createSeason(data)),
        deleteSeason: id => dispatch(deleteSeason(id)),
        updateSeason: (id, data) => dispatch(updateSeason(id, data)),
        toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType))

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashSeasons) 