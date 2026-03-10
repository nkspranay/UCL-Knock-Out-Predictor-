import numpy as np

from match_engine.expected_goals import expected_goals
from knockout.two_leg_pens import penalties

def extra_time(teamA, teamB, homeadvantage = 50):
    elo_A = teamA.elo+ homeadvantage-10
    elo_B = teamB.elo - 20
    lambda_A, lambda_B = expected_goals(elo_A, elo_B)
    lambda_A*=(30/90)
    lambda_B*=(30/90)
    goals_A = np.random.poisson(lambda_A)
    goals_B = np.random.poisson(lambda_B)
    if goals_A>goals_B:
        return teamA
    elif goals_A<goals_B:
        return teamB
    else:
        return penalties(teamA, teamB)