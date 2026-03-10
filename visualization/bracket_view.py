def print_bracket(ro16_matches, ro16_winners, qf_winners, sf_winners, champion):

    print("\nSimulated Knockout Bracket\n")

    print("RO16")
    print("-"*50)

    for i, (teamA, teamB) in enumerate(ro16_matches):
        winner = ro16_winners[i]
        print(f"{teamA.name:<15} vs {teamB.name:<15} → {winner.name}")

    print("\nQuarterfinals")
    print("-"*50)

    qf_matches = [(ro16_winners[i], ro16_winners[i+1]) for i in range(0, len(ro16_winners), 2)]

    for i, (teamA, teamB) in enumerate(qf_matches):
        winner = qf_winners[i]
        print(f"{teamA.name:<15} vs {teamB.name:<15} → {winner.name}")

    print("\nSemifinals")
    print("-"*50)

    sf_matches = [(qf_winners[i], qf_winners[i+1]) for i in range(0, len(qf_winners), 2)]

    for i, (teamA, teamB) in enumerate(sf_matches):
        winner = sf_winners[i]
        print(f"{teamA.name:<15} vs {teamB.name:<15} → {winner.name}")

    print("\nFinal")
    print("-"*50)

    print(f"{sf_winners[0].name:<15} vs {sf_winners[1].name:<15} → {champion.name}")