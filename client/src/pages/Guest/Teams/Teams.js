import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTeamsPageFilters, getTeamsByDivision } from '../../../redux/actions/teamsActions';
import { Select } from '../../../components/';
import { getQuery, setQuery } from '../../../helpers';
import './teams.scss';

const Teams = (props) => {

    const [ filters, setFilters ] = useState({});

    // console.log(props.scheduleFilters, 'SCHEDULE FILTERS')

    useEffect(() => {

        if(props.location.search.length > 0) {
            const [ filters, filterString ] = getQuery();
            // get the teams list here by passing in the filterString
            setFilters(filters)
            props.getTeamsPageFilters(filterString)
            props.getTeamsByDivision(filterString)

        } else {
            // if theres no seasons or allTeams, get the filters
            // const { seasons, allTeams } = props.scheduleFilters;
            // if(seasons.length <= 0 && allTeams.length <= 0) {
                props.getTeamsPageFilters()
                props.getTeamsByDivision()

            // }
        }
        
    }, [])

    const handleChange = e => {
        const _filters = { ...filters };
        const { name, value } = e.target; 

        // console.log({[name]: value})

        // if name === team, history push the team id
        // if name === season, getteamspagefilters with season_id
        if(name === 'team') {
            props.history.push(`/teams/${value}`)
        }

        if(name === 'season') {

            // if(props.currentSeasonId === Number(value)) {
            //     delete _filters['season'];
            // } else {
                _filters[name] = value;
            // }
            const search = setQuery(_filters)
            props.getTeamsPageFilters(search)
            props.getTeamsByDivision(search)
            setFilters({..._filters}); 
        }
    }

    return (
        <div className="schedule-container">
            <div className="white-bg" style={{paddingBottom:40}}>
                <h1>Teams</h1>

                <div className="schedule-filters"> 
                    <Select name='season'   title="Season"   listOfSelects={props.scheduleFilters.seasons}                                     onChange={handleChange}  defaultValue={filters.season || ''}   useKey="id" />
                    <Select name='team'     title="Team"     listOfSelects={[{name: 'All', value: ''}, ...props.scheduleFilters.allTeams]}     onChange={handleChange}  defaultValue={filters.allTeams || ''} useKey="id" />
                    {/* <a>Clear Filters</a> */}
                    <div></div>
                    <div></div>
                </div>

                <div className="teams-container">

                    {/* {ListOfTeams.map(t => {
                        return (
                            <div key={t.divName} className="division-container">

                                <h2>{t.divName}</h2>

                                {t.teams.map(team => {
                                    return (
                                        <p key={team.id} style={{background: 'yellow', padding: '2px 10px 2px 0', marginTop: 10}}>{team.name}</p>
                                    )
                                })}
                            </div>
                        )
                    })} */}

                    {props.teamsByDivision.map(t => {
                        return (
                            <div key={t.division_name} className="division-container">
                                <h2>{t.division_name}</h2>

                                {t.teams_in_division.map(team => {
                                    return (
                                        <p key={team.id}>
                                        
                                            <Link to={`teams/${team.id}`}    >{team.name}</Link>
                                        </p>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}

const mapStateToProps = state => {
    return {
        scheduleFilters: state.misc.scheduleFilters,
        currentSeasonId: state.seasons.currentSeason && state.seasons.currentSeason.id,
        teamsByDivision: state.teams.teamsByDivision
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTeamsPageFilters: filter => dispatch(getTeamsPageFilters(filter)),
        getTeamsByDivision: filter => dispatch(getTeamsByDivision(filter))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Teams);




const ListOfTeams = [
    {
        divName: 'A1',
        teams: [ { id: 27, name: 'synthesize onlines'}, {id: 20, name: 'array arrays'}, {id: 26, name: 'mobile microchips' } ]
    },
    {
        divName: 'B1',
        teams: [ { id: 32, name: 'quantify matrixs'}, {id: 29, name: 'matrix matrixs'}, {id: 28, name: 'hack hacks'}, {id: 31, name: 'bluetooth generates'}, {id: 35, name: 'override protocols'} ]
    },
    {
        divName: 'C1',
        teams: [ { id: 44, name: 'hack wireless'}, {id: 40, name: 'navigate virtuals'}, {id: 41, name: 'firewall copys'}, {id: 42, name: 'calculate monitors' } ]
    }
]


// const listOfSelects = [
//     {id: 1, name: 'hi'},
//     {id: 2, name: 'hello'},
//     {id: 3, name: 'whatsup'},
//     {id: 4, name: 'nmyou?'},
// ]


// Pivot Table

// id | team_id | season_id | division_id
// --------------------------------------
// 1  |	3	 |     1     |      3	
// 2  |	4	 |     1     |      3	
// 3  |	5	 |     1     |      3	
// 4  |	6	 |     1     |      3	


// Query to list all teams 

// SELECT t.name, d.name FROM team_season_division tsd
// JOIN teams t ON t.id = tsd.team_id
// JOIN divisions d ON d.id = tsd.division_id
// WHERE tsd.season_id = 1;



// [
//     {
//         team_name: 'synthesize onlines',
//         division_name: 'A1',
//     },
//     {
//         team_name: 'array arrays',
//         division_name: 'A1',
//     },
//     {
//         team_name: 'quantify matrixs',
//         division_name: 'B1',
//     }
// ]

// How to get nested array within an array of objects using joins

// const exampleResponseNeeded = [
//     {
//         division_name: 'A1',
//         teams_in_division: [ 
//             { name: 'synthesize onlines' }, 
//             { name: 'array arrays' },
//             { name: 'mobile microchips' } 
//         ]
//     },
//     {
//         division_name: 'B1',
//         teamteams_in_divisions: [ 
//             { name: 'quantify matrixs' }, 
//             { name: 'matrix matrixs' }, 
//             { name: 'hack hacks' }, 
//             { name: 'bluetooth generates' }, 
//             { name: 'override protocols' } 
//         ]
//     }
// ]