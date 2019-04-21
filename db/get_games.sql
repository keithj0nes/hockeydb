SELECT 
g.id,
g.start_date, 
g.has_been_played,
g.home_score,
g.away_score,

locations.name AS location_name, 
locations.id AS location_id,
h.name AS home_team, 
a.name AS away_team 
FROM games g
JOIN teams h ON h.id = g.home_team
JOIN teams a ON a.id = g.away_team
JOIN locations ON locations.id = g.location_id







