"""Scene sounds for the Dark Horse Labs reel (v2). Quiet physical sounds tied to visible events, about 0.1 s before the word.
Word times come from words_measured.json via caps_gen.js (WT)."""
import json, os, re

_WT = json.loads(re.search(r"const WT = (.*);\n", open(os.path.join(os.path.dirname(__file__), "caps_gen.js")).read()).group(1))


def w(line, word, n=0):
    return [x for x in _WT[line] if x[0] == word][n][1]


def L0(line):
    return _WT[line][0][1]


def hooves(add, X, t, dur, g=0.12):
    k = 0
    while k * 0.09 < dur:
        add(X.tick(520 + (k % 2) * 140, 0.03), t + k * 0.09, g, pan=0.15)
        k += 1


def count_ticks(add, X, t, dur, n=8, g=0.08):
    for k in range(n):
        add(X.tick(1700 + k * 50, 0.02), t + k * dur / n, g)


def extra(add, X, C):
    # camera travel: a whoosh per move, the pull-back low
    for k, lid in enumerate(["s3", "s4", "s7", "s8"]):
        add(X.lp(X.whoosh(0.5), 2600), L0(lid) - 0.45, 0.12, pan=(-0.2, 0.2)[k % 2])
    add(X.lp(X.whoosh(0.9, up=False), 1500), L0("s9") - 0.12, 0.13)
    add(X.lp(X.whoosh(0.6, up=False), 1400), w("s9", "darkhorselabs") - 0.15, 0.1)
    # s1: the hook
    add(X.paper_swish(0.25), w("s1", "saturday") - 0.1, 0.12)
    add(X.paper_swish(0.3), w("s1", "said") - 0.1, 0.1)
    add(X.paper_swish(0.3), w("s1", "never") - 0.1, 0.08)
    add(X.paper_swish(0.3), w("s1", "twentysix") - 0.2, 0.14)
    count_ticks(add, X, w("s1", "twentysix") - 0.02, 0.6)
    add(X.pop(), w("s1", "thousand") - 0.05, 0.12)
    for k in range(5):
        add(X.pop(), w("s1", "saved") - 0.06 + k * 0.03, 0.05, pan=(-0.3, 0.3)[k % 2])
    # s2: the name, the quote
    add(X.paper_swish(0.3), w("s2", "andrej") - 0.1, 0.1)
    for k in range(12):
        add(X.key_click(), w("s2", "im") - 0.05 + k * 0.1, 0.06)
    add(X.paper_swish(0.25), w("s2", "any") - 0.04, 0.1)
    # s3: the list
    add(X.pop(), w("s3", "actually") - 0.1, 0.08)
    for k in range(6):
        add(X.tick(2000 + k * 70, 0.02), w("s3", "collects") - 0.06 + k * 0.06, 0.08)
    add(X.pop(), w("s3", "dark") - 0.1, 0.14)
    hooves(add, X, w("s3", "horse") + 0.02, 0.55)
    for k in range(4):
        add(X.tick(1500, 0.03), w("s3", "went") - 0.08 + k * 0.07, 0.08)
    # s4-s6: firstmate
    add(X.pop(), w("s4", "favourite") - 0.08, 0.12)
    add(X.pop(), w("s4", "talk") - 0.08, 0.12)
    for k in range(3):
        add(X.pop(), w("s4", "crew") - 0.08 + k * 0.1, 0.08, pan=(-0.3, 0.0, 0.3)[k])
    for k in range(3):
        add(X.paper_swish(0.2), w("s5", "copy") - 0.08 + k * 0.1, 0.06)
    for k in range(3):
        add(X.tick(1800 + k * 120, 0.04), w("s5", "done") - 0.08 + k * 0.08, 0.12)
    add(X.pop(), w("s5", "reports") - 0.1, 0.1)
    for k in range(14):
        add(X.key_click(), w("s5", "pr") - 0.05 + k * 0.1, 0.06)
    add(X.paper_swish(0.25), w("s6", "june") - 0.08, 0.1)
    add(X.lp(X.whoosh(0.5), 3000), w("s6", "already") - 0.3, 0.1)
    add(X.paper_swish(0.25), w("s6", "eight") - 0.08, 0.12)
    add(X.ding(1046.5), w("s6", "thousand") + 0.05, 0.05)
    # s7: PocketBase
    count_ticks(add, X, w("s7", "pocketbase") - 0.02, 0.5)
    for k in range(3):
        add(X.pop(), w("s7", "app") - 0.1 + k * 0.12, 0.07)
    add(X.paper_swish(0.3), w("s7", "one") - 0.1, 0.08)
    add(X.lp(X.whoosh(0.6), 2400), w("s7", "almost") - 0.1, 0.1)
    # s8: LocalSend
    add(X.lp(X.whoosh(0.5), 3000), w("s8", "phone") - 0.1, 0.1)
    add(X.tick(1800, 0.04), w("s8", "laptop") + 0.1, 0.12)
    add(X.snip(), w("s8", "internet") - 0.04, 0.12)
    count_ticks(add, X, w("s8", "ninetysix") - 0.06, 0.5)
    add(X.ding(1174.7), w("s8", "thousand") + 0.05, 0.05)
    # s9: the win and the end card
    hooves(add, X, L0("s9") + 0.02, 0.75, 0.16)
    add(X.ding(1318.5), L0("s9") + 0.82, 0.07)
    add(X.paper_swish(0.4), w("s9", "darkhorselabs") - 0.08, 0.12)
    add(X.paper_swish(0.5), w("s9", "send") - 0.05, 0.1)
    add(X.pop(), w("s9", "friend") - 0.1, 0.1)
    add(X.pop(), w("s9", "follow") - 0.12, 0.16)
    add(X.tick(2400, 0.04), w("s9", "follow") + 0.25, 0.25)
    for lid in ["s4", "s5", "s6", "s7", "s8"]:
        hooves(add, X, L0(lid) + 0.12, 0.6, 0.09)
