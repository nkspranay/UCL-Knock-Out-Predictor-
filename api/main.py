from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from monte_carlo_engine import run_simulations
from teams import teams, RO16_matches
from tournament_simulation import simulate_tournament, pair_winners


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SIMULATIONS = 10_000


@app.get("/simulate")
def simulate():
    """
    Run Monte Carlo simulations using the existing engine and team data,
    and expose the aggregated results plus one example tournament.
    """
    # Reuse existing simulation logic without changing it
    team_results, league_results, round_results = run_simulations(
        teams,
        RO16_matches,
        SIMULATIONS,
    )

    # Single example tournament simulation using the same tournament logic
    ro16_winners, qf_winners, sf_winners, champion = simulate_tournament(RO16_matches)

    # Build simple round structures for the frontend
    def serialize_pair_round(pairs, winners):
        return [
            {
                "home": a.name,
                "away": b.name,
                "winner": w.name,
            }
            for (a, b), w in zip(pairs, winners)
        ]

    ro16_pairs = RO16_matches
    qf_pairs = pair_winners(ro16_winners)
    sf_pairs = pair_winners(qf_winners)

    round_of_16 = serialize_pair_round(ro16_pairs, ro16_winners)
    quarter_finals = serialize_pair_round(qf_pairs, qf_winners)
    semi_finals = serialize_pair_round(sf_pairs, sf_winners)

    final_match = {
        "home": sf_winners[0].name,
        "away": sf_winners[1].name,
        "winner": champion.name,
    }

    simulation = {
        "round_of_16": round_of_16,
        "quarter_finals": quarter_finals,
        "semi_finals": semi_finals,
        "final": final_match,
        "champion": champion.name,
    }

    return {
        "team_results": team_results,
        "league_results": league_results,
        "round_results": round_results,
        "simulation": simulation,
    }

