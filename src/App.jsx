import { useState, useMemo, useEffect } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/simulate";

const CLUB_LOGOS = {
  Arsenal:
    "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  Bayern:
    "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg",
  "Man City":
    "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
  Liverpool:
    "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
  Barcelona:
    "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
  Chelsea:
    "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
  "Paris SG":
    "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
  "Real Madrid":
    "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
  Newcastle:
    "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg",
  Sporting:
    "https://upload.wikimedia.org/wikipedia/pt/3/3e/Sporting_Clube_de_Portugal.png",
  "Atlético":
    "https://upload.wikimedia.org/wikipedia/en/c/c1/Atletico_Madrid_logo.svg",
  Leverkusen:
    "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg",
  Atalanta:
    "https://upload.wikimedia.org/wikipedia/en/6/66/AtalantaBC.svg",
  Tottenham:
    "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
  "Bodø/Glimt":
    "https://upload.wikimedia.org/wikipedia/commons/8/8c/600px_Flag_club_Bod%C3%B8_Glimt.png",
  Galatasaray:
    "https://upload.wikimedia.org/wikipedia/commons/f/f6/Galatasaray_Sports_Club_Logo.png",
};

const LEAGUE_LOGOS = {
  "Premier League":
    "https://upload.wikimedia.org/wikipedia/commons/7/79/UK_Premier_League_logo.png",
  Bundesliga:
    "https://upload.wikimedia.org/wikipedia/commons/1/15/Bundesliga_logo.svg",
  "La Liga":
    "https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_logo_2023.svg",
  "Ligue 1":
    "https://upload.wikimedia.org/wikipedia/commons/c/cd/Ligue_1_Uber_Eats_logo.svg",
  "Primeira Liga":
    "https://upload.wikimedia.org/wikipedia/commons/c/c0/Bwin_Liga.svg",
  "Serie A":
    "https://upload.wikimedia.org/wikipedia/commons/e/e9/Serie_A_logo_2022.svg",
  Eliteserien:
    "https://images.football-logos.cc/norway/eliteserien.9ff9e53b.svg",
  "Süper Lig":
    "https://upload.wikimedia.org/wikipedia/commons/4/4f/S%C3%BCper_Lig_logo.svg",
};

const UCL_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/0/0a/UEFA_Champions_League_logo.svg";

function safeImg(e) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = UCL_LOGO;
}

function getLogoUrl(teamName) {
  return (
    CLUB_LOGOS[teamName] ||
    UCL_LOGO
  );
}

function getLeagueLogo(leagueName) {
  return (
    LEAGUE_LOGOS[leagueName] ||
    UCL_LOGO
  );
}

function formatPercent(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "0.0%";
  return `${(value * 100).toFixed(1).replace(/\.0$/, ".0")}%`;
}

function normalizeRoundEntry(team, stages) {
  const qf = stages.qf ?? stages.QF ?? 0;
  const sf = stages.sf ?? stages.SF ?? 0;
  const final = stages.final ?? stages.FINAL ?? 0;
  const win = stages.win ?? stages.WIN ?? 0;
  return { team, qf, sf, final, win };
}

