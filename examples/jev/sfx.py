"""Scene sound effects for the Jev story reel, v3 (called by make_reel.py). A few quiet, physical sounds tied to visible events:
mail arriving, trays landing, typing, envelopes dropping, one stamp. Hits sit just before or after key words, never on them."""


def extra(add, X, C):
    c = C
    # j3: the camera whips across the board to Maya's desk
    add(X.lp(X.whoosh(0.45), 3500), c["j3"]["_start"] - 0.3, 0.3)
    # j4 and j11: the cursor clicks
    add(X.tick(2600, 0.02), c["j4"]["each"] - 0.12, 0.4)
    add(X.tick(2600, 0.02), c["j11"]["_start"] - 0.25 + 0.95, 0.35)   # the cursor click into the reply (tC2 in the scene)
    # j2: the line lands at 35%
    add(X.tick(2200, 0.03) * 0.6, c["j2"]["35"] - 0.02, 0.35)
    # j3: mail keeps arriving at the top of the inbox
    ta, tb = c["j3"]["runs"] - 0.04, c["j3"]["day"] + 0.15   # same even spacing as the scene
    for k in range(8):
        add(X.tick(1700 + (k % 3) * 120, 0.02), ta + k * (tb - ta) / 7 + 0.05, 0.22, pan=(-0.2, 0.0, 0.2)[k % 3])
    # j4: each tray lands on the desk
    for w in ["refund", "shipping", "urgent"]:
        add(X.lp(X.clank(300), 2500), c["j4"][w] - 0.02, 0.3)
    # j5: the chatbot types on and on
    t0, t1 = c["j5"]["writes"], c["j5"]["say"]
    for k in range(22):
        add(X.key_click(), t0 + k * (t1 - t0) / 22 + (0.03 if k % 3 == 0 else 0), 0.28)
    # j6: Jev's panel rises; the email slides in; one envelope drops into its tray
    add(X.lp(X.whoosh(0.3), 4000), c["j6"]["jev"] - 0.12, 0.22)
    add(X.paper_swish(0.25), c["j6"]["machine"] - 0.28, 0.3)
    add(X.paper_swish(0.25), c["j6"]["box"] + 0.22, 0.3)
    add(X.lp(X.clank(260), 2000), c["j6"]["box"] + 0.7, 0.3)
    # j7: the answer arrives in 212 ms
    add(X.ding(1567.98) * 0.5, c["j7"]["answers"] + 0.17, 0.3)
    # j8: the fourth tray fails to form
    add(X.lp(X.buzz(0.18), 1500), c["j8"]["box"] + 0.12, 0.3)
    # j9: one envelope to its tray; the unsure one to Maya
    add(X.paper_swish(0.25), c["j9"]["sorted"] - 0.05, 0.3)
    add(X.lp(X.clank(260), 2000), c["j9"]["sorted"] + 0.43, 0.3)
    add(X.paper_swish(0.3), c["j9"]["maya"] - 0.15, 0.3)
    # j10: a command typed in the terminal, then blocked
    t0, t1 = c["j10"]["uses"], c["j10"]["harmful"]
    for k in range(12):
        add(X.key_click(), t0 + k * (t1 - t0) / 12, 0.32)
    add(X.stamp(), c["j10"]["before"] + 0.03, 0.42)
    # j11-j12: the chatbot types the reply
    t0, t1 = c["j11"]["chatbot"], c["j12"]["decides"] + 0.2
    for k in range(16):
        add(X.key_click(), t0 + k * (t1 - t0) / 16, 0.24)
    # j12: Jev sorts a run of emails into the trays
    t = c["j12"]["and"]
    for k, g in enumerate([0.02, 0.15, 0.26, 0.42, 0.52, 0.66, 0.8]):
        add(X.tick(1900 + (k % 3) * 160, 0.02) * 0.7, t + g + 0.32, 0.25, pan=(-0.3, 0.0, 0.3)[k % 3])
    # j12b: the board moves on to Cyndra's card; the button is clicked; the calendar gets its check
    add(X.lp(X.whoosh(0.4), 3500), c["j12b"]["_start"] - 0.42, 0.22)
    add(X.paper_swish(0.3), c["j12b"]["_start"] + 0.05, 0.22)
    add(X.key_click(), c["j12b"]["call"] + 0.06, 0.5)
    add(X.tick(2200, 0.03) * 0.8, c["j12b"]["take"] + 0.18, 0.3)
