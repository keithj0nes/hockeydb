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
      // ['link', 'image'],
      ['clean']
    ],
    imageHandler: this.imageHandler
  }

  quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  imageHandler = (image, callback) => {
    var IMGUR_CLIENT_ID = 'bcab3ce060640ba';
    var IMGUR_API_URL = 'https://api.imgur.com/3/image';
    var data = new FormData();
    data.append('image', image);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', IMGUR_API_URL, true);
    xhr.setRequestHeader('Authorization', 'Client-ID ' + IMGUR_CLIENT_ID);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var response = JSON.parse(xhr.responseText);
        if (response.status === 200 && response.success) {
          callback(response.data.link);
        } else {
          var reader = new FileReader();
          reader.onload = function (e) {
            callback(e.target.result);
          };
          reader.readAsDataURL(image);
        }
      }
    }
    xhr.send(data);
  }

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


