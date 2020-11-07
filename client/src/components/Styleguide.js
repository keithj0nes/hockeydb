import React from 'react';
import { Button, Input, Select } from './index';

const selectData = [
    { id: 1, name: 'option 1' },
    { id: 2, name: 'option 2' },
    { id: 4, name: 'option 3' },
    { id: 6, name: 'option 4' },
];

// export const Select = ({name, defaultValue, hiddenValue, listOfSelects, onChange}) => {

export const Styleguide = () => (
    <div style={{ padding: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

        <div style={{ width: 500, padding: 20, background: 'white', textAlign: 'center' }}>
            <h1>Style Guide</h1>
            <br />
            <br />

            <h3>Select</h3>
            <Select name="demo" hiddenValue="Select Season" listOfSelects={selectData} onChange={(e) => console.log(e.target.value, 'changed!')} />
            <Select name="demo" title="Demo" hiddenValue="Select Season" listOfSelects={selectData} onChange={(e) => console.log(e.target.value, 'changed!')} />

            <br />

            <h3>Input</h3>
            <Input name="name" label="Name" />
            <br />
            <Input name="password" label="Password" type="password" />
            <br />
            <Input name="disabled" label="Disabled" disabled />

            <br />

            <h3>Button</h3>
            <Button title="Normal" />
            <br />
            <Button title="Normal Hovered" opa />
            <br />
            <Button title="Danger" type="danger" />
            <br />
            <Button title="Danger Hovered" type="danger" opa />
            <br />
            <Button title="Disabled" type="disabled" />
            <br />
            <Button title="Cancel" type="cancel" />
            <br />
            <br />
            <br />
            <br />
        </div>
    </div>

);
