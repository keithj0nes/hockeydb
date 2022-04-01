import React, { useState, useEffect } from 'react';
// import { Form, Input } from 'antd';
import { CustomPicker } from 'react-color';
import tinycolor from 'tinycolor2';
import { Button } from '.';

const { Saturation, EditableInput, Hue } = require('react-color/lib/components/common');

// on component mount, i want to take the hex value and convert to hex, hsl, hsv to set state

const CustomColorComponent = (props) => {
    console.log(props,' PROPS!!!!!')
    const [color, setColor] = useState({
        hex: props.defaultValue.hex || '#22194d',
        hsl: {
            a: 1,
            h: 249.99999999999994,
            s: 0.6666666666666667,
            l: 0.30000000000000004,
        },
        hsv: {
            a: 1,
            h: 249.99999999999994,
            s: 0.6666666666666667,
            v: 0.30000000000000004,
        },
        name: props.defaultValue.name || '',
    });

    useEffect(()=> {
        console.log(props.defaultValue, 'ayoooo')

        const { hex: hexs, id } = props.defaultValue;

        const hex = tinycolor(hexs);

        setColor({
            ...color,
            hex: `#${hex.toHex()}`,
            hsv: hex.toHsv(),
            hsl: hex.toHsl(),
            id,
        });
    }, [props.defaultValue, color])

    const CustomPointer = () => <div className="pointer" />;

    const handleSaturationChange = hsv => {
        const hex = tinycolor(hsv);
        setColor({ ...color, hsv, hex: `#${hex.toHex()}` });
    };


    const handleHueChange = hue => {
        // console.log(hue, 'hue')
        const hex = tinycolor(hue);
        setColor({ ...color, hsl: hue, hex: `#${hex.toHex()}` });
    };

    const handleHexChange = hexs => {
        console.log({hexs})
        const hex = tinycolor(hexs);
        // console.log(hex.toHex(), 'to hexxxxx')
        setColor({
            ...color,
            hex: `#${hex.toHex()}`,
            hsv: hex.toHsv(),
            hsl: hex.toHsl(),
        });
    };


    const handleSubmit = () => {
        const { hex, name, id } = color;

        if (!name) return alert('color name required')

        props.onSubmit({color: hex, name, id});
        props.onClose()
        return true;
        // handle submit should pass the hext color up state to the parent compnent
    };

    // const onFinish = val => {
    //     console.log(val, 'VAAALLLL')
    // }

    return (
        <div style={{display: 'flex', zIndex: '1000', top: '0px', bottom: '0px', right: '0px', left: '0px', background: 'rgba(0, 0, 0, 0.5)', position: 'fixed', alignItems: 'center', justifyContent: 'center' }}>
            <div
                style={{
                    position: 'absolute',
                    zIndex: '1000',
                    top: '0px',
                    bottom: '0px',
                    right: '0px',
                    left: '0px',
                }}
                onClick={() => props.onClose(false)}
            />
            <div className="color-picker-container">
                {/* <Form
                    layout="vertical"
                    style={inlineStyles.container}
                    onFinish={onFinish}
                > */}
                {props.title && <h4>{props.title}</h4>}
                <div className="saturation">
                    <Saturation
                        hsl={color.hsl}
                        hsv={color.hsv}
                        pointer={CustomPointer}
                        onChange={handleSaturationChange}
                    />
                </div>
                <div style={{ minHeight: 10, position: 'relative', margin: 2 }}>
                    <Hue
                        hsl={color.hsl}
                        pointer={() => <div className="slider" />}
                        onChange={handleHueChange}
                        direction="horizontal"
                    />
                </div>

                {/* list of colors */}

                <div style={{ display: 'flex', alignItems: 'center', margin: '2px 0' }}>
                    <span style={{ color: 'gray', fontSize: 13, marginRight: 3, marginTop: 2, marginLeft: 3 }}>Hex</span>
                    {/* <Form.Item>
                        <Form.Item
                            name="culur"
                            initialValue={color.hex}
                            noStyle
                            // rules={[{ required: true, message: 'Body is required' }]}
                        > */}
                    <EditableInput
                        value={color.hex}
                        onChange={handleHexChange}
                    />
                    {/* </Form.Item>
                </Form.Item> */}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', margin: '2px 0' }}>
                    <span style={{ color: 'gray', fontSize: 13, marginRight: 3, marginTop: 2, marginLeft: 3 }}>Name</span>
                    {/* <EditableInput
                        style={inputStyles}
                        value={''}
                        onChange={props.onChange}
                    /> */}

                    <input type="text" value={color.name} onChange={e => setColor({ ...color, name: e.target.value })} />
                    {/* <Form.Item label="colur nam" style={inputStyles} name="color_name" rules={[{ required: true }]}>
                        <Input placeholder="Color name" />
                    </Form.Item> */}

                </div>

                {/* <Button htmlType="submit" title="Submit" type="admin" /> */}
                <div style={{ height: 100, width: '100%', background: color.hex }} />
                <Button onClick={handleSubmit} title="Submit" type="admin" />



            </div>
        </div>
    );
};

// {/* </Form> */}

export const ColorPicker = CustomPicker(CustomColorComponent);
