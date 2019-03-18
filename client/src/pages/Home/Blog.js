import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getBlogs } from '../../redux/actions/blogActions';

export class Blog extends Component {
  componentDidMount() {
    this.props.getBlogs();
  }

  render() {
    return (
      <div>
        <h1>blog</h1>
        {this.props.blogs.map(item => (
          <p key={item.id}>{item.message}</p>
        ))}
      </div>
    )
  }
}
const mapStateToProps = state => {
  // console.log(state, "our state in blogs🈯️");

  return {
    blogs: state.blogs.blogs
  };
};



const mapDispatchToProps = dispatch => ({
  getBlogs: () => dispatch(getBlogs())
})

export default connect(mapStateToProps, mapDispatchToProps)(Blog);