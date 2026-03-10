import numpy as np
from match_engine.expected_goals import expected_goals
from match_engine.update_elo import update_elo

HOME_ADVANTAGE = 50

def simulate_match(teamA, teamB):
    elo_A = teamA.elo+HOME_ADVANTAGE
    elo_B = teamB.elo

    lambda_A, lambda_B = expected_goals(elo_A, elo_B)

    goals_A = np.random.poisson(lambda_A)
    goals_B = np.random.poisson(lambda_B)

    #update_elo(teamA, teamB, goals_A, goals_B)

    return goals_A, goals_B



    
