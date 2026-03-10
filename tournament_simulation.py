from knockout.two_leg_tie import simulate_2_leg_tie
from knockout.finals import simulate_finals

def pair_winners(winners):
    return [(winners[i],winners[i+1]) for i in range(0,len(winners), 2)]

def simulate_round(matches):
    winners = []
    for teamA, teamB in matches:
        winner = simulate_2_leg_tie(teamA, teamB)
        winners.append(winner)
    return winners

def simulate_tournament(ro16_matches):
    RO16_winners = simulate_round(ro16_matches)

    QF_winners = simulate_round(pair_winners(RO16_winners))

    SF_winners = simulate_round(pair_winners(QF_winners))

    champion = simulate_finals(SF_winners[0],SF_winners[1])

    return RO16_winners,QF_winners,SF_winners,champion
