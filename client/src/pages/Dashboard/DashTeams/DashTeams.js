import React, { Component } from 'react';

class DashTeams extends Component {

    render() {
        return (
            <div>
                <h1>Add a team</h1>

                <select name="" id="">
                    <option hidden>Division</option>
                    <option value="A">Div A</option>
                    <option value="B">Div B</option>
                    <option value="C">Div C</option>

                </select>
                <br />
                <input type="text" placeholder={'team name'} />
                <input type="text" placeholder={'team colors'} />

                <div style={{ marginBottom: '100px' }}></div>

            </div>
        )
    }
}

export default DashTeams;
