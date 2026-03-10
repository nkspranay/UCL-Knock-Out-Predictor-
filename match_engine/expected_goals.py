from match_engine.expected_elo import expected_elo

TOTAL_GOALS = 2.6
HOME_GOAL_SHARE = 0.55
DAMPING_STRENGTH = 0.55

def expected_goals(elo_A, elo_B, neutral = False):
    E_A = expected_elo(elo_A, elo_B)
    E_B = 1-E_A

    if neutral:
        lambda_A = E_A*TOTAL_GOALS
        lambda_B = E_B*TOTAL_GOALS
    else:
        base_home = TOTAL_GOALS*HOME_GOAL_SHARE
        base_away = TOTAL_GOALS*(1-HOME_GOAL_SHARE)
        
        lambda_A = base_home*(0.5 + DAMPING_STRENGTH*(E_A - 0.5))
        lambda_B = base_away*(0.5 + DAMPING_STRENGTH*(E_B - 0.5))
    return lambda_A, lambda_B
    
