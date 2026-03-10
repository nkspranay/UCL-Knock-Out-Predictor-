import random
import numpy as np

random.seed(42)
np.random.seed(42)

from monte_carlo_engine import run_simulations
from teams import Team

from tournament_simulation import simulate_tournament
from visualization.bracket_view import print_bracket


arsenal = Team("Arsenal", 2070, "Premier League")
bayern = Team("Bayern", 1988, "Bundesliga")
man_city = Team("Man City", 1986, "Premier League")
liverpool = Team("Liverpool", 1952, "Premier League")
barcelona = Team("Barcelona", 1943, "La Liga")
chelsea = Team("Chelsea", 1934, "Premier League")
psg = Team("Paris SG", 1924, "Ligue 1")
real_madrid = Team("Real Madrid", 1908, "La Liga")
newcastle = Team("Newcastle", 1873, "Premier League")
sporting = Team("Sporting", 1851, "Primeira Liga")
atletico = Team("Atlético", 1840, "La Liga")
leverkusen = Team("Leverkusen", 1808, "Bundesliga")
atalanta = Team("Atalanta", 1795, "Serie A")
tottenham = Team("Tottenham", 1789, "Premier League")
bodo_glimt = Team("Bodø/Glimt", 1739, "Eliteserien")
galatasaray = Team("Galatasaray", 1728, "Süper Lig")

teams = [
    arsenal,
    bayern,
    man_city,
    liverpool,
    barcelona,
    chelsea,
    psg,
    real_madrid,
    newcastle,
    sporting,
    atletico,
    leverkusen,
    atalanta,
    tottenham,
    bodo_glimt,
    galatasaray
]

RO16_matches = [
    (psg, chelsea),
    (galatasaray, liverpool),
    (real_madrid, man_city),
    (atalanta, bayern),
    (newcastle, barcelona),
    (atletico, tottenham),
    (bodo_glimt, sporting),
    (leverkusen, arsenal)
]

simulations = 10000

team_results, league_results, round_results = run_simulations(teams, RO16_matches, simulations)

print("Team Win Probabilities:\n")

for team, prob in sorted(team_results.items(), key=lambda x: x[1], reverse=True):
    print(f"{team}: {prob*100:.2f}%")

print("\nLeague Win Probabilities:\n")

for league, prob in sorted(league_results.items(), key=lambda x: x[1], reverse=True):
    print(f"{league}: {prob*100:.2f}%")

print("\nRound Reach Probabilities:\n")

print(f"{'Team':<15}{'QF':>8}{'SF':>8}{'Final':>10}{'Win':>8}")
print("-"*50)

for team, stages in sorted(round_results.items(), key=lambda x: x[1]["WIN"], reverse=True):
    print(
        f"{team:<15}"
        f"{stages['QF']*100:>7.1f}%"
        f"{stages['SF']*100:>7.1f}%"
        f"{stages['FINAL']*100:>9.1f}%"
        f"{stages['WIN']*100:>7.1f}%"
    )

ro16_winners, qf_winners, sf_winners, champion = simulate_tournament(RO16_matches)

print_bracket(RO16_matches, ro16_winners, qf_winners, sf_winners, champion)