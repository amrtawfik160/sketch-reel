"""Scene sounds for the ICEBERG reel. Quiet physical sounds tied to visible events, about 0.1 s before the word.
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


def bubbles(add, X, t, g=0.04):
    for k in range(3):
        add(X.tick(900 + k * 260, 0.03), t + k * 0.08, g, pan=-0.2)


def extra(add, X, C):
    # camera moves: a whoosh each (the two pull-backs and the push-in are longer)
    add(X.lp(X.whoosh(1.0), 1800), w("i1", "but") - 0.1, 0.16)
    add(X.lp(X.whoosh(0.7), 2200), L0("i2") - 0.55, 0.12)
    for lid, dt in [("i3", -0.45), ("i4", -0.4), ("i6", -0.3), ("i8", -0.22), ("i9", -0.22), ("i10", -0.3), ("i11", -0.28), ("i12", -0.1), ("i13", -0.33), ("i14", -0.42)]:
        add(X.lp(X.whoosh(0.5), 2600), L0(lid) + dt, 0.11)
    add(X.lp(X.whoosh(1.0), 1800), L0("i15") + 0.1, 0.15)
    # the sub sinks a layer: bubbles
    for t in [w("i4", "down"), w("i8", "down"), w("i10", "deeper"), w("i12", "bottom")]:
        bubbles(add, X, t + 0.3, 0.03)
    # i1: everyone knows it, the Hugging Face badge, 3,000,000+, the weird ones
    marker(add, X, w("i1", "knows") - 0.06, 0.5, 0.04)
    add(X.pop(), w("i1", "website") - 0.1, 0.09)
    for k in range(10):
        add(X.tick(1500 + k * 120, 0.02), w("i1", "three") - 0.1 + k * 0.06, 0.04)
    add(X.ding(1318.5), w("i1", "million") + 0.1, 0.05)
    for k in range(5):
        add(X.pop(), w("i1", "and") + k * 0.11, 0.04)
    marker(add, X, w("i1", "weird") - 0.08, 0.4, 0.05)
    add(X.lp(X.glitch(0.3), 1600), w("i1", "here") - 0.06, 0.06)
    # i2: the window, the note counts to 1B, people
    add(X.paper_swish(0.3), L0("i2") - 0.1, 0.08)
    for k in range(6):
        add(X.key_click(), L0("i2") + 0.3 + k * 0.08, 0.04)
    add(X.pop(), w("i2", "about") - 0.1, 0.08)
    add(X.ding(1567.98), w("i2", "billion") - 0.02, 0.06)
    for k in range(5):
        add(X.pop(), w("i2", "people") - 0.06 + k * 0.06, 0.035)
    for k in range(8):
        add(X.key_click(), w("i2", "use") + k * 0.11, 0.04)
    # i3: the newspaper flies in, the crate, the lock, the timeline, the warnings
    add(X.paper_swish(0.4), L0("i3") + 0.02, 0.12)
    marker(add, X, w("i3", "nineteen") - 0.04, 0.25, 0.05)
    add(X.pop(), w("i3", "openai") - 0.1, 0.08)
    add(X.clank(500), w("i3", "back") - 0.06, 0.1)
    marker(add, X, w("i3", "gpt2") - 0.06, 0.3, 0.05)
    marker(add, X, w("i3", "an") - 0.06, 0.4, 0.04)
    add(X.lp(X.buzz(0.25), 1600), w("i3", "worries") - 0.08, 0.05)
    for k in range(3):
        add(X.pop(), w("i3", "malicious") - 0.1 + k * 0.13, 0.07)
    # i4: the machine, Anthropic, Claude, the awning, the calendar
    marker(add, X, L0("i4") + 0.3, 0.3, 0.04)
    add(X.pop(), w("i4", "anthropic") - 0.1, 0.08)
    add(X.ding(1318.5), w("i4", "claude") - 0.04, 0.05)
    add(X.paper_swish(0.25), w("i4", "snack") - 0.08, 0.08)
    add(X.pop(), w("i4", "about", 0) - 0.14, 0.08)
    for k in range(8):
        add(X.tick(2000, 0.02), w("i4", "about", 0) + 0.08 + k * 0.06, 0.04)
    # i5: Slack pings, codes fly, cubes clank, the price tag
    for word in ["employees", "talked", "into", "joke"]:
        add(X.tick(1760, 0.04), w("i5", word) - 0.06, 0.07)
    for k in range(3):
        add(X.paper_swish(0.15), w("i5", "discount") - 0.08 + k * 0.12, 0.06)
    for k in range(12):
        add(X.clank(800 + (k % 3) * 120), w("i5", "metal") - 0.07 + k * 0.04, 0.03)
    add(X.pop(), w("i5", "below") - 0.1, 0.09)
    # i6: the payment screen, ???, the bubble, the blazer, the tie
    add(X.paper_swish(0.3), w("i6", "pay") - 0.22, 0.08)
    marker(add, X, w("i6", "made") - 0.06, 0.25, 0.06)
    add(X.pop(), w("i6", "said") - 0.1, 0.08)
    add(X.paper_swish(0.3), w("i6", "blue") - 0.14, 0.1)
    add(X.pop(), w("i6", "red") - 0.12, 0.08)
    # i7: the chart falls, NO PROFIT
    add(X.lp(X.riser(0.6), 900), w("i7", "never") - 0.1, 0.04)
    add(X.stamp(), w("i7", "money") - 0.12, 0.22)
    # i8: DeepSeek, Jan 2025, #1, the crash, -$590B
    add(X.pop(), w("i8", "chinas") - 0.08, 0.08)
    marker(add, X, w("i8", "deepseek") - 0.06, 0.3, 0.05)
    add(X.pop(), w("i8", "january") - 0.1, 0.07)
    add(X.paper_swish(0.3), w("i8", "went") - 0.06, 0.08)
    add(X.ding(1567.98), w("i8", "viral") - 0.02, 0.06)
    add(X.lp(X.impact(0.5), 800), w("i8", "wipe") + 0.15, 0.12)
    for k in range(10):
        add(X.tick(1800 - k * 90, 0.02), w("i8", "five") - 0.06 + k * 0.1, 0.04)
    marker(add, X, w("i8", "in", 1) - 0.04, 0.3, 0.05)
    # i9: the Nature page, the arrow, the receipt prints, self-reported
    add(X.paper_swish(0.4), L0("i9") + 0.02, 0.1)
    add(X.pop(), w("i9", "deepseek") - 0.1, 0.07)
    for k in range(10):
        add(X.key_click(), w("i9", "final") - 0.1 + k * 0.07, 0.04)
    for k in range(8):
        add(X.tick(2200, 0.02), w("i9", "under") - 0.04 + k * 0.13, 0.035)
    add(X.stamp(), w("i9", "dollars") + 0.03, 0.18)
    # i10: the model shrinks, Google, the phone, chats, the battery
    add(X.pop(), L0("i10") + 0.28, 0.08)
    add(X.lp(X.whoosh(0.35), 3000), w("i10", "tiny") - 0.1, 0.07)
    add(X.pop(), w("i10", "googles") - 0.1, 0.07)
    for k in range(10):
        add(X.tick(1700 + (k % 2) * 300, 0.02), w("i10", "twentyfive") - 0.2 + k * 0.09, 0.04)
    add(X.ding(1975.5), w("i10", "percent") - 0.04, 0.05)
    # i11: Microsoft, the numbers, the flips, the chip ticked, the card crossed
    add(X.pop(), w("i11", "microsoft") - 0.1, 0.08)
    for k in range(12):
        add(X.key_click(), w("i11", "every") - 0.06 + k * 0.04, 0.03)
    for word, n in [("minus", 0), ("zero", 0), ("one", 2)]:
        add(X.tick(1300, 0.03), w("i11", word, n) - 0.08, 0.07)
    add(X.ding(1567.98), w("i11", "chip") - 0.04, 0.06)
    add(X.snip(), w("i11", "card") - 0.08, 0.1)
    # i12: THE BOTTOM, Microsoft, the card, Tay, Twitter users
    marker(add, X, w("i12", "very") - 0.04, 0.4, 0.05)
    add(X.pop(), w("i12", "microsofts") - 0.08, 0.07)
    add(X.paper_swish(0.3), w("i12", "is") - 0.12, 0.08)
    for k in range(6):
        add(X.tick(1900, 0.02), w("i12", "learned") - 0.1 + k * 0.05, 0.035)
    # i13: trolls pile on, the card turns red, PULLED OFFLINE, the timer
    for k in range(4):
        add(X.lp(X.buzz(0.12), 1500), w("i13", "trolls") - 0.08 + k * 0.13, 0.04)
    add(X.lp(X.impact(0.4), 800), w("i13", "hate") - 0.04, 0.1)
    add(X.stamp(), w("i13", "pulled") - 0.1, 0.22)
    for k in range(6):
        add(X.tick(1400, 0.02), w("i13", "within") + k * 0.12, 0.04)
    # i14: 2016 -> 2025, the bad update, the glitch, xAI, the second timer, the match
    for k in range(5):
        add(X.tick(1600 + k * 80, 0.02), w("i14", "years") - 0.1 + k * 0.1, 0.035)
    add(X.lp(X.buzz(0.4), 1800), w("i14", "bad") - 0.06, 0.05)
    add(X.lp(X.glitch(0.6), 2400), w("i14", "mechahitler") - 0.08, 0.1)
    add(X.lp(X.impact(0.4), 800), w("i14", "mechahitler") - 0.02, 0.1)
    add(X.pop(), w("i14", "xai") - 0.1, 0.07)
    for k in range(6):
        add(X.tick(1400, 0.02), w("i14", "for") + k * 0.11, 0.04)
    add(X.paper_swish(0.3), w("i14", "about") - 0.08, 0.08)
    add(X.ding(1318.5), w("i14", "tay") - 0.06, 0.06)
    # i15: the labels, the ring, the Follow click
    for k in range(5):
        add(X.pop(), L0("i15") + 1.1 + k * 0.16, 0.04)
    marker(add, X, w("i15", "chatgpt") - 0.1, 0.4, 0.05)
    add(X.pop(), w("i15", "follow") - 0.12, 0.1)
    add(X.tick(1800, 0.03), w("i15", "follow") + 0.28, 0.16)
    add(X.ding(1975.5), w("i15", "follow") + 0.34, 0.06)
