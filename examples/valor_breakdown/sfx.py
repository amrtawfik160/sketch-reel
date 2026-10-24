"""Scene sound effects for the sketch Valor breakdown (called by make_reel.py). Quiet, physical sounds tied to visible events:
the wipes between light and dark boards, pops, pencil scribbles, typing, ticks, stamps, a ding on $2.97, a click on Follow.
Hits sit just before key words, never on them."""


def extra(add, X, C):
    c = C
    sw = lambda line: c[line]["_start"] - 0.03
    # the five wipes between the light and dark boards
    for k, line in enumerate(["v3", "v8", "v13", "v16", "v19"]):
        add(X.lp(X.whoosh(0.4), 3800), sw(line) - 0.34, 0.24, pan=(-0.25, 0.25)[k % 2])
    # v1: the heatmap fills (soft ticks), the scribble over the head, the jolt
    for k in range(8):
        add(X.tick(1700 + (k % 4) * 140, 0.02) * 0.6, 0.12 + k * 0.28, 0.16)
    add(X.lp(X.glitch(0.22), 3000), c["v1"]["not"] - 0.06, 0.22)
    add(X.lp(X.clank(200), 1600), c["v1"]["human"] - 0.02, 0.22)
    # v2: the merge card, the human crossed out, the shield
    add(X.paper_swish(0.25), c["v2"]["no"] - 0.1, 0.24)
    add(X.lp(X.paper_swish(0.15), 5000), c["v2"]["approves"] - 0.02, 0.24)
    add(X.pop(), c["v2"]["safe"] - 0.12, 0.26)
    # v3: Tom types; v4 the reactions
    t0, t1 = c["v3"]["one"] - 0.05, c["v3"]["tom"] - 0.1
    for k in range(12):
        add(X.key_click(), t0 + k * (t1 - t0) / 12, 0.18)
    add(X.tick(2400, 0.03), c["v3"]["sends"], 0.3)
    add(X.pop(), c["v4"]["eyes"] - 0.04, 0.3)
    add(X.pop(), c["v4"]["salute"] + 0.02, 0.3)
    # v5: the judge's needle; v6 the file ticks and the question; v7 the buzz and the bubble
    add(X.lp(X.whoosh(0.3), 3000), c["v5"]["clear"] - 0.1, 0.14)
    add(X.ding(1318.5) * 0.4, c["v5"]["vague"] - 0.1, 0.22)
    for k in range(5):
        add(X.tick(2000 + k * 120, 0.025), c["v6"]["reads"] + k * 0.22 + 0.2, 0.22)
    add(X.paper_swish(0.25), c["v6"]["asks"] - 0.1, 0.26)
    add(X.lp(X.buzz(0.2), 1500), c["v7"]["bad"] - 0.12, 0.22)
    add(X.pop(), c["v7"]["says"] - 0.15, 0.24)
    # v8: the plan types; the critic walks in and scribbles
    t0, t1 = c["v8"]["writes"] - 0.1, c["v8"]["brand"] - 0.15
    for k in range(10):
        add(X.key_click(), t0 + k * (t1 - t0) / 10, 0.18)
    for k in range(3):
        add(X.lp(X.paper_swish(0.15), 5000), c["v8"]["tries"] + k * 0.18, 0.2)
    # v9: three icons pop; the 1 becomes a 2
    for w in ["money", "logins", "stored"]:
        add(X.pop(), c["v9"][w] - 0.08, 0.24)
    add(X.lp(X.paper_swish(0.15), 5000), c["v9"]["two"] - 0.12, 0.24)
    # v10: typing, the lanes; v11 the scribble-out and the re-run; v12 ticks, MERGED, two crosses
    t0 = c["v10"]["then"] - 0.12
    for k in range(8):
        add(X.key_click(), t0 + k * 0.16, 0.18)
    add(X.pop(), c["v10"]["three"] + 0.05, 0.24)
    add(X.lp(X.paper_swish(0.2), 5000), c["v11"]["word"] - 0.1, 0.24)
    add(X.riser(1.2) * 0.4, c["v11"]["every"] - 0.05, 0.16)
    for k in range(3):
        add(X.tick(2200 + k * 200, 0.03), c["v12"]["pass"] - 0.25 + k * 0.12, 0.26)
    add(X.stamp(), c["v12"]["merges"] - 0.04, 0.42)
    add(X.lp(X.paper_swish(0.15), 5000), c["v12"]["request"] - 0.1, 0.22)
    add(X.lp(X.paper_swish(0.15), 5000), c["v12"]["click"] - 0.1, 0.22)
    # v13: the receipt feeds, the counter, the ding on the total
    t0, t1 = c["v13"]["_start"] + 0.1, c["v13"]["cost"] - 0.1
    for k in range(14):
        add(X.tick(900 + (k % 2) * 120, 0.02) * 0.5, t0 + k * (t1 - t0) / 14, 0.16)
    add(X.ding(1567.98) * 0.5, 62.40 + 0.02, 0.28)
    # v14: the pen writes, row 9, the eraser bounces; v15 REFUSED
    for k in range(9):
        add(X.lp(X.paper_swish(0.12), 6000), c["v14"]["step"] + k * 0.36, 0.12)
    add(X.pop(), c["v14"]["added"] - 0.05, 0.24)
    add(X.lp(X.buzz(0.18), 1400), c["v14"]["erased"] - 0.1, 0.2)
    add(X.stamp(), c["v15"]["refuses"] - 0.06, 0.45)
    # v16: "stop" types, STOP slams, the ledger row; v17 the wall, the refusals, the tasks stop
    for k in range(4):
        add(X.key_click(), c["v16"]["word"] - 0.05 + k * 0.15, 0.2)
    add(X.stamp(), c["v16"]["stop"] - 0.08, 0.48)
    add(X.lp(X.clank(240), 2000), c["v17"]["_start"] + 0.1, 0.24)
    add(X.lp(X.buzz(0.25), 1500), c["v17"]["refused"] - 0.04, 0.26)
    for k in range(3):
        add(X.lp(X.clank(300 - k * 30), 1800), c["v17"]["seconds"] - 0.1 + k * 0.36, 0.2)
    # v18: the envelope flies off
    add(X.lp(X.whoosh(0.5), 4000), c["v18"]["sent"] - 0.2, 0.22)
    # v19: the three tiles; v20 the address types; v21 the Follow click and the paper plane
    add(X.pop(), 88.79 - 0.12, 0.24)
    add(X.pop(), 90.43 - 0.12, 0.26)
    t0 = c["v20"]["whole"] - 0.05
    for k in range(7):
        add(X.key_click(), t0 + k * 0.1, 0.18)
    add(X.key_click(), c["v21"]["follow"] + 0.2, 0.5)
    add(X.pop(), c["v21"]["follow"] + 0.25, 0.22)
    add(X.lp(X.whoosh(0.4), 4500), c["v21"]["send"], 0.18)
