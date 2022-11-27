import React from 'react';

const TeamsDropdown = ({ teams, seasonFilterHandler }) => {
    console.log('PROPS IN TEAMSDROPDOWN', teams);

    const seasonSelectHandler = (e) => {
        seasonFilterHandler(e.target.value);
    };


    return (
        <>
            <select onSelect={seasonSelectHandler}>
                <option>All</option>
                {teams.map(team => (
                    <option key={team.id}>{team.division_name}</option>
                ))}
            </select>
        </>
    );
};

export default TeamsDropdown;


// const [selectedYear, setYear] = useState('All');
//   const yearFilterHandler = (selectedYear) => {
//     setYear(selectedYear);
//     console.log('In Expenses year: ', selectedYear);
//   }