from match_engine.match_simulation import simulate_match
from teams import Team

import numpy as np

teamA = Team("TeamA", 1900, "TestLeague")
teamB = Team("TeamB", 1900, "TestLeague")

matches = 10000

total_goals = 0
draws = 0

for _ in range(matches):

    teamA.reset_elo()
    teamB.reset_elo()

    gA, gB = simulate_match(teamA, teamB)

    total_goals += gA + gB

    if gA == gB:
        draws += 1

print("Average goals:", total_goals / matches)
print("Draw rate:", draws / matches)