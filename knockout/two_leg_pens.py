import random

from match_engine.expected_elo import expected_elo

def penalties(teamA, teamB):
    E_A = expected_elo(teamA.elo, teamB.elo)
    if random.random() < E_A:
        return teamA
    else:
        return teamB