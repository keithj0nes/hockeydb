import React from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Button, Drawer } from 'antd';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { guid } from '../../../../helpers';


const formModels = {
    discounts: [
        {
            label: 'Code',
            name: 'label',
            type: 'text',
        },
        {
            label: 'Amount Off',
            name: 'amount_off',
            type: 'number',
            addonAfter: 'suffixSelector',
        },
        {
            label: 'Limit of Codes',
            name: 'limit',
            type: 'number',
        },
    ],
    frequency: [
        {
            label: 'Label',
            name: 'label',
            type: 'text',
        },
        {
            label: 'Number of Payments',
            name: 'number_of_payments',
            type: 'number',
        },
    ],
    amounts: [
        {
            label: 'Label',
            name: 'label',
            type: 'text',
        },
        {
            label: 'Cost of Registration',
            name: 'amount',
            type: 'number',
        },
    ],
};

function mapObj(obj) {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
}


const DashPaymentDrawer = ({ visible, onClose, editingField, editingSection, onSubmit, type }) => {
    const [form] = Form.useForm();
    return (
        <Drawer
            width={320}
            closable={false}
            onClose={onClose}
            visible={visible}
        >
            <div className="p-h-s p-v-s" style={{ height: '100%', background: 'beige' }}>
                {/* {renderForm()} */}
                <h1>hello</h1>

                <Form
                    form={form}
                    layout="vertical"
                    className="m-t-xs"
                    onFinish={(values) => {
                        values.key = `${values.label.replace(/\s+/g, '_').toLowerCase()}_${guid()}`;
                        onSubmit(values, type);
                        onClose();
                        form.resetFields();
                    }}
                    // onFinish={onSubmit}
                >

                    {type && mapObj(formModels[type]).map(({ value }) => {
                        // console.log(value, 'item!!')
                        switch (value.type) {
                        case 'text':
                        case 'number':
                        default:
                            return (
                                <Form.Item key={value.name} label={value.label} name={value.name} rules={[{ required: true, message: 'Please enter a label' }]}>
                                    <Input type={value.type} addonAfter={value.addonAfter} />
                                </Form.Item>
                            );
                        }
                    })}

                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form>

            </div>
        </Drawer>
    );
};

export default DashPaymentDrawer;
