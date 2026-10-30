"""Scene sounds for the CARE reel. Quiet physical sounds tied to visible events, about 0.1 s before the word.
Word times come from words_measured.json via caps_gen.js (WT)."""
import json, os, re

_WT = json.loads(re.search(r"const WT = (.*);\n", open(os.path.join(os.path.dirname(__file__), "caps_gen.js")).read()).group(1))


def w(line, word, n=0):
    return [x for x in _WT[line] if x[0] == word][n][1]


def L0(line):
    return _WT[line][0][1]


def marker(add, X, t, dur, g=0.05):
    """a felt marker on a board: short band-passed noise strokes"""
    k = 0
    while k * 0.11 < dur:
        add(X.bp(X.noise(0.09) * X.env(int(0.09 * X.SR), a=0.01, d=0.08), 1800, 5200), t + k * 0.11, g, pan=0.1)
        k += 1


def tape(add, X, t, g=0.16):
    """a patch slapped on: a paper swish and a soft thud"""
    add(X.paper_swish(0.18), t - 0.04, g * 0.7)
    add(X.lp(X.impact(0.25), 700), t, g * 0.5)


def extra(add, X, C):
    # camera travel: a whoosh per move
    for k, lid in enumerate(["c2", "c3", "c4", "c5", "c6", "c8", "c9", "c11"]):
        add(X.lp(X.whoosh(0.5), 2600), L0(lid) - 0.45, 0.13, pan=(-0.2, 0.2)[k % 2])
    # c1: the question is written; two feature cards drop in
    marker(add, X, 0.02, 0.35, 0.06)
    marker(add, X, w("c1", "ai") - 0.1, 0.4, 0.06)
    marker(add, X, w("c1", "messier") - 0.12, 0.35, 0.07)
    add(X.pop(), w("c1", "every") - 0.4, 0.1)
    add(X.pop(), w("c1", "feature") - 0.4, 0.1)
    add(X.lp(X.impact(0.3), 900), w("c1", "every") + 0.2, 0.08)
    add(X.clank(700), w("c1", "feature") + 0.25, 0.05)
    # c2: Nadia, her AI types, a feature drops in, two blocks crack, the magnifier
    marker(add, X, w("c2", "nadias") - 0.08, 0.25, 0.05)
    add(X.pop(), w("c2", "ai") - 0.1, 0.1)
    for k in range(6):
        add(X.key_click(), w("c2", "built") - 0.04 + k * 0.17, 0.07)
    add(X.pop(), w("c2", "every") - 0.1, 0.1)
    add(X.paper_swish(0.25), w("c2", "feature") - 0.15, 0.1)
    add(X.snip(), w("c2", "breaks") - 0.08, 0.2)
    add(X.lp(X.impact(0.4), 900), w("c2", "breaks") - 0.04, 0.14)
    add(X.snip(), w("c2", "two") - 0.08, 0.2)
    add(X.lp(X.impact(0.4), 900), w("c2", "two") - 0.04, 0.12)
    add(X.paper_swish(0.3), w("c2", "looked") - 0.12, 0.1)
    # c3: features, patches, test chips, the green ring
    for word in ["feature", "stuck", "patch", "top"]:
        tape(add, X, w("c3", word) - 0.04)
    for word in ["feature", "stuck", "patch", "top"]:
        add(X.tick(2400, 0.03), w("c3", word) + 0.26, 0.09)
    marker(add, X, w("c3", "patch") - 0.06, 0.4, 0.05)
    add(X.ding(1567.98), w("c3", "passed") - 0.02, 0.07)
    # c4: patches pile up, the box gives way to the mud, the flies, BIG BALL OF MUD
    for k in range(5):
        tape(add, X, w("c4", "months") - 0.02 + k * 0.1, 0.12)
    add(X.squelch(0.5), w("c4", "looked") - 0.12, 0.2)
    add(X.lp(X.glitch(0.25), 2200), w("c4", "this") - 0.06, 0.07)
    add(X.pop(), w("c4", "programmers") - 0.1, 0.08)
    marker(add, X, w("c4", "big") - 0.1, 0.6, 0.07)
    # c5: other balls of mud, the chart, the note, the bars
    for t in [L0("c5") - 0.02, w("c5", "not") - 0.06, w("c5", "her") - 0.04]:
        add(X.squelch(0.3), t - 0.04, 0.08)
    marker(add, X, w("c5", "2024") - 0.08, 0.25, 0.05)
    add(X.paper_swish(0.3), w("c5", "gitclear") + 0.0, 0.12)
    add(X.riser(0.55), w("c5", "copypasted") - 0.06, 0.06)
    add(X.pop(), w("c5", "cleaned") - 0.08, 0.08)
    add(X.ding(1318.5), w("c5", "first") - 0.04, 0.07)
    # c6: the question marks, the dive, the training rules, +1, +0
    add(X.pop(), w("c6", "why") - 0.1, 0.1)
    add(X.pop(), w("c6", "that") - 0.1, 0.1)
    add(X.riser(0.6), w("c6", "one") - 0.5, 0.08)
    add(X.lp(X.whoosh(0.6), 1800), w("c6", "one") - 0.15, 0.16)
    add(X.paper_swish(0.3), w("c6", "published") - 0.1, 0.1)
    marker(add, X, w("c6", "training") - 0.08, 0.35, 0.05)
    add(X.paper_swish(0.25), w("c6", "rules") - 0.06, 0.1)
    add(X.ding(1975.5), w("c6", "point") - 0.04, 0.09)
    add(X.lp(X.buzz(0.3), 1400), w("c6", "nothing") - 0.06, 0.06)
    # c7: out of the head, Matt's card, the saves count, the coding AIs, +1s
    add(X.lp(X.whoosh(0.6, up=False), 2200), L0("c7") - 0.55, 0.14)
    marker(add, X, w("c7", "matt") - 0.08, 0.4, 0.05)
    for k in range(12):
        add(X.tick(1500 + k * 60, 0.02), w("c7", "three") - 0.04 + k * 0.07, 0.06)
    add(X.pop(), w("c7", "three") + 0.05, 0.08)
    for k in range(3):
        add(X.pop(), w("c7", "thinks") - 0.1 + k * 0.09, 0.06)
    for k in range(3):
        add(X.pop(), w("c7", "coding", 1) - 0.12 + k * 0.12, 0.07)
    for k in range(3):
        add(X.ding(1760 + k * 200), w("c7", "learn") - 0.04 + k * 0.1, 0.04)
    # c8: the fix, the bubble, the robot lights up, the broom
    marker(add, X, w("c8", "fix") - 0.3, 0.5, 0.05)
    add(X.paper_swish(0.3), w("c8", "tell") - 0.12, 0.1)
    add(X.shimmer(0.8, 1568), w("c8", "care") - 0.02, 0.08)
    add(X.pop(), w("c8", "care") - 0.06, 0.1)
    add(X.paper_swish(0.25), w("c8", "cleaning") - 0.06, 0.12)
    add(X.shimmer(0.6, 2093), w("c8", "cleaning") + 0.1, 0.05)
    # c9: the ball drops in, the rule card, the feature waits, the clean-up
    add(X.lp(X.impact(0.5), 700), L0("c9") + 0.1, 0.12)
    add(X.paper_swish(0.4), w("c9", "gave") - 0.02, 0.12)
    marker(add, X, w("c9", "one") - 0.06, 0.3, 0.05)
    marker(add, X, w("c9", "before") - 0.06, 0.6, 0.04)
    add(X.pop(), w("c9", "add") - 0.08, 0.08)
    for k in range(9):
        add(X.key_click(), w("c9", "clean") - 0.06 + k * 0.17, 0.06)
    for k in range(5):
        add(X.pop(), w("c9", "clean") + 0.22 + k * 0.13, 0.05)
    add(X.paper_swish(0.4), w("c9", "clean") + 0.1, 0.08)
    # c10: the feature slots in, the note flies in, ticks
    add(X.clank(900), L0("c10") + 0.1, 0.06)
    add(X.paper_swish(0.4), L0("c10") + 0.4, 0.1)
    add(X.tick(2600, 0.04), w("c10", "done") - 0.04, 0.14)
    add(X.tick(2600, 0.04), w("c10", "clean") - 0.02, 0.14)
    add(X.ding(2093), w("c10", "clean") + 0.15, 0.08)
    # c11: Comment CARE slams in, the Follow click
    add(X.stamp(), w("c11", "comment") - 0.1, 0.22)
    add(X.lp(X.impact(0.5), 900), w("c11", "comment") - 0.04, 0.12)
    marker(add, X, w("c11", "care") - 0.04, 0.2, 0.06)
    add(X.pop(), w("c11", "follow") - 0.12, 0.1)
    add(X.tick(1800, 0.03), w("c11", "follow") + 0.28, 0.16)
    add(X.ding(1975.5), w("c11", "follow") + 0.34, 0.06)
