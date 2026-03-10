class Team:
    def __init__(self, name, elo, league):
        self.name = name
        self.league = league
        self.base_elo = elo
        self.elo = elo
    def reset_elo(self):
        self.elo = self.base_elo
    
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