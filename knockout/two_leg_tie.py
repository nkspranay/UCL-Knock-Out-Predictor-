import random

from match_engine.match_simulation import simulate_match
from knockout.two_leg_extra_time import extra_time

def simulate_2_leg_tie(teamA, teamB):
    goals = {teamA:0, teamB:0}
    if random.random() < 0.5:
        first_home = teamA
        first_away = teamB
    else:
        first_home = teamB
        first_away = teamA
    second_home, second_away = first_away, first_home
    goals_first_home, goals_first_away = simulate_match(first_home, first_away)
    goals_second_home, goals_second_away = simulate_match(second_home, second_away)

    goals[first_home]+=goals_first_home
    goals[first_away]+=goals_first_away
    goals[second_home]+=goals_second_home
    goals[second_away]+=goals_second_away
    if goals[teamA]>goals[teamB]:
        return teamA
    elif goals[teamA]<goals[teamB]:
        return teamB
    else:
        return extra_time(second_home, second_away)
        
    
    