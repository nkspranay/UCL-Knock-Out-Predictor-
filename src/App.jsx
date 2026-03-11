import { useState, useMemo, useEffect } from "react";
import "./App.css";

const API_URL = "https://ucl-knock-out-predictor.onrender.com/simulate";

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
  "https://upload.wikimedia.org/wikipedia/commons/f/f3/Logo_UEFA_Champions_League.png";
const UCL_TROPHY =
  "https://www.pngwing.com/en/free-png-sspim";

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
                          Click &quot;Run Simulation&quot; to load
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
                    // Changed to be out of 100% instead of maxChampionWin
                    const widthPercent = row.win * 100;
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
                    // Changed to be out of 100% instead of maxLeagueWin
                    const widthPercent = row.win * 100;
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

      <footer className="app-footer">
        <p className="footer-quote">
          &quot;Football will forever remain our first love&quot;
        </p>
        <p className="footer-credit">
          N.K.S.PRANAY | <a href="mailto:nkspranay123@gmail.com">nkspranay123@gmail.com</a>
        </p>
      </footer>
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

  // 13 column grid
  // Match Cols: 1 (L16), 3 (QF), 5 (SF), 7 (FIN), 9 (SF), 11 (QF), 13 (R16)
  // Conn Cols: 2, 4, 6, 8, 10, 12

  // Rows: 1=head, matches=2 to 9
  const ro16RowStarts = [2, 4, 6, 8];

  // QF spans 2-4 and 6-8
  const qfRowStarts = [2, 6];
  const qfSpan = 3;

  // SF spans 2-8
  const sfRowStarts = [2];
  const sfSpan = 7;

  // Final spans 2-8
  const finalRowStart = 2;
  const finalSpan = 7;

  // Delays for animation
  const d_ro16 = "0.1s";
  const d_c1 = "0.5s";
  const d_qf = "0.9s";
  const d_c2 = "1.3s";
  const d_sf = "1.7s";
  const d_c3 = "2.1s";
  const d_fin = "2.5s";
  const d_champ = "3.1s";

  const node = (match, key, col, rowStart, span, side, stage, delay) => {
    const isFinal = stage === "final";
    return (
      <div
        key={key}
        className={`bracket-node ${side} ${stage} fade-in-node`}
        style={{ gridColumn: col, gridRow: `${rowStart} / span ${span}`, animationDelay: delay }}
      >
        {isFinal && (
          <img className="final-trophy-bg" src={UCL_TROPHY} alt="UCL Trophy" />
        )}
        {renderMatch(match, key)}
      </div>
    );
  };

  const conn = (key, col, rowStart, span, type, delay) => (
    <div
      key={key}
      className={`connector-bracket ${type} fade-in-node`}
      style={{
        gridColumn: col,
        gridRow: `${rowStart} / span ${span}`,
        "--span": span,
        animationDelay: delay
      }}
    />
  );

  const connH = (key, col, rowStart, span, type, delay) => (
    <div
      key={key}
      className={`connector-bracket ${type} fade-in-node`}
      style={{
        gridColumn: col,
        gridRow: `${rowStart} / span ${span}`,
        animationDelay: delay
      }}
    >
      <div className="horizontal-line" />
    </div>
  );

  return (
    <div className="bracket-grid">
      <div className="bracket-head" style={{ gridColumn: 1 }}>RO16</div>
      <div className="bracket-head" style={{ gridColumn: 3 }}>QF</div>
      <div className="bracket-head" style={{ gridColumn: 5 }}>SF</div>
      <div className="bracket-head" style={{ gridColumn: 7 }}>Final</div>
      <div className="bracket-head" style={{ gridColumn: 9 }}>SF</div>
      <div className="bracket-head" style={{ gridColumn: 11 }}>QF</div>
      <div className="bracket-head" style={{ gridColumn: 13 }}>RO16</div>

      {/* MATCHES - LEFT */}
      {leftRo16.map((m, idx) => node(m, `l16-${idx}`, 1, ro16RowStarts[idx], 1, "left", "ro16", d_ro16))}
      {leftQF.map((m, idx) => node(m, `lqf-${idx}`, 3, qfRowStarts[idx], qfSpan, "left", "qf", d_qf))}
      {leftSF.map((m, idx) => node(m, `lsf-${idx}`, 5, sfRowStarts[idx], sfSpan, "left", "sf", d_sf))}

      {/* MATCHES - RIGHT */}
      {rightSF.map((m, idx) => node(m, `rsf-${idx}`, 9, sfRowStarts[idx], sfSpan, "right", "sf", d_sf))}
      {rightQF.map((m, idx) => node(m, `rqf-${idx}`, 11, qfRowStarts[idx], qfSpan, "right", "qf", d_qf))}
      {rightRo16.map((m, idx) => node(m, `r16-${idx}`, 13, ro16RowStarts[idx], 1, "right", "ro16", d_ro16))}

      {/* FINAL */}
      {finalMatch && node(finalMatch, "final", 7, finalRowStart, finalSpan, "center", "final", d_fin)}

      {/* CONNECTORS - LEFT */}
      {/* RO16 to QF: span from center of RO16(1) to RO16(2) -> spans 3 rows */}
      {conn("lc1-0", 2, ro16RowStarts[0], 3, "right", d_c1)}
      {conn("lc1-1", 2, ro16RowStarts[2], 3, "right", d_c1)}

      {/* QF to SF: span from center of QF(1) to QF(2) -> rows 2 to 8 -> spans 7 rows */}
      {conn("lc2-0", 4, 3, 5, "right", d_c2)}

      {/* SF to Final: horizontal only, since it's 1 match to 1 match */}
      {connH("lc3", 6, 2, 7, "horizontal-only", d_c3)}

      {/* CONNECTORS - RIGHT */}
      {/* RO16 to QF */}
      {conn("rc1-0", 12, ro16RowStarts[0], 3, "left", d_c1)}
      {conn("rc1-1", 12, ro16RowStarts[2], 3, "left", d_c1)}

      {/* QF to SF */}
      {conn("rc2-0", 10, 3, 5, "left", d_c2)}

      {/* SF to Final */}
      {connH("rc3", 8, 2, 7, "horizontal-only", d_c3)}

      {champion && (
        <div className="bracket-champion fade-in-node" style={{ animationDelay: d_champ }}>
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

