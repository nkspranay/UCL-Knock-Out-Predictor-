import numpy as np

from match_engine.expected_goals import expected_goals
from knockout.extra_time_finals import extra_time_finals

def simulate_finals(teamA, teamB):
    elo_A = teamA.elo
    elo_B = teamB.elo
    lambda_A, lambda_B = expected_goals(elo_A, elo_B, neutral=True)
    goals_A = np.random.poisson(lambda_A)
    goals_B = np.random.poisson(lambda_B)
    if goals_A>goals_B:
        return teamA
    elif goals_A<goals_B:
        return teamB
    else:
        return extra_time_finals(teamA, teamB)