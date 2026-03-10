from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from monte_carlo_engine import run_simulations
from teams import teams, RO16_matches

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SIMULATIONS = 10000

@app.get("/simulate")
def simulate():

    team_results, league_results, round_results = run_simulations(
        teams,
        RO16_matches,
        SIMULATIONS
    )

    ro16_matchups = [[match[0].name, match[1].name] for match in RO16_matches]

    return {
        "team_results": team_results,
        "league_results": league_results,
        "round_results": round_results,
        "ro16_matchups": ro16_matchups
    }