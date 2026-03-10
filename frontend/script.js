// Real Wikimedia Commons URLs for authentic club logos
const CLUB_LOGOS = {
    "Arsenal": "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
    "Bayern": "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg",
    "Man City": "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
    "Liverpool": "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
    "Barcelona": "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
    "Chelsea": "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
    "Paris SG": "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
    "Real Madrid": "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
    "Newcastle": "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg",
    "Sporting": "https://upload.wikimedia.org/wikipedia/en/e/e1/Sporting_Clube_de_Portugal_%28Logo_2%29.svg",
    "Atlético": "https://upload.wikimedia.org/wikipedia/en/c/c1/Atletico_Madrid_logo.svg",
    "Leverkusen": "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg",
    "Atalanta": "https://upload.wikimedia.org/wikipedia/en/6/66/AtalantaBC.svg",
    "Tottenham": "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
    "Bodø/Glimt": "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Fk_bodo-glimt_logo.svg/1200px-Fk_bodo-glimt_logo.svg.png",
    "Galatasaray": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Galatasaray_Sports_Club_Logo.png"
};

function getLogoUrl(teamName) {
    return CLUB_LOGOS[teamName] || "assets/ucl-logo.png"; // Fallback to UCL logo
}

// Chart.js Globals
let teamWinChart = null;
let leagueWinChart = null;

// DOM Elements
const simulateBtn = document.getElementById("simulate-btn");
const roundTableBody = document.querySelector("#roundTable tbody");
const bracketContainer = document.getElementById("bracket-container");
const navButtons = document.querySelectorAll(".nav-btn");
const contentSections = document.querySelectorAll(".content-section");

// Navigation Logic
navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active class from all
        navButtons.forEach(b => b.classList.remove("active"));
        contentSections.forEach(s => s.classList.remove("active"));

        // Add active class to clicked button and target section
        btn.classList.add("active");
        const targetId = btn.getAttribute("data-target");
        document.getElementById(targetId).classList.add("active");
    });
});

// Simulate Button Event
simulateBtn.addEventListener("click", () => {
    simulateBtn.textContent = "Simulating...";
    simulateBtn.disabled = true;

    fetch("http://127.0.0.1:8000/simulate")
        .then(response => response.json())
        .then(data => {
            renderTeamChart(data.team_results);
            renderLeagueChart(data.league_results);
            renderRoundTable(data.round_results);
            renderBracket(data.ro16_matchups);

            simulateBtn.textContent = "Simulate Again";
            simulateBtn.disabled = false;
        })
        .catch(err => {
            console.error("Simulation failed:", err);
            simulateBtn.textContent = "Error! Try Again.";
            simulateBtn.disabled = false;
        });
});

// Render Team Bar Chart
function renderTeamChart(data) {
    const ctx = document.getElementById("teamChart").getContext("2d");

    // Sort and convert to percentages
    const sortedTeams = Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const labels = sortedTeams.map(t => t[0]);
    const values = sortedTeams.map(t => (t[1] * 100).toFixed(2));

    if (teamWinChart) teamWinChart.destroy();

    teamWinChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Win Probability (%)',
                data: values,
                backgroundColor: 'rgba(0, 242, 254, 0.4)',
                borderColor: '#00f2fe',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(0, 242, 254, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#8892b0', font: { size: 14 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#ffffff', font: { size: 14, weight: 'bold' } }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Render League Pie Chart
function renderLeagueChart(data) {
    const ctx = document.getElementById("leagueChart").getContext("2d");

    // Sort to make pie chart look ordered
    const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);

    const labels = sortedData.map(d => d[0]);
    const values = sortedData.map(d => (d[1] * 100).toFixed(2));

    if (leagueWinChart) leagueWinChart.destroy();

    leagueWinChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    '#00f2fe',
                    '#0250c5',
                    '#00ddec',
                    '#122b5e',
                    '#0275d8',
                    '#5bc0de',
                    '#fff'
                ],
                borderColor: '#000a16',
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#fff',
                        font: { size: 14, family: 'Outfit' },
                        padding: 20
                    }
                }
            }
        }
    });
}

// Render Round Table with Real Logos
function renderRoundTable(data) {
    roundTableBody.innerHTML = "";

    const sortedTeams = Object.entries(data).sort((a, b) => b[1].WIN - a[1].WIN);

    sortedTeams.forEach(([team, stages]) => {
        const tr = document.createElement("tr");

        // Team Cell with Logo
        const tdTeam = document.createElement("td");
        const logoUrl = getLogoUrl(team);
        tdTeam.innerHTML = `<img src="${logoUrl}" class="club-logo-small" alt="${team}"> <span>${team}</span>`;

        // Probability Cells
        const buildTd = val => {
            const td = document.createElement("td");
            td.textContent = (val * 100).toFixed(1) + "%";
            return td;
        };

        const tdQF = buildTd(stages.QF);
        const tdSF = buildTd(stages.SF);
        const tdFinal = buildTd(stages.FINAL);
        const tdWin = buildTd(stages.WIN);

        // Highlight high probabilities
        if (stages.WIN > 0.15) tdWin.style.color = "#00f2fe";

        tr.appendChild(tdTeam);
        tr.appendChild(tdQF);
        tr.appendChild(tdSF);
        tr.appendChild(tdFinal);
        tr.appendChild(tdWin);

        roundTableBody.appendChild(tr);
    });
}

// Render Knockout Bracket with Logos
function renderBracket(matchups) {
    bracketContainer.innerHTML = "";

    matchups.forEach(match => {
        const team1 = match[0];
        const team2 = match[1];

        const card = document.createElement("div");
        card.className = "matchup-card";

        card.innerHTML = `
            <div class="team-row">
                <img src="${getLogoUrl(team1)}" class="club-logo-med" alt="${team1}">
                <span class="team-name">${team1}</span>
            </div>
            <div class="vs-badge">VS</div>
            <div class="team-row">
                <img src="${getLogoUrl(team2)}" class="club-logo-med" alt="${team2}">
                <span class="team-name">${team2}</span>
            </div>
        `;

        bracketContainer.appendChild(card);
    });
}
