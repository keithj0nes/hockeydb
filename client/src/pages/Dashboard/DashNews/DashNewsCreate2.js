import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dateFormat from 'date-fns/format';
import { Form, Input, Select, Tag, Breadcrumb } from 'antd';
import { Button, DashPageHeader, NewsPost } from '../../../components';
import { createNewsPost, getNewsPostById, updateNewsPostById, getNewsTags } from '../../../redux/actions/news';
import './dashnews.scss';


const quillModules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        // ['link', 'image'],
    ],
    // imageHandler: this.imageHandler,
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
];

const DashNewsCreate2 = ({ user, newsById, newsTags, getNewsTags, createNewsPost, updateNewsPostById, getNewsPostById, history, match }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [tagsList, setTagsList] = useState([]);
    const [post, setPost] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        getNewsTags();
        if (match.params.id !== 'create') {
            getNewsPostById(match.params.id);
            setIsEditing(true);
        }
    }, [getNewsTags, getNewsPostById, match.params.id]);

    useEffect(() => {
        if (match.params.id !== 'create') {
            const m = newsTags.filter((item) => !newsById.tags_in_post?.find(item2 => item2.id === item.id));
            setTagsList(m);
        } else {
            setTagsList(newsTags);
        }
    }, [newsTags, newsById, match.params.id]);


    useEffect(() => {
        if (match.params.id !== 'create') {
            form.setFieldsValue({ ...newsById, tags_in_post: newsById.tags_in_post?.map(item => item.name) });
        }
    }, [newsById, form, match.params.id]);

    const addTagToSelect = (tag) => {
        setTagsList(tagsList.filter(item => item.name !== tag.name));
        const newOptions = !!form.getFieldValue('tags_in_post') ? [...form.getFieldValue('tags_in_post'), tag.name] : [tag.name];
        form.setFieldsValue({ tags_in_post: newOptions });
    };

    const removeTagFromSelect = ({ value }) => {
        // value in var names references param "value"
        const mapValueToTagsList = newsTags.find(item => item.name === value);
        setTagsList([...tagsList, mapValueToTagsList]);
        const tagSelectWithoutValue = form.getFieldValue('tags_in_post').filter(item => item !== value);
        form.setFieldsValue({ tags_in_post: tagSelectWithoutValue });
    };

    const tagRender = (props) => {
        const { label, value, closable } = props;
        return (
            <Tag color="#FF815C" closable={closable} onClose={() => removeTagFromSelect({ value })} style={{ marginRight: 3 }}>
                {label}
            </Tag>
        );
    };

    const handleSubmit = () => {
        if (isEditing) {
            updateNewsPostById(post, match.params.id);
        } else {
            createNewsPost(post);
        }
    };

    const pageHeaderInfo = {
        title: `Announcements - ${isEditing ? 'Edit' : 'Create'}`,
        hideSearchAndButtons: true,
    };

    const onFinish = (values) => {
        // this map is required to do antd select only allowing array of strings (no array of object)
        // this map takse a the away of strings ['announcemnt'] and maps them to their object [{ id: 1, name: 'announcemnt' }]
        const mappedSelectArrayToNewsTagsKeys = values.tags_in_post?.map(item => newsTags.find(t => t.name === item));
        setPost({ ...values, tags_in_post: mappedSelectArrayToNewsTagsKeys || [] });
        setShowPreview(!showPreview);
    };

    const isEditingData = isEditing ? { updated_date: new Date() } : { first_name: user.first_name, last_name: user.last_name, created_date: new Date() };
    const postPreviewData = { ...newsById, ...post, ...isEditingData };

    return (
        <>
            <DashPageHeader pageHeaderInfo={pageHeaderInfo} />

            <Breadcrumb style={{ marginLeft: 16, paddingTop: 16 }}>

                <Breadcrumb.Item>
                    <Link to="/dashboard/announcements"> {'<'} Back</Link>
                </Breadcrumb.Item>
                {/* <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="">Application Center</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="">Application List</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>An Application</Breadcrumb.Item> */}
            </Breadcrumb>

            <div className="dashnews-container">

                {!showPreview && (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={values => onFinish(values)}
                    >

                        <div className="title-postdate-container">
                            <Form.Item
                                label="Title"
                                name="title"
                                className="dashnews-input"
                                // rules={[{ required: true, message: 'Title is required' }]}
                            >
                                <Input />
                            </Form.Item>

                            {/* save for later */}
                            {/* <Form.Item label="Post Date" name="post_date" className="dashnews-input">
                                <Input />
                            </Form.Item> */}
                        </div>

                        {isEditing && (
                            <div style={{ paddingBottom: 20, background: 'white' }}>
                                <p> Created By: {newsById.first_name} {newsById.last_name}</p>
                                <p> Created Date: {dateFormat(newsById.created_date, 'MM/DD/YYYY h:mmA')}</p>
                            </div>
                        )}

                        <Form.Item>
                            <Form.Item
                                name="body"
                                initialValue=""
                                noStyle
                                // rules={[{ required: true, message: 'Body is required' }]}
                            >
                                <ReactQuill formats={quillFormats} modules={quillModules} />
                            </Form.Item>
                        </Form.Item>


                        <Form.Item label="Tags" name="tags_in_post" className="dashnews-input">
                            <Select
                                mode="multiple"
                                tagRender={tagRender}
                                open={false}
                                style={{ width: '100%' }}
                                placeholder="Select tags"
                                className="tag-select"
                            />
                        </Form.Item>

                        <div className="dashnews-input">
                            {tagsList.map(tag => <Tag onClick={() => addTagToSelect(tag)} key={tag.id}>{tag.name}</Tag>)}
                        </div>
                        <br />
                        <br />

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button title="Cancel" type="cancel" htmlType="button" onClick={() => history.goBack()} />
                            <Button title="Preview Post" type="admin" htmlType="submit" />
                        </div>

                    </Form>
                )}

                {showPreview && (
                    <>
                        <div className="dash-news-preview-container">
                            <NewsPost post={postPreviewData} />
                        </div>

                        <br />
                        <br />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button title="Edit" type="cancel" htmlType="button" onClick={() => setShowPreview(false)} />
                            <Button title={isEditing ? 'Edit post' : 'Submit post'} type="admin" htmlType="button" onClick={handleSubmit} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};


// const mapStateToProps = state => ({
//     user: state.user.user,
//     newsById: state.news.newsById,
// });

const mapStateToProps = state => {
    return {
        user: state.user.user,
        newsById: state.news.newsById,
        newsTags: state.news.newsTags,
    };
};

const mapDispatchToProps = dispatch => ({
    createNewsPost: data => dispatch(createNewsPost(data)),
    getNewsPostById: id => dispatch(getNewsPostById(id)),
    updateNewsPostById: (data, id) => dispatch(updateNewsPostById(data, id)),
    getNewsTags: () => dispatch(getNewsTags()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashNewsCreate2));

DashNewsCreate2.propTypes = {
    user: PropTypes.object,
    history: PropTypes.object,
    createNewsPost: PropTypes.func,
    match: PropTypes.object,
    newsById: PropTypes.object,
    updateNewsPostById: PropTypes.func,
    getNewsPostById: PropTypes.func,
    getNewsTags: PropTypes.func,
    newsTags: PropTypes.array,
};
