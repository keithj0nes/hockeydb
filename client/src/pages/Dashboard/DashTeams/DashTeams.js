import React, { Component } from 'react';

class DashTeams extends Component {

    state = {
        divison_id: '',
        team_name: '',
        team_colors: '',
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    render(){
        return (
            <div>
                <h1>Add a team</h1>

                <select name="division" id="" onChange={this.handleChange}>
                    <option hidden>Division</option>
                    <option value="1">Div A</option>
                    <option value="2">Div B</option>
                    <option value="3">Div C</option>

                </select>
                
                <br/>
                <input type="text" name='team_name' onChange={this.handleChange} placeholder={'team name'}/>
                <input type="text" name='team_colors' onChange={this.handleChange} placeholder={'team colors'}/>

                <div style={{marginBottom: '100px'}}></div>
                
            </div>
        )
    }
}

export default DashTeams;
