import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Button, DashPageHeader } from '../../../components';
import DashNewsListItem from './DashNewsListItem';
import { getNews, updateNewsPostOrder } from '../../../redux/actions/news';
import DashTable from '../DashTable';


const DashNews2 = ({news, isLoading, location}) => {

    console.log('dashnews2')

    const onDragEnd = result => {
        const { destination, source } = result;
        console.log(result, 'resultsssss onDRAGEND');
    };

    const pageHeaderInfo = {
        title: 'News',
        searchPlaceholder: 'Search by title or content',
        onChange: () => console.log('changing placeholder text'),
        buttons: [
            {
                iconName: 'ADD_USER',
                title: 'Add News Post',
                onClick: () => console.log('clicked new post'),
            },
            // {
            //     iconName: 'FILTER',
            //     title: 'Filter News Posts',
            //     onClick: () => console.log('clickedddd FILTER')
            // },
        ],
    };

    return (
        <>
            <DashPageHeader pageHeaderInfo={pageHeaderInfo} />

            <div style={{ paddingBottom: 16 }} />

            <div className="dashboard-list-container">
                <div className="dashboard-list">
                    <DashTable
                        data={news}
                        sections={{ title: 'two', type: 'one' }}
                        minWidth={550}
                        isLoading={[isLoading, 15]}
                        emptyTableText={location.search.length > 0 ? 'Sorry, there are no seasons within your filter criteria' : 'Sorry, no seasons have been created. Start by adding a season above.'}
                        popoverData={(d, closePopover) => (
                            <ul>
                                <li>hi</li>
                                <li>there</li>
                                {/* <li onClick={() => { handleEditSeason(d); closePopover(); }}>Edit Season</li>
                                {!d.is_active && <li onClick={() => { handleHideSeason(d); closePopover(); }}>{`${showingHidden ? 'Unh' : 'H'}ide Season`}</li>}
                                {!d.is_active && <li onClick={() => { handleDeleteSeason(d); closePopover(); }}>Delete Season</li>} */}
                            </ul>
                        )}

                        draggableProps={{
                            onDragEnd,
                        }}
                    />
                </div>
            </div>

        </>
    );
};


const mapStateToProps = state => {
    // console.log(state, "our state in DASH NEWS");
    return {
        news: state.news.news,
        newsNum: state.news.newsNum,
        isLoading: state.news.isLoading,
    };
};

const mapDispatchToProps = dispatch => ({
    // getNews: () => dispatch(getNews()),
    // updateNewsPostOrder: (data, id) => dispatch(updateNewsPostOrder(data, id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashNews2));

DashNews2.propTypes = {
    news: PropTypes.array.isRequired,
    // getNews: PropTypes.func.isRequired,
    // toggleModal: PropTypes.func.isRequired,
    // deleteSeason: PropTypes.func.isRequired,
    // updateSeason: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object,
};
