import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { wait } from 'helpers';
import { EditOutlined, CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import DashPaymentDrawer from './DashPaymentDrawer';


const defaultSections = {
    amounts: {
        label: 'Payment Types',
        fields: {
            player: {
                label: 'Player',
                amount: '100.00',
            },
            part_time: {
                label: 'Part Time',
                amount: '60.00',
            },
            goalie: {
                label: 'Goalie',
                amount: '50.00',
            },
        },
    },
    frequency: {
        label: 'Payment Frequency',
        fields: {
            full: {
                label: 'Pay in full',
                number_of_payments: 1,
            },
            monthly: {
                label: 'Monthly',
                number_of_payments: 6,
            },
            half: {
                label: 'Half',
                number_of_payments: 2,
                // add payment date column?
            },
        },
    },
    discounts: {
        label: 'Discount Codes',
        fields: {
            half_off: {
                label: 'Half Off',
                amount_off: '50%',
                limit: 4,
            },
            late2020: {
                label: 'Late2020',
                amount_off: '$20',
                limit: 10,
            },
        },
    },
};

function currency(number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(number);
}

function mapObj(obj) {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
}

const DashRegistrationPayments = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState('');
    const [mySections, setMySections] = useState(defaultSections);

    // const suffixSelector = (
    //     <Form.Item name="suffix" noStyle>
    //         <Select style={{ width: 70 }}>
    //             <Select.Option value="dollar">$</Select.Option>
    //             <Select.Option value="percent">%</Select.Option>
    //         </Select>
    //     </Form.Item>
    // );

    const handleSubmit = (values, type) => {
        // console.log(values, type, 'type values')

        const item = { ...mySections, [type]: { ...mySections[type], fields: { ...mySections[type].fields, [values.key]: values } } };
        // console.log(item, 'item');
        setMySections(item);
    };

    const handleDelete = ({ section, field }) => {
        // console.log(section, field, 'section key delte')
        const newObj = { ...mySections };
        delete newObj[section].fields[field];
        setMySections(newObj);
    };

    return (
        <div className="m-t-xs">

            <div className="p-t-m">
                {mapObj(mySections).map(section => {
                    // console.log(section.value, section.key, 'mysectionsss')

                    return (
                        <div className="p-t-m" key={section.key}>
                            <div className="f">
                                <h2>{section.value.label}</h2>
                                {/* <Button className="m-l-m" type="primary" onClick={() => { setDrawerOpen(!drawerOpen); setDrawerType(section.key); }}>Add Discount Code</Button> */}
                                <Button className="m-l-m" type="primary" onClick={() => { setDrawerOpen(!drawerOpen); setDrawerType(section.key); }}>
                                    Add {section.value.label.substring(section.value.label.length - 1, section.value.label.length) === 's' ? section.value.label.slice(0, -1) : section.value.label}
                                </Button>
                            </div>
                            {!Object.keys(section.value.fields).length ? (
                                <p>Add a field for this section</p>
                            ) : mapObj(section.value.fields).map(item => {
                                // console.log(item, 'item')

                                switch (section.key) {
                                case 'amounts':
                                    return (
                                        <div className="p-t-xs f-align-center" key={item.key}>
                                            <p>{item.value.label} - {currency(item.value.amount)}</p>
                                            <Popconfirm placement="top" className="m-l-m" onConfirm={() => handleDelete({ field: item.key, section: section.key })} title="Are you sure you want to delete this field?" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                                                <CloseOutlined />
                                            </Popconfirm>
                                            <EditOutlined
                                                onClick={() => {
                                                    console.log('ok')
                                                    // setSectionOpen({ section: section.key, field: item.value });
                                                    // setAddFieldDrawerVisible(!addFieldDrawerVisible);
                                                }}
                                            />
                                        </div>
                                    );
                                case 'frequency':
                                    return (
                                        <div className="p-t-xs f-align-center" key={item.key}>
                                            <p>{item.value.label} - amount / {item.value.number_of_payments} payments</p>
                                            <Popconfirm placement="top" className="m-l-m" onConfirm={() => handleDelete({ field: item.key, section: section.key })} title="Are you sure you want to delete this field?" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                                                <CloseOutlined />
                                            </Popconfirm>
                                            <EditOutlined
                                                onClick={() => {
                                                    console.log('ok')
                                                    // setSectionOpen({ section: section.key, field: item.value });
                                                    // setAddFieldDrawerVisible(!addFieldDrawerVisible);
                                                }}
                                            />
                                        </div>
                                    );
                                case 'discounts':
                                    return (
                                        <div className="p-t-xs f-align-center" key={item.key}>
                                            <p>{item.value.label} - {item.value.amount_off}, limited amount of {item.value.limit}</p>
                                            <Popconfirm placement="top" className="m-l-m" onConfirm={() => handleDelete({ field: item.key, section: section.key })} title="Are you sure you want to delete this field?" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                                                <CloseOutlined />
                                            </Popconfirm>
                                            <EditOutlined
                                                onClick={() => {
                                                    console.log('ok')
                                                    // setSectionOpen({ section: section.key, field: item.value });
                                                    // setAddFieldDrawerVisible(!addFieldDrawerVisible);
                                                }}
                                            />
                                        </div>
                                    );
                                default:
                                    return null;
                                }
                            })}
                        </div>
                    );
                })}
            </div>

            <DashPaymentDrawer
                visible={drawerOpen}
                onClose={async () => {
                    setDrawerOpen(!drawerOpen);
                    await wait(100);
                    setDrawerType('');
                }}
                type={drawerType}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default DashRegistrationPayments;
