import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '../../../components';
import DashNewsCreate from './DashNewsCreate';

import { getNews, updateNewsPostOrder } from '../../../redux/actions/news';


class DashNews extends Component {

  state = {
    newsPosts: []
  }

  static getDerivedStateFromProps(props, state) {
    if(props.news.length !== state.newsPosts.length) {
      return {
        newsPosts: props.news
      }
    }
    return null;
  }
  
  componentDidMount() {
    this.props.getNews();
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

  render() {
    return (
      <div className="dashnews-container">

      <DashNewsCreate />

        <div style={{background: 'yellow', width: '60%', padding: 20}}>
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
                      return (
                        <Draggable draggableId={post.id} index={index} key={post.id}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    // isDragging={snapshot.isDragging}
                                >
                                    <p style={{padding: 20, background: 'white', marginBottom: 10, border: '1px solid red'}} key={post.id}>{post.id} | {post.title} | {post.first_name}</p>
                                </div>
                            )}
                        </Draggable>
                      )
                    })}

                    {provided.placeholder}
                </div>
            )}
            </Droppable>
          </DragDropContext>
        </div>
        {/* {this.props.news.map(post => {
          return (<p key={post.id}>{post.id} | {post.title} | {post.first_name}</p>)
        })} */}
      </div>
    )
  }
}

const mapStateToProps = state => {
  // console.log(state, "our state in DASH NEWS");
  return {
    news: state.news.news
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