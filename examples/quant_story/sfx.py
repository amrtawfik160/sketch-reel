"""Scene sound effects for the story version of the quantization reel (called by make_reel.py). Quiet, physical sounds tied
to visible events; word times come from words_measured.json via caps_gen.js (WT), so hits land on the spoken word."""
import json
import os
import re

_WT = json.loads(re.search(r"const WT = (.*);\n", open(os.path.join(os.path.dirname(__file__), "caps_gen.js")).read()).group(1))


def w(line, word, n=0):
    return [x for x in _WT[line] if x[0] == word][n][1]


def extra(add, X, C):
    c = C
    pans = [w("s2", "so") - 0.05, c["s4"]["_start"] - 0.1, c["s5"]["_start"] - 0.1, w("s6", "can") - 0.1,
            w("s7", "so") - 0.12, w("s7", "and") - 0.12, w("s8", "but") - 0.12]
    for k, t in enumerate(pans):   # the camera travels along the board; soft footsteps and a whoosh
        add(X.lp(X.whoosh(0.5), 2600), t, 0.12, pan=(-0.2, 0.2)[k % 2])
        for j in range(4):
            add(X.lp(X.tick(900, 0.03), 1500), t + 0.1 + j * 0.17, 0.08)
    # s1: the cloud pops, the vise screws in, coins
    add(X.pop(), w("s1", "theory") - 0.2, 0.22)
    add(X.lp(X.squelch(0.6), 1800), w("s1", "shrank") - 0.15, 0.16)
    for k in range(6):
        add(X.ding(1800 + k * 140) * 0.35, w("s1", "money") - 0.2 + k * 0.05, 0.14, pan=(-0.3, 0.3)[k % 2])
    # s2: the stamp, the lid opens
    add(X.stamp(), w("s2", "quantization") - 0.05, 0.32)
    add(X.lp(X.clank(260), 1800), w("s2", "opened") - 0.05, 0.16)
    # s3: numbers fly out, the ring, the card, each digit
    for k in range(18):
        add(X.tick(1500 + (k % 6) * 130, 0.02), w("s3", "inside") + k * 0.09, 0.09)
    add(X.pop(), w("s3", "one") - 0.05, 0.24)
    for t in [w("s3", "zero"), w("s3", "point"), w("s3", "zero", 1), w("s3", "three"), w("s3", "seven"), w("s3", "two")]:
        add(X.key_click(), t - 0.03, 0.22)
    # s4: the chat writes, word by word; the tick
    for t in [w("s4", "word"), w("s4", "claude"), w("s4", "writes"), w("s4", "is"), w("s4", "built")]:
        add(X.key_click(), t - 0.03, 0.2)
    add(X.ding(1567.98) * 0.5, w("s4", "reading") - 0.05, 0.2)
    # s5: the rounding wave, the strike, the 0.04, the shrink, the tag
    for k in range(8):
        add(X.tick(2000 + k * 70, 0.02), w("s5", "rounds") + k * 0.1, 0.1)
    add(X.paper_swish(0.2), w("s5", "becomes") + 0.3, 0.16)
    for t in [w("s5", "zero", 2), w("s5", "point", 1), w("s5", "zero", 3), w("s5", "four")]:
        add(X.key_click(), t - 0.03, 0.2)
    add(X.lp(X.whoosh(0.35, up=False), 3200), w("s5", "three") - 0.05, 0.16)
    add(X.ding(1318.5) * 0.5, w("s5", "smaller") - 0.05, 0.2)
    add(X.pop(), w("s5", "faster") - 0.05, 0.2)
    add(X.lp(X.glitch(0.15), 3000), w("s5", "cheaper") - 0.03, 0.12)
    add(X.pop(), w("s5", "faster") - 0.1, 0.18)
    # s6: red glow, the billions flash, the answer flips
    add(X.lp(X.buzz(0.25), 2500), w("s6", "off") - 0.1, 0.12)
    for k in range(6):
        add(X.tick(1400 + k * 90, 0.02), w("s6", "billions") + k * 0.12, 0.1)
    add(X.lp(X.buzz(0.3), 2500), w("s6", "wrong") - 0.1, 0.16)
    # s7: the quote, the daily dots, NO DROP, the bubble pops
    add(X.paper_swish(0.25), w("s7", "so") + 0.45, 0.2)
    for k in range(10):
        add(X.tick(1800 + (k % 5) * 120, 0.02), w("s7", "quizzed") + k * 0.24, 0.09)
    add(X.stamp(), w("s7", "no") - 0.04, 0.3)
    add(X.pop(), w("s7", "no") + 0.12, 0.24)
    # s8: the dial drops, "aha!"
    add(X.tick(1500, 0.04), w("s8", "less") - 0.12, 0.26)
    add(X.pop(), w("s8", "thinks") - 0.05, 0.2)
    # s9: the plane, the hand turns the dial, the pull-back, Follow, the second plane
    add(X.paper_swish(0.3), w("s9", "sent"), 0.2)
    add(X.pop(), w("s9", "tip") - 0.05, 0.2)
    add(X.lp(X.whoosh(0.4), 3000), w("s9", "turn"), 0.16)
    add(X.tick(2200, 0.04), w("s9", "turn") + 0.15, 0.26)
    add(X.lp(X.whoosh(1.2, up=False), 2400), w("s9", "follow") - 0.15, 0.14)
    add(X.tick(3000, 0.03), w("s9", "more") + 0.05, 0.4)
    add(X.paper_swish(0.3), w("s9", "send"), 0.2)
