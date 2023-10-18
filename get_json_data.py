import pandas as pd
from nba_api.stats.endpoints import shotchartdetail

def get_player_id(player_name):
    from nba_api.stats.static import players
    player_dict = players.get_players()
    for player in player_dict:
        if player['full_name'] == player_name:
            return player['id']
    return None

def get_team_id(team_name):
    from nba_api.stats.static import teams
    team_dict = teams.get_teams()
    for team in team_dict:
        if team['full_name'] == team_name:
            return team['id']
    return None

def get_shooting_data(player_name, team_name, opponent_team_abbreviation=None):
    player_id = get_player_id(player_name)
    team_id = get_team_id(team_name)
    
    if not player_id or not team_id:
        print("Error: Player or Team not found.")
        return None

    shot_chart_df = shotchartdetail.ShotChartDetail(
        team_id=team_id,
        player_id=player_id,
        season_nullable='2022-23',
        season_type_all_star='Regular Season'
    ).get_data_frames()[0]
    
    if opponent_team_abbreviation:
        shot_chart_df = shot_chart_df[(shot_chart_df['HTM'] == opponent_team_abbreviation) | 
                                      (shot_chart_df['VTM'] == opponent_team_abbreviation)]
    
    return shot_chart_df

if __name__ == "__main__":
    player_name = "LeBron James"
    team_name = "Los Angeles Lakers"
    OPPONENT_TEAM_ABBREVIATION = 'ATL'  # Atlanta Hawks
    
    shots = get_shooting_data(player_name, team_name, OPPONENT_TEAM_ABBREVIATION)
    if shots is not None:
        shots.to_json('shots_data.json', orient='records')
