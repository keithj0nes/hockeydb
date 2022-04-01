import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Drawer, Button } from 'antd';

const DashDeleteDrawer = ({ stringToDelete, visible, onClose, onDelete, hide }) => {
    const [canBeDeleted, setCanBeDeleted] = useState(false);

    return (
        <Drawer
            width={320}
            closable={false}
            onClose={onClose}
            visible={visible}
        >
            {hide ? (
                <div className="p-h-s p-v-s" style={{height: '100%', background: 'beige'}}>
                    <h3 className="p-b-s">Are you sure you want to hide this season?</h3>
                    <p className="p-b-s">This will hide the season from both the admin dashboard and from the public page. You can view all hidden seasons using the filter. This does NOT delete the season</p>

                    <div className="f-justify-between">
                        <Button type="text" onClick={() => onClose(!visible)}>Cancel</Button>
                        <Button type="primary">Hide Season</Button>
                    </div>
                </div>
            ) : (
                <div className="p-h-s p-v-s" style={{height: '100%', background: 'beige'}}>
                    <h3 className="p-b-s">Are you sure you want to delete this season?</h3>
                    <p className="p-b-s">This cannot be undone and you will lose any information saved within this season.</p>
                    <p className="p-b-xl">Please type in the name of the season below to delete.</p>

                    {/* <Form.Item label={stringToDelete}> */}
                    {/* <Input placeholder="Enter Season Name" onChange={e => e.target.value === stringToDelete ? setCanBeDeleted(!)} /> */}
                    <p className="p-b-xxs"><em>{stringToDelete}</em></p>
                    <Input className="m-b-m" placeholder="Enter Season Name" onChange={e => setCanBeDeleted(e.target.value === stringToDelete)} />
                    {/* </Form.Item> */}

                    <div className="f-justify-between">
                        <Button type="text" onClick={() => onClose(!visible)}>Cancel</Button>
                        <Button type="primary" disabled={!canBeDeleted} onClick={onDelete}>Delete Season</Button>
                    </div>
                </div>
            )}

        </Drawer>
    );
};

export default DashDeleteDrawer;

DashDeleteDrawer.propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
    stringToDelete: PropTypes.string,
};
