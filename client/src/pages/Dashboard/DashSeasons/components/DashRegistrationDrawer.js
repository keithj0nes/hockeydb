import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Switch, Drawer, Select, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { guid } from '../../../../helpers';

// preselected options
const predeterminedOptions = {
    quick_select: {
        label: 'Quick Select',
        value: null,
    },
    first_name_0001: {
        label: 'First Name',
        name: 'first_name_0001',
        required: true,
        type: 'text',
    },
    last_name_0002: {
        label: 'Last Name',
        name: 'last_name_0002',
        required: true,
        type: 'text',
    },
    email_0003: {
        label: 'Email',
        name: 'email_0003',
        required: true,
        type: 'text',
    },
    birthdate_0004: {
        label: 'Birth Date',
        name: 'birthdate_0004',
        required: true,
        type: 'text',
    },
    phone_0005: {
        label: 'Phone #',
        name: 'phone_0005',
        required: true,
        type: 'text',
    },
};

const DashRegistrationDrawer = ({ visible, onClose, editingField, editingSection, onSubmit, type = 'field' }) => {
    const renderForm = () => {
        // console.log(type, 'type')
        // console.log(editingSection, 'editingSection LAMO')
        // console.log(editingField, 'editingFieldeditingField')
        switch (type) {
        case 'section':
            return <AddSection onSubmit={onSubmit} onClose={onClose} editingSection={editingSection} visible={visible} />;
        case 'field':
        default:
            return <AddField onSubmit={onSubmit} onClose={onClose} editingField={editingField} visible={visible} />;
        }
    };


    return (
        <Drawer
            width={320}
            closable={false}
            onClose={onClose}
            visible={visible}
        >
            <div className="p-h-s p-v-s" style={{ height: '100%', background: 'beige' }}>
                {renderForm()}
            </div>
        </Drawer>
    );
};

export default DashRegistrationDrawer;

DashRegistrationDrawer.propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
};


const AddField = ({ onSubmit, onClose, editingField, visible }) => {
    const [form] = Form.useForm();
    const [showOptions, setShowOptions] = useState(false);
    const [selectValue, setSelectValue] = useState(null);

    useEffect(() => {
        if (!visible) {
            form.resetFields();
            setSelectValue(null);
        }
    }, [visible]);

    useEffect(() => {
        if (!!editingField) {
            // console.log(editingField, 'editingField')
            form.setFieldsValue(editingField);
        } else {
            form.resetFields();
        }
    }, [editingField, form]);

    const handleInputType = (type) => {
        if (type === 'select') {
            setShowOptions(true);
        } else {
            setShowOptions(false);
        }
    };

    const handleQuickSelect = val => {
        if (val === 'quick_select') {
            setSelectValue(null);
            return form.resetFields();
        }

        setSelectValue(val);
        return form.setFieldsValue(predeterminedOptions[val]);
    };

    // console.log(selectValue, 'selectvalue')

    return (
        <>
            <div className="f-justify-between">
                <p>Add field</p>

                {!editingField && (
                    <Select placeholder="Quick Select" style={{width: '50%'}} value={selectValue} onChange={handleQuickSelect}>
                        {Object.keys(predeterminedOptions).map(item => {
                            return <Select.Option key={item} value={predeterminedOptions[item].name}>{predeterminedOptions[item].label}</Select.Option>
                        })}
                    </Select>
                )}

            </div>
            <Form
                form={form}
                layout="vertical"
                className="m-t-xl"
                onFinish={(values) => {
                    values.name = `${values.label.replace(/\s+/g, '_').toLowerCase()}_${guid()}`;

                    if (values.options) {
                        values.options = values.options.map(item => {
                            // console.log({ label: item, name: `${item.replace(/\s+/g, '_').toLowerCase()}_${guid()}` }, 'lmao')
                            return { label: item, value: `${item.replace(/\s+/g, '_').toLowerCase()}_${guid()}` };
                        });
                    }
                    onClose();
                    onSubmit(values);
                    setShowOptions(false);
                    form.resetFields();
                }}
                initialValues={{ options: [''], required: true }}
            >

                <Form.Item label="Label" name="label" rules={[{ required: true, message: 'Please enter a label' }]}>
                    <Input type="text" />
                </Form.Item>

                <div className="f-justify-between">

                    <Form.Item
                        name="type"
                        label="Field Type"
                        rules={[{ required: true, message: 'Please enter a field type' }]}
                        style={{ width: '100%' }}
                        className="p-r-s"
                    >
                        <Select placeholder="Select One" onChange={handleInputType}>
                            <Select.Option value="text">Text</Select.Option>
                            <Select.Option value="select">Select</Select.Option>
                            <Select.Option value="description">Description</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Required" name="required" valuePropName="checked">
                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                </div>

                {showOptions && (
                    <div className="select-options-formlist">
                        <Form.List
                            name="options"
                            rules={[{
                                validator: async (_, options) => {
                                    if (!options || options.length < 1) {
                                        return Promise.reject(new Error('Add at least 1 option'));
                                    }
                                    return null;
                                },
                            }]}
                        >
                            {(fields, { add, remove }, { errors }) => (
                                <>
                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    // {console.log(key, name, fieldKey, 'fields')}
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item
                                                // noStyle
                                                {...restField}
                                                fieldKey={fieldKey}
                                                name={name}
                                                // rules={[{ required: true, message: 'Missing last name' }]}
                                                validateTrigger={['onChange', 'onBlur']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message: `Please add option ${name !== 0 ? 'or delete this field.' : ''}`,
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Dropdown Item" />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} style={fields.length <= 1 ? { visibility: 'hidden' } : null} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add field
                                        </Button>
                                    </Form.Item>
                                    <Form.ErrorList errors={errors} />
                                </>
                            )}
                        </Form.List>
                    </div>
                )}

                <Button type="primary" htmlType="submit">Submit</Button>
            </Form>
        </>
    );
};

const AddSection = ({ onSubmit, onClose, editingSection }) => {
// const AddSection = (props) => {
    const [form] = Form.useForm();

    // console.log(props, 'propssss')

    // const { onSubmit, onClose, editingSection } = props;

    useEffect(() => {
        // console.log(editingSection, 'editingSectioneditingSectioneditingSectioneditingSection')
        if (!!editingSection) {
            form.setFieldsValue(editingSection);
        } else {
            form.resetFields();
        }
    }, [editingSection, form])

    const _onSubmit = (values) => {
        console.log({ ...values, fields: [] }, 'section');
        onSubmit({ ...values, fields: editingSection?.fields || [] }, 'section');
        onClose();
        form.resetFields();
    };

    return (
        <>
            <h3>Add Section</h3>
            <Form
                form={form}
                layout="vertical"
                className="m-t-s"
                onFinish={values => {
                    // console.log(values);
                    _onSubmit(values);
                }}
            >

                <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a title' }]}>
                    <Input type="text" />
                </Form.Item>

                <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter a description' }]}>
                    <Input type="text" />
                </Form.Item>

                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form>
        </>
    );
};
