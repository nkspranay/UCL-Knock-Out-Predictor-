from tournament_simulation import simulate_tournament


def run_simulations(teams, ro16_matches, simulations):

    team_results = {}
    league_results = {}
    round_results = {
        team.name : {
            "QF" : 0,
            "SF" : 0,
            "FINAL" : 0,
            "WIN" : 0
        } for team in teams
    }

    for _ in range(simulations):

        for team in teams:
            team.reset_elo()

        ro16_winners, qf_winners, sf_winners, champion = simulate_tournament(ro16_matches)

        team_results[champion.name] = team_results.get(champion.name, 0) + 1
        league_results[champion.league] = league_results.get(champion.league, 0) + 1

        for team in ro16_winners:
            round_results[team.name]["QF"]+=1
        for team in qf_winners:
            round_results[team.name]["SF"]+=1
        for team in sf_winners:
            round_results[team.name]["FINAL"]+=1
        round_results[champion.name]["WIN"]+=1

    for team_name in team_results:
        team_results[team_name] /= simulations

    for league_name in league_results:
        league_results[league_name] /= simulations
    
    for team in round_results:
        for stage in round_results[team]:
            round_results[team][stage]/=simulations

    return team_results, league_results, round_results