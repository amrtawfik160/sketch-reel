"""Scene sound effects for the Valor reel (called by make_reel.py). Quiet, physical sounds tied to visible events: chat pings,
cards and laptops landing, the camera's whips and the dive, typing, the plan tearing, stamps, the freeze. Hits sit just before
or after key words, never on them."""


def extra(add, X, C):
    c = C
    # v1: six chats ping, one after another; a scribble on "not"
    for k, t in enumerate([0, 0.22, 0.52, 0.8, 1.08, 1.32]):
        add(X.tick(1900 + (k % 3) * 180, 0.025), t + 0.07, 0.32, pan=(-0.3, 0.3)[k % 2])
    add(X.lp(X.glitch(0.22), 3000), c["v1"]["not"] - 0.06, 0.22)
    # v2: the chats fly off; the cards slide in; each Mac pops up
    add(X.lp(X.whoosh(0.35), 3500), c["v2"]["_start"] - 0.08, 0.22)
    add(X.paper_swish(0.25), c["v2"]["email"] - 0.12, 0.28)
    add(X.paper_swish(0.25), c["v2"]["github"] - 0.12, 0.28)
    for w in ["pirate", "cowboy", "bald", "captain"]:
        add(X.pop(), c["v2"][w] - 0.02, 0.32)
    # v3: client stickers land; the walls go up
    for w, d in [("belongs", -0.12), ("to", -0.02), ("one", 0.04), ("client", 0.08)]:
        add(X.paper_swish(0.2), c["v3"][w] + d + 0.15, 0.2)
    add(X.lp(X.clank(260), 2000), c["v3"]["never"] - 0.05, 0.32)
    add(X.lp(X.clank(240), 2000), c["v3"]["never"] + 0.15, 0.28)
    # whip to the desk; the messages pop in; the laptop pings
    add(X.lp(X.whoosh(0.45), 3500), c["v4"]["_start"] - 0.36, 0.3)
    add(X.tick(2400, 0.03), c["v4"]["message"], 0.3)
    add(X.pop(), c["v4"]["slack"] - 0.2, 0.28)
    add(X.pop(), c["v4"]["telegram"] - 0.14, 0.28)
    # v5: typing, then the dive into the screen
    t0 = c["v5"]["then"] + 0.1
    for k in range(10):
        add(X.key_click(), t0 + k * 0.13, 0.22)
    add(X.riser(0.9) * 0.5, c["v5"]["real"] - 0.6, 0.22)
    add(X.lp(X.whoosh(0.6), 4000), c["v5"]["real"] - 0.15, 0.3)
    # v6: the plan types, the critic scribbles, the plan tears, code types, tests tick, SHIPPED slams
    t0, t1 = c["v6"]["plans"] - 0.23, c["v6"]["second"] - 0.12
    for k in range(10):
        add(X.key_click(), t0 + k * (t1 - t0) / 10, 0.2)
    for k in range(3):
        add(X.lp(X.paper_swish(0.15), 5000), c["v6"]["tears"] + k * 0.12, 0.22)
    add(X.snip(), c["v6"]["apart"] - 0.03, 0.4)
    t0, t1 = c["v6"]["builds"], c["v6"]["tests"] - 0.08
    for k in range(9):
        add(X.key_click(), t0 + k * (t1 - t0) / 9, 0.2)
    for k in range(3):
        add(X.tick(2200 + k * 200, 0.03), c["v6"]["tests"] + 0.16 + k * 0.16, 0.26)
    add(X.stamp(), c["v6"]["ships"], 0.42)
    # v7: the request slides in; a buzz at the bad idea; a ding at the simpler way
    add(X.paper_swish(0.25), c["v7"]["request"] - 0.2, 0.25)
    add(X.lp(X.buzz(0.2), 1500), c["v7"]["bad"] - 0.12, 0.22)
    add(X.ding(1567.98) * 0.5, c["v7"]["first"] + 0.15, 0.28)
    # v8: the pull back out of the screen; the rosette; the Approve button crossed out
    add(X.lp(X.whoosh(0.6, up=False), 3500), c["v8"]["_start"] - 0.08, 0.28)
    add(X.pop(), c["v8"]["engineer"] - 0.05, 0.26)
    add(X.pop(), c["v8"]["doesnt"] - 0.05, 0.24)
    add(X.lp(X.paper_swish(0.2), 4000), c["v8"]["merges"] - 0.08, 0.3)
    # v9: the pile lands; cards zip into the laptop; one decision flies to Tom
    add(X.paper_swish(0.3), c["v9"]["_start"] - 0.1, 0.24)
    t = c["v9"]["brings"] - 0.1
    k = 0
    while t + k * 0.4 < c["v10"]["freezes"] - 0.05:
        add(X.tick(1800 + (k % 3) * 150, 0.02) * 0.6, t + k * 0.4 + 0.3, 0.18)
        k += 1
    add(X.paper_swish(0.3), c["v9"]["decisions"] - 0.25, 0.28)
    # v10: the warning; STOP slams; the freeze
    add(X.lp(X.buzz(0.3), 1500), c["v10"]["wrong"] - 0.12, 0.28)
    add(X.stamp(), c["v10"]["stop"] + 0.02, 0.45)
    add(X.shimmer(0.9, 2093.0) * 0.6, c["v10"]["freezes"] - 0.02, 0.3)
    # v11: whip back; six ticks; the little Macs pop up
    add(X.lp(X.whoosh(0.45), 3500), c["v11"]["_start"] - 0.38, 0.3)
    for i in range(6):
        add(X.tick(2000 + i * 120, 0.03), c["v11"]["engineer"] + 0.1 + i * 0.17, 0.26)
    for i in range(4):
        add(X.pop(), c["v11"]["macs"] - 0.25 + i * 0.08, 0.2)
    # v12: the address writes; the cursor clicks it
    t0 = c["v12"]["valorangels"] - 0.3
    for k in range(6):
        add(X.key_click(), t0 + k * 0.12, 0.2)
    add(X.key_click(), c["v12"]["com"] + 0.3, 0.45)