function App() {
  const [roundResults, setRoundResults] = useState(null);
  const [teamResults, setTeamResults] = useState(null);
  const [leagueResults, setLeagueResults] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState("rounds");

  async function handleRunSimulation() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const data = await res.json();
      setRoundResults(data.round_results || null);
      setTeamResults(data.team_results || null);
      setLeagueResults(data.league_results || null);
      setSimulation(data.simulation || null);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to run simulation. Make sure the FastAPI backend is running on http://127.0.0.1:8000."
      );
    } finally {
      setLoading(false);
    }
  }

  const tableRows = useMemo(() => {
    if (!roundResults) return [];
    return Object.entries(roundResults)
      .map(([team, stages]) => normalizeRoundEntry(team, stages || {}))
      .sort((a, b) => b.win - a.win);
  }, [roundResults]);

  const maxWin = useMemo(() => {
    if (!tableRows.length) return 0;
    return Math.max(...tableRows.map((r) => r.win));
  }, [tableRows]);

  const championRows = useMemo(() => {
    if (!teamResults) return [];
    return Object.entries(teamResults)
      .map(([team, prob]) => ({ team, win: prob ?? 0 }))
      .sort((a, b) => b.win - a.win);
  }, [teamResults]);

  const maxChampionWin = useMemo(() => {
    if (!championRows.length) return 0;
    return Math.max(...championRows.map((r) => r.win));
  }, [championRows]);

  const leagueRows = useMemo(() => {
    if (!leagueResults) return [];
    return Object.entries(leagueResults)
      .map(([league, prob]) => ({ league, win: prob ?? 0 }))
      .sort((a, b) => b.win - a.win);
  }, [leagueResults]);

  const maxLeagueWin = useMemo(() => {
    if (!leagueRows.length) return 0;
    return Math.max(...leagueRows.map((r) => r.win));
  }, [leagueRows]);

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand-row">
          <img
            src={UCL_LOGO}
            alt="UEFA Champions League"
            className="ucl-logo"
            onError={safeImg}
          />
          <div>
            <h1>UCL Knock-Out Predictor</h1>
            <p className="subtitle">
              Monte Carlo Simulation of Champions League Knockout Stage
            </p>
          </div>
        </div>
        <nav className="nav-bar">
          <button
            type="button"
            className={page === "rounds" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("rounds")}
          >
            Round Probabilities
          </button>
          <button
            type="button"
            className={page === "champions" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("champions")}
          >
            Champion Odds
          </button>
          <button
            type="button"
            className={page === "leagues" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("leagues")}
          >
            League Odds
          </button>
          <button
            type="button"
            className={page === "simulation" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("simulation")}
          >
            Example Simulation
          </button>
        </nav>
      </header>

      <main className="app-main">
        <section className="panel">
          <div className="panel-header">
            <button
              type="button"
              className="primary-btn"
              onClick={handleRunSimulation}
              disabled={loading}
            >
              {loading ? "Running Simulation..." : "Run Monte Carlo Simulation"}
            </button>
            {error && <p className="error-text">{error}</p>}
          </div>

          {page === "rounds" && (
            <div className="section">
              <h2 className="section-title">Team Round Probabilities</h2>
              <div className="table-wrapper">
                <table className="prob-table">
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>Quarter Final</th>
                      <th>Semi Final</th>
                      <th>Final</th>
                      <th>Win</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="placeholder-cell">
                          Click &quot;Run Monte Carlo Simulation&quot; to load
                          results.
                        </td>
                      </tr>
                    ) : (
                      tableRows.map((row) => (
                        <tr key={row.team}>
                          <td className="team-name">
                            <img
                              src={getLogoUrl(row.team)}
                              alt={row.team}
                              className="club-logo"
                              onError={safeImg}
                            />
                            <span>{row.team}</span>
                          </td>
                          <td>{formatPercent(row.qf)}</td>
                          <td>{formatPercent(row.sf)}</td>
                          <td>{formatPercent(row.final)}</td>
                          <td className="win-cell">
                            {formatPercent(row.win)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === "champions" && (
            <div className="section">
              <h2 className="section-title">Champion Probabilities</h2>
              {championRows.length === 0 ? (
                <p className="placeholder-text">
                  Champion probability bars will appear here after a simulation
                  run.
                </p>
              ) : (
                <div className="bars-list">
                  {championRows.map((row) => {
                    const widthPercent =
                      maxChampionWin > 0
                        ? (row.win / maxChampionWin) * 100
                        : 0;
                    return (
                      <BarRow
                        key={row.team}
                        label={row.team}
                        logoUrl={getLogoUrl(row.team)}
                        value={row.win}
                        widthPercent={widthPercent}
                        variant="team"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {page === "leagues" && (
            <div className="section">
              <h2 className="section-title">League Probabilities</h2>
              {leagueRows.length === 0 ? (
                <p className="placeholder-text">
                  League probability bars will appear here after a simulation
                  run.
                </p>
              ) : (
                <div className="bars-list">
                  {leagueRows.map((row) => {
                    const widthPercent =
                      maxLeagueWin > 0 ? (row.win / maxLeagueWin) * 100 : 0;
                    return (
                      <BarRow
                        key={row.league}
                        label={row.league}
                        logoUrl={getLeagueLogo(row.league)}
                        value={row.win}
                        widthPercent={widthPercent}
                        variant="league"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {page === "simulation" && (
            <div className="section">
              <h2 className="section-title">Example Tournament Simulation</h2>
              {simulation ? (
                <SimulationView simulation={simulation} />
              ) : (
                <p className="placeholder-text">
                  When the backend returns a sample tournament under{" "}
                  <code>simulation</code>, it will be rendered here.
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function SimulationView({ simulation }) {
  const {
    round_of_16 = [],
    quarter_finals = [],
    semi_finals = [],
    final,
    champion,
  } = simulation;

  const leftRo16 = round_of_16.slice(0, 4);
  const rightRo16 = round_of_16.slice(4);

  const leftQF = quarter_finals.slice(0, 2);
  const rightQF = quarter_finals.slice(2);

  const leftSF = semi_finals[0] ? [semi_finals[0]] : [];
  const rightSF = semi_finals[1] ? [semi_finals[1]] : [];

  const finalMatch = Array.isArray(final)
    ? final[0]
    : final && typeof final === "object"
    ? final
    : null;

  const renderMatch = (match, key) => {
    if (!match) return null;
    const home = match.home ?? match.team1 ?? match.a ?? "";
    const away = match.away ?? match.team2 ?? match.b ?? "";
    const winner = match.winner ?? match.champion ?? "";
    const homeWinner = winner && winner === home;
    const awayWinner = winner && winner === away;

    return (
      <div className="bracket-match" key={key}>
        <div className={homeWinner ? "team-chip winner" : "team-chip"}>
          <img
            src={getLogoUrl(home)}
            alt={home}
            className="team-chip-logo"
            onError={safeImg}
          />
          <span>{home}</span>
        </div>
        <div className={awayWinner ? "team-chip winner" : "team-chip"}>
          <img
            src={getLogoUrl(away)}
            alt={away}
            className="team-chip-logo"
            onError={safeImg}
          />
          <span>{away}</span>
        </div>
      </div>
    );
  };

  // Grid placement helpers for an 8-row bracket (match slots are rows 2-9; row 1 is headings)
  const ro16RowStarts = [2, 4, 6, 8];
  const qfRowStarts = [3, 7];
  const sfRowStart = 5;

  const node = (match, key, col, rowStart, span, side, stage) => (
    <div
      key={key}
      className={`bracket-node ${side} ${stage}`}
      style={{ gridColumn: col, gridRow: `${rowStart} / span ${span}` }}
    >
      {renderMatch(match, key)}
    </div>
  );

  const connectorV = (key, col, rowStart, rowSpan) => (
    <div
      key={key}
      className="connector-v"
      style={{ gridColumn: col, gridRow: `${rowStart} / span ${rowSpan}` }}
    />
  );

  const connectorH = (key, colStart, colEnd, row) => (
    <div
      key={key}
      className="connector-h"
      style={{ gridColumn: `${colStart} / ${colEnd}`, gridRow: row }}
    />
  );

  return (
    <div className="bracket-grid bracket-grid-connected">
      <div className="bracket-head ro16-left">RO16</div>
      <div className="bracket-head qf-left">QF</div>
      <div className="bracket-head sf-left">SF</div>
      <div className="bracket-head final-head">Final</div>
      <div className="bracket-head sf-right">SF</div>
      <div className="bracket-head qf-right">QF</div>
      <div className="bracket-head ro16-right">RO16</div>

      {/* LEFT SIDE */}
      {leftRo16.map((m, idx) =>
        node(m, `l16-${idx}`, 1, ro16RowStarts[idx], 2, "left", "ro16")
      )}
      {leftQF.map((m, idx) =>
        node(m, `lqf-${idx}`, 2, qfRowStarts[idx], 4, "left", "qf")
      )}
      {leftSF.map((m, idx) =>
        node(m, `lsf-${idx}`, 3, sfRowStart, 8, "left", "sf")
      )}

      {/* RIGHT SIDE */}
      {rightSF.map((m, idx) =>
        node(m, `rsf-${idx}`, 5, sfRowStart, 8, "right", "sf")
      )}
      {rightQF.map((m, idx) =>
        node(m, `rqf-${idx}`, 6, qfRowStarts[idx], 4, "right", "qf")
      )}
      {rightRo16.map((m, idx) =>
        node(m, `r16-${idx}`, 7, ro16RowStarts[idx], 2, "right", "ro16")
      )}

      {/* FINAL */}
      {finalMatch && node(finalMatch, "final", 4, 6, 2, "center", "final")}

      {/* CONNECTORS: RO16 -> QF (left) */}
      {connectorV("lv0", 1, 2, 4)}
      {connectorH("lh0", 1, 2, 4)}
      {connectorV("lv1", 1, 6, 4)}
      {connectorH("lh1", 1, 2, 8)}

      {/* CONNECTORS: QF -> SF (left) */}
      {connectorV("lqv", 2, 3, 8)}
      {connectorH("lqh", 2, 3, 5)}

      {/* CONNECTORS: SF -> Final (left) */}
      {connectorH("lsfh", 3, 4, 6)}

      {/* CONNECTORS: SF -> Final (right) */}
      {connectorH("rsfh", 4, 5, 6)}

      {/* CONNECTORS: QF -> SF (right) */}
      {connectorV("rqv", 6, 3, 8)}
      {connectorH("rqh", 5, 6, 5)}

      {/* CONNECTORS: RO16 -> QF (right) */}
      {connectorV("rv0", 7, 2, 4)}
      {connectorH("rh0", 6, 7, 4)}
      {connectorV("rv1", 7, 6, 4)}
      {connectorH("rh1", 6, 7, 8)}

      {champion && (
        <div className="bracket-champion">
          <span className="champion-pill">
            <img
              src={getLogoUrl(champion)}
              alt={champion}
              className="champion-logo"
              onError={safeImg}
            />
            <span>
              <strong>Champion:</strong> {champion}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

function useAnimatedNumber(target, durationMs = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const to = typeof target === "number" ? target : 0;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

function BarRow({ label, logoUrl, value, widthPercent, variant }) {
  const animated = useAnimatedNumber(value, 900);
  return (
    <div className="bar-row">
      <span className="bar-label">
        <img src={logoUrl} alt={label} className="bar-logo" onError={safeImg} />
        <span>{label}</span>
      </span>
      <div className="bar-track">
        <div
          className={variant === "league" ? "bar-fill league" : "bar-fill"}
          style={{ "--scale": Math.max(0, Math.min(1, widthPercent / 100)) }}
        />
      </div>
      <span className="bar-value">{formatPercent(animated)}</span>
    </div>
  );
}

export default App;

