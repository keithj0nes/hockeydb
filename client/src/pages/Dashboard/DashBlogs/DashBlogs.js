import React, { Component } from 'react'
import { connect } from 'react-redux';

import { newBlogPost } from '../../../redux/actions/blogActions';

export class DashBlogs extends Component {
  state = {
    message: '',
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
    console.log(this.state.message);

  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.newBlogPost(this.state.message)
  }

  render() {
    return (
      <div>
        <h1>DAASHHH</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name='message' onChange={this.handleChange} placeholder={'Post here'} />
          <input type="submit" value="Submit" />
        </form>
      </div >
    )
  }
}
// const mapStateToProps = state => {
//   console.log(state, "our state in dashNav!s");

//   return {
//     blogs: state.blogs.blogs
//   };
// };



const mapDispatchToProps = dispatch => ({
  newBlogPost: (msg) => dispatch(newBlogPost(msg))
})

export default connect(null, mapDispatchToProps)(DashBlogs);


