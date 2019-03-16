import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getBlogs } from '../../redux/actions/blogActions';

export class Blog extends Component {
  // console.log(this.props.);
  componentDidMount() {
    this.props.getBlogs();
  }

  render() {
    return (
      <div>
        <h1>blog</h1>
        {this.props.blogs.map(item => (
          <p>{item.message}</p>
        ))}
      </div>
    )
  }
}
const mapStateToProps = state => {
  console.log(state, "our state 🈯️");
  console.log(state.blogs.blogs, "our state.blog 🈯️");

  return {
    blogs: state.blogs.blogs
  };
};



const mapDispatchToProps = dispatch => ({
  getBlogs: () => dispatch(getBlogs())
})

export default connect(mapStateToProps, mapDispatchToProps)(Blog);