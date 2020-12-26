import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStandingsPageFilters, getStandings } from '../../../redux/actions/teams';
import { Select } from '../../../components';
import { getQuery, setQuery } from '../../../helpers';
import GuestTable from '../../../components/GuestTable';

// clean this file up

const Standings = ({ location, getStandingsPageFilters, getStandings, currentSeasonId, standings, standingsFilters }) => {
    const [filters, setFilters] = useState({});

    useEffect(() => {
        if (location.search.length > 0) {
            const [filterss, filterStringg] = getQuery();
            // get the standings list here by passing in the filterString
            setFilters(filterss);
            getStandingsPageFilters(filterStringg);
            getStandings(filterStringg);
        } else {
            getStandings().then(res => setFilters(filters => ({ ...filters, season: res })));
            getStandingsPageFilters();
        }
    }, [location, getStandings, getStandingsPageFilters]);


    const handleChange = e => {
        const _filters = { ...filters };
        const { name, value } = e.target;

        _filters[name] = value;

        if (name === 'season' || !value) {
            delete _filters.division;
        }
        if (currentSeasonId === Number(value)) {
            delete _filters.season;
        }

        const search = setQuery(_filters);
        getStandingsPageFilters(search);
        getStandings(search);
        setFilters({ ..._filters });
    };

    const season = Number(filters.season) !== currentSeasonId && `?season=${filters.season}`;
    return (
        <>
            <div className="schedule-container" style={{ paddingBottom: 0 }}>
                <div className="white-bg" style={{ paddingBottom: 40 }}>
                    <h1>Standings</h1>

                    <div className="schedule-filters">
                        <Select name="season" title="Season" listOfSelects={standingsFilters.seasons} onChange={handleChange} defaultValue={filters.season || ''} useKey="id" />
                        <Select name="division" title="Division" listOfSelects={[{ name: 'All', value: '' }, ...standingsFilters.divisions]} onChange={handleChange} defaultValue={filters.division || ''} useKey="id" />
                        {/* <a>Clear Filters</a> */}
                        <div />
                        <div />
                    </div>

                </div>

            </div>

            {
                standings.length <= 0 ? (
                    <p>No standings under this season</p>
                ) : (
                    standings.map(t => (
                        // <div key={t.division_name} className="division-container">
                        <div key={t.division_name} style={{ background: 'white', margin: '0 10px' }}>
                            <h2 style={{ paddingLeft: 20 }}>{t.division_name}</h2>

                            <GuestTable
                                data={t.teams_in_division}
                                minWidth={800}
                                sections={{
                                    rank: 'one',
                                    name: { as: 'name', flex: 'four', link: { to: '/teams', key: 'id', search: season } },
                                    games_played: { as: 'gp', flex: 'one' },
                                    wins: { as: 'w', flex: 'one' },
                                    losses: { as: 'l', flex: 'one' },
                                    points: { as: 'pts', flex: 'one' },
                                    goals_for: { as: 'gf', flex: 'one' },
                                    goals_against: { as: 'ga', flex: 'one' },
                                    penalties_in_minutes: { as: 'PIMs', flex: 'one' },
                                }}
                                emptyTableText="No recent games have been played"
                            />
                        </div>
                    ))
                )
            }
        </>
    );
};


const mapStateToProps = state => ({
    standingsFilters: state.misc.standingsFilters,
    currentSeasonId: state.seasons.currentSeason && state.seasons.currentSeason.id,
    standings: state.standings.standings,
});

const mapDispatchToProps = dispatch => ({
    getStandingsPageFilters: filter => dispatch(getStandingsPageFilters(filter)),
    getStandings: filter => dispatch(getStandings(filter)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Standings);

Standings.propTypes = {
    location: PropTypes.object,
    standings: PropTypes.array,
    getStandingsPageFilters: PropTypes.func,
    getStandings: PropTypes.func,
    currentSeasonId: PropTypes.number,
    standingsFilters: PropTypes.object,
};
