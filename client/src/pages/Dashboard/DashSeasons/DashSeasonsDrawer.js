import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';
import dateFormat from 'date-fns/format';
import { Form, Input, Select, Switch, Drawer, Button } from 'antd';
// import Form from '../../../components/Form';
import { deleteSeason } from 'redux/actions/seasons';
import DashDeleteDrawer from '../../../components/DashDeleteDrawer';


const seasonTypes = [
    { label: 'View All', value: '' },
    { label: 'Regular', value: 'Regular' },
    { label: 'Playoffs', value: 'Playoffs' },
    { label: 'Tournament', value: 'Tournament' },
];

const DashSeasonsDrawer = ({ selected, user, deleteSeason, onClose, visible }) => {
    // const [isEditing, setIsEditing] = useState(false);
    const [deleteDrawerVisible, setDeleteDrawerVisible] = useState(false);
    const [hideDrawerVisible, setHideDrawerVisible] = useState(false);

    useEffect(() => {
        // useeffect fires on selected variable changing to update form fields
    }, [selected]);

    if (!selected) return null;

    // const formFields = [
    //     {
    //         fields: {
    //             name: {
    //                 label: 'Name',
    //                 type: 'text',
    //                 // width: 150,
    //                 // ratio: 1,
    //                 required: true,
    //                 placeholder: 'Enter Price',
    //             },
    //         },
    //     },
    //     {
    //         fields: {
    //             type: {
    //                 label: 'Type',
    //                 type: 'text',
    //                 // width: 150,
    //                 // ratio: 1,
    //                 required: false,
    //                 placeholder: 'Enter Transactions Count',
    //             },
    //         },
    //     },
    // ];


    return (
        <Drawer
            width="360px"
            placement="right"
            maskClosable // ={true} // set to false if has been edited
            // onClick={() => setQuickMenuVisible(false)}
            onClose={onClose}
            visible={visible}
        >
            <div className="f-column p-h-s p-v-s" style={{ height: '100%', background: 'beige' }}>
                <div className="f-1">

                    <h2>Season</h2>
                    {/* <p style={{textDecoration: 'underline'}} onClick={() => setIsEditing(true)}>edit</p> */}


                    {/* <Form
                        fields={formFields}
                        onSubmit={val => console.log(val, 'val from form!')}
                    /> */}

                    <Form
                        layout="vertical"
                        // initialValues={Object.assign({}, ...data.fields.map(item => ({ [item.name]: item.defaultValue })))}
                        initialValues={{ name: selected.name, type: selected.type, is_active: selected.is_active }}
                        // initialValues={{name: selected.name, type: selected.type, is_active: true}}

                    >
                        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
                            <Input placeholder="Enter Season Name" disabled={false} />
                        </Form.Item>

                        <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Type is required' }]}>
                            <Select>
                                {seasonTypes.map(item => <Select.Option key={item.label} value={item.value}>{item.label}</Select.Option>)}
                            </Select>
                        </Form.Item>

                        {/* <Form.Item name={field.name} valuePropName="checked">
                            <Checkbox>{field.title}</Checkbox>
                        </Form.Item> */}

                        {/* <Form.Item label={selected.is_active ? 'Active Season' : 'Set To Active Season'} name="is_active" valuePropName="checked">
                            <Switch /> <span>hahaha</span>
                        </Form.Item> */}

                        <Form.Item label={selected.is_active ? 'Active Season' : 'Set To Active Season'}>
                            <Form.Item name="is_active" valuePropName="checked" noStyle><Switch checkedChildren="Yes" unCheckedChildren="No" disabled={selected.is_active} /></Form.Item>
                            {selected.is_active && <span> <LockOutlined style={{ fontSize: 20 }} className="p-l-xs p-r-xs" />Activate another season to deactivate this season</span>}
                        </Form.Item>

                        {/* <Form.Item label={selected.is_active ? 'Active Season' : 'Set To Active Season'}>
                            <Form.Item name="is_active" valuePropName="checked" noStyle><Switch checkedChildren="Yes" unCheckedChildren="No" disabled={selected.is_active} /></Form.Item>
                            {selected.is_active && (
                                <>
                                    <LockOutlined style={{ fontSize: 20 }} className="p-l-s p-r-xs" />
                                    <p>Activate another season to deactivate this season</p>
                                </>
                            )}
                        </Form.Item> */}
                    </Form>


                    {/* <ul className="p-t-m">
                        <li>Name: {selected?.name}</li>
                        <li>Type: {selected?.type}</li>
                        <li>Active: {selected?.is_active ? 'Yes' : 'No'}</li>
                        <li>Registration: CLOSED *update later</li>
                    </ul> */}
                    {/* <button type="button" className="btn m-t-m">Registration Details</button> */}

                    <Link className="btn d-inline-block m-t-m" to={`/dashboard/seasons/${selected.id}/registration`}> Registration Details </Link>
                    {/* <Button title="Hide P÷ermissions" onClick={() => setState({ isPermissionsVisible: !state.isPermissionsVisible })} /> */}

                    <p className="p-t-xxl">Created by
                        {selected.created_by === user.id ? (
                            <strong> you </strong>
                        ) : (
                            <> {selected.created_by_first_name} {selected.created_by_last_name} </>
                        )}
                        on {dateFormat(selected.created_at, 'MM/DD/YYYY')}
                    </p>

                    {selected.updated_by && (
                        <p>Updated by
                            {selected.updated_by === user.id ? (
                                <strong> you </strong>
                            ) : (
                                <> {selected.updated_by_first_name} {selected.updated_by_last_name} </>
                            )}
                            on {dateFormat(selected.updated_at, 'MM/DD/YYYY')}
                        </p>
                    )}

                </div>

                {!selected.is_active ? (
                    <div className="f-justify-between">
                        <Button type="text" danger onClick={() => setDeleteDrawerVisible(!deleteDrawerVisible)}>Delete</Button>
                        <Button type="text" onClick={() => setHideDrawerVisible(!hideDrawerVisible)}>Hide</Button>
                    </div>
                ) : (
                    <p>Cannot delete currently active season</p>
                )}

                <DashDeleteDrawer
                    stringToDelete={selected.name}
                    visible={deleteDrawerVisible}
                    // onDelete={() => deleteSeason({ id: selected.id })}
                    // onDelete={onClose}
                    onDelete={() => {
                        // get resposne from delete then fire onClose
                        setDeleteDrawerVisible(!deleteDrawerVisible);
                        onClose();
                    }}

                    onClose={() => setDeleteDrawerVisible(!deleteDrawerVisible)}
                />

                <DashDeleteDrawer
                    hide
                    visible={hideDrawerVisible}
                    onClose={() => setHideDrawerVisible(!hideDrawerVisible)}
                />

            </div>
        </Drawer>

    );
};

const mapStateToProps = state => ({ user: state.user.user });
const mapDispatchToProps = dispatch => ({
    deleteSeason: id => dispatch(deleteSeason(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashSeasonsDrawer);


DashSeasonsDrawer.propTypes = {
    selected: PropTypes.object,
    user: PropTypes.object,
    deleteSeason: PropTypes.func,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
};


// <Drawer
//   className="my-drawer"
//   ...
// .my-drawer.ant-drawer-open {
//   // width: 100% !important; // mask: false
//   > .ant-drawer-content-wrapper {
//     width: 30% !important;
//   }
// }

// @media (max-width: 767.98px) {
//   .my-drawer.ant-drawer-open {
//     > .ant-drawer-content-wrapper {
//       width: 100% !important;
//     }
//   }
// } */}
