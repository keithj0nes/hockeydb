import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '../../../components';

import { newBlogPost } from '../../../redux/actions/blogActions';

export class DashBlogs extends Component {
  state = {
    // message: '',
    text: '',
  }

  quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  }

  quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  // handleChange = e => {
  //   this.setState({ [e.target.name]: e.target.value })
  //   console.log(this.state.message);

  // }
  // handleSubmit = e => {
  //   e.preventDefault();
  //   this.props.newBlogPost(this.state.message)

  // }

  handleQuillChange = (value) => {
    this.setState({ text: value })
    console.log(this.state.text);
  }

  handleQuillSubmit = () => {
    console.log(this.state.text, 'right herrr')
    this.props.newBlogPost(this.state.text)

  }

  render() {
    return (
      <div>
        <h1>News</h1>
        {/* <form onSubmit={this.handleSubmit}>
          <input type="text" name='message' onChange={this.handleChange} placeholder={'Post here'} />
          <input type="submit" value="Submit" />
        </form> */}

        <ReactQuill value={this.state.text} onChange={this.handleQuillChange} formats={this.quillFormats} modules={this.quillModules} />
        <br />
        <Button title="Post" onClick={this.handleQuillSubmit} />
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


