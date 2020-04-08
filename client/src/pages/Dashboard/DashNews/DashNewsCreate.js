import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '../../../components';

import { createNewsPost } from '../../../redux/actions/news';
import './dashnews.scss';


const tags = [
  {name: 'IMPORTANT', icon: '!'},
  {name: 'ALERT',     icon: '!i!'}
]

const initialState = {
    title: '',
    body: '',
    allow_collapse: false,
    tag: ''
}


export class DashBlogs extends Component {
  state = initialState;

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



  // imageHandler = (image, callback) => {
  //   var IMGUR_CLIENT_ID = 'bcab3ce060640ba';
  //   var IMGUR_API_URL = 'https://api.imgur.com/3/image';
  //   var data = new FormData();
  //   data.append('image', image);

  //   var xhr = new XMLHttpRequest();
  //   xhr.open('POST', IMGUR_API_URL, true);
  //   xhr.setRequestHeader('Authorization', 'Client-ID ' + IMGUR_CLIENT_ID);
  //   xhr.onreadystatechange = function () {
  //     if (xhr.readyState === 4) {
  //       var response = JSON.parse(xhr.responseText);
  //       if (response.status === 200 && response.success) {
  //         callback(response.data.link);
  //       } else {
  //         var reader = new FileReader();
  //         reader.onload = function (e) {
  //           callback(e.target.result);
  //         };
  //         reader.readAsDataURL(image);
  //       }
  //     }
  //   }
  //   xhr.send(data);
  // }

  // handleChange = e => {
  //   this.setState({ [e.target.name]: e.target.value })
  //   console.log(this.state.message);

  // }
  // handleSubmit = e => {
  //   e.preventDefault();
  //   this.props.newBlogPost(this.state.message)
  // }

  handleQuillChange = body => {
    this.setState({ body })
    // console.log(this.state.text);
  }

  handleQuillSubmit = () => {
    // console.log(this.state, 'right herrr')
    this.props.createNewsPost(this.state);
    this.setState(initialState)
  }

  handleChange = e => {
      this.setState({ [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  }

  render() {
    return (
      <div className="dashnews-container">
        <h1>News</h1>
        <br />
        <br />

        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" value={this.state.title} onChange={this.handleChange}/>

        <br />
        <br />

        <div className="rte-container">
          <ReactQuill value={this.state.body} onChange={this.handleQuillChange} formats={this.quillFormats} modules={this.quillModules} />
        </div>

        <br />
        <br />

        <label htmlFor="allow_collapse">Allow Collapse</label>
        <input type="checkbox" id="allow_collapse" checked={this.state.allow_collapse} name="allow_collapse" onChange={this.handleChange}/>
        <br />
        <br />

        <select name="tag" id="tag" value={this.state.tag} onChange={this.handleChange}>
          <option value="">{'Select A Tag'}</option>
          {tags.map(tag => {
            return <option key={tag.name}>{tag.name}</option>
          })}
        </select>
        <br />
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
  createNewsPost: data => dispatch(createNewsPost(data))
})

export default connect(null, mapDispatchToProps)(DashBlogs);


