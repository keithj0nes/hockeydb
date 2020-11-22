import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Button, DashPageHeader } from '../../../components';
import DashNewsListItem from './DashNewsListItem';

import { getNews, updateNewsPostOrder } from '../../../redux/actions/news';


class DashNews extends Component {

  state = {
    newsPosts: [],
    newsNum: null
  }

  static getDerivedStateFromProps(props, state) {
    // if(props.news.length !== state.newsPosts.length || props.newsNum !== state.newsNum) {
    if(props.newsNum !== state.newsNum) {
      return {
        newsPosts: props.news,
        newsNum: props.newsNum
      }
    }
    return null;
  }
  
  componentDidMount() {
    this.props.news.length === 0 && this.props.getNews();
  }

  onDragEnd = result => {
    const { destination, source } = result;

    if(!destination) return; // if dropped outside of droppable area
    if(destination.droppableId === source.droppableId && destination.index === source.index) return; // if dropped in the same spot
    
    const newPostsArr = [...this.state.newsPosts];
    const [ removed ] = newPostsArr.splice(source.index, 1);
    newPostsArr.splice(destination.index, 0, removed);
    this.setState({newsPosts: newPostsArr}, () => {
      // console.log({movedId: removed.id, toIndex:destination.index + 1, fromIndex:source.index + 1, move: destination.index + 1 > source.index + 1 ? 'down' : 'up'})
      const { id } = removed;
      const data = {toIndex:destination.index + 1, fromIndex:source.index + 1, move: destination.index + 1 > source.index + 1 ? 'down' : 'up'}
      this.props.updateNewsPostOrder(data, id);
    })
  }

  handleAddNewsPost = () => {
    this.props.history.push(`${this.props.location.pathname}/create`);
  }

  handleEditNewsPost = post => {
    this.props.history.push(`${this.props.location.pathname}/${post.id}`, post);
  }

  render() {

    const pageHeaderInfo = {
      title: 'News',
      searchPlaceholder: 'Search by title or content',
      onChange: () => console.log('changing placeholder text'),
      buttons: [
          { 
              iconName: 'ADD_USER',
              title: 'Add News Post',
              onClick: () => console.log('clickedddd ADD_USER')
          },
          { 
              iconName: 'FILTER',
              title: 'Filter News Posts',
              onClick: () => console.log('clickedddd FILTER')
          }
      ]
    }

    return (

      <>
        <DashPageHeader pageHeaderInfo={pageHeaderInfo} />
        {/* <div className="dashnews-container"> */}

        <div className="dashboard-filter-header">
            <div style={{width: '100%'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button title="Add Post" onClick={this.handleAddNewsPost} />
                </div>
            </div>

        </div>

        <div className="dashboard-list-container">

        <div className="dashboard-list">

          <div className="dashboard-list-item hide-mobile">
              <div style={{ display: 'flex' }}>

                  <p className="flex-four">&nbsp;Move&nbsp;&nbsp;Post</p>
                  {/* <p className="flex-four">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Post</p> */}

                  <p className="flex-one">Manage</p>
              </div>
          </div>

          <div style={{background: 'white', width: '100%'}}>
            <DragDropContext
              // onDragStart={this.onDragStart}
              // onDragUpdate={this.onDragUpdate}
              onDragEnd={this.onDragEnd}
            >
              <Droppable droppableId="news-dnd-container">
                {(provided, snapshot) => (
                  <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      // isDraggingOver={snapshot.isDraggingOver}
                  >
                      {this.state.newsPosts.map((post, index) => {

                        // const {tag} = post;
                        // const icon = post.tag ? '!' : '';

                        return (
                          <DashNewsListItem 
                            key={post.id}
                            item={post} 
                            sections={{'name': 'four'}} 
                            onDelete={() => console.log('clicked delete')}
                            onEdit={() => console.log('clicked edit')}
                            // onEdit={() => this.handleEditNewsPost(post)}
                            onHide={() => console.log('on hide clicekd')}
                            index={index}
                          />
                        )

                        // return (
                        //   <Draggable draggableId={post.id} index={index} key={post.id}>
                        //       {(provided, snapshot) => (
                        //           <div
                        //               {...provided.draggableProps}
                                      
                        //               ref={provided.innerRef}
                        //               // isDragging={snapshot.isDragging}
                        //           >
                        //             <div style={{padding: 10, display: 'flex', alignItems: 'center', background: 'white', marginBottom: 10, border: '1px solid red'}} >

                        //               <div style={{height: 16, width: 30, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#f1f1f1', marginRight: 15}} {...provided.dragHandleProps}>
                        //                 <div style={{height: 2, width: '100%', backgroundColor: 'black'}}></div>
                        //                 <div style={{height: 2, width: '100%', backgroundColor: 'black'}}></div>
                        //                 <div style={{height: 2, width: '100%', backgroundColor: 'black'}}></div>
                        //               </div>

                        //               <div style={{display: 'flex'}}>
                        //                 <p  key={post.id}>{post.title} | {post.first_name}</p>
                        //                 {tag && <div className="tag" style={{background: '#E3BA4A'}}>{icon} <span className="hide-mobile">&nbsp;{tag}</span></div> }
                        //               </div>
                        //             </div>
                        //           </div>
                        //       )}
                        //   </Draggable>
                        // )
                      })}

                      {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          </div>

          {/* {this.props.news.map(post => {
            return (<p key={post.id}>{post.id} | {post.title} | {post.first_name}</p>)
          })} */}
        </div>
      </>
    )
  }
}

// {divisions.map(item => {
//   return (
//       <ListItem 
//           key={item.id} 
//           item={item} 
//           sections={{'name': 'three'}} 
//           onClick={() => this.handleDeleteDivision(item)}
//           onEdit={() => this.handleEditDivision(item)}
//       />
//   )

// })}

const mapStateToProps = state => {
  // console.log(state, "our state in DASH NEWS");
  return {
    news: state.news.news,
    newsNum: state.news.newsNum
  };
};

const mapDispatchToProps = dispatch => ({
  getNews: () => dispatch(getNews()),
  updateNewsPostOrder: (data, id) => dispatch(updateNewsPostOrder(data, id))
})
export default connect(mapStateToProps, mapDispatchToProps)(DashNews);




// // onDragStart
// const start = {
//   draggingOver: 'task-1',
//   type: 'TYPE',
//   source: {
//     droppableId: 'column-1',
//     index: 0
//   }
// }

// // onDragUpdate
// const update = {
//   draggingOver: 'task-1',
//   type: 'TYPE',
//   source: {
//     droppableId: 'column-1',
//     index: 0
//   },
//   destination: {
//     droppableId: 'column-1',
//     index: 1
//   },
// }

// // onDragEnd (result) returned
// const result = {
//   draggablId: 'task-1',
//   type: 'TYPE',
//   reason: 'DROP',
//   source: {
//     droppableId: 'column-1',
//     index: 0
//   },
//   destination: {
//     droppableId: 'column-1',
//    index: 1
//  },
//   destination: null // when droped outside of droppable area
// }

// // Draggable
// const draggableSnapshot = {
//   isDragging: true,
//   draggingOver: 'column-1'
// }

// // Droppable
// const droppableSnapshot = {
//   isDraggingOver: true,
//   draggingOverWith: 'task-1'
// }