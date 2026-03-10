from match_engine.expected_elo import expected_elo

K_FACTOR = 10

def update_elo(teamA, teamB, goals_A, goals_B):
    elo_A = teamA.elo
    elo_B = teamB.elo

    E_A = expected_elo(elo_A, elo_B)
    E_B = 1-E_A
    if goals_A > goals_B:
        score_a,score_b = 1,0
    elif goals_A < goals_B:
        score_a,score_b = 0,1
    else:
        score_a,score_b = 0.5,0.5
    teamA.elo += K_FACTOR*(score_a-E_A)
    teamB.elo += K_FACTOR*(score_b-E_B)

    
