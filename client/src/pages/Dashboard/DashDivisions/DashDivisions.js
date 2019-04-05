import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSeasons, deleteSeason } from '../../../redux/actions/seasons';
import { Button } from '../../../components';
import './DashDivisions.scss';
import ListItem from './ListItem';

class DashDivisions extends Component {

    state = {
        isAddDivisionVisible: false,
        newDivisionName: '',
    }

    componentDidMount() {
        // if (this.props.seasons.length <= 0) {
        //     this.props.getSeasons();
        // }

    }

    toggleSeasonVisible = () => {
        this.setState({ isAddDivisionVisible: !this.state.isAddDivisionVisible })
    }



    render() {
        //this should be it's own loading icon component
        if (this.props.isLoading) {
            return <div>Loading...</div>
        }
        return (
            <div>

                <div className="dashboard-filter-header">
                    <div>
                        <Button title="Add Division" onClick={this.toggleSeasonVisible} />
                    </div>

                </div>

                {this.state.isAddDivisionVisible && (

                    <div className="dashboard-add-container">
                        <input type="text" placeholder="Enter division name" />
                        <div className="dashboard-add-button-container">
                            <Button title="Save Division" success onClick={this.toggleSeasonVisible} />
                        </div>

                    </div>

                )}


                <div className="dashboard-list-container">

                    <div className="dashboard-list">

                        <div className="dashboard-list-item hide-mobile">
                            <div style={{ display: 'flex' }}>
                                <p className="flex-three">Name</p>
                                <p className="flex-one">Manage</p>
                            </div>
                        </div>

                        {this.props.seasons && this.props.seasons.map(item => {

                            return (
                                <ListItem key={item.id} item={item} onClick={() => this.props.deleteSeason(item.id)} />
                            )

                        })}
                    </div>

                </div>
            </div>
        )
    }
}

// const mapStateToProps = state => {
//     // console.log(state, 'state!')
//     return {
//         seasons: state.seasons.seasons,
//         isLoading: state.seasons.isLoading
//     }
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         getSeasons: () => dispatch(getSeasons()),
//         deleteSeason: id => dispatch(deleteSeason(id))
//     }
// }
export default connect(null, null)(DashDivisions) 